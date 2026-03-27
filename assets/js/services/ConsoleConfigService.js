class ConsoleConfigService {
    constructor() {
        this.config = {
            'config:array': { value: Infinity, label: 'Array 长度' },
            'config:table':  { value: Infinity, label: 'Table 长度' },
        };
    }

    setValue(slotKey, rawValue) {
        if (!this.config[slotKey]) return null;
        const cfg = this.config[slotKey];

        if (rawValue === '' || rawValue === null || rawValue === undefined) {
            cfg.value = Infinity;
        } else {
            const num = parseInt(rawValue, 10);
            if (isNaN(num) || num < 0) {
                cfg.value = Infinity;
            } else {
                cfg.value = num;
            }
        }

        console.log('[MojoStub][ConsoleConfigService.setValue]', { slotKey, rawValue, value: cfg.value });
        return cfg.value;
    }

    getValue(slotKey) {
        return this.config[slotKey]?.value ?? null;
    }

    getMode(slotKey) {
        const v = this.getValue(slotKey);
        if (v === Infinity) return 'unlimited';
        if (v === 0) return 'disabled';
        return 'limited';
    }

    isValid(slotKey) {
        return slotKey in this.config;
    }

    getAllConfig() {
        return JSON.parse(JSON.stringify(this.config));
    }
}

export const consoleConfigService = new ConsoleConfigService();
