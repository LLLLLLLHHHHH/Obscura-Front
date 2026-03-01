import { router, ROUTES } from './router.js';

export class DevTools {
    constructor(container) {
        this.container = container;
        this.currentView = 'curl';
    }

    init() {
        this.render();
        this.bindEvents();
    }

    render() {
        this.container.innerHTML = `
            <div class="dt-tool">
                <div class="dt-sidebar">
                    <nav class="dt-nav">
                        <a href="#${ROUTES.DEVTOOLS_CURL}" class="dt-nav-item active" data-view="curl">
                            <span data-i18n="devtools.curl">Curl Converter</span>
                        </a>
                    </nav>
                </div>
                <div class="dt-main">
                    <div class="dt-header">
                        <div class="keycap" id="dtBackBtn" role="button" tabindex="0">
                            <span class="letter">ESC</span>
                        </div>
                        <input type="checkbox" id="nav-toggle" class="nav-toggle-checkbox">
                        <label for="nav-toggle" class="nav-toggle-label">
                            <span class="toggle-bar" id="bar1"></span>
                            <span class="toggle-bar" id="bar2"></span>
                            <span class="toggle-bar" id="bar3"></span>
                        </label>
                    </div>
                    <div class="dt-content" id="dtContent">
                        <div class="dt-card">
                            <h3 class="dt-card-title" data-i18n="devtools.curl">Curl Converter</h3>
                            <p class="dt-card-desc" data-i18n="devtools.curlDesc">将 Curl 命令转换为各种编程语言的请求代码</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    bindEvents() {
        const backBtn = document.getElementById('dtBackBtn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                router.navigate('');
            });
        }

        const navToggle = document.getElementById('nav-toggle');
        if (navToggle) {
            navToggle.addEventListener('change', (e) => {
                const sidebar = this.container.querySelector('.dt-sidebar');
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
                const btn = document.getElementById('dtBackBtn');
                if (btn) btn.classList.add('active');
            }
        };

        this.handleKeyUp = (e) => {
            if (e.key === 'Escape') {
                const btn = document.getElementById('dtBackBtn');
                if (btn) btn.classList.remove('active');
                router.navigate('');
            }
        };

        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('keyup', this.handleKeyUp);

        const navItems = this.container.querySelectorAll('.dt-nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const view = item.getAttribute('data-view');
                router.navigate(ROUTES[`DEVTOOLS_${view.toUpperCase()}`]);
                
                const navToggle = document.getElementById('nav-toggle');
                if (navToggle && navToggle.checked) {
                    navToggle.checked = false;
                }
            });
        });
    }

    navigate(view) {
        this.currentView = view;
        
        const navItems = this.container.querySelectorAll('.dt-nav-item');
        navItems.forEach(item => {
            if (item.getAttribute('data-view') === view) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        const content = document.getElementById('dtContent');
        if (!content) return;

        switch (view) {
            case 'curl':
                content.innerHTML = `
                    <div class="dt-card">
                        <h3 class="dt-card-title" data-i18n="devtools.curl">Curl Converter</h3>
                        <p class="dt-card-desc" data-i18n="devtools.curlDesc">将 Curl 命令转换为各种编程语言的请求代码</p>
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
