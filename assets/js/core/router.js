export const ROUTES = {
    HOME: '',
    PLACEHOLDER1: 'placeholder1',
    PLACEHOLDER2: 'placeholder2',
    PLACEHOLDER3: 'placeholder3'
};

const PLACEHOLDER_CONFIGS = {
    [ROUTES.PLACEHOLDER1]: {
        route: ROUTES.PLACEHOLDER1,
        titleKey: 'placeholderPages.placeholder1Title',
        descKey: 'placeholderPages.placeholder1Desc',
        fallbackTitle: '占位工具 1',
        fallbackDesc: '这是一个预留的工具位置，可作为后续功能模板。'
    },
    [ROUTES.PLACEHOLDER2]: {
        route: ROUTES.PLACEHOLDER2,
        titleKey: 'placeholderPages.placeholder2Title',
        descKey: 'placeholderPages.placeholder2Desc',
        fallbackTitle: '占位工具 2',
        fallbackDesc: '这是一个预留的工具位置，可作为后续功能模板。'
    },
    [ROUTES.PLACEHOLDER3]: {
        route: ROUTES.PLACEHOLDER3,
        titleKey: 'placeholderPages.placeholder3Title',
        descKey: 'placeholderPages.placeholder3Desc',
        fallbackTitle: '占位工具 3',
        fallbackDesc: '这是一个预留的工具位置，可作为后续功能模板。'
    }
};

class Router {
    constructor() {
        this.init();
    }

    init() {
        window.addEventListener('hashchange', () => this.handleRoute());
        window.addEventListener('load', () => this.handleRoute());
    }

    navigate(path) {
        window.location.hash = path;
    }

    handleRoute() {
        const hash = window.location.hash.slice(1) || ROUTES.HOME;

        const main = document.querySelector('main');
        if (!main) return;

        if (PLACEHOLDER_CONFIGS[hash]) {
            this.loadToolPage(main, hash);
        } else {
            this.loadHomePage(main);
        }
    }

    async loadToolPage(main, hash) {
        const toolContainer = document.getElementById('tool-container');
        if (toolContainer) {
            toolContainer.classList.remove('is-hidden');
            const toolsSection = main.querySelector('.tools');
            if (toolsSection) {
                toolsSection.classList.add('is-hidden');
            }
            await this.loadTool(hash);
        }
    }

    loadHomePage(main) {
        if (window.placeholderTool) {
            window.placeholderTool.destroy();
            window.placeholderTool = null;
            window.placeholderToolRoute = null;
        }

        const toolContainer = document.getElementById('tool-container');
        if (toolContainer) {
            toolContainer.classList.add('is-hidden');
        }
        const toolsSection = main.querySelector('.tools');
        if (toolsSection) {
            toolsSection.classList.remove('is-hidden');
        }
    }

    async loadTool(hash) {
        const container = document.getElementById('tool-content');
        if (!container) return;

        const config = PLACEHOLDER_CONFIGS[hash];
        if (config) {
            const { PlaceholderTool } = await import('../pages/placeholder.js');
            if (!window.placeholderTool || window.placeholderToolRoute !== hash) {
                if (window.placeholderTool) {
                    window.placeholderTool.destroy();
                }
                window.placeholderTool = new PlaceholderTool(container, config);
                window.placeholderToolRoute = hash;
                window.placeholderTool.init();
            }
            window.placeholderTool.navigate();
        }
    }
}

export const router = new Router();
