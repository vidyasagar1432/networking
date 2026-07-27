import { NetworkProtocol } from './protocol.js';
import { utils } from '../js/utilities.js';
import { store } from '../js/store.js';

const ARP_CACHE_STATES = {
    INCOMPLETE: 'INCOMPLETE',
    REACHABLE: 'REACHABLE',
    STALE: 'STALE',
    DELAY: 'DELAY',
    PROBE: 'PROBE',
};

const ARP_TIMEOUTS = {
    INCOMPLETE: 3000,
    REACHABLE: 20000,
    STALE: 60000,
    DELAY: 5000,
    PROBE: 1000,
    RETRY_INTERVAL: 1000,
    MAX_RETRIES: 3,
};

export class ARPProtocol extends NetworkProtocol {
    constructor() {
        super("ARP", 2, 0x0806);
        this.pendingRequests = {};
        this.switchMacTables = {};
    }

    async process(packet, destinationNode) {
        if (!packet || !destinationNode) return null;

        const packets = [];
        const now = Date.now();

        if (this._isSwitch(destinationNode)) {
            return this._handleSwitch(packet, destinationNode);
        }

        const isBroadcast = packet.dstMac && packet.dstMac.toLowerCase() === 'ff:ff:ff:ff:ff:ff';
        const isForMe = destinationNode.interfaces &&
            destinationNode.interfaces.some(i => i.mac && i.mac.toLowerCase() === (packet.dstMac || '').toLowerCase());

        if (packet.opcode === 'REQUEST' || packet.type === 'REQUEST') {
            const result = this._handleRequest(packet, destinationNode, now);
            if (result) packets.push(...result);
        }

        if (packet.opcode === 'REPLY' || packet.type === 'REPLY') {
            this._handleReply(packet, destinationNode, now);
        }

        if (packet.opcode === 'GRATUITOUS') {
            this._handleGratuitous(packet, destinationNode, now);
        }

        return packets.length > 0 ? packets : null;
    }

    _isSwitch(node) {
        return node.type === 'switch' || node.hostname?.toLowerCase().startsWith('sw');
    }

    _handleSwitch(packet, switchNode) {
        if (!this.switchMacTables[switchNode.id]) {
            this.switchMacTables[switchNode.id] = {};
        }
        const table = this.switchMacTables[switchNode.id];

        if (packet.srcMac) {
            table[packet.srcMac.toLowerCase()] = { port: packet.srcId || 'unknown', learned: Date.now() };
        }

        const isBroadcast = packet.dstMac && packet.dstMac.toLowerCase() === 'ff:ff:ff:ff:ff:ff';
        const knownPort = table[packet.dstMac?.toLowerCase()];

        const neighbors = this._getSwitchNeighbors(switchNode);

        if (knownPort && !isBroadcast) {
            const targetNeighbor = neighbors.find(n => n.node.id === knownPort.port);
            if (targetNeighbor) {
                store.actions.addLog(
                    switchNode.hostname + ` forwarding frame to ${targetNeighbor.node.hostname} (MAC table hit)`,
                    'info'
                );
                const fwd = { ...packet, id: utils.uuid(), srcId: switchNode.id, dstId: knownPort.port };
                return [fwd];
            }
        }

        const hopCount = (packet.hopCount || 0);
        if (hopCount >= 10) {
            store.actions.addLog(switchNode.hostname + ' dropping frame (max hops reached)', 'danger');
            return null;
        }

        const floodPackets = neighbors
            .filter(n => n.node.id !== packet.srcId)
            .map(n => ({
                ...packet,
                id: utils.uuid(),
                srcId: switchNode.id,
                dstId: n.node.id,
                hopCount: hopCount + 1,
            }));

        if (floodPackets.length > 0) {
            store.actions.addLog(
                switchNode.hostname + ` flooding frame to ${floodPackets.length} port(s)`,
                isBroadcast ? 'warning' : 'info'
            );
        }

        return floodPackets.length > 0 ? floodPackets : null;
    }

    _getSwitchNeighbors(switchNode) {
        const links = store.topology.links.filter(
            l => l.source === switchNode.id || l.target === switchNode.id
        );
        return links.map(l => {
            const neighborId = l.source === switchNode.id ? l.target : l.source;
            const node = store.topology.nodes.find(n => n.id === neighborId);
            return node ? { link: l, node } : null;
        }).filter(Boolean);
    }

