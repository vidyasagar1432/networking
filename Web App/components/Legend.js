export default {
    name: "Legend",
    template: `
    <div class="absolute bottom-4 right-4 bg-slate-800/80 p-3 rounded border border-slate-700 text-[10px] space-y-1 z-10">
        <div class="font-bold text-slate-400 uppercase tracking-wider mb-1">Legend</div>
        <div class="flex items-center gap-2"><div class="w-3 h-0.5 bg-slate-600"></div> Copper Link</div>
        <div class="flex items-center gap-2"><div class="w-3 h-0.5 bg-amber-600" style="border-top: 2px dashed #d97706;"></div> Fiber Link</div>
        <div class="flex items-center gap-2"><div class="w-3 h-3 rounded-full bg-sky-400"></div> Active Packet</div>
        <div class="flex items-center gap-2"><div class="w-2 h-2 rounded-full bg-green-500"></div> Device Online</div>
        <div class="flex items-center gap-2"><div class="w-2 h-2 rounded-full bg-red-500"></div> Device Offline</div>
    </div>
    `
};
