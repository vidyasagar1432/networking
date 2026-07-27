import { ref, computed } from 'vue';

export default {
    name: "Toolbar",
    template: `
    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-slate-800/90 backdrop-blur border border-slate-600 p-2 rounded-xl shadow-2xl z-20">
        <button @click="resetSim" class="toolbar-btn px-3 py-2 hover:bg-slate-700 rounded-lg transition-colors" title="Reset Simulation">
            <i class="fas fa-undo-alt"></i>
        </button>
        <div class="h-6 w-[1px] bg-slate-600 mx-1"></div>
        <button @click="toggleSim" :class="isRunning ? 'bg-amber-600 hover:bg-amber-500' : 'bg-sky-600 hover:bg-sky-500'" class="px-4 py-2 text-white rounded-lg transition-all flex items-center gap-2">
            <i :class="isRunning ? 'fas fa-pause' : 'fas fa-play'"></i>
            <span class="text-sm font-bold">{{ isRunning ? 'Pause' : 'Start' }}</span>
        </button>
        <button @click="sendSimplePdu" class="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-all flex items-center gap-2" title="Send Simple PDU">
            <i class="fas fa-envelope"></i>
            <span class="text-sm font-bold">PDU</span>
        </button>
        <div class="h-6 w-[1px] bg-slate-600 mx-1"></div>
        <div class="flex items-center gap-3 px-4">
            <i class="fas fa-tachometer-alt text-slate-400 text-xs"></i>
            <input type="range" min="0.25" max="3" step="0.25" v-model.number="speed" @input="updateSpeed" class="w-24 h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-sky-500">
            <span class="text-xs font-mono w-8 text-slate-400">{{ speed }}x</span>
        </div>
    </div>
    `,
    setup() {
        const store = (window.__ns || {}).store;
        const packetEngine = (window.__ns || {}).packetEngine;

        const isRunning = computed(() => store && store.simulation.status === 'running' && !store.simulation.paused);
        const speed = ref(store ? store.simulation.playbackSpeed : 1.0);
        let hasWarnedNoSelection = false;

        const updateSpeed = () => { if (store) store.simulation.playbackSpeed = speed.value; };

        const toggleSim = () => {
            if (!store) return;
            if (store.simulation.status !== 'running') {
                store.simulation.status = 'running';
                store.simulation.paused = false;
                if (packetEngine) {
                    store.actions.addLog("Simulation started", "success");
                }
            } else {
                store.simulation.paused = !store.simulation.paused;
                store.actions.addLog(store.simulation.paused ? "Simulation paused" : "Simulation resumed", "info");
            }
        };

        const resetSim = () => {
            if (!store) return;
            if (packetEngine) packetEngine.stopAll();
            store.simulation.status = 'idle';
            store.simulation.paused = false;
            store.simulation.currentTime = 0;
            store.traffic.activePackets = [];
            store.actions.addLog("Simulation reset", "info");
        };

        const sendSimplePdu = () => {
            if (!store || !packetEngine) return;
            const sel = store.ui.selectedObjectId;
            const nodes = store.topology.nodes;
            if (!sel) {
                if (!hasWarnedNoSelection) {
                    store.actions.addLog("Select a source device first, then click PDU", "warning");
                    hasWarnedNoSelection = true;
                    setTimeout(() => { hasWarnedNoSelection = false; }, 3000);
                }
                return;
            }
            const src = nodes.find(n => n.id === sel);
            if (!src || !src.interfaces.length) {
                store.actions.addLog("Selected device has no IP interface", "warning");
                return;
            }
            const targets = nodes.filter(n => n.id !== sel && n.interfaces.length);
            if (!targets.length) {
                store.actions.addLog("No reachable target devices", "warning");
                return;
            }
            const dst = targets[0];
            store.actions.addLog("PDU: " + src.hostname + " -> " + dst.hostname + " (ARP)", "info");
            const arpRequest = {
                type: "REQUEST", protocol: "ARP",
                srcIp: src.interfaces[0].ip, srcMac: src.interfaces[0].mac,
                dstIp: dst.interfaces[0].ip, dstMac: "ff:ff:ff:ff:ff:ff",
                targetIp: dst.interfaces[0].ip,
                payload: "ARP Request: Who has " + dst.interfaces[0].ip + "?",
                srcId: src.id, dstId: dst.id
            };
            packetEngine.dispatchPacket(arpRequest);
        };

        return { isRunning, speed, updateSpeed, toggleSim, resetSim, sendSimplePdu };
    }
};
