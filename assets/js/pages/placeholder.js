import { router } from '../core/router.js';
import { getPlaceholderTemplate } from './templates/placeholder.js';
import { refreshI18n } from '../i18n/index.js';

export class PlaceholderTool {
    constructor(container, options) {
        this.container = container;
        this.options = options;
        this.handleKeyDown = null;
        this.handleKeyUp = null;
    }

    init() {
        this.render();
        this.bindEvents();
    }

    render() {
        this.container.innerHTML = getPlaceholderTemplate(this.options);
        refreshI18n();
    }

    bindEvents() {
        const backBtn = this.container.querySelector('#placeholderBackBtn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                router.navigate('');
            });
        }

        const navToggle = this.container.querySelector('#nav-toggle');
        if (navToggle) {
            navToggle.addEventListener('change', (event) => {
                const sidebar = this.container.querySelector('.placeholder-sidebar');
                if (sidebar) {
                    sidebar.classList.toggle('collapsed', event.target.checked);
                }
            });
        }

        this.handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                const btn = this.container.querySelector('#placeholderBackBtn');
                if (btn) btn.classList.add('active');
            }
        };

        this.handleKeyUp = (event) => {
            if (event.key === 'Escape') {
                const btn = this.container.querySelector('#placeholderBackBtn');
                if (btn) btn.classList.remove('active');
                router.navigate('');
            }
        };

        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('keyup', this.handleKeyUp);

        const navItems = this.container.querySelectorAll('.placeholder-nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (event) => {
                event.preventDefault();
                router.navigate(this.options.route);

                const navToggle = this.container.querySelector('#nav-toggle');
                if (navToggle && navToggle.checked) {
                    navToggle.checked = false;
                }
            });
        });
    }

    navigate() {
        const navItems = this.container.querySelectorAll('.placeholder-nav-item');
        navItems.forEach(item => {
            item.classList.add('active');
        });

        refreshI18n();
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
