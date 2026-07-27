import { ARPProtocol } from '../protocols/arp.js';
import { store } from './store.js';

export class ProtocolEngine {
    constructor(packetEngine) {
        this.packetEngine = packetEngine;
        this.protocols = {
            "ARP": new ARPProtocol()
        };
    }

    async handlePacketArrival(packet, targetNode) {
        if (!packet || !targetNode) return;

        this._learnMacOnSwitches(packet);

        if (targetNode.type === 'switch') {
            const protocol = this.protocols["ARP"];
            if (protocol && protocol._handleSwitch) {
                const newPackets = protocol._handleSwitch(packet, targetNode);
                if (newPackets && newPackets.length > 0) {
                    for (const pkt of newPackets) {
                        this.packetEngine.dispatchPacket(pkt);
                    }
                }
                store.actions.addLog(
                    `${targetNode.hostname} processed frame (MAC table: ${Object.keys(protocol.getSwitchMacTable(targetNode)).length} entries)`,
                    'info'
                );
            }
            return;
        }

        const protocol = this.protocols[packet.protocol];
        if (protocol) {
            const newPackets = await protocol.process(packet, targetNode);
            if (newPackets && newPackets.length > 0) {
                for (const nextPacket of newPackets) {
                    this.packetEngine.dispatchPacket(nextPacket);
                }
            }
        } else {
            store.actions.addLog("Unknown protocol: " + packet.protocol, "warning");
        }
    }

    _learnMacOnSwitches(packet) {
        if (!packet || !packet.srcMac || !packet.srcId) return;

        const switches = store.topology.nodes.filter(n => n.type === 'switch');
        const arp = this.protocols["ARP"];
        if (!arp) return;

        for (const sw of switches) {
            const connected = this._isConnected(sw.id, packet.srcId);
            if (connected) {
                if (!arp.switchMacTables[sw.id]) {
                    arp.switchMacTables[sw.id] = {};
                }
                arp.switchMacTables[sw.id][packet.srcMac.toLowerCase()] = {
                    port: packet.srcId,
                    learned: Date.now()
                };
            }
        }
    }

    _isConnected(nodeA, nodeB) {
        return store.topology.links.some(l =>
            (l.source === nodeA && l.target === nodeB) ||
            (l.target === nodeA && l.source === nodeB)
        );
    }

    triggerGratuitousArp(node) {
        const arp = this.protocols["ARP"];
        if (!arp) return;

        const neighborSwitch = store.topology.nodes.find(n =>
            n.type === 'switch' && this._isConnected(n.id, node.id)
        );

        const packet = arp.sendGratuitousArp(node, neighborSwitch);
        if (packet) {
            this.packetEngine.dispatchPacket(packet);
        }
    }

    sendArpRequest(srcNode, targetIp, targetNodeId) {
        const arp = this.protocols["ARP"];
        if (!arp) return;
        const packet = arp.sendArpRequest(srcNode, targetIp, targetNodeId);
        if (packet) {
            this.packetEngine.dispatchPacket(packet);
        }
    }
}
