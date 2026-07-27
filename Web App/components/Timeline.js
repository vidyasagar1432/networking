import { ref, computed } from 'vue';

export default {
    name: "Timeline",
    template: `
    <div class="h-[50px] bg-slate-800 border-t border-slate-700 flex items-center px-4 gap-4">
        <div class="flex items-center gap-2">
            <button @click="stepBack" class="text-xs text-slate-400 hover:text-white"><i class="fas fa-step-backward"></i></button>
            <button @click="togglePlayback" class="text-xs text-slate-400 hover:text-white"><i class="fas" :class="paused ? 'fa-play' : 'fa-pause'"></i></button>
            <button @click="stepForward" class="text-xs text-slate-400 hover:text-white"><i class="fas fa-step-forward"></i></button>
        </div>
        <div class="flex-1 h-1.5 bg-slate-700 rounded-full relative cursor-pointer" @click="seek">
            <div class="h-full rounded-full bg-sky-500 transition-all" :style="{ width: progress + '%' }"></div>
        </div>
        <span class="text-xs font-mono text-slate-400">{{ formattedTime }}</span>
    </div>
    `,
    setup() {
        const store = (window.__ns || {}).store;

        const progress = computed(() => {
            if (!store || !store.traffic.eventLog.length) return 0;
            return Math.min((store.simulation.currentTime / 30000) * 100, 100);
        });

        const paused = computed(() => store ? store.simulation.paused : true);

        const formattedTime = computed(() => {
            if (!store) return "00:00:00";
            const total = Math.floor(store.simulation.currentTime / 1000);
            const h = String(Math.floor(total / 3600)).padStart(2, '0');
            const m = String(Math.floor((total % 3600) / 60)).padStart(2, '0');
            const s = String(total % 60).padStart(2, '0');
            return h + ':' + m + ':' + s;
        });

        const togglePlayback = () => {
            if (!store) return;
            store.simulation.paused = !store.simulation.paused;
        };

        const stepBack = () => {
            if (store) store.simulation.currentTime = Math.max(0, store.simulation.currentTime - 1000);
        };

        const stepForward = () => {
            if (store) store.simulation.currentTime += 1000;
        };

        const seek = (e) => {
            if (!store) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const pct = (e.clientX - rect.left) / rect.width;
            store.simulation.currentTime = pct * 30000;
        };

        if (store) {
            setInterval(() => {
                if (!store.simulation.paused) {
                    store.simulation.currentTime += 100 * store.simulation.playbackSpeed;
                }
            }, 100);
        }

        return { progress, paused, formattedTime, togglePlayback, stepBack, stepForward, seek };
    }
};