    _handleRequest(packet, node, now) {
        const packets = [];
        const targetIp = packet.targetIp || packet.dstIp;

        this._updateArpCache(node, packet.srcIp, packet.srcMac, ARP_CACHE_STATES.REACHABLE, now);

        const matchIface = node.interfaces?.find(i => i.ip === targetIp);
        if (!matchIface) return packets;

        store.actions.addLog(
            `${node.hostname} received ARP Request: "Who has ${targetIp}? Tell ${packet.srcIp}"`,
            'info'
        );

        this._updateArpCache(node, packet.srcIp, packet.srcMac, ARP_CACHE_STATES.REACHABLE, now);

        const reply = {
            id: utils.uuid(),
            opcode: 'REPLY',
            type: 'REPLY',
            protocol: 'ARP',
            hardwareType: 1,
            protocolType: 0x0800,
            hardwareLen: 6,
            protocolLen: 4,
            srcIp: matchIface.ip,
            srcMac: matchIface.mac,
            dstIp: packet.srcIp,
            dstMac: packet.srcMac,
            targetIp: packet.srcIp,
            targetMac: packet.srcMac,
            senderIp: matchIface.ip,
            senderMac: matchIface.mac,
            payload: `ARP Reply: ${matchIface.ip} is at ${this.formatMac(matchIface.mac)}`,
            srcId: node.id,
            dstId: packet.srcId,
            hopCount: 0,
        };

        store.actions.addLog(
            `${node.hostname} sending ARP Reply: "${matchIface.ip} is at ${this.formatMac(matchIface.mac)}"`,
            'success'
        );

        this._sendGratuitousAfterReply(node, matchIface);
        packets.push(reply);
        return packets;
    }

    _handleReply(packet, node, now) {
        this._updateArpCache(node, packet.srcIp, packet.srcMac, ARP_CACHE_STATES.REACHABLE, now);

        const reqKey = `${node.id}:${packet.srcIp}`;
        if (this.pendingRequests[reqKey]) {
            clearTimeout(this.pendingRequests[reqKey].timer);
            delete this.pendingRequests[reqKey];
        }

        store.actions.addLog(
            `${node.hostname} received ARP Reply: "${packet.srcIp} is at ${this.formatMac(packet.srcMac)}"`,
            'success'
        );

        if (node.arpCache) {
            const entry = node.arpCache[packet.srcIp];
            if (entry) {
                entry.state = ARP_CACHE_STATES.REACHABLE;
                entry.lastUsed = now;
            }
        }
    }

    _handleGratuitous(packet, node, now) {
        const isSelf = node.interfaces?.some(i => i.mac === packet.srcMac);
        if (isSelf) return;

        store.actions.addLog(
            `${node.hostname} received Gratuitous ARP from ${packet.srcIp} (${this.formatMac(packet.srcMac)})`,
            'warning'
        );

        const matchIface = node.interfaces?.find(i => i.ip === packet.srcIp);
        if (matchIface) {
            store.actions.addLog(
                `${node.hostname}: IP conflict detected! ${packet.srcIp} already in use by ${this.formatMac(packet.srcMac)}`,
                'danger'
            );
        }

        this._updateArpCache(node, packet.srcIp, packet.srcMac, ARP_CACHE_STATES.REACHABLE, now);
    }

    sendArpRequest(srcNode, targetIp, targetNodeId) {
        if (!srcNode || !srcNode.interfaces?.length) return;

        const srcIface = srcNode.interfaces[0];
        const targetNode = store.topology.nodes.find(n => n.id === targetNodeId);

        const request = {
            id: utils.uuid(),
            opcode: 'REQUEST',
            type: 'REQUEST',
            protocol: 'ARP',
            hardwareType: 1,
            protocolType: 0x0800,
            hardwareLen: 6,
            protocolLen: 4,
            srcIp: srcIface.ip,
            srcMac: srcIface.mac,
            dstIp: targetIp,
            dstMac: 'ff:ff:ff:ff:ff:ff',
            targetIp: targetIp,
            targetMac: '00:00:00:00:00:00',
            senderIp: srcIface.ip,
            senderMac: srcIface.mac,
            payload: `ARP Request: Who has ${targetIp}? Tell ${srcIface.ip}`,
            srcId: srcNode.id,
            dstId: targetNodeId,
            hopCount: 0,
        };

        if (!srcNode.arpCache) srcNode.arpCache = {};
        srcNode.arpCache[targetIp] = {
            state: ARP_CACHE_STATES.INCOMPLETE,
            mac: null,
            lastUsed: Date.now(),
            createdAt: Date.now(),
            retryCount: 0,
        };

        if (!srcNode.arpTable) srcNode.arpTable = {};
        delete srcNode.arpTable[targetIp];

        const reqKey = `${srcNode.id}:${targetIp}`;
        this.pendingRequests[reqKey] = {
            srcNode,
            targetIp,
            targetNodeId,
            retries: 0,
        };

        store.actions.addLog(
            `${srcNode.hostname} sending ARP Request: "Who has ${targetIp}? Tell ${srcIface.ip}"`,
            'info'
        );

        return request;
    }

