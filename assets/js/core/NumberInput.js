import { mojoSlotService } from '../services/MojoSlotService.js';
import { t, i18nReady } from '../i18n/index.js';

class NumberInput {
    constructor(slotKey, mountEl) {
        this.slotKey = slotKey;
        this.mountEl = mountEl;
        this.render();
        this.bindEvents();
    }

    static async create(slotKey, mountEl) {
        await i18nReady;
        return new NumberInput(slotKey, mountEl);
    }

    render() {
        const container = document.createElement('div');
        container.className = 'ni-container';

        const inputId = `ni-${this.slotKey.replace(':', '-')}`;

        this.inputEl = document.createElement('input');
        this.inputEl.id = inputId;
        this.inputEl.type = 'number';
        this.inputEl.className = 'ni-input';
        this.inputEl.min = '0';
        this.inputEl.inputMode = 'numeric';

        this.labelEl = document.createElement('label');
        this.labelEl.className = 'ni-label';
        this.labelEl.htmlFor = inputId;

        const toplineEl = document.createElement('div');
        toplineEl.className = 'ni-topline';

        const underlineEl = document.createElement('div');
        underlineEl.className = 'ni-underline';

        container.appendChild(this.inputEl);
        container.appendChild(this.labelEl);
        container.appendChild(toplineEl);
        container.appendChild(underlineEl);
        this.mountEl.appendChild(container);

        this.wrapper = container;

        const slotName = this.slotKey.replace('config:', '');
        const hintKey = `ad.console.${slotName}Hint`;
        this.labelEl.textContent = t(hintKey);
        this.labelEl.setAttribute('data-i18n', hintKey);
        this._slotName = slotName;
    }

    bindEvents() {
        this.inputEl.addEventListener('input', () => this.handleInput());
        this.inputEl.addEventListener('blur', () => this.handleInput());
    }

    handleInput() {
        const raw = this.inputEl.value;
        mojoSlotService.setValue(this.slotKey, raw);
        if (raw === '0') {
            const key = `ad.console.${this._slotName}Disabled`;
            this.labelEl.textContent = t(key);
            this.labelEl.setAttribute('data-i18n', key);
            this.labelEl.removeAttribute('data-i18n-n');
        } else if (raw && raw !== '') {
            const key = `ad.console.${this._slotName}Limited`;
            this.labelEl.textContent = t(key).replace('{n}', raw);
            this.labelEl.setAttribute('data-i18n', key);
            this.labelEl.setAttribute('data-i18n-n', raw);
        } else {
            const key = `ad.console.${this._slotName}Hint`;
            this.labelEl.textContent = t(key);
            this.labelEl.setAttribute('data-i18n', key);
            this.labelEl.removeAttribute('data-i18n-n');
        }
    }
}

export default NumberInput;
