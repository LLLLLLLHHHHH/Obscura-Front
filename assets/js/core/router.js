export const ROUTES = {
    HOME: '',
    ENVIRONMENT: 'environment',
    ENVIRONMENT_HOOKS: 'environment/hooks',
    ENVIRONMENT_FUNCTIONS: 'environment/functions',
    ENVIRONMENT_FINGERPRINT: 'environment/fingerprint',
    ENVIRONMENT_ASYNC: 'environment/async'
};

class Router {
    constructor() {
        this.routes = new Map();
        this.currentRoute = null;
        this.init();
    }

    init() {
        window.addEventListener('hashchange', () => this.handleRoute());
        window.addEventListener('load', () => this.handleRoute());
    }

    register(path, handler) {
        this.routes.set(path, handler);
    }

    navigate(path) {
        window.location.hash = path;
    }

    handleRoute() {
        const hash = window.location.hash.slice(1) || ROUTES.HOME;
        
        const main = document.querySelector('main');
        if (!main) return;

        if (hash.startsWith(ROUTES.ENVIRONMENT)) {
            this.loadToolPage(main, hash);
        } else {
            this.loadHomePage(main);
        }
    }

    async loadToolPage(main, hash) {
        const toolContainer = document.getElementById('tool-container');
        if (toolContainer) {
            toolContainer.style.display = 'flex'; // 使用 flex 以保持样式
            const toolsSection = main.querySelector('.tools');
            if (toolsSection) {
                toolsSection.style.display = 'none';
            }
            this.loadTool(hash);
        }
    }

    loadHomePage(main) {
        if (window.environmentTool) {
            window.environmentTool.destroy();
            window.environmentTool = null;
        }

        const toolContainer = document.getElementById('tool-container');
        if (toolContainer) {
            toolContainer.style.display = 'none';
        }
        const toolsSection = main.querySelector('.tools');
        if (toolsSection) {
            toolsSection.style.display = 'block';
        }
    }

    async loadTool(hash) {
        const container = document.getElementById('tool-content');
        if (!container) return;

        const { EnvironmentTool } = await import('./environment.js');
        
        if (!window.environmentTool) {
            window.environmentTool = new EnvironmentTool(container);
            window.environmentTool.init();
        }

        if (hash === ROUTES.ENVIRONMENT || hash === ROUTES.ENVIRONMENT_HOOKS) {
            window.environmentTool.navigate('hooks');
        } else if (hash === ROUTES.ENVIRONMENT_FUNCTIONS) {
            window.environmentTool.navigate('functions');
        } else if (hash === ROUTES.ENVIRONMENT_FINGERPRINT) {
            window.environmentTool.navigate('fingerprint');
        } else if (hash === ROUTES.ENVIRONMENT_ASYNC) {
            window.environmentTool.navigate('async');
        }
    }
}

export const router = new Router();
