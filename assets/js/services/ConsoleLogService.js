class ConsoleLogService {
    constructor() {
        this.slots = {
            'log:info':   { enabled: true,  method: 'info',    label: 'Info' },
            'log:warn':   { enabled: true,  method: 'warn',    label: 'Warn' },
            'log:error':  { enabled: true,  method: 'error',   label: 'Error' },
            'log:debug':  { enabled: true,  method: 'debug',   label: 'Debug' },
            'log:table':  { enabled: true,  method: 'table',   label: 'Table' },
            'log:dir':    { enabled: true,  method: 'dir',     label: 'Dir' },
            'log:dirxml': { enabled: true,  method: 'dirxml',  label: 'Dirxml' },
            'log:log':    { enabled: true,  method: 'log',     label: 'Log' },
        };
        this._wrapConsoleMethods();
    }

    _wrapConsoleMethods() {
        Object.values(this.slots).forEach(slot => {
            const original = console[slot.method].bind(console);
            console[slot.method] = (...args) => {
                if (this.slots[`log:${slot.method}`]?.enabled) {
                    original(...args);
                }
            };
        });
    }

    toggle(slotKey) {
        if (this.slots[slotKey]) {
            this.slots[slotKey].enabled = !this.slots[slotKey].enabled;
            return this.slots[slotKey].enabled;
        }
        return null;
    }

    isEnabled(slotKey) {
        return this.slots[slotKey]?.enabled ?? null;
    }

    isValid(slotKey) {
        return slotKey in this.slots;
    }

    getAllSlots() {
        return { ...this.slots };
    }

    invoke(slotKey, ...args) {
        const slot = this.slots[slotKey];
        if (!slot || !slot.enabled) return;
        console[slot.method](...args);
    }
}

export const consoleLogService = new ConsoleLogService();
