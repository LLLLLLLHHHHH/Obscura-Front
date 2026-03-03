const OS_LAYOUTS = {
    mac: {
        rows: [
            [
                { key: 'Escape', code: 'Escape', class: 'vk-function-key', width: 'vk-u-1' },
                { key: 'F1', code: 'F1', class: 'vk-function-key', width: 'vk-u-1' },
                { key: 'F2', code: 'F2', class: 'vk-function-key', width: 'vk-u-1' },
                { key: 'F3', code: 'F3', class: 'vk-function-key', width: 'vk-u-1' },
                { key: 'F4', code: 'F4', class: 'vk-function-key', width: 'vk-u-1' },
                { key: 'F5', code: 'F5', class: 'vk-function-key', width: 'vk-u-1' },
                { key: 'F6', code: 'F6', class: 'vk-function-key', width: 'vk-u-1' },
                { key: 'F7', code: 'F7', class: 'vk-function-key', width: 'vk-u-1' },
                { key: 'F8', code: 'F8', class: 'vk-function-key', width: 'vk-u-1' },
                { key: 'F9', code: 'F9', class: 'vk-function-key', width: 'vk-u-1' },
                { key: 'F10', code: 'F10', class: 'vk-function-key', width: 'vk-u-1' },
                { key: 'F11', code: 'F11', class: 'vk-function-key', width: 'vk-u-1' },
                { key: 'F12', code: 'F12', class: 'vk-function-key', width: 'vk-u-1' },
                { key: '⏏', code: 'Eject', class: 'vk-eject-key vk-function-key', width: 'vk-u-2' }
            ],
            [
                { key: '`', code: 'Backquote', shift: '~', width: 'vk-u-1' },
                { key: '1', code: 'Digit1', shift: '!', width: 'vk-u-1' },
                { key: '2', code: 'Digit2', shift: '@', width: 'vk-u-1' },
                { key: '3', code: 'Digit3', shift: '#', width: 'vk-u-1' },
                { key: '4', code: 'Digit4', shift: '$', width: 'vk-u-1' },
                { key: '5', code: 'Digit5', shift: '%', width: 'vk-u-1' },
                { key: '6', code: 'Digit6', shift: '^', width: 'vk-u-1' },
                { key: '7', code: 'Digit7', shift: '&', width: 'vk-u-1' },
                { key: '8', code: 'Digit8', shift: '*', width: 'vk-u-1' },
                { key: '9', code: 'Digit9', shift: '(', width: 'vk-u-1' },
                { key: '0', code: 'Digit0', shift: ')', width: 'vk-u-1' },
                { key: '-', code: 'Minus', shift: '_', width: 'vk-u-1' },
                { key: '=', code: 'Equal', shift: '+', width: 'vk-u-1' },
                { key: 'delete', code: 'Backspace', class: 'vk-delete-key', width: 'vk-u-2' }
            ],
            [
                { key: 'tab', code: 'Tab', class: 'vk-tab-key', width: 'vk-u-1-5' },
                { key: 'Q', code: 'KeyQ', width: 'vk-u-1' },
                { key: 'W', code: 'KeyW', width: 'vk-u-1' },
                { key: 'E', code: 'KeyE', width: 'vk-u-1' },
                { key: 'R', code: 'KeyR', width: 'vk-u-1' },
                { key: 'T', code: 'KeyT', width: 'vk-u-1' },
                { key: 'Y', code: 'KeyY', width: 'vk-u-1' },
                { key: 'U', code: 'KeyU', width: 'vk-u-1' },
                { key: 'I', code: 'KeyI', width: 'vk-u-1' },
                { key: 'O', code: 'KeyO', width: 'vk-u-1' },
                { key: 'P', code: 'KeyP', width: 'vk-u-1' },
                { key: '[', code: 'BracketLeft', shift: '{', width: 'vk-u-1' },
                { key: ']', code: 'BracketRight', shift: '}', width: 'vk-u-1' },
                { key: '\\', code: 'Backslash', shift: '|', class: 'vk-backslash-key', width: 'vk-u-1-5' }
            ],
            [
                { key: 'caps', code: 'CapsLock', class: 'vk-caps-lock-key', width: 'vk-u-1-5' },
                { key: 'A', code: 'KeyA', width: 'vk-u-1' },
                { key: 'S', code: 'KeyS', width: 'vk-u-1' },
                { key: 'D', code: 'KeyD', width: 'vk-u-1' },
                { key: 'F', code: 'KeyF', width: 'vk-u-1' },
                { key: 'G', code: 'KeyG', width: 'vk-u-1' },
                { key: 'H', code: 'KeyH', width: 'vk-u-1' },
                { key: 'J', code: 'KeyJ', width: 'vk-u-1' },
                { key: 'K', code: 'KeyK', width: 'vk-u-1' },
                { key: 'L', code: 'KeyL', width: 'vk-u-1' },
                { key: ';', code: 'Semicolon', shift: ':', width: 'vk-u-1' },
                { key: "'", code: 'Quote', shift: '"', width: 'vk-u-1' },
                { key: 'return', code: 'Enter', class: 'vk-return-key', width: 'vk-u-2-25' }
            ],
            [
                { key: 'shift', code: 'ShiftLeft', class: 'vk-shift-key', width: 'vk-u-2-25' },
                { key: 'Z', code: 'KeyZ', width: 'vk-u-1' },
                { key: 'X', code: 'KeyX', width: 'vk-u-1' },
                { key: 'C', code: 'KeyC', width: 'vk-u-1' },
                { key: 'V', code: 'KeyV', width: 'vk-u-1' },
                { key: 'B', code: 'KeyB', width: 'vk-u-1' },
                { key: 'N', code: 'KeyN', width: 'vk-u-1' },
                { key: 'M', code: 'KeyM', width: 'vk-u-1' },
                { key: ',', code: 'Comma', shift: '<', width: 'vk-u-1' },
                { key: '.', code: 'Period', shift: '>', width: 'vk-u-1' },
                { key: '/', code: 'Slash', shift: '?', width: 'vk-u-1' },
                { key: 'shift', code: 'ShiftRight', class: 'vk-shift-key', width: 'vk-u-2-75' }
            ],
            [
                { key: 'fn', code: 'Fn', class: 'vk-fn-key', width: 'vk-u-1' },
                { key: 'control', code: 'ControlLeft', class: 'vk-ctrl-key', width: 'vk-u-1-25' },
                { key: 'option', code: 'AltLeft', class: 'vk-alt-key', width: 'vk-u-1-25' },
                { key: 'command', code: 'MetaLeft', class: 'vk-command-key', width: 'vk-u-1-5' },
                { key: '', code: 'Space', class: 'vk-space-key', width: 'vk-u-6' },
                { key: 'command', code: 'MetaRight', class: 'vk-command-key', width: 'vk-u-1-5' },
                { key: 'option', code: 'AltRight', class: 'vk-alt-key', width: 'vk-u-1-25' }
            ]
        ],
        modifierKeys: ['ShiftLeft', 'ShiftRight', 'ControlLeft', 'ControlRight', 'AltLeft', 'AltRight', 'MetaLeft', 'MetaRight', 'CapsLock', 'Fn'],
        style: 'mac'
    },
    win: {
        rows: [
            [
                { key: 'Esc', code: 'Escape', class: 'vk-function-key', width: 'vk-u-1' },
                { key: 'F1', code: 'F1', class: 'vk-function-key', width: 'vk-u-1' },
                { key: 'F2', code: 'F2', class: 'vk-function-key', width: 'vk-u-1' },
                { key: 'F3', code: 'F3', class: 'vk-function-key', width: 'vk-u-1' },
                { key: 'F4', code: 'F4', class: 'vk-function-key', width: 'vk-u-1' },
                { key: 'F5', code: 'F5', class: 'vk-function-key', width: 'vk-u-1' },
                { key: 'F6', code: 'F6', class: 'vk-function-key', width: 'vk-u-1' },
                { key: 'F7', code: 'F7', class: 'vk-function-key', width: 'vk-u-1' },
                { key: 'F8', code: 'F8', class: 'vk-function-key', width: 'vk-u-1' },
                { key: 'F9', code: 'F9', class: 'vk-function-key', width: 'vk-u-1' },
                { key: 'F10', code: 'F10', class: 'vk-function-key', width: 'vk-u-1' },
                { key: 'F11', code: 'F11', class: 'vk-function-key', width: 'vk-u-1' },
                { key: 'F12', code: 'F12', class: 'vk-function-key', width: 'vk-u-1' },
                { key: 'PrtSc', code: 'PrintScreen', class: 'vk-print-key vk-function-key', width: 'vk-u-2' }
            ],
            [
                { key: '`', code: 'Backquote', shift: '~', width: 'vk-u-1' },
                { key: '1', code: 'Digit1', shift: '!', width: 'vk-u-1' },
                { key: '2', code: 'Digit2', shift: '@', width: 'vk-u-1' },
                { key: '3', code: 'Digit3', shift: '#', width: 'vk-u-1' },
                { key: '4', code: 'Digit4', shift: '$', width: 'vk-u-1' },
                { key: '5', code: 'Digit5', shift: '%', width: 'vk-u-1' },
                { key: '6', code: 'Digit6', shift: '^', width: 'vk-u-1' },
                { key: '7', code: 'Digit7', shift: '&', width: 'vk-u-1' },
                { key: '8', code: 'Digit8', shift: '*', width: 'vk-u-1' },
                { key: '9', code: 'Digit9', shift: '(', width: 'vk-u-1' },
                { key: '0', code: 'Digit0', shift: ')', width: 'vk-u-1' },
                { key: '-', code: 'Minus', shift: '_', width: 'vk-u-1' },
                { key: '=', code: 'Equal', shift: '+', width: 'vk-u-1' },
                { key: 'Backspace', code: 'Backspace', class: 'vk-backspace-key', width: 'vk-u-2' }
            ],
            [
                { key: 'Tab', code: 'Tab', class: 'vk-tab-key', width: 'vk-u-1-5' },
                { key: 'Q', code: 'KeyQ', width: 'vk-u-1' },
                { key: 'W', code: 'KeyW', width: 'vk-u-1' },
                { key: 'E', code: 'KeyE', width: 'vk-u-1' },
                { key: 'R', code: 'KeyR', width: 'vk-u-1' },
                { key: 'T', code: 'KeyT', width: 'vk-u-1' },
                { key: 'Y', code: 'KeyY', width: 'vk-u-1' },
                { key: 'U', code: 'KeyU', width: 'vk-u-1' },
                { key: 'I', code: 'KeyI', width: 'vk-u-1' },
                { key: 'O', code: 'KeyO', width: 'vk-u-1' },
                { key: 'P', code: 'KeyP', width: 'vk-u-1' },
                { key: '[', code: 'BracketLeft', shift: '{', width: 'vk-u-1' },
                { key: ']', code: 'BracketRight', shift: '}', width: 'vk-u-1' },
                { key: '\\', code: 'Backslash', shift: '|', class: 'vk-backslash-key', width: 'vk-u-1-5' }
            ],
            [
                { key: 'Caps', code: 'CapsLock', class: 'vk-caps-lock-key', width: 'vk-u-1-5' },
                { key: 'A', code: 'KeyA', width: 'vk-u-1' },
                { key: 'S', code: 'KeyS', width: 'vk-u-1' },
                { key: 'D', code: 'KeyD', width: 'vk-u-1' },
                { key: 'F', code: 'KeyF', width: 'vk-u-1' },
                { key: 'G', code: 'KeyG', width: 'vk-u-1' },
                { key: 'H', code: 'KeyH', width: 'vk-u-1' },
                { key: 'J', code: 'KeyJ', width: 'vk-u-1' },
                { key: 'K', code: 'KeyK', width: 'vk-u-1' },
                { key: 'L', code: 'KeyL', width: 'vk-u-1' },
                { key: ';', code: 'Semicolon', shift: ':', width: 'vk-u-1' },
                { key: "'", code: 'Quote', shift: '"', width: 'vk-u-1' },
                { key: 'Enter', code: 'Enter', class: 'vk-enter-key', width: 'vk-u-2-25' }
            ],
            [
                { key: 'Shift', code: 'ShiftLeft', class: 'vk-shift-key', width: 'vk-u-2-25' },
                { key: 'Z', code: 'KeyZ', width: 'vk-u-1' },
                { key: 'X', code: 'KeyX', width: 'vk-u-1' },
                { key: 'C', code: 'KeyC', width: 'vk-u-1' },
                { key: 'V', code: 'KeyV', width: 'vk-u-1' },
                { key: 'B', code: 'KeyB', width: 'vk-u-1' },
                { key: 'N', code: 'KeyN', width: 'vk-u-1' },
                { key: 'M', code: 'KeyM', width: 'vk-u-1' },
                { key: ',', code: 'Comma', shift: '<', width: 'vk-u-1' },
                { key: '.', code: 'Period', shift: '>', width: 'vk-u-1' },
                { key: '/', code: 'Slash', shift: '?', width: 'vk-u-1' },
                { key: 'Shift', code: 'ShiftRight', class: 'vk-shift-key', width: 'vk-u-2-75' }
            ],
            [
                { key: 'Ctrl', code: 'ControlLeft', class: 'vk-ctrl-key', width: 'vk-u-1-25' },
                { key: '⊞', code: 'MetaLeft', class: 'vk-win-key', width: 'vk-u-1-25' },
                { key: 'Alt', code: 'AltLeft', class: 'vk-alt-key', width: 'vk-u-1-25' },
                { key: '', code: 'Space', class: 'vk-space-key', width: 'vk-u-6-25' },
                { key: 'Alt', code: 'AltRight', class: 'vk-alt-key', width: 'vk-u-1-25' },
                { key: '⊞', code: 'MetaRight', class: 'vk-win-key', width: 'vk-u-1-25' },
                { key: '≣', code: 'ContextMenu', class: 'vk-menu-key', width: 'vk-u-1-25' },
                { key: 'Ctrl', code: 'ControlRight', class: 'vk-ctrl-key', width: 'vk-u-1-25' }
            ]
        ],
        modifierKeys: ['ShiftLeft', 'ShiftRight', 'ControlLeft', 'ControlRight', 'AltLeft', 'AltRight', 'MetaLeft', 'MetaRight', 'CapsLock'],
        style: 'win'
    }
};

