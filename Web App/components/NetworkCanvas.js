import { ref, computed, onMounted, onUnmounted } from 'vue';
import { utils } from '../js/utilities.js';

const deviceIcons = { pc: "fas fa-desktop", router: "fas fa-route", switch: "fas fa-network-wired", server: "fas fa-server", firewall: "fa-shield-halved", cloud: "fas fa-cloud" };

export default {
    name: "NetworkCanvas",
    template: `
    <div class="canvas-container w-full h-full overflow-hidden relative"
        @dragover.prevent @drop="onDrop">
        <svg class="w-full h-full" @mousedown="onSvgMouseDown" @mousemove="onSvgMouseMove" @mouseup="onSvgMouseUp" @dblclick="onDblClick">
            <defs>
                <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                    <polygon points="0 0, 8 3, 0 6" fill="#64748b"/>
                </marker>
            </defs>
            <g class="links-layer">
                <line v-for="link in links" :key="link.id"
                    :x1="getNodeX(link.source)" :y1="getNodeY(link.source)"
                    :x2="getNodeX(link.target)" :y2="getNodeY(link.target)"
                    :class="getLinkClass(link)" :stroke-dasharray="getLinkDash(link)"
                    stroke-linecap="round" marker-end="url(#arrowhead)"
                    @click.stop="selectLink(link)"/>
            </g>
            <g class="packets-layer">
                <circle v-for="pkt in activePackets" :key="pkt.id"
                    :cx="pkt.currentX" :cy="pkt.currentY" r="5"
                    class="packet-node fill-sky-400"
                    @click.stop="selectPacket(pkt)"/>
            </g>
            <g class="nodes-layer">
                <g v-for="node in nodes" :key="node.id"
                    :transform="'translate(' + node.x + ', ' + node.y + ')'"
                    class="network-node group"
                    @mousedown.stop="onNodeMouseDown($event, node)">
                    <rect x="-28" y="-28" width="56" height="56" rx="8" ry="8"
                        :class="getNodeRectClass(node)" stroke-width="2"/>
                    <foreignObject x="-20" y="-22" width="40" height="28">
                        <div class="flex items-center justify-center w-full h-full">
                            <i :class="getNodeIcon(node.type)" :style="{color: getNodeIconColor(node)}" class="text-xl"></i>
                        </div>
                    </foreignObject>
                    <text x="0" y="36" text-anchor="middle" class="fill-slate-300 text-[9px] font-mono">{{ node.hostname }}</text>
                    <circle cx="20" cy="-20" r="4" :class="node.status === 'up' ? 'led-green' : 'fill-red-500'" stroke="#1e293b" stroke-width="1.5"/>
                </g>
            </g>
            <line v-if="store.ui.linkSourceId" :x1="linkSourceX" :y1="linkSourceY" :x2="linkMouseX" :y2="linkMouseY" stroke="#0ea5e9" stroke-width="2" stroke-dasharray="4,4" class="pointer-events-none"/>
        </svg>
        <div v-if="modeHint" class="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg text-sm font-bold shadow-lg z-30 transition-opacity" :class="modeHintClass">{{ modeHint }}</div>
    </div>
    `,
    setup() {
        const store = (window.__ns || {}).store;
        const nodes = computed(() => store ? store.topology.nodes : []);
        const links = computed(() => store ? store.topology.links : []);
        const activePackets = computed(() => store ? store.traffic.activePackets : []);

        const linkSourceX = ref(0);
        const linkSourceY = ref(0);
        const linkMouseX = ref(0);
        const linkMouseY = ref(0);
        const modeHint = ref('');
        const modeHintClass = ref('');
        let hintTimeout = null;

        const draggingNode = ref(null);
        const dragOffsetX = ref(0);
        const dragOffsetY = ref(0);

        const showModeHint = (msg, cls = 'bg-sky-600 text-white') => {
            modeHint.value = msg;
            modeHintClass.value = cls;
            if (hintTimeout) clearTimeout(hintTimeout);
            hintTimeout = setTimeout(() => { modeHint.value = ''; }, 3000);
        };

        const getNodeX = (id) => { const n = nodes.value.find(n => n.id === id); return n ? n.x : 0; };
        const getNodeY = (id) => { const n = nodes.value.find(n => n.id === id); return n ? n.y : 0; };
        const getNodeIcon = (type) => deviceIcons[type] || "fas fa-question";
        const getNodeIconColor = (type) => {
            const colors = { pc: "#38bdf8", router: "#34d399", switch: "#f59e0b", server: "#a78bfa", firewall: "#fb7185", cloud: "#94a3b8" };
            return colors[type] || "#94a3b8";
        };
        const getNodeRectClass = (node) => {
            let base = 'fill-slate-800 ';
            if (store && store.ui.selectedObjectId === node.id) base += 'stroke-sky-400 ';
            else base += 'stroke-slate-600 ';
            return base;
        };
        const getLinkClass = (link) => {
            return link.type === 'fiber' ? 'connection-line stroke-amber-600 stroke-2' : 'connection-line stroke-slate-600 stroke-2';
        };
        const getLinkDash = (link) => {
            return link.type === 'fiber' ? '4,4' : '8,4';
        };

        const selectLink = (link) => {
            if (!store) return;
            if (store.ui.activeTool === 'delete') {
                store.topology.links = store.topology.links.filter(l => l.id !== link.id);
                store.actions.addLog("Link removed", "info");
                return;
            }
        };

        const selectPacket = (pkt) => {
            const eb = (window.__ns || {}).eventBus;
            if (eb) eb.emit("inspect_packet", pkt);
        };

        const onNodeMouseDown = (e, node) => {
            if (!store) return;
            const tool = store.ui.activeTool;
            if (tool === 'delete') {
                store.topology.nodes = store.topology.nodes.filter(n => n.id !== node.id);
                store.topology.links = store.topology.links.filter(l => l.source !== node.id && l.target !== node.id);
                store.actions.addLog("Deleted " + node.hostname, "info");
                return;
            }
            if (tool === 'connect') {
                if (!store.ui.linkSourceId) {
                    store.ui.linkSourceId = node.id;
                    linkSourceX.value = node.x;
                    linkSourceY.value = node.y;
                    store.actions.addLog("Link from: " + node.hostname, "info");
                    showModeHint('Click target device to complete connection');
                } else if (store.ui.linkSourceId !== node.id) {
                    const link = { id: utils.uuid(), source: store.ui.linkSourceId, target: node.id, type: store.ui.cableType || 'copper' };
                    store.topology.links.push(link);
                    store.actions.addLog("Link created: " + link.source + " <-> " + link.target + " (" + link.type + ")", "success");
                    store.ui.linkSourceId = null;
                    showModeHint('Connection created!', 'bg-green-600 text-white');
                }
                return;
            }
            if (tool === 'inspect') {
                store.ui.deviceConfigTarget = node.id;
                return;
            }
            store.ui.selectedObjectId = node.id;
            draggingNode.value = node;
            const svg = e.currentTarget.closest('svg');
            const rect = svg.getBoundingClientRect();
            dragOffsetX.value = e.clientX - rect.left - node.x;
            dragOffsetY.value = e.clientY - rect.top - node.y;
        };

        const onSvgMouseDown = () => {
            if (store && store.ui.activeTool === 'select') {
                store.ui.selectedObjectId = null;
            }
        };

        const onSvgMouseMove = (e) => {
            if (!store) return;
            if (store.ui.linkSourceId) {
                const svg = e.currentTarget;
                const rect = svg.getBoundingClientRect();
                linkMouseX.value = e.clientX - rect.left;
                linkMouseY.value = e.clientY - rect.top;
            }
            if (draggingNode.value) {
                const svg = e.currentTarget;
                const rect = svg.getBoundingClientRect();
                draggingNode.value.x = e.clientX - rect.left - dragOffsetX.value;
                draggingNode.value.y = e.clientY - rect.top - dragOffsetY.value;
            }
        };

        const onSvgMouseUp = () => {
            if (draggingNode.value) {
                store.actions.addLog("Moved " + draggingNode.value.hostname, "info");
                draggingNode.value = null;
            }
        };

        const onDblClick = (e) => {
            if (!store) return;
            const svg = e.currentTarget;
            const rect = svg.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const clicked = nodes.value.find(n => Math.abs(n.x - x) < 30 && Math.abs(n.y - y) < 30);
            if (clicked) {
                store.ui.deviceConfigTarget = clicked.id;
            }
        };

        const onDrop = (e) => {
            if (!store) return;
            const deviceType = e.dataTransfer.getData('text/plain');
            if (!deviceType) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const nm = window.__ns.topologyManager;
            const id = utils.uuid();
            const hostname = deviceType.toUpperCase() + '-' + (store.topology.nodes.length + 1);
            const node = {
                id, type: deviceType, hostname, x, y, status: 'up',
                interfaces: deviceType === 'pc' || deviceType === 'server'
                    ? [{ ip: "192.168.1." + (store.topology.nodes.length + 10), mac: utils.generateMac(), name: "eth0" }]
                    : [],
                arpTable: {}
            };
            if (nm) {
                nm.addNode(deviceType, x, y);
            } else {
                store.topology.nodes.push(node);
            }
            store.actions.addLog("Added " + hostname + " (" + deviceType + ")", "success");
            showModeHint(hostname + ' placed on canvas', 'bg-green-600 text-white');
        };

        let mouseHandler;
        onMounted(() => {
            mouseHandler = (e) => {
                if (store && store.ui.linkSourceId) {
                    const svg = document.querySelector('.canvas-container svg');
                    if (svg) {
                        const rect = svg.getBoundingClientRect();
                        linkMouseX.value = e.clientX - rect.left;
                        linkMouseY.value = e.clientY - rect.top;
                    }
                }
            };
            document.addEventListener('mousemove', mouseHandler);
        });
        onUnmounted(() => {
            if (mouseHandler) document.removeEventListener('mousemove', mouseHandler);
        });

        return { store, nodes, links, activePackets, linkSourceX, linkSourceY, linkMouseX, linkMouseY, modeHint, modeHintClass,
            getNodeX, getNodeY, getNodeIcon, getNodeIconColor, getNodeRectClass, getLinkClass, getLinkDash,
            selectLink, selectPacket, onNodeMouseDown, onSvgMouseDown, onSvgMouseMove, onSvgMouseUp, onDblClick, onDrop };
    }
};
