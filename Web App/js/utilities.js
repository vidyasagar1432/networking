export const utils = {
    formatMac: (mac) => {
        if (!mac) return '00:00:00:00:00:00';
        return mac.toUpperCase().match(/.{2}/g).join(':');
    },
    formatIp: (ip) => ip || '0.0.0.0',
    clone: (obj) => JSON.parse(JSON.stringify(obj)),
    uuid: () => 'id_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36),
    delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
    getDistance: (p1, p2) => {
        return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    },
    getNodeById: (nodes, id) => nodes.find(n => n.id === id),
    generateMac: () => {
        const hex = '0123456789ABCDEF';
        let mac = '';
        for (let i = 0; i < 6; i++) {
            if (i > 0) mac += ':';
            mac += hex[Math.floor(Math.random() * 16)] + hex[Math.floor(Math.random() * 16)];
        }
        return mac;
    }
};
