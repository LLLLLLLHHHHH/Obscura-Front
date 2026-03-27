class ConsoleControlService {
    constructor() {
        this.slots = {
            'ctrl:trace': { enabled: true, label: 'Trace' },
            'ctrl:clear': { enabled: true, label: 'Clear' },
            'ctrl:assert': { enabled: true, label: 'Assert' },
            'ctrl:count': { enabled: true, label: 'Count' },
        };
    }

    toggle(slotKey) {
        if (this.slots[slotKey]) {
            this.slots[slotKey].enabled = !this.slots[slotKey].enabled;
            console.log('[MojoStub][ConsoleControlService.toggle]', { slotKey, enabled: this.slots[slotKey].enabled });
            return this.slots[slotKey].enabled;
        }
        console.log('[MojoStub][ConsoleControlService.toggle] invalid slot', { slotKey });
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
            console.log('[MojoStub][ConsoleControlService.invoke] skipped', { slotKey, enabled: slot?.enabled ?? null, args });
            return;
        }
        console.log('[MojoStub][ConsoleControlService.invoke]', { slotKey, args });
    }
}

export const consoleControlService = new ConsoleControlService();
