import { ref, computed } from 'vue';

export default {
    name: "DeviceConfig",
    template: `
    <div class="fixed inset-0 bg-black/60 flex items-center justify-center z-50" @click.self="close">
        <div class="bg-slate-800 rounded-xl border border-slate-600 shadow-2xl w-[650px] max-h-[80vh] flex flex-col">
            <div class="flex items-center justify-between px-5 py-3 border-b border-slate-700 bg-slate-900 rounded-t-xl">
                <div class="flex items-center gap-3">
                    <i :class="deviceIcon" class="text-lg" :style="{color: deviceIconColor}"></i>
                    <div>
                        <span class="text-white font-bold">{{ device.hostname }}</span>
                        <span class="text-slate-500 text-sm ml-2">({{ device.type }})</span>
                    </div>
                </div>
                <button @click="close" class="text-slate-400 hover:text-white text-xl leading-none">&times;</button>
            </div>
            <div class="flex border-b border-slate-700 bg-slate-900/50">
                <button v-for="tab in tabs" :key="tab.id"
                    @click="activeTab = tab.id"
                    :class="activeTab === tab.id ? 'bg-slate-800 text-sky-400 border-b-2 border-sky-400' : 'text-slate-500 hover:text-slate-300'"
                    class="px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all">
                    <i :class="tab.icon" class="mr-1.5"></i>{{ tab.label }}
                </button>
            </div>
            <div class="flex-1 overflow-y-auto p-5">
                <div v-if="activeTab === 'desktop'">
                    <div class="grid grid-cols-2 gap-4 mb-4">
                        <div class="bg-slate-900 rounded-lg p-4 border border-slate-700">
                            <div class="text-[10px] text-slate-500 uppercase font-bold mb-2">IP Configuration</div>
                            <div v-if="device.interfaces && device.interfaces.length" class="space-y-2 text-xs font-mono">
                                <div class="flex justify-between"><span class="text-slate-400">Interface</span><span class="text-white">{{ device.interfaces[0].name }}</span></div>
                                <div class="flex justify-between"><span class="text-slate-400">IP Address</span><span class="text-sky-400">{{ device.interfaces[0].ip }}</span></div>
                                <div class="flex justify-between"><span class="text-slate-400">MAC Address</span><span class="text-amber-400">{{ device.interfaces[0].mac }}</span></div>
                                <div class="flex justify-between"><span class="text-slate-400">Link Status</span><span class="text-green-400">Up</span></div>
                            </div>
                            <div v-else class="text-xs text-slate-500 italic">No interfaces</div>
                        </div>
                        <div class="bg-slate-900 rounded-lg p-4 border border-slate-700">
                            <div class="text-[10px] text-slate-500 uppercase font-bold mb-2">Device Status</div>
                            <div class="space-y-2 text-xs font-mono">
                                <div class="flex justify-between"><span class="text-slate-400">Hostname</span><span class="text-white">{{ device.hostname }}</span></div>
                                <div class="flex justify-between"><span class="text-slate-400">Type</span><span class="text-slate-300 capitalize">{{ device.type }}</span></div>
                                <div class="flex justify-between"><span class="text-slate-400">Status</span><span :class="device.status === 'up' ? 'text-green-400' : 'text-red-400'" class="uppercase">{{ device.status }}</span></div>
                                <div class="flex justify-between"><span class="text-slate-400">Connected Links</span><span class="text-white">{{ connectedLinks.length }}</span></div>
                            </div>
                        </div>
                    </div>
                    <button @click="ping" class="w-full py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-sm font-bold transition-all">Ping PC-B (192.168.1.2)</button>
                </div>
                <div v-if="activeTab === 'cli'" class="space-y-0">
                    <div class="bg-black rounded-t-lg px-4 py-2 border-b border-slate-800 flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-red-500"></div>
                        <div class="w-3 h-3 rounded-full bg-amber-500"></div>
                        <div class="w-3 h-3 rounded-full bg-green-500"></div>
                        <span class="ml-2 text-[10px] text-slate-600 font-mono">{{ device.hostname }}: CLI</span>
                    </div>
                    <div class="bg-black/90 rounded-b-lg p-4 font-mono text-xs h-64 overflow-y-auto" ref="cliOutput">
                        <div class="text-green-500">{{ cliLines.join('\\n') }}</div>
                        <div class="flex items-center mt-1">
                            <span class="text-sky-400">{{ cliPrompt }}</span>
                            <input ref="cliInput" v-model="cliBuffer" @keydown.enter="runCliCommand" class="bg-transparent border-none outline-none text-white flex-1 ml-1 text-xs font-mono" autofocus/>
                        </div>
                    </div>
                </div>
                <div v-if="activeTab === 'config'">
                    <div class="space-y-3">
                        <div class="bg-slate-900 rounded-lg p-4 border border-slate-700">
                            <div class="text-[10px] text-slate-500 uppercase font-bold mb-3">Interfaces</div>
                            <div v-if="device.interfaces && device.interfaces.length">
                                <div v-for="iface in device.interfaces" class="flex items-center justify-between py-2 border-b border-slate-700/50 last:border-0">
                                    <div class="flex items-center gap-2">
                                        <div class="w-2 h-2 rounded-full bg-green-500"></div>
                                        <span class="text-sm font-mono text-white">{{ iface.name }}</span>
                                    </div>
                                    <div class="text-right">
                                        <div class="text-xs font-mono text-sky-400">{{ iface.ip }}</div>
                                        <div class="text-[10px] font-mono text-amber-400">{{ iface.mac }}</div>
                                    </div>
                                </div>
                            </div>
                            <div v-else class="text-xs text-slate-500 italic py-2">No interfaces configured</div>
                        </div>
                        <div class="bg-slate-900 rounded-lg p-4 border border-slate-700">
                            <div class="text-[10px] text-slate-500 uppercase font-bold mb-2">ARP Table</div>
                            <div v-if="hasArpEntries" class="text-xs font-mono">
                                <div class="flex justify-between text-slate-500 pb-1 border-b border-slate-700 mb-1">
                                    <span>IP Address</span><span>MAC Address</span>
                                </div>
                                <div v-for="(mac, ip) in device.arpTable" class="flex justify-between py-0.5">
                                    <span class="text-sky-400">{{ ip }}</span><span class="text-green-400">{{ mac }}</span>
                                </div>
                            </div>
                            <div v-else class="text-xs text-slate-500 italic py-2">ARP cache empty</div>
                        </div>
                    </div>
                </div>
                <div v-if="activeTab === 'arp'">
                    <div class="bg-slate-900 rounded-lg border border-slate-700 overflow-hidden">
                        <div class="grid grid-cols-3 gap-4 px-4 py-2 bg-slate-800 text-[10px] text-slate-500 uppercase font-bold">
                            <span>IP Address</span><span>MAC Address</span><span>Type</span>
                        </div>
                        <div v-if="hasArpEntries">
                            <div v-for="(mac, ip) in device.arpTable" class="grid grid-cols-3 gap-4 px-4 py-2 border-t border-slate-700/50 text-xs font-mono">
                                <span class="text-sky-400">{{ ip }}</span><span class="text-green-400">{{ mac }}</span><span class="text-slate-500">Dynamic</span>
                            </div>
                        </div>
                        <div v-else class="px-4 py-6 text-xs text-slate-500 italic text-center">ARP table is empty. Send traffic to populate.</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    setup() {
        const store = (window.__ns || {}).store;
        const activeTab = ref('desktop');
        const cliBuffer = ref('');
        const cliLines = ref([
            'IOS Command Line Interface',
            'Copyright (c) 2024 NetSim',
            '',
            deviceHostname() + '>',
        ]);
        const cliInput = ref(null);

        function deviceHostname() {
            if (!store || !store.ui.deviceConfigTarget) return 'Device';
            const n = store.topology.nodes.find(x => x.id === store.ui.deviceConfigTarget);
            return n ? n.hostname : 'Device';
        }

        const device = computed(() => {
            if (!store || !store.ui.deviceConfigTarget) return { hostname: 'Unknown', type: '', interfaces: [], arpTable: {}, status: 'down' };
            return store.topology.nodes.find(n => n.id === store.ui.deviceConfigTarget) || { hostname: 'Unknown', type: '', interfaces: [], arpTable: {}, status: 'down' };
        });

        const deviceIcon = computed(() => {
            const icons = { pc: "fas fa-desktop", router: "fas fa-route", switch: "fas fa-network-wired", server: "fas fa-server", firewall: "fa-shield-halved", cloud: "fas fa-cloud" };
            return icons[device.value.type] || "fas fa-question";
        });

        const deviceIconColor = computed(() => {
            const colors = { pc: "#38bdf8", router: "#34d399", switch: "#f59e0b", server: "#a78bfa", firewall: "#fb7185", cloud: "#94a3b8" };
            return colors[device.value.type] || "#94a3b8";
        });

        const connectedLinks = computed(() => {
            if (!store) return [];
            return store.topology.links.filter(l => l.source === device.value.id || l.target === device.value.id);
        });

        const hasArpEntries = computed(() => device.value.arpTable && Object.keys(device.value.arpTable).length > 0);

        const cliPrompt = computed(() => deviceHostname() + '>');

        const tabs = [
            { id: 'desktop', label: 'Desktop', icon: 'fas fa-desktop' },
            { id: 'cli', label: 'CLI', icon: 'fas fa-terminal' },
            { id: 'config', label: 'Config', icon: 'fas fa-cog' },
            { id: 'arp', label: 'ARP Table', icon: 'fas fa-table' },
        ];

        const ping = () => {
            const ns = window.__ns || {};
            const { packetEngine } = ns;
            if (!packetEngine || !store) return;
            const src = device.value;
            const dst = store.topology.nodes.find(n => n.id === 'pc2');
            if (!src || !dst || !src.interfaces.length || !dst.interfaces.length) return;
            store.actions.addLog("Ping sent from " + src.hostname, "info");
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

        const runCliCommand = () => {
            const cmd = cliBuffer.value.trim().toLowerCase();
            cliBuffer.value = '';
            if (!cmd) return;
            cliLines.value.push(cliPrompt.value + ' ' + cmd);
            const parts = cmd.split(/\s+/);
            if (cmd === 'show ip arp' || cmd === 'show arp') {
                const tbl = device.value.arpTable || {};
                const keys = Object.keys(tbl);
                if (keys.length === 0) {
                    cliLines.value.push('  ARP table is empty');
                } else {
                    cliLines.value.push('  IP Address       MAC Address');
                    keys.forEach(k => cliLines.value.push('  ' + k.padEnd(16) + '  ' + tbl[k]));
                }
            } else if (cmd === 'show interfaces' || cmd === 'show ip interface brief') {
                const ifs = device.value.interfaces || [];
                if (ifs.length === 0) {
                    cliLines.value.push('  No interfaces');
                } else {
                    cliLines.value.push('  Interface  IP Address      MAC Address');
                    ifs.forEach(i => cliLines.value.push('  ' + i.name.padEnd(9) + ' ' + i.ip.padEnd(15) + ' ' + i.mac));
                }
            } else if (cmd === 'show version') {
                cliLines.value.push('  NetSim v1.0, ARP Protocol Lab');
                cliLines.value.push('  Device: ' + device.value.hostname + ' (' + device.value.type + ')');
                cliLines.value.push('  Uptime: simulation time');
            } else if (cmd === 'ping') {
                ping();
                cliLines.value.push('  Sending ARP request...');
            } else if (cmd.startsWith('ping ') && parts.length >= 2) {
                cliLines.value.push('  Pinging ' + parts[1] + ' via ARP...');
                const ns = window.__ns || {};
                if (ns.packetEngine && store) {
                    const src = device.value;
                    const dstIp = parts[1];
                    const dst = store.topology.nodes.find(n => n.interfaces.some(i => i.ip === dstIp));
                    if (src && dst && src.interfaces.length && dst.interfaces.length) {
                        const arpRequest = {
                            type: "REQUEST", protocol: "ARP",
                            srcIp: src.interfaces[0].ip, srcMac: src.interfaces[0].mac,
                            dstIp: dst.interfaces[0].ip, dstMac: "ff:ff:ff:ff:ff:ff",
                            targetIp: dst.interfaces[0].ip,
                            payload: "ARP Request for " + dst.interfaces[0].ip,
                            srcId: src.id, dstId: dst.id
                        };
                        ns.packetEngine.dispatchPacket(arpRequest);
                    }
                }
            } else if (cmd === 'help' || cmd === '?') {
                cliLines.value.push('  Available commands:');
                cliLines.value.push('    show ip arp          Display ARP cache');
                cliLines.value.push('    show interfaces      Display interface info');
                cliLines.value.push('    show version         Show device info');
                cliLines.value.push('    ping [ip]            Send ARP ping');
                cliLines.value.push('    clear arp-cache      Clear ARP table');
                cliLines.value.push('    help                 This help');
            } else if (cmd === 'clear arp-cache') {
                if (device.value.arpTable) device.value.arpTable = {};
                cliLines.value.push('  ARP cache cleared');
            } else if (cmd === 'enable') {
                cliLines.value.push('  Privilege mode not available in this lab');
            } else {
                cliLines.value.push('  % Unknown command "' + cmd + '". Type "help" for available commands.');
            }
            cliLines.value.push(deviceHostname() + '>');
            setTimeout(() => {
                const el = cliInput.value;
                if (el) el.focus();
            }, 50);
        };

        const close = () => { if (store) store.ui.deviceConfigTarget = null; };

        return { device, activeTab, tabs, deviceIcon, deviceIconColor, connectedLinks, hasArpEntries,
            cliBuffer, cliLines, cliPrompt, cliInput, ping, runCliCommand, close };
    }
};
