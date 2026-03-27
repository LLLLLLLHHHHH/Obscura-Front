class ConsoleLogService {
    constructor() {
        this.slots = {
            'log:info':   { enabled: true, label: 'Info' },
            'log:warn':   { enabled: true, label: 'Warn' },
            'log:error':  { enabled: true, label: 'Error' },
            'log:debug':  { enabled: true, label: 'Debug' },
            'log:table':  { enabled: true, label: 'Table' },
            'log:dir':    { enabled: true, label: 'Dir' },
            'log:dirxml': { enabled: true, label: 'Dirxml' },
            'log:log':    { enabled: true, label: 'Log' },
        };
    }

    toggle(slotKey) {
        if (this.slots[slotKey]) {
            this.slots[slotKey].enabled = !this.slots[slotKey].enabled;
            console.log('[MojoStub][ConsoleLogService.toggle]', { slotKey, enabled: this.slots[slotKey].enabled });
            return this.slots[slotKey].enabled;
        }
        console.log('[MojoStub][ConsoleLogService.toggle] invalid slot', { slotKey });
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
        if (!slot || !slot.enabled) {
            console.log('[MojoStub][ConsoleLogService.invoke] skipped', { slotKey, enabled: slot?.enabled ?? null, args });
            return;
        }
        console.log('[MojoStub][ConsoleLogService.invoke]', { slotKey, args });
    }
}

export const consoleLogService = new ConsoleLogService();
