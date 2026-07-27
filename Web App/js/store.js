import { reactive } from 'vue';
import { APP_CONFIG, SIM_STATUS } from './constants.js';

function createStore() {
    const state = reactive({
        simulation: {
            status: SIM_STATUS.IDLE,
            currentTime: 0,
            playbackSpeed: 1.0,
            activeScenario: null,
            paused: false
        },
        topology: {
            nodes: [],
            links: [],
            gridSize: APP_CONFIG.GRID_SIZE
        },
        traffic: {
            activePackets: [],
            eventLog: [],
            statistics: {
                packetsSent: 0,
                packetsReceived: 0,
                packetsDropped: 0,
                broadcasts: 0,
                errors: 0
            }
        },
        ui: {
            sidebarOpen: true,
            inspectorType: null,
            selectedObjectId: null,
            theme: APP_CONFIG.DEFAULT_THEME,
            activeTool: 'select',
            linkSourceId: null,
            cableType: 'copper',
            deviceConfigTarget: null,
            currentRoute: 'dashboard'
        }
    });

    state.actions = {
        setSimulationStatus(status) {
            state.simulation.status = status;
        },
        addLog(message, type) {
            type = type || 'info';
            const entry = {
                timestamp: Date.now(),
                timeStr: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                message: String(message),
                type: type
            };
            state.traffic.eventLog.unshift(entry);
            if (state.traffic.eventLog.length > 100) state.traffic.eventLog.pop();
        },
        updateStatistics(name, delta) {
            if (state.traffic.statistics.hasOwnProperty(name)) {
                state.traffic.statistics[name] += delta;
            }
        }
    };

    return state;
}

export const store = createStore();
