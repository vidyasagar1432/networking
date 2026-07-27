import { store } from './store.js';

export const router = {
    currentRoute: 'dashboard',
    routes: {
        'dashboard': { name: 'Main Simulation' },
        'lab': { name: 'Learning Lab' },
        'challenges': { name: 'Troubleshooting' },
        'settings': { name: 'Settings' }
    },
    navigate(route) {
        if (this.routes[route]) {
            this.currentRoute = route;
            store.ui.currentRoute = route;
            store.actions.addLog('Navigated to ' + this.routes[route].name, 'info');
        } else {
            console.error('Route ' + route + ' not found');
        }
    }
};
