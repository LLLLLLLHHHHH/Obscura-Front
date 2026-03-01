import { ROUTES } from '../../core/router.js';

export const antidebugTemplate = `
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

export const getAdContentTemplate = (view) => {
    switch (view) {
        case 'debugger':
            return `
                <div class="ad-card">
                    <h3 class="ad-card-title" data-i18n="ad.debugger">Debugger</h3>
                    <p class="ad-card-desc" data-i18n="ad.debuggerDesc">检测并阻止调试器行为</p>
                </div>
            `;
        case 'console':
            return `
                <div class="ad-card">
                    <h3 class="ad-card-title" data-i18n="ad.console">Console</h3>
                    <p class="ad-card-desc" data-i18n="ad.consoleDesc">检测控制台打开状态</p>
                </div>
            `;
        default:
            return '';
    }
};
