import { consoleLogService } from './ConsoleLogService.js';
import { consoleControlService } from './ConsoleControlService.js';
import { consoleConfigService } from './ConsoleConfigService.js';

class MojoSlotService {
    constructor() {
        this.services = {
            'log':   consoleLogService,
            'ctrl':  consoleControlService,
            'config': consoleConfigService,
        };
    }

    _getService(slotKey) {
        const prefix = slotKey.split(':')[0];
        return this.services[prefix] || null;
    }

    isValid(slotKey) {
        const svc = this._getService(slotKey);
        return svc ? svc.isValid(slotKey) : false;
    }

    toggle(slotKey) {
        const svc = this._getService(slotKey);
        if (svc && typeof svc.toggle === 'function') {
            return svc.toggle(slotKey);
        }
        return null;
    }

    isEnabled(slotKey) {
        const svc = this._getService(slotKey);
        if (svc && typeof svc.isEnabled === 'function') {
            return svc.isEnabled(slotKey);
        }
        return null;
    }

    setValue(slotKey, value) {
        const svc = this._getService(slotKey);
        if (svc && typeof svc.setValue === 'function') {
            return svc.setValue(slotKey, value);
        }
        return null;
    }

    getValue(slotKey) {
        const svc = this._getService(slotKey);
        if (svc && typeof svc.getValue === 'function') {
            return svc.getValue(slotKey);
        }
        return null;
    }

    getAllSlots() {
        return {
            'log':    consoleLogService.getAllSlots(),
            'ctrl':   consoleControlService.getAllSlots(),
            'config': consoleConfigService.getAllConfig(),
        };
    }

    invoke(slotKey, ...args) {
        const svc = this._getService(slotKey);
        if (svc && typeof svc.invoke === 'function') {
            svc.invoke(slotKey, ...args);
        }
    }
}

export const mojoSlotService = new MojoSlotService();
