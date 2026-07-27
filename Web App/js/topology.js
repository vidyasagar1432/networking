import { store } from './store.js';
import { utils } from './utilities.js';

export class TopologyManager {
    constructor() {
        this.selectedNode = null;
        this.selectedLink = null;
    }

    loadTopology(data) {
        store.topology.nodes = data.nodes || [];
        store.topology.links = data.links || [];
        store.actions.addLog('Topology loaded: ' + store.topology.nodes.length + ' devices', 'info');
    }

    addNode(type, x, y) {
        const node = {
            id: utils.uuid(),
            type: type,
            hostname: type.toUpperCase() + '-' + (store.topology.nodes.length + 1),
            x: x, y: y,
            status: 'up',
            interfaces: [],
            arpTable: {}
        };
        store.topology.nodes.push(node);
        store.actions.addLog('Device added: ' + node.hostname, 'success');
        return node;
    }

    removeNode(nodeId) {
        store.topology.nodes = store.topology.nodes.filter(n => n.id !== nodeId);
        store.topology.links = store.topology.links.filter(l => l.source !== nodeId && l.target !== nodeId);
        store.actions.addLog('Device removed', 'info');
    }

    addLink(sourceId, targetId, type) {
        type = type || 'copper';
        const link = { id: utils.uuid(), source: sourceId, target: targetId, type: type };
        store.topology.links.push(link);
        store.actions.addLog('Link created', 'success');
        return link;
    }

    getNodeById(id) {
        return store.topology.nodes.find(n => n.id === id);
    }

    getLinksForNode(nodeId) {
        return store.topology.links.filter(l => l.source === nodeId || l.target === nodeId);
    }
}