class VirtualKeyboard {
    constructor(options = {}) {
        this.options = {
            visible: options.visible !== false,
            defaultPosition: options.defaultPosition || { x: -20, y: -20 },
            onInput: options.onInput || null,
            onKeyPress: options.onKeyPress || null,
            ...options
        };

        this.container = null;
        this.keyboardEl = null;
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };
        this.pressedKeys = new Set();
        this.state = {
            shift: false,
            capsLock: false,
            alt: false,
            ctrl: false,
            meta: false
        };

        this.detectOS();
        this.loadPosition();
        this.init();
    }

    detectOS() {
        const ua = navigator.userAgent.toLowerCase();
        this.isMac = /macintosh|mac os x|iphone|ipad|ipod/.test(ua);
        this.os = this.isMac ? 'mac' : 'win';
        this.layout = OS_LAYOUTS[this.os];
    }

    loadPosition() {
        this.position = { ...this.options.defaultPosition };
    }

    savePosition() {
        localStorage.setItem('virtualKeyboardPosition', JSON.stringify(this.position));
    }

    init() {
        this.createElement();
        this.render();
        this.bindEvents();
        this.updateTheme();
        this.options.visible ? this.show() : this.hide();
    }

    createElement() {
        this.keyboardEl = document.createElement('div');
        this.keyboardEl.className = `virtual-keyboard ${this.os}`;
        this.keyboardEl.style.display = 'none';
        document.body.appendChild(this.keyboardEl);

        this.container = document.createElement('div');
        this.container.className = 'vk-container';
        this.keyboardEl.appendChild(this.container);
    }

    render() {
        this.layout.rows.forEach(row => {
            const rowEl = document.createElement('div');
            rowEl.className = 'vk-row';
            
            row.forEach(keyData => {
                const keyEl = document.createElement('div');
                keyEl.className = `vk-key ${keyData.class || ''} ${keyData.width || 'vk-u-1'}`;
                keyEl.dataset.code = keyData.code;
                keyEl.dataset.key = keyData.key;
                keyEl.textContent = keyData.key;
                
                if (keyData.shift) {
                    keyEl.dataset.shiftKey = keyData.shift;
                }

                rowEl.appendChild(keyEl);
            });

            this.container.appendChild(rowEl);
        });
    }

    bindEvents() {
        this.keyboardEl.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('vk-key')) return;
            this.startDrag(e);
        });
        document.addEventListener('mousemove', (e) => this.drag(e));
        document.addEventListener('mouseup', () => this.endDrag());

        this.keyboardEl.querySelectorAll('.vk-key').forEach(key => {
            key.setAttribute('tabindex', '-1');
            key.addEventListener('mousedown', (e) => {
                e.preventDefault();
                this.handleKeyDown(e);
            });
            key.addEventListener('mouseup', (e) => this.handleKeyUp(e));
            key.addEventListener('mouseleave', (e) => this.handleKeyLeave(e));
            
            key.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.handleKeyDown(e);
            }, { passive: false });
            key.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.handleKeyUp(e);
            }, { passive: false });
        });

        document.addEventListener('keydown', (e) => this.onPhysicalKeyDown(e));
        document.addEventListener('keyup', (e) => this.onPhysicalKeyUp(e));

        const observer = new MutationObserver(() => this.updateTheme());
        observer.observe(document.documentElement, { 
            attributes: true, 
            attributeFilter: ['class'] 
        });

        window.addEventListener('resize', () => {
            if (this.keyboardEl.style.display !== 'none') {
                this.updatePositionToBottomRight();
            }
        });
    }

    updateTheme() {
        const isDark = document.documentElement.classList.contains('dark');
        this.keyboardEl.classList.toggle('dark', isDark);
    }

    startDrag(e) {
        this.isDragging = true;
        const rect = this.keyboardEl.getBoundingClientRect();
        this.dragOffset = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
        this.keyboardEl.style.transition = 'none';
    }

    drag(e) {
        if (!this.isDragging) return;
        
        let x = e.clientX - this.dragOffset.x;
        let y = e.clientY - this.dragOffset.y;

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const rect = this.keyboardEl.getBoundingClientRect();

        x = Math.max(0, Math.min(x, viewportWidth - rect.width));
        y = Math.max(0, Math.min(y, viewportHeight - rect.height));

        this.keyboardEl.style.left = x + 'px';
        this.keyboardEl.style.top = y + 'px';
    }

    endDrag() {
        if (!this.isDragging) return;
        this.isDragging = false;
        
        const rect = this.keyboardEl.getBoundingClientRect();
        this.position = {
            x: rect.left,
            y: rect.top
        };
        this.savePosition();
        this.keyboardEl.style.transition = '';
    }

    getDisplayKey(keyData) {
        if (!keyData.key) return '';
        
        if (this.state.capsLock || this.state.shift) {
            if (keyData.key.length === 1 && /[a-z]/.test(keyData.key)) {
                return keyData.key.toUpperCase();
            }
            if (keyData.shiftKey && this.state.shift) {
                return keyData.shiftKey;
            }
        }
        
        return keyData.key;
    }

    updateKeyDisplay() {
        this.keyboardEl.querySelectorAll('.vk-key').forEach(keyEl => {
            const code = keyEl.dataset.code;
            const keyData = this.layout.rows.flat().find(k => k.code === code);
            
            if (keyData) {
                keyEl.textContent = this.getDisplayKey(keyData);
            }
        });
    }

    onPhysicalKeyDown(e) {
        const code = e.code;
        
        if (code === 'CapsLock') {
            this.state.capsLock = !this.state.capsLock;
        }
        
        if (e.shiftKey) {
            this.state.shift = true;
        }
        if (e.ctrlKey) {
            this.state.ctrl = true;
        }
        if (e.altKey) {
            this.state.alt = true;
        }
        if (e.metaKey) {
            this.state.meta = true;
        }

        this.pressedKeys.add(code);
        
        const keyEl = this.keyboardEl.querySelector(`[data-code="${code}"]`);
        if (keyEl) {
            keyEl.classList.add('pressed');
        }

        this.updateKeyDisplay();

        if (this.options.onKeyPress) {
            this.options.onKeyPress({
                type: 'down',
                code: code,
                key: e.key,
                state: { ...this.state }
            });
        }
    }

    onPhysicalKeyUp(e) {
        const code = e.code;

        if (!e.shiftKey) {
            this.state.shift = false;
        }
        if (!e.ctrlKey) {
            this.state.ctrl = false;
        }
        if (!e.altKey) {
            this.state.alt = false;
        }
        if (!e.metaKey) {
            this.state.meta = false;
        }

        this.pressedKeys.delete(code);

        const keyEl = this.keyboardEl.querySelector(`[data-code="${code}"]`);
        if (keyEl) {
            keyEl.classList.remove('pressed');
        }

        this.updateKeyDisplay();

        if (this.options.onKeyPress) {
            this.options.onKeyPress({
                type: 'up',
                code: code,
                key: e.key,
                state: { ...this.state }
            });
        }
    }

    handleKeyDown(e) {
        const keyEl = e.target.closest('.vk-key');
        if (!keyEl) return;

        keyEl.classList.add('pressed');
        
        const code = keyEl.dataset.code;
        const key = keyEl.dataset.key;
        
        this.pressedKeys.add(code);

        const modifierKeys = ['ShiftLeft', 'ShiftRight', 'CapsLock', 'ControlLeft', 'ControlRight', 'AltLeft', 'AltRight', 'MetaLeft', 'MetaRight', 'Fn'];
        const isModifierKey = modifierKeys.includes(code);

        if (code === 'ShiftLeft' || code === 'ShiftRight') {
            this.state.shift = true;
        }
        if (code === 'CapsLock') {
            this.state.capsLock = !this.state.capsLock;
        }
        if (code === 'ControlLeft' || code === 'ControlRight') {
            this.state.ctrl = !this.state.ctrl;
        }
        if (code === 'AltLeft' || code === 'AltRight') {
            this.state.alt = !this.state.alt;
        }
        if (code === 'MetaLeft' || code === 'MetaRight') {
            this.state.meta = !this.state.meta;
        }

        this.updateKeyDisplay();

        if (isModifierKey) {
            return;
        }

        const displayKey = keyEl.textContent;
        
        if (this.options.onInput) {
            this.options.onInput({
                code: code,
                key: displayKey,
                state: { ...this.state }
            });
        }
    }

    handleKeyUp(e) {
        const keyEl = e.target.closest('.vk-key');
        if (!keyEl) return;

        keyEl.classList.remove('pressed');
        
        const code = keyEl.dataset.code;
        this.pressedKeys.delete(code);
        
        if (code === 'ShiftLeft' || code === 'ShiftRight') {
            this.state.shift = false;
        }
        
        if (code !== 'ShiftLeft' && code !== 'ShiftRight') {
            this.updateKeyDisplay();
        }
    }

    handleKeyLeave(e) {
        const keyEl = e.target.closest('.vk-key');
        if (keyEl && keyEl.classList.contains('pressed')) {
            keyEl.classList.remove('pressed');
        }
    }

    show() {
        this.keyboardEl.style.display = 'flex';
        this.updatePositionToBottomRight();
        this.keyboardEl.style.right = 'auto';
        this.keyboardEl.style.bottom = 'auto';
    }

    updatePositionToBottomRight() {
        const rect = this.keyboardEl.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        this.position.x = viewportWidth - rect.width - 20;
        this.position.y = viewportHeight - rect.height - 20;
        
        this.keyboardEl.style.left = this.position.x + 'px';
        this.keyboardEl.style.top = this.position.y + 'px';
    }

    hide() {
        this.keyboardEl.style.display = 'none';
    }

    toggle() {
        if (this.keyboardEl.style.display === 'none') {
            this.show();
        } else {
            this.hide();
        }
    }

    destroy() {
        this.keyboardEl.remove();
        document.removeEventListener('keydown', this.onPhysicalKeyDown);
        document.removeEventListener('keyup', this.onPhysicalKeyUp);
    }
}

export default VirtualKeyboard;
