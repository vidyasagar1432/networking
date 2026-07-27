import { ref } from 'vue';

export default {
    name: "SettingsPanel",
    template: `
    <div class="inspector flex flex-col h-full bg-slate-900 border-l border-slate-700">
        <div class="panel-header bg-slate-800"><span class="text-sm font-bold">Settings</span></div>
        <div class="panel-content space-y-6">
            <div>
                <h4 class="text-xs font-bold text-slate-500 uppercase mb-3">Simulation</h4>
                <div class="space-y-3">
                    <div class="flex justify-between text-sm">
                        <span class="text-slate-400">Playback Speed</span>
                        <span class="text-sky-400">{{ speed }}x</span>
                    </div>
                    <input type="range" min="0.25" max="3" step="0.25" v-model.number="speed" class="w-full h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-sky-500">
                    <div class="flex justify-between text-sm"><span class="text-slate-400">Max Packet Log</span><span class="text-sky-400">100</span></div>
                    <div class="flex justify-between text-sm"><span class="text-slate-400">Animation Quality</span><span class="text-sky-400">High</span></div>
                </div>
            </div>
            <div>
                <h4 class="text-xs font-bold text-slate-500 uppercase mb-3">Display</h4>
                <div class="space-y-3">
                    <div class="flex justify-between text-sm"><span class="text-slate-400">Theme</span><span class="text-sky-400">Dark</span></div>
                    <div class="flex justify-between text-sm"><span class="text-slate-400">Show Grid</span><span class="text-sky-400">Enabled</span></div>
                </div>
            </div>
            <div class="text-center text-xs text-slate-600 pt-4 border-t border-slate-800">
                NetSim v1.0.0 | ARP Lab
            </div>
        </div>
    </div>
    `,
    setup() {
        const store = (window.__ns || {}).store;
        const speed = ref(store ? store.simulation.playbackSpeed : 1.0);
        return { speed };
    }
};
