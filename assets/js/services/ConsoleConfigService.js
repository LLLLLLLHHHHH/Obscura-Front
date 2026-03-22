class ConsoleConfigService {
    constructor() {
        this.config = {
            'config:array': { value: 100, label: 'Array 长度', min: 10, max: 1000 },
            'config:table':  { value: 100, label: 'Table 长度',  min: 10, max: 1000 },
        };
        this._applyConfig();
    }

    _applyConfig() {
        try {
            Object.defineProperty(Array.prototype, '__maxLength', {
                get: () => this.config['config:array'].value,
                configurable: true
            });
            Object.defineProperty(Array.prototype, '__maxTableLength', {
                get: () => this.config['config:table'].value,
                configurable: true
            });
        } catch (e) {
            // ignore
        }
    }

    setValue(slotKey, value) {
        if (!this.config[slotKey]) return null;
        const cfg = this.config[slotKey];
        value = Math.max(cfg.min, Math.min(cfg.max, Number(value) || cfg.value));
        cfg.value = value;
        this._applyConfig();
        return cfg.value;
    }

    getValue(slotKey) {
        return this.config[slotKey]?.value ?? null;
    }

    isValid(slotKey) {
        return slotKey in this.config;
    }

    getAllConfig() {
        return JSON.parse(JSON.stringify(this.config));
    }
}

export const consoleConfigService = new ConsoleConfigService();
