import { ref } from 'vue';

export default {
    name: "ChallengePanel",
    template: `
    <div class="inspector flex flex-col h-full bg-slate-900 border-l border-slate-700 shadow-2xl">
        <div class="panel-header bg-red-900/30 border-b border-red-500/30 flex justify-between items-center">
            <div class="flex items-center gap-2">
                <i class="fas fa-biohazard text-red-400"></i>
                <span class="text-sm font-bold text-red-100">Troubleshooting Lab</span>
            </div>
            <span class="text-[10px] font-mono text-red-400">STATUS: {{ challengeStatus }}</span>
        </div>
        <div class="panel-content space-y-6">
            <div class="bg-slate-800 rounded-lg border border-red-500/50 overflow-hidden">
                <div class="bg-red-500/10 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-red-400">Active Incident</div>
                <div class="p-4">
                    <h3 class="text-lg font-bold text-white mb-2">{{ currentChallenge.title }}</h3>
                    <p class="text-sm text-slate-300 leading-relaxed">{{ currentChallenge.description }}</p>
                </div>
            </div>
            <div class="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                <h4 class="text-xs font-bold text-slate-500 uppercase mb-3">Diagnostic Checklist</h4>
                <ul class="space-y-2">
                    <li v-for="task in currentChallenge.objectives" :key="task.id" class="flex items-center gap-3 text-sm">
                        <i :class="task.completed ? 'fas fa-check-circle text-green-500' : 'far fa-circle text-slate-600'" class="text-lg"></i>
                        <span :class="task.completed ? 'text-slate-500 line-through' : 'text-slate-300'">{{ task.label }}</span>
                    </li>
                </ul>
            </div>
            <div class="bg-black rounded-lg p-3 font-mono text-xs border border-slate-700 shadow-inner">
                <div class="flex items-center gap-2 mb-2 text-slate-500">
                    <div class="w-2 h-2 rounded-full bg-red-500"></div>
                    <div class="w-2 h-2 rounded-full bg-amber-500"></div>
                    <div class="w-2 h-2 rounded-full bg-green-500"></div>
                    <span class="ml-2">diagnostics@net-sim:~#</span>
                </div>
                <div class="text-green-500 h-24 overflow-y-auto">
                    <p>> System initialized...</p>
                    <p>> Monitoring interface errors...</p>
                    <p class="text-red-400">> ERROR: ARP_REPLY_TIMEOUT</p>
                </div>
            </div>
            <div class="space-y-2">
                <button @click="solveChallenge" class="w-full py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg font-bold shadow-lg transition-all">Submit Fix</button>
                <button @click="resetChallenge" class="w-full py-2 text-xs text-slate-500 hover:text-white">Reset Lab</button>
            </div>
        </div>
    </div>
    `,
    setup() {
        const challengeStatus = ref("UNRESOLVED");
        const currentChallenge = ref({
            title: "Connectivity Failure",
            description: "PC-A cannot ping PC-B. The link lights are green and physical connections are active. Investigate the cause using the diagnostic tools.",
            objectives: [
                { id: 1, label: "Verify Layer 2 Connectivity", completed: false },
                { id: 2, label: "Check ARP Table on PC-A", completed: false },
                { id: 3, label: "Identify IP/Subnet Mismatch", completed: false }
            ]
        });
        const solveChallenge = () => {
            challengeStatus.value = "RESOLVED";
            currentChallenge.value.objectives.forEach(t => t.completed = true);
            const store = (window.__ns || {}).store;
            if (store) store.actions.addLog("Challenge resolved by user", "success");
        };
        const resetChallenge = () => {
            challengeStatus.value = "UNRESOLVED";
            currentChallenge.value.objectives.forEach(t => t.completed = false);
        };
        return { currentChallenge, challengeStatus, solveChallenge, resetChallenge };
    }
};
