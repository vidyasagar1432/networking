import { ref, onMounted, onUnmounted } from 'vue';

export default {
    name: "PacketInspector",
    template: `
    <div class="inspector flex flex-col h-full border-l border-slate-700 bg-slate-900 shadow-xl">
        <div class="panel-header flex justify-between items-center bg-slate-800">
            <div class="flex items-center gap-2">
                <i class="fas fa-search-plus text-sky-400"></i>
                <span>Packet Inspector</span>
            </div>
            <button @click="close" class="text-slate-400 hover:text-white"><i class="fas fa-times"></i></button>
        </div>
        <div v-if="packet" class="panel-content space-y-4">
            <div class="layer-block">
                <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Layer 2 - Ethernet</div>
                <div class="bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
                    <div class="grid grid-cols-2 text-[12px] p-2 border-b border-slate-700">
                        <span class="text-slate-400">Destination MAC</span>
                        <span class="font-mono text-sky-400">{{ packet.dstMac }}</span>
                    </div>
                    <div class="grid grid-cols-2 text-[12px] p-2 border-b border-slate-700">
                        <span class="text-slate-400">Source MAC</span>
                        <span class="font-mono text-sky-400">{{ packet.srcMac }}</span>
                    </div>
                    <div class="grid grid-cols-2 text-[12px] p-2">
                        <span class="text-slate-400">EtherType</span>
                        <span class="font-mono">0x0806 (ARP)</span>
                    </div>
                </div>
            </div>
            <div class="layer-block">
                <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Layer 3 - IPv4</div>
                <div class="bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
                    <div class="grid grid-cols-2 text-[12px] p-2 border-b border-slate-700">
                        <span class="text-slate-400">Source IP</span>
                        <span class="font-mono text-sky-400">{{ packet.srcIp }}</span>
                    </div>
                    <div class="grid grid-cols-2 text-[12px] p-2 border-b border-slate-700">
                        <span class="text-slate-400">Destination IP</span>
                        <span class="font-mono text-sky-400">{{ packet.dstIp }}</span>
                    </div>
                    <div class="grid grid-cols-2 text-[12px] p-2">
                        <span class="text-slate-400">TTL</span>
                        <span class="font-mono">64</span>
                    </div>
                </div>
            </div>
            <div class="layer-block">
                <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Layer 4 - Transport</div>
                <div class="bg-slate-800 rounded-lg overflow-hidden border border-slate-700 p-3 text-xs text-slate-400 italic">
                    No L4 Header (ARP is non-TCP/UDP)
                </div>
            </div>
            <div class="layer-block">
                <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Payload</div>
                <div class="bg-slate-950 rounded-lg p-3 font-mono text-[11px] text-green-500 border border-slate-800">
                    {{ packet.payload || "No payload data" }}
                </div>
            </div>
        </div>
        <div v-else class="flex-1 flex flex-col items-center justify-center text-slate-500 p-10 text-center">
            <i class="fas fa-mouse text-4xl mb-4 opacity-20"></i>
            <p class="text-sm">Select a packet to inspect its details.</p>
        </div>
    </div>
    `,
    setup() {
        const packet = ref(null);
        let eventBus;
        onMounted(() => {
            eventBus = (window.__ns || {}).eventBus;
            if (eventBus) eventBus.on("inspect_packet", (pkt) => { packet.value = pkt; });
        });
        onUnmounted(() => {
            if (eventBus) eventBus.off("inspect_packet");
        });
        const close = () => { packet.value = null; };
        return { packet, close };
    }
};
