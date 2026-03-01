import { router, ROUTES } from './router.js';

export class AntiDebugTool {
    constructor(container) {
        this.container = container;
        this.currentView = 'debugger';
    }

    init() {
        this.render();
        this.bindEvents();
    }

    render() {
        this.container.innerHTML = `
            <div class="ad-tool">
                <div class="ad-sidebar">
                    <nav class="ad-nav">
                        <a href="#${ROUTES.ANTIDEBUG_DEBUGGER}" class="ad-nav-item active" data-view="debugger">
                            <span data-i18n="ad.debugger">Debugger</span>
                        </a>
                        <a href="#${ROUTES.ANTIDEBUG_CONSOLE}" class="ad-nav-item" data-view="console">
                            <span data-i18n="ad.console">Console</span>
                        </a>
                    </nav>
                </div>
                <div class="ad-main">
                    <div class="ad-header">
                        <div class="keycap" id="adBackBtn" role="button" tabindex="0">
                            <span class="letter">ESC</span>
                        </div>
                        <input type="checkbox" id="nav-toggle" class="nav-toggle-checkbox">
                        <label for="nav-toggle" class="nav-toggle-label">
                            <span class="toggle-bar" id="bar1"></span>
                            <span class="toggle-bar" id="bar2"></span>
                            <span class="toggle-bar" id="bar3"></span>
                        </label>
                    </div>
                    <div class="ad-content" id="adContent">
                        <div class="ad-card">
                            <h3 class="ad-card-title" data-i18n="ad.debugger">Debugger</h3>
                            <p class="ad-card-desc" data-i18n="ad.debuggerDesc">检测并阻止调试器行为</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
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

    navigate(view) {
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

        switch (view) {
            case 'debugger':
                content.innerHTML = `
                    <div class="ad-card">
                        <h3 class="ad-card-title" data-i18n="ad.debugger">Debugger</h3>
                        <p class="ad-card-desc" data-i18n="ad.debuggerDesc">检测并阻止调试器行为</p>
                    </div>
                `;
                break;
            case 'console':
                content.innerHTML = `
                    <div class="ad-card">
                        <h3 class="ad-card-title" data-i18n="ad.console">Console</h3>
                        <p class="ad-card-desc" data-i18n="ad.consoleDesc">检测控制台打开状态</p>
                    </div>
                `;
                break;
        }
    }

    destroy() {
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
