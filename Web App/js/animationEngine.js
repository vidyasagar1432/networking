import { utils } from './utilities.js';
import { store } from './store.js';

export class AnimationEngine {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.activeAnimations = new Set();
        this.animationFrameId = null;
        this.isRunning = false;
    }

    animatePacket(packet, startPos, endPos, onStep) {
        const duration = 1500;
        let startTime = null;
        const self = this;

        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const currentX = startPos.x + (endPos.x - startPos.x) * progress;
            const currentY = startPos.y + (endPos.y - startPos.y) * progress;
            packet.currentX = currentX;
            packet.currentY = currentY;
            packet.progress = progress;
            onStep(packet);
            if (progress < 1) {
                self.animationFrameId = requestAnimationFrame(step);
            } else {
                self.activeAnimations.delete(packet.id);
                self.eventBus.emit("packet_arrived", packet.id);
            }
        };
        this.activeAnimations.add(packet.id);
        this.animationFrameId = requestAnimationFrame(step);
    }

    triggerLinkPulse(linkId, color) {
        this.eventBus.emit("link_pulse", { linkId, color: color || "#38bdf8" });
    }

    stopAll() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        this.activeAnimations.clear();
    }
}
