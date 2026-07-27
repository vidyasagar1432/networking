export class NetworkProtocol {
    constructor(name, layer, etherType) {
        this.name = name;
        this.layer = layer;
        this.etherType = etherType || 0x0800;
    }

    async process(packet, receivingNode, topology) {
        throw new Error("process() must be implemented");
    }

    formatMac(mac) {
        if (!mac) return '00:00:00:00:00:00';
        const clean = mac.replace(/:/g, '');
        return clean.toUpperCase().match(/.{2}/g).join(':');
    }

    formatIp(ip) {
        return ip || '0.0.0.0';
    }

    timestamp() {
        return new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }
}
