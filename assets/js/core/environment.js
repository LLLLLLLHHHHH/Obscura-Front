import { router, ROUTES } from './router.js';

export class EnvironmentTool {
    constructor(container) {
        this.container = container;
        this.currentView = 'hooks';
    }

    init() {
        this.render();
        this.bindEvents();
    }

    render() {
        this.container.innerHTML = `
            <div class="env-tool">
                <div class="env-sidebar">
                    <nav class="env-nav">
                        <a href="#${ROUTES.ENVIRONMENT_HOOKS}" class="env-nav-item active" data-view="hooks">
                            <span data-i18n="env.hooks">对象钩子</span>
                        </a>
                        <a href="#${ROUTES.ENVIRONMENT_FUNCTIONS}" class="env-nav-item" data-view="functions">
                            <span data-i18n="env.functions">函数固定</span>
                        </a>
                        <a href="#${ROUTES.ENVIRONMENT_FINGERPRINT}" class="env-nav-item" data-view="fingerprint">
                            <span data-i18n="env.fingerprint">指纹配置</span>
                        </a>
                        <a href="#${ROUTES.ENVIRONMENT_ASYNC}" class="env-nav-item" data-view="async">
                            <span data-i18n="env.async">异步拦截</span>
                        </a>
                    </nav>
                </div>
                <div class="env-main">
                    <div class="env-header">
                        <div class="keycap" id="envBackBtn" role="button" tabindex="0">
                            <span class="letter">ESC</span>
                        </div>
                        <input type="checkbox" id="nav-toggle" class="nav-toggle-checkbox">
                        <label for="nav-toggle" class="nav-toggle-label">
                            <span class="toggle-bar" id="bar1"></span>
                            <span class="toggle-bar" id="bar2"></span>
                            <span class="toggle-bar" id="bar3"></span>
                        </label>
                    </div>
                    <div class="env-content" id="envContent">
                        <div class="env-card">
                            <h3 class="env-card-title" data-i18n="env.hooks">对象钩子</h3>
                            <p class="env-card-desc" data-i18n="env.hooksDesc">拦截并修改对象属性的读取和写入操作</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    bindEvents() {
        const backBtn = document.getElementById('envBackBtn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                router.navigate('');
            });
        }

        const navToggle = document.getElementById('nav-toggle');
        if (navToggle) {
            navToggle.addEventListener('change', (e) => {
                const sidebar = this.container.querySelector('.env-sidebar');
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
                const btn = document.getElementById('envBackBtn');
                if (btn) btn.classList.add('active');
            }
        };

        this.handleKeyUp = (e) => {
            if (e.key === 'Escape') {
                const btn = document.getElementById('envBackBtn');
                if (btn) btn.classList.remove('active');
                router.navigate('');
            }
        };

        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('keyup', this.handleKeyUp);

        const navItems = this.container.querySelectorAll('.env-nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const view = item.getAttribute('data-view');
                router.navigate(ROUTES[`ENVIRONMENT_${view.toUpperCase()}`]);
                
                const navToggle = document.getElementById('nav-toggle');
                if (navToggle && navToggle.checked) {
                    navToggle.checked = false;
                }
            });
        });
    }

    navigate(view) {
        this.currentView = view;
        
        const navItems = this.container.querySelectorAll('.env-nav-item');
        navItems.forEach(item => {
            if (item.getAttribute('data-view') === view) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        const content = document.getElementById('envContent');
        if (!content) return;

        switch (view) {
            case 'hooks':
                content.innerHTML = `
                    <div class="env-card">
                        <h3 class="env-card-title" data-i18n="env.hooks">对象钩子</h3>
                        <p class="env-card-desc" data-i18n="env.hooksDesc">拦截并修改对象属性的读取和写入操作</p>
                    </div>
                `;
                break;
            case 'functions':
                content.innerHTML = `
                    <div class="env-card">
                        <h3 class="env-card-title" data-i18n="env.functions">函数固定</h3>
                        <p class="env-card-desc" data-i18n="env.functionsDesc">固定函数返回值或修改函数行为</p>
                    </div>
                `;
                break;
            case 'fingerprint':
                content.innerHTML = `
                    <div class="env-card">
                        <h3 class="env-card-title" data-i18n="env.fingerprint">指纹配置</h3>
                        <p class="env-card-desc" data-i18n="env.fingerprintDesc">伪造浏览器指纹信息</p>
                    </div>
                `;
                break;
            case 'async':
                content.innerHTML = `
                    <div class="env-card">
                        <h3 class="env-card-title" data-i18n="env.async">异步拦截</h3>
                        <p class="env-card-desc" data-i18n="env.asyncDesc">拦截并修改异步操作的结果</p>
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
