import { createApp, h, ref } from 'vue';
import { store } from './store.js';
import { eventBus } from './eventBus.js';
import { PacketEngine } from './packetEngine.js';
import { ProtocolEngine } from './protocolEngine.js';
import { TopologyManager } from './topology.js';
import { router } from './router.js';
import Navbar from '../components/Navbar.js';
import Sidebar from '../components/Sidebar.js';
import Toolbar from '../components/Toolbar.js';
import NetworkCanvas from '../components/NetworkCanvas.js';
import PacketInspector from '../components/PacketInspector.js';
import EventLog from '../components/EventLog.js';
import StatisticsPanel from '../components/StatisticsPanel.js';
import LearningPanel from '../components/LearningPanel.js';
import QuizPanel from '../components/QuizPanel.js';
import ChallengePanel from '../components/ChallengePanel.js';
import Timeline from '../components/Timeline.js';
import Legend from '../components/Legend.js';
import SettingsPanel from '../components/SettingsPanel.js';
import DeviceConfig from '../components/DeviceConfig.js';

window.__ns = { store, eventBus, router };

const initApp = async () => {
    console.log("Initializing Network Simulator v1.0...");

    const packetEngine = new PacketEngine(eventBus);
    const protocolEngine = new ProtocolEngine(packetEngine);
    const topologyManager = new TopologyManager();
    packetEngine.protocolEngine = protocolEngine;
    window.__ns.packetEngine = packetEngine;
    window.__ns.topologyManager = topologyManager;

    eventBus.on("packet_arrived", async (packetId) => {
        const packet = store.traffic.activePackets.find(p => p.id === packetId);
        if (packet) {
            const targetNode = store.topology.nodes.find(n => n.id === packet.dstId);
            if (targetNode) {
                await protocolEngine.handlePacketArrival(packet, targetNode);
            }
            const idx = store.traffic.activePackets.findIndex(p => p.id === packetId);
            if (idx !== -1) store.traffic.activePackets.splice(idx, 1);
        }
    });

    await loadInitialScenario(topologyManager);

    setTimeout(() => {
        const pc1 = store.topology.nodes.find(n => n.id === "pc1");
        const pc2 = store.topology.nodes.find(n => n.id === "pc2");
        if (pc1) protocolEngine.triggerGratuitousArp(pc1);
        if (pc2) protocolEngine.triggerGratuitousArp(pc2);
    }, 1000);

    const app = createApp({
        name: 'App',
        components: {
            Navbar, Sidebar, Toolbar, NetworkCanvas, PacketInspector,
            EventLog, StatisticsPanel, LearningPanel, QuizPanel,
            ChallengePanel, Timeline, Legend, SettingsPanel, DeviceConfig
        },
        setup() {
            const activePanel = ref('eventlog');
            const showSidebar = ref(true);
            const showInspector = ref(true);
            return { store, activePanel, showSidebar, showInspector };
        },
        template: `
            <div class="app-container">
                <Navbar />
                <div v-if="store.ui.currentRoute === 'dashboard'" class="main-workspace">
                    <Sidebar v-if="showSidebar" />
                    <div class="canvas-container flex-1 relative">
                        <NetworkCanvas />
                        <Toolbar />
                        <Legend />
                    </div>
                    <div class="inspector-panel" v-if="showInspector">
                        <div class="flex border-b border-slate-700 bg-slate-800">
                            <button @click="activePanel='eventlog'" :class="activePanel==='eventlog'?'bg-slate-900 text-sky-400':'text-slate-400'" class="px-3 py-2 text-xs font-bold uppercase">Events</button>
                            <button @click="activePanel='stats'" :class="activePanel==='stats'?'bg-slate-900 text-sky-400':'text-slate-400'" class="px-3 py-2 text-xs font-bold uppercase">Stats</button>
                            <button @click="activePanel='learn'" :class="activePanel==='learn'?'bg-slate-900 text-sky-400':'text-slate-400'" class="px-3 py-2 text-xs font-bold uppercase">Learn</button>
                            <button @click="activePanel='quiz'" :class="activePanel==='quiz'?'bg-slate-900 text-sky-400':'text-slate-400'" class="px-3 py-2 text-xs font-bold uppercase">Quiz</button>
                            <button @click="activePanel='challenge'" :class="activePanel==='challenge'?'bg-slate-900 text-sky-400':'text-slate-400'" class="px-3 py-2 text-xs font-bold uppercase">Challenge</button>
                        </div>
                        <PacketInspector v-if="activePanel==='packet'" />
                        <EventLog v-if="activePanel==='eventlog'" />
                        <StatisticsPanel v-if="activePanel==='stats'" />
                        <LearningPanel v-if="activePanel==='learn'" />
                        <QuizPanel v-if="activePanel==='quiz'" />
                        <ChallengePanel v-if="activePanel==='challenge'" />
                        <SettingsPanel v-if="activePanel==='settings'" />
                    </div>
                </div>
                <div v-if="store.ui.currentRoute === 'lab'" class="flex-1 overflow-hidden bg-slate-900 route-fullview">
                    <LearningPanel />
                </div>
                <div v-if="store.ui.currentRoute === 'challenges'" class="flex-1 overflow-hidden bg-slate-900 route-fullview">
                    <ChallengePanel />
                </div>
                <div v-if="store.ui.currentRoute === 'settings'" class="flex-1 overflow-hidden bg-slate-900 route-fullview">
                    <SettingsPanel />
                </div>
                <Timeline />
                <DeviceConfig v-if="store.ui.deviceConfigTarget" />
            </div>
        `
    });

    app.mount('#app');
    console.log("Simulator Ready.");
};

const loadInitialScenario = async (topologyManager) => {
    topologyManager.loadTopology({
        nodes: [
            { id: "pc1", type: "pc", hostname: "PC-A", x: 200, y: 200, status: "up", interfaces: [{ ip: "192.168.1.1", mac: "00:0A:95:9D:68:16", name: "eth0" }] },
            { id: "sw1", type: "switch", hostname: "SW-1", x: 400, y: 200, status: "up", interfaces: [{ ip: "10.0.0.1", mac: "00:0A:95:9D:68:AA", name: "gi0/1" }, { ip: "10.0.0.2", mac: "00:0A:95:9D:68:BB", name: "gi0/2" }] },
            { id: "pc2", type: "pc", hostname: "PC-B", x: 600, y: 200, status: "up", interfaces: [{ ip: "192.168.1.2", mac: "00:0A:95:9D:68:22", name: "eth0" }] }
        ],
        links: [
            { id: "l1", source: "pc1", target: "sw1", type: "copper" },
            { id: "l2", source: "sw1", target: "pc2", type: "copper" }
        ]
    });
    store.actions.addLog("=== ARP Protocol Lab Initialized ===", 'info');
    store.actions.addLog("Topology: PC-A <--copper--> SW-1 <--copper--> PC-B", 'info');
    store.actions.addLog("PC-A: 192.168.1.1 / 00:0A:95:9D:68:16", 'info');
    store.actions.addLog("PC-B: 192.168.1.2 / 00:0A:95:9D:68:22", 'info');
    store.actions.addLog("Devices will announce themselves via Gratuitous ARP...", 'info');
    store.actions.addLog("Ready. Select PC-A and click PDU, or click Start.", 'info');
};

initApp();
