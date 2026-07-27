import { computed, onMounted } from 'vue';

export default {
    name: "StatisticsPanel",
    template: `
    <div class="inspector flex flex-col h-full border-l border-slate-700 bg-slate-900">
        <div class="panel-header bg-slate-800"><span class="text-sm font-bold">Network Analytics</span></div>
        <div class="panel-content space-y-6">
            <div class="grid grid-cols-2 gap-3">
                <div class="bg-slate-800 p-3 rounded-lg border border-slate-700">
                    <div class="text-[10px] text-slate-500 uppercase font-bold">Sent</div>
                    <div class="text-xl font-mono text-sky-400">{{ stats.packetsSent }}</div>
                </div>
                <div class="bg-slate-800 p-3 rounded-lg border border-slate-700">
                    <div class="text-[10px] text-slate-500 uppercase font-bold">Dropped</div>
                    <div class="text-xl font-mono text-red-400">{{ stats.packetsDropped }}</div>
                </div>
                <div class="bg-slate-800 p-3 rounded-lg border border-slate-700">
                    <div class="text-[10px] text-slate-500 uppercase font-bold">Broadcasts</div>
                    <div class="text-xl font-mono text-amber-400">{{ stats.broadcasts }}</div>
                </div>
                <div class="bg-slate-800 p-3 rounded-lg border border-slate-700">
                    <div class="text-[10px] text-slate-500 uppercase font-bold">Success</div>
                    <div class="text-xl font-mono text-green-400">{{ successRate }}%</div>
                </div>
            </div>
            <div class="bg-slate-800 p-4 rounded-lg border border-slate-700">
                <h4 class="text-xs font-bold text-slate-400 uppercase mb-4">Packet Throughput</h4>
                <div class="h-40"><canvas id="throughputChart"></canvas></div>
            </div>
            <div class="bg-slate-800 p-4 rounded-lg border border-slate-700">
                <h4 class="text-xs font-bold text-slate-400 uppercase mb-4">Protocol Distribution</h4>
                <ul class="space-y-2 text-sm font-mono">
                    <li class="flex justify-between"><span class="text-slate-500">ARP</span><span class="text-sky-400">{{ arpCount }}</span></li>
                    <li class="flex justify-between"><span class="text-slate-500">ICMP</span><span class="text-sky-400">0</span></li>
                    <li class="flex justify-between"><span class="text-slate-500">IPv4</span><span class="text-sky-400">0</span></li>
                </ul>
            </div>
        </div>
    </div>
    `,
    setup() {
        const store = (window.__ns || {}).store;
        const stats = computed(() => store ? store.traffic.statistics : { packetsSent: 0, packetsDropped: 0, broadcasts: 0, errors: 0 });
        const successRate = computed(() => {
            const total = stats.value.packetsSent + stats.value.packetsDropped;
            return total === 0 ? 100 : Math.round((stats.value.packetsSent / total) * 100);
        });
        const arpCount = computed(() => {
            if (!store) return 0;
            return store.traffic.eventLog.filter(e => e.message.includes("ARP")).length;
        });
        onMounted(() => {
            const ctx = document.getElementById("throughputChart");
            if (!ctx) return;
            new Chart(ctx, {
                type: "line",
                data: { labels: [], datasets: [{ label: "Packets/sec", data: [], borderColor: "#0ea5e9", tension: 0.4, fill: true, backgroundColor: "rgba(14,165,233,0.1)" }] },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { grid: { color: "#334155" }, ticks: { color: "#94a3b8", font: { size: 10 } } } } }
            });
        });
        return { stats, successRate, arpCount };
    }
};
