import { computed } from 'vue';

export default {
    name: "EventLog",
    template: `
    <div class="inspector flex flex-col h-full border-l border-slate-700 bg-slate-900 shadow-xl">
        <div class="panel-header flex justify-between items-center bg-slate-800">
            <div class="flex items-center gap-2">
                <i class="fas fa-list-ul text-sky-400 text-xs"></i>
                <span class="text-sm font-bold">System Events</span>
            </div>
            <button @click="clearLogs" class="text-[10px] text-slate-400 hover:text-white uppercase">Clear</button>
        </div>
        <div class="panel-content bg-slate-950/50 font-mono text-[11px] leading-relaxed">
            <div v-if="events.length === 0" class="flex flex-col items-center justify-center h-full text-slate-600 text-center px-4">
                <i class="fas fa-terminal text-3xl mb-3 opacity-10"></i>
                <p>No events recorded.</p>
            </div>
            <div v-for="event in reversedEvents" :key="event.timestamp"
                 @click="inspectEvent(event)"
                 class="group flex flex-col gap-1 px-3 py-2 border-b border-slate-800/50 hover:bg-slate-800 cursor-pointer transition-colors">
                <div class="flex justify-between items-center">
                    <span class="text-slate-500">[{{ event.timeStr }}]</span>
                    <span :class="getSeverityClass(event.type)" class="text-[9px] font-bold uppercase px-1 rounded">{{ event.type }}</span>
                </div>
                <div class="text-slate-300 group-hover:text-white transition-colors">{{ event.message }}</div>
                <div v-if="event.packet" class="text-[9px] text-sky-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <i class="fas fa-envelope-open text-[8px] mr-1"></i> Inspect Packet
                </div>
            </div>
        </div>
        <div class="p-2 bg-slate-800/50 border-t border-slate-700 flex justify-between text-[10px] text-slate-500">
            <span>Logs: {{ events.length }}</span>
            <span>Buffer: 100/100</span>
        </div>
    </div>
    `,
    setup() {
        const store = (window.__ns || {}).store;
        const events = computed(() => store ? store.traffic.eventLog : []);
        const reversedEvents = computed(() => [...events.value].reverse());
        const clearLogs = () => { if (store) { store.traffic.eventLog = []; store.actions.addLog("Logs cleared", "info"); } };
        const getSeverityClass = (type) => {
            const map = { info: "text-blue-400 bg-blue-400/10", success: "text-green-400 bg-green-400/10", warning: "text-yellow-400 bg-yellow-400/10", danger: "text-red-400 bg-red-400/10" };
            return map[type] || "text-slate-400 bg-slate-400/10";
        };
        const inspectEvent = (event) => {
            if (event.packet) {
                const eb = (window.__ns || {}).eventBus;
                if (eb) eb.emit("inspect_packet", event.packet);
            }
        };
        return { events, reversedEvents, clearLogs, getSeverityClass, inspectEvent };
    }
};
