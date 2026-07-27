import { ref, computed } from 'vue';

export default {
    name: "LearningPanel",
    template: `
    <div class="inspector flex flex-col h-full bg-slate-900 border-l border-slate-700 shadow-2xl">
        <div class="panel-header bg-sky-900/30 border-b border-sky-500/30 flex items-center gap-2">
            <i class="fas fa-graduation-cap text-sky-400"></i>
            <span class="text-sm font-bold text-sky-100">Learning Mode: ARP</span>
        </div>
        <div class="panel-content space-y-4">
            <div class="bg-slate-800 rounded-lg border border-sky-500/50 overflow-hidden">
                <div class="bg-sky-500/10 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-sky-400">Current Step</div>
                <div class="p-4">
                    <h3 class="text-lg font-bold text-white mb-2">{{ currentStep.title }}</h3>
                    <p class="text-sm text-slate-300 leading-relaxed">{{ currentStep.description }}</p>
                </div>
            </div>
            <div class="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                <h4 class="text-xs font-bold text-slate-500 uppercase mb-3">Technical Explanation</h4>
                <p class="text-sm text-slate-400 leading-relaxed">{{ currentStep.technicalDetail }}</p>
            </div>
            <div class="grid grid-cols-2 gap-2">
                <div class="bg-slate-800/50 p-2 rounded border border-slate-700 text-center">
                    <div class="text-[9px] text-slate-500 uppercase font-bold">OSI Layer</div>
                    <div class="text-sm font-mono text-sky-400">{{ currentStep.osiLayer }}</div>
                </div>
                <div class="bg-slate-800/50 p-2 rounded border border-slate-700 text-center">
                    <div class="text-[9px] text-slate-500 uppercase font-bold">TCP/IP Layer</div>
                    <div class="text-sm font-mono text-sky-400">{{ currentStep.tcpIpLayer }}</div>
                </div>
            </div>
            <div class="bg-slate-950 rounded-lg p-3 border border-slate-800">
                <h4 class="text-[10px] font-bold text-slate-500 uppercase mb-2">Cisco IOS Command</h4>
                <div class="bg-black/30 rounded p-2 text-xs font-mono text-green-500"><span class="text-slate-500">#</span> {{ currentStep.ciscoCommand }}</div>
            </div>
            <div class="bg-amber-900/10 border border-amber-500/20 rounded-lg p-3">
                <h4 class="text-xs font-bold text-amber-500/70 uppercase mb-1">Interview Tip</h4>
                <p class="text-xs text-amber-200/80 italic">"{{ currentStep.interviewTip }}"</p>
            </div>
        </div>
        <div class="p-4 bg-slate-800/50 mt-auto flex justify-between gap-2">
            <button @click="prevStep" class="flex-1 py-2 text-xs bg-slate-700 hover:bg-slate-600 rounded">Previous</button>
            <button @click="nextStep" class="flex-1 py-2 text-xs bg-sky-600 hover:bg-sky-500 rounded font-bold">Next Step</button>
        </div>
    </div>
    `,
    setup() {
        const currentStepIndex = ref(0);
        const steps = [
            { title: "The ARP Request", description: "When a host wants to communicate with an IP on its local subnet but only knows the IP, it generates an ARP Request.", technicalDetail: "The host encapsulates an ARP message inside an Ethernet frame. The destination MAC is set to the broadcast address (FF:FF:FF:FF:FF:FF), forcing every device on the segment to process it.", osiLayer: "Layer 2 (Data Link)", tcpIpLayer: "Network Access", ciscoCommand: "show ip arp", interviewTip: "ARP is a broadcast protocol. It cannot cross a router (Layer 3 boundary)." },
            { title: "Switch Flooding", description: "The Layer 2 switch receives the broadcast frame and floods it out of all ports except the one it arrived on.", technicalDetail: "The switch looks at the Destination MAC (FF:FF:FF:FF:FF:FF). Since it is a broadcast, it replicates the frame to all active ports.", osiLayer: "Layer 2 (Data Link)", tcpIpLayer: "Network Access", ciscoCommand: "show mac address-table", interviewTip: "Excessive ARP broadcasts can lead to Broadcast Storms." },
            { title: "The ARP Reply", description: "The target host recognizes its IP in the request and sends a Unicast ARP Reply.", technicalDetail: "The target updates its own ARP cache with the sender info and sends a Reply directly to the requester MAC. This is Unicast, not broadcast.", osiLayer: "Layer 2 -> Layer 3", tcpIpLayer: "Network Access -> Internet", ciscoCommand: "debug arp", interviewTip: "ARP is stateless; devices accept replies even without a request (ARP Poisoning risk)." }
        ];
        const currentStep = computed(() => steps[currentStepIndex.value]);
        const nextStep = () => { if (currentStepIndex.value < steps.length - 1) currentStepIndex.value++; };
        const prevStep = () => { if (currentStepIndex.value > 0) currentStepIndex.value--; };
        return { currentStep, nextStep, prevStep };
    }
};
