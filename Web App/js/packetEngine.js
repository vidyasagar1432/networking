import { utils } from './utilities.js';
import { store } from './store.js';

export class PacketEngine {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.protocolEngine = null;
        this.intervals = new Set();
    }

    async dispatchPacket(packetData) {
        const packet = {
            ...packetData,
            id: packetData.id || utils.uuid(),
            currentX: 0,
            currentY: 0,
            progress: 0,
            timestamp: Date.now()
        };
        store.traffic.activePackets.push(packet);
        store.actions.updateStatistics("packetsSent", 1);
        store.actions.addLog("Packet dispatched: " + packet.protocol + " from " + packet.srcIp, 'info');

        const sourceNode = store.topology.nodes.find(n => n.id === packet.srcId);
        const targetNode = store.topology.nodes.find(n => n.id === packet.dstId);

        if (sourceNode && targetNode) {
            await this.animate(packet, sourceNode, targetNode);
        } else {
            store.actions.addLog("Packet dropped: Destination unreachable", 'danger');
            store.actions.updateStatistics("packetsDropped", 1);
        }
    }

    animate(packet, source, target) {
        return new Promise((resolve) => {
            let progress = 0;
            const interval = setInterval(() => {
                if (store.simulation.paused) return;
                const speed = store.simulation.playbackSpeed || 1;
                progress += 0.05 * speed;
                packet.currentX = source.x + (target.x - source.x) * progress;
                packet.currentY = source.y + (target.y - source.y) * progress;
                if (progress >= 1) {
                    clearInterval(interval);
                    this.intervals.delete(interval);
                    this.eventBus.emit("packet_arrived", packet.id);
                    resolve();
                }
            }, 50);
            this.intervals.add(interval);
        });
    }

    stopAll() {
        for (const interval of this.intervals) {
            clearInterval(interval);
        }
        this.intervals.clear();
    }
}
