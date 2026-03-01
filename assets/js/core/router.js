export const ROUTES = {
    HOME: '',
    ENVIRONMENT: 'environment',
    ENVIRONMENT_HOOKS: 'environment/hooks',
    ENVIRONMENT_FUNCTIONS: 'environment/functions',
    ENVIRONMENT_FINGERPRINT: 'environment/fingerprint',
    ENVIRONMENT_ASYNC: 'environment/async',
    ANTIDEBUG: 'antidebug',
    ANTIDEBUG_DEBUGGER: 'antidebug/debugger',
    ANTIDEBUG_CONSOLE: 'antidebug/console',
    DEVTOOLS: 'devtools',
    DEVTOOLS_CURL: 'devtools/curl'
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
        } else if (hash.startsWith(ROUTES.ANTIDEBUG)) {
            this.loadToolPage(main, hash);
        } else if (hash.startsWith(ROUTES.DEVTOOLS)) {
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
        if (window.antidebugTool) {
            window.antidebugTool.destroy();
            window.antidebugTool = null;
        }
        if (window.devTools) {
            window.devTools.destroy();
            window.devTools = null;
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

        if (hash.startsWith(ROUTES.ENVIRONMENT)) {
            const { EnvironmentTool } = await import('../pages/environment.js');
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
        } else if (hash.startsWith(ROUTES.ANTIDEBUG)) {
            const { AntiDebugTool } = await import('../pages/antidebug.js');
            if (!window.antidebugTool) {
                window.antidebugTool = new AntiDebugTool(container);
                window.antidebugTool.init();
            }
            if (hash === ROUTES.ANTIDEBUG || hash === ROUTES.ANTIDEBUG_DEBUGGER) {
                window.antidebugTool.navigate('debugger');
            } else if (hash === ROUTES.ANTIDEBUG_CONSOLE) {
                window.antidebugTool.navigate('console');
            }
        } else if (hash.startsWith(ROUTES.DEVTOOLS)) {
            const { DevTools } = await import('../pages/devtools.js');
            if (!window.devTools) {
                window.devTools = new DevTools(container);
                window.devTools.init();
            }
            if (hash === ROUTES.DEVTOOLS || hash === ROUTES.DEVTOOLS_CURL) {
                window.devTools.navigate('curl');
            }
        }
    }
}

export const router = new Router();
