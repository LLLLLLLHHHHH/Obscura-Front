class ConsoleControlService {
    constructor() {
        this.slots = {
            'ctrl:trace': { enabled: true, method: 'trace', label: 'Trace' },
            'ctrl:clear': { enabled: true, method: 'clear', label: 'Clear' },
            'ctrl:assert': { enabled: true, method: 'assert', label: 'Assert' },
            'ctrl:count': { enabled: true, method: 'count', label: 'Count' },
        };
        this._counters = {};
        this._wrapConsoleMethods();
    }

    _wrapConsoleMethods() {
        const originalTrace = console.trace.bind(console);
        console.trace = (...args) => {
            if (this.slots['ctrl:trace']?.enabled) originalTrace(...args);
        };

        const originalClear = console.clear.bind(console);
        console.clear = () => {
            if (this.slots['ctrl:clear']?.enabled) originalClear();
        };

        const originalAssert = console.assert.bind(console);
        console.assert = (condition, ...args) => {
            if (this.slots['ctrl:assert']?.enabled) originalAssert(condition, ...args);
        };

        const originalCount = console.count.bind(console);
        console.count = (label = 'default') => {
            if (this.slots['ctrl:count']?.enabled) originalCount(label);
        };
        console.countReset = (label = 'default') => {
            if (this.slots['ctrl:count']?.enabled && console.countReset) {
                console.countReset(label);
            }
        };
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

export const consoleControlService = new ConsoleControlService();
