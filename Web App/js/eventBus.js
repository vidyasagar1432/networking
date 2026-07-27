class EventBus {
    constructor() {
        this.events = {};
        this.onceEvents = {};
    }

    on(event, callback) {
        if (!this.events[event]) this.events[event] = [];
        this.events[event].push(callback);
    }

    once(event, callback) {
        if (!this.onceEvents[event]) this.onceEvents[event] = [];
        this.onceEvents[event].push(callback);
    }

    emit(event, data) {
        if (this.events[event]) this.events[event].forEach(cb => cb(data));
        if (this.onceEvents[event]) {
            this.onceEvents[event].forEach(cb => cb(data));
            delete this.onceEvents[event];
        }
    }

    off(event) {
        delete this.events[event];
        delete this.onceEvents[event];
    }
}

export const eventBus = new EventBus();