    sendGratuitousArp(node, neighborSwitch) {
        if (!node || !node.interfaces?.length) return null;

        const iface = node.interfaces[0];
        const dstId = neighborSwitch ? neighborSwitch.id : node.id;
        return {
            id: utils.uuid(),
            opcode: 'GRATUITOUS',
            type: 'GRATUITOUS',
            protocol: 'ARP',
            hardwareType: 1,
            protocolType: 0x0800,
            hardwareLen: 6,
            protocolLen: 4,
            srcIp: iface.ip,
            srcMac: iface.mac,
            dstIp: iface.ip,
            dstMac: 'ff:ff:ff:ff:ff:ff',
            targetIp: iface.ip,
            targetMac: iface.mac,
            senderIp: iface.ip,
            senderMac: iface.mac,
            payload: `Gratuitous ARP: ${iface.ip} is at ${this.formatMac(iface.mac)}`,
            srcId: node.id,
            dstId: dstId,
            hopCount: 0,
        };
    }

    _sendGratuitousAfterReply(node, iface) {
        const neighborSwitch = store.topology.nodes.find(n =>
            n.type === 'switch' && store.topology.links.some(l =>
                (l.source === n.id && l.target === node.id) || (l.target === n.id && l.source === node.id)
            )
        );
        const dstId = neighborSwitch ? neighborSwitch.id : node.id;
        const gratuitous = {
            id: utils.uuid(),
            opcode: 'GRATUITOUS',
            type: 'GRATUITOUS',
            protocol: 'ARP',
            hardwareType: 1,
            protocolType: 0x0800,
            hardwareLen: 6,
            protocolLen: 4,
            srcIp: iface.ip,
            srcMac: iface.mac,
            dstIp: iface.ip,
            dstMac: 'ff:ff:ff:ff:ff:ff',
            targetIp: iface.ip,
            targetMac: iface.mac,
            senderIp: iface.ip,
            senderMac: iface.mac,
            payload: `Gratuitous ARP: ${iface.ip} is at ${this.formatMac(iface.mac)}`,
            srcId: node.id,
            dstId: dstId,
            hopCount: 0,
        };

        setTimeout(() => {
            const ns = window.__ns || {};
            if (ns.packetEngine) {
                ns.packetEngine.dispatchPacket(gratuitous);
            }
        }, 200);
    }

    _updateArpCache(node, ip, mac, state, now) {
        if (!node.arpCache) node.arpCache = {};
        if (!node.arpTable) node.arpTable = {};

        node.arpCache[ip] = {
            state: state || ARP_CACHE_STATES.REACHABLE,
            mac: mac,
            lastUsed: now || Date.now(),
            createdAt: now || Date.now(),
        };

        if (mac && mac !== '00:00:00:00:00:00' && mac.toLowerCase() !== 'ff:ff:ff:ff:ff:ff') {
            node.arpTable[ip] = mac;
        }
    }

    getCacheState(ip, node) {
        if (!node || !node.arpCache || !node.arpCache[ip]) return null;
        const entry = node.arpCache[ip];
        const elapsed = Date.now() - entry.lastUsed;

        if (entry.state === ARP_CACHE_STATES.REACHABLE && elapsed > ARP_TIMEOUTS.REACHABLE) {
            entry.state = ARP_CACHE_STATES.STALE;
        }
        if (entry.state === ARP_CACHE_STATES.STALE && elapsed > ARP_TIMEOUTS.STALE) {
            entry.state = ARP_CACHE_STATES.DELAY;
        }

        return entry;
    }

    getArpCache(node) {
        if (!node) return {};
        if (!node.arpCache) node.arpCache = {};
        const now = Date.now();
        const result = {};
        for (const [ip, entry] of Object.entries(node.arpCache)) {
            result[ip] = {
                mac: entry.mac,
                state: entry.state,
                age: Math.floor((now - entry.lastUsed) / 1000),
            };
        }
        return result;
    }

    getSwitchMacTable(switchNode) {
        return this.switchMacTables[switchNode.id] || {};
    }

    clearArpCache(node) {
        if (node) {
            node.arpCache = {};
            node.arpTable = {};
            store.actions.addLog(`${node.hostname} ARP cache cleared`, 'info');
        }
    }
}
