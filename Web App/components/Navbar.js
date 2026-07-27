import { computed } from 'vue';

export default {
    name: "Navbar",
    template: `
    <nav class="h-[60px] bg-slate-800 border-b border-slate-700 flex items-center justify-between px-4 z-20">
        <div class="flex items-center gap-4">
            <div class="flex items-center gap-2">
                <div class="w-8 h-8 bg-sky-500 rounded flex items-center justify-center">
                    <i class="fas fa-network-wired text-white"></i>
                </div>
                <span class="font-bold text-lg tracking-tight">NetSim <span class="text-sky-400 text-xs font-mono">v1.0</span></span>
            </div>
            <div class="h-6 w-[1px] bg-slate-600 mx-2"></div>
            <div class="flex gap-4 text-sm font-medium text-slate-400">
                <button @click="navigate('dashboard')" :class="{'text-sky-400': currentRoute === 'dashboard'}" class="hover:text-white transition-colors">Dashboard</button>
                <button @click="navigate('lab')" :class="{'text-sky-400': currentRoute === 'lab'}" class="hover:text-white transition-colors">Learning Lab</button>
                <button @click="navigate('challenges')" :class="{'text-sky-400': currentRoute === 'challenges'}" class="hover:text-white transition-colors">Challenges</button>
            </div>
        </div>
        <div class="flex items-center gap-3">
            <div class="flex items-center gap-2 bg-slate-900 px-3 py-1 rounded-full border border-slate-700 text-xs">
                <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span>System Ready</span>
            </div>
            <button @click="openSettings" class="text-slate-400 hover:text-white"><i class="fas fa-cog"></i></button>
        </div>
    </nav>
    `,
    setup() {
        const store = (window.__ns || {}).store;
        const currentRoute = computed(() => store ? store.ui.currentRoute : 'dashboard');

        const navigate = (route) => {
            if (store) store.ui.currentRoute = route;
            const { router } = window.__ns || {};
            if (router) router.navigate(route);
        };
        const openSettings = () => {
            const { router } = window.__ns || {};
            if (router) router.navigate("settings");
        };
        return { currentRoute, navigate, openSettings };
    }
};
