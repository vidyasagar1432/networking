import { computed } from 'vue';

const deviceTypes = [
  { id: 'pc',       label: 'PC',         icon: 'fas fa-desktop',         category: 'End Devices' },
  { id: 'server',   label: 'Server',     icon: 'fas fa-server',          category: 'End Devices' },
  { id: 'switch',   label: 'Switch',     icon: 'fas fa-network-wired',   category: 'Network Devices' },
  { id: 'router',   label: 'Router',     icon: 'fas fa-route',           category: 'Network Devices' },
  { id: 'firewall', label: 'Firewall',   icon: 'fa-shield-halved',       category: 'Network Devices' },
  { id: 'cloud',    label: 'Cloud',      icon: 'fas fa-cloud',           category: 'Network Devices' },
];

const cableTypes = [
  { id: 'copper', label: 'Copper', icon: 'fas fa-cable' },
  { id: 'fiber',  label: 'Fiber',  icon: 'fas fa-grip-lines-vertical' },
  { id: 'serial', label: 'Serial', icon: 'fas fa-plug' },
];

export default {
    name: "Sidebar",
    template: `
    <aside class="sidebar flex flex-col bg-slate-800 overflow-y-auto">
        <div class="p-3 text-xs font-semibold text-slate-500 uppercase tracking-widest border-b border-slate-700">Device Palette</div>
        <div v-for="cat in categories" :key="cat">
            <div class="px-3 pt-3 pb-1 text-[9px] font-bold text-slate-600 uppercase tracking-wider">{{ cat }}</div>
            <div class="px-2 space-y-0.5">
                <div v-for="dev in filteredDevices(cat)" :key="dev.id"
                    draggable="true"
                    @dragstart="onDragStart($event, dev)"
                    class="device-palette-item flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white rounded-md cursor-grab transition-all">
                    <i :class="dev.icon" class="w-5 text-center text-xs text-sky-400"></i>
                    <span>{{ dev.label }}</span>
                </div>
            </div>
        </div>
        <div class="mt-3 border-t border-slate-700 p-3">
            <div class="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Connections</div>
            <div class="space-y-1">
                <button v-for="cable in cableTypes" :key="cable.id"
                    @click="selectCable(cable.id)"
                    :class="store.ui.activeTool === 'connect' && store.ui.cableType === cable.id ? 'bg-sky-600 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'"
                    class="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-all">
                    <i :class="cable.icon" class="w-5 text-center text-xs text-amber-400"></i>
                    <span>{{ cable.label }}</span>
                </button>
            </div>
        </div>
        <div class="mt-auto border-t border-slate-700 p-3">
            <div class="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Tools</div>
            <div class="space-y-1">
                <button @click="setTool('select')" :class="store.ui.activeTool === 'select' ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'" class="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-all">
                    <i class="fas fa-mouse-pointer w-5 text-center text-xs"></i> Select / Move
                </button>
                <button @click="setTool('inspect')" :class="store.ui.activeTool === 'inspect' ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'" class="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-all">
                    <i class="fas fa-search w-5 text-center text-xs"></i> Inspect
                </button>
                <button @click="setTool('delete')" :class="store.ui.activeTool === 'delete' ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'" class="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-all">
                    <i class="fas fa-trash w-5 text-center text-xs text-red-400"></i> Delete
                </button>
            </div>
        </div>
        <div v-if="selectedNode" class="border-t border-slate-700 p-3 bg-slate-900/50">
            <div class="flex items-center gap-2 mb-2">
                <i :class="getIcon(selectedNode.type)" class="text-sky-400 text-sm"></i>
                <span class="text-sm font-bold text-white">{{ selectedNode.hostname }}</span>
            </div>
            <div class="text-[10px] font-mono text-slate-400 space-y-1">
                <div class="flex justify-between"><span class="text-slate-500">Type</span><span class="text-slate-300">{{ selectedNode.type }}</span></div>
                <div class="flex justify-between"><span class="text-slate-500">Status</span><span :class="selectedNode.status === 'up' ? 'text-green-400' : 'text-red-400'" class="uppercase">{{ selectedNode.status }}</span></div>
                <div v-for="iface in selectedNode.interfaces" class="border-t border-slate-700/50 pt-1 mt-1">
                    <div class="text-[9px] text-slate-500 font-bold mb-0.5">{{ iface.name }}</div>
                    <div class="flex justify-between"><span class="text-slate-500">IP</span><span class="text-sky-400">{{ iface.ip }}</span></div>
                    <div class="flex justify-between"><span class="text-slate-500">MAC</span><span class="text-amber-400">{{ iface.mac }}</span></div>
                </div>
                <div v-if="selectedNode.arpTable && Object.keys(selectedNode.arpTable).length" class="border-t border-slate-700/50 pt-1 mt-1">
                    <div class="text-[9px] text-slate-500 uppercase font-bold mb-1">ARP Cache</div>
                    <div v-for="(mac, ip) in selectedNode.arpTable" class="flex justify-between text-[9px]">
                        <span class="text-slate-400">{{ ip }}</span>
                        <span class="text-green-400">{{ mac }}</span>
                    </div>
                </div>
            </div>
        </div>
    </aside>
    `,
    setup() {
        const store = (window.__ns || {}).store;
        const categories = ['End Devices', 'Network Devices'];

        const filteredDevices = (cat) => deviceTypes.filter(d => d.category === cat);

        const selectedNode = computed(() => {
            if (!store || !store.ui.selectedObjectId) return null;
            return store.topology.nodes.find(n => n.id === store.ui.selectedObjectId);
        });

        const getIcon = (type) => {
            const d = deviceTypes.find(x => x.id === type);
            return d ? d.icon : 'fas fa-question';
        };

        const onDragStart = (e, dev) => {
            e.dataTransfer.setData('text/plain', dev.id);
            e.dataTransfer.effectAllowed = 'copy';
        };

        const setTool = (tool) => { if (store) { store.ui.activeTool = tool; if (tool !== 'connect') store.ui.linkSourceId = null; } };
        const selectCable = (cableId) => {
            if (!store) return;
            store.ui.cableType = cableId;
            store.ui.activeTool = 'connect';
        };

        return { store, categories, cableTypes, filteredDevices, selectedNode, getIcon, onDragStart, setTool, selectCable };
    }
};
