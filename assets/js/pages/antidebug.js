import { router, ROUTES } from '../core/router.js';
import { antidebugTemplate, getAdContentTemplate } from './templates/antidebug.js';
import { debuggerService } from '../services/DebuggerService.js';
import { mojoSlotService } from '../services/MojoSlotService.js';
import { initStandee } from '../core/standee.js';
import NumberInput from '../core/NumberInput.js';

export class AntiDebugTool {
    constructor(container) {
        this.container = container;
        this.currentView = 'debugger';
        this.consoleStandeenstances = [];
        this.consoleNumberInputs = [];
    }

    init() {
        this.render();
        this.bindEvents();
        this.initDebuggerServiceListener();
    }

    initDebuggerServiceListener() {
        debuggerService.addListener((status) => {
            this.updateDebuggerStatus();
        });
    }

    render() {
        this.container.innerHTML = antidebugTemplate;
    }

    bindEvents() {
        const backBtn = document.getElementById('adBackBtn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                router.navigate('');
            });
        }

        const navToggle = document.getElementById('nav-toggle');
        if (navToggle) {
            navToggle.addEventListener('change', (e) => {
                const sidebar = this.container.querySelector('.ad-sidebar');
                if (sidebar) {
                    if (e.target.checked) {
                        sidebar.classList.add('collapsed');
                    } else {
                        sidebar.classList.remove('collapsed');
                    }
                }
            });
        }

        // 键盘事件监听
        this.handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                const btn = document.getElementById('adBackBtn');
                if (btn) btn.classList.add('active');
            }
        };

        this.handleKeyUp = (e) => {
            if (e.key === 'Escape') {
                const btn = document.getElementById('adBackBtn');
                if (btn) btn.classList.remove('active');
                router.navigate('');
            }
        };

        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('keyup', this.handleKeyUp);

        const navItems = this.container.querySelectorAll('.ad-nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const view = item.getAttribute('data-view');
                router.navigate(ROUTES[`ANTIDEBUG_${view.toUpperCase()}`]);
                
                const navToggle = document.getElementById('nav-toggle');
                if (navToggle && navToggle.checked) {
                    navToggle.checked = false;
                }
            });
        });
    }

    async navigate(view) {
        this.currentView = view;
        
        const navItems = this.container.querySelectorAll('.ad-nav-item');
        navItems.forEach(item => {
            if (item.getAttribute('data-view') === view) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        const content = document.getElementById('adContent');
        if (!content) return;

        content.innerHTML = getAdContentTemplate(view);

        if (view === 'debugger') {
            this.initDebuggerTerminal();
        } else if (view === 'console') {
            this.initConsoleStandeen();
            await this.initConsoleNumberInputs();
        }
    }

    initConsoleStandeen() {
        this.consoleStandeenstances.forEach(s => s.destroy());
        this.consoleStandeenstances = [];
        const standeeContainers = this.container.querySelectorAll('[data-standee]');
        standeeContainers.forEach(container => {
            const options = {};
            const title = container.getAttribute('data-standee-title');
            const sub = container.getAttribute('data-standee-sub');
            if (title) options.title = title;
            if (sub) options.sub = sub;
            const instance = initStandee(container, options);
            this.consoleStandeenstances.push(instance);
        });
    }

    async initConsoleNumberInputs() {
        this.consoleNumberInputs.forEach(ni => ni.wrapper.remove());
        this.consoleNumberInputs = [];
        const mountEls = this.container.querySelectorAll('[data-inputslot]');
        for (const mountEl of mountEls) {
            const slotKey = mountEl.getAttribute('data-inputslot');
            const instance = await NumberInput.create(slotKey, mountEl);
            this.consoleNumberInputs.push(instance);
        }
    }

    initDebuggerTerminal() {
        const input = document.getElementById('debuggerInput');
        const output = document.getElementById('debuggerOutput');
        const terminal = document.getElementById('debuggerTerminal');

        if (!input || !output) return;

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const cmd = input.value.trim();
                if (cmd) {
                    this.executeCommand(cmd);
                }
                input.value = '';
            }
        });

        if (terminal) {
            terminal.addEventListener('click', () => {
                input.focus();
            });
        }

        this.updateTerminalTime();
        if (this.timeInterval) clearInterval(this.timeInterval);
        this.timeInterval = setInterval(() => this.updateTerminalTime(), 1000);

        this.updateDebuggerStatus();
        this.scrollToBottom();
        input.focus();
    }

    updateTerminalTime() {
        const timeElement = document.getElementById('terminal-time');
        if (timeElement) {
            const now = new Date();
            const options = { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric', 
                hour: 'numeric', 
                minute: 'numeric', 
                second: 'numeric',
                hour12: true 
            };
            timeElement.textContent = now.toLocaleString('en-US', options);
        }
    }

    executeCommand(cmd) {
        const output = document.getElementById('debuggerOutput');
        if (!output) return;

        const cmdDiv = document.createElement('div');
        cmdDiv.className = 'pre cmd-echo';
        cmdDiv.innerHTML = `<span class="prompt">obscura@JJH ~ %</span> ${this.escapeHtml(cmd)}`;
        output.appendChild(cmdDiv);

        const result = debuggerService.executeCommand(cmd);

        if (result.responseClass === 'clear') {
            output.innerHTML = '';
            return;
        }

        const lines = result.response.split('\n');
        lines.forEach(line => {
            const pre = document.createElement('div');
            pre.className = `pre ${result.responseClass}`;
            pre.textContent = line;
            output.appendChild(pre);
        });

        this.scrollToBottom();
    }

    scrollToBottom() {
        const output = document.getElementById('debuggerOutput');
        if (output) {
            output.scrollTop = output.scrollHeight;
        }
    }

    updateDebuggerStatus() {
        const statusIndicator = document.getElementById('debuggerStatus');
        const statusText = document.getElementById('debuggerStatusText');
        
        if (statusIndicator) {
            if (debuggerService.isRunning()) {
                statusIndicator.classList.add('active');
            } else {
                statusIndicator.classList.remove('active');
            }
        }

        if (statusText) {
            statusText.textContent = debuggerService.getStatusText();
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    destroy() {
        if (this.timeInterval) {
            clearInterval(this.timeInterval);
        }
        if (this.handleKeyDown) {
            document.removeEventListener('keydown', this.handleKeyDown);
        }
        if (this.handleKeyUp) {
            document.removeEventListener('keyup', this.handleKeyUp);
        }
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
}
