class FingerprintService {
    constructor() {
        this.values = {};
    }

    _isFingerprintSlot(slotKey) {
        return typeof slotKey === 'string' && slotKey.startsWith('fingerprint:');
    }

    isValid(slotKey) {
        return this._isFingerprintSlot(slotKey);
    }

    setValue(slotKey, value) {
        if (!this.isValid(slotKey)) {
            return null;
        }
        this.values[slotKey] = value;
        console.log('[MojoStub][FingerprintService.setValue]', { slotKey, value });
        return value;
    }

    getValue(slotKey) {
        if (!this.isValid(slotKey)) {
            return null;
        }
        return this.values[slotKey] ?? null;
    }

    getAllSlots() {
        return { ...this.values };
    }

    invoke(slotKey, payload = {}) {
        if (!this.isValid(slotKey)) {
            return null;
        }

        if (payload && Object.prototype.hasOwnProperty.call(payload, 'value')) {
            return this.setValue(slotKey, payload.value);
        }

        console.log('[MojoStub][FingerprintService.invoke]', { slotKey, payload });
        return this.getValue(slotKey);
    }
}

export const fingerprintService = new FingerprintService();
