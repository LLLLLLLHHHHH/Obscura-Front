import { ROUTES } from '../../core/router.js';

export const environmentTemplate = `
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

export const getEnvContentTemplate = (view) => {
    switch (view) {
        case 'hooks':
            return `
                <div class="env-card">
                    <h3 class="env-card-title" data-i18n="env.hooks">对象钩子</h3>
                    <p class="env-card-desc" data-i18n="env.hooksDesc">拦截并修改对象属性的读取和写入操作</p>
                </div>
            `;
        case 'functions':
            return `
                <div class="env-card">
                    <h3 class="env-card-title" data-i18n="env.functions">函数固定</h3>
                    <p class="env-card-desc" data-i18n="env.functionsDesc">固定函数返回值或修改函数行为</p>
                </div>
            `;
        case 'fingerprint':
            return `
                <div class="env-card">
                    <h3 class="env-card-title" data-i18n="env.fingerprint">指纹配置</h3>
                    <p class="env-card-desc" data-i18n="env.fingerprintDesc">伪造浏览器指纹信息</p>
                </div>
            `;
        case 'async':
            return `
                <div class="env-card">
                    <h3 class="env-card-title" data-i18n="env.async">异步拦截</h3>
                    <p class="env-card-desc" data-i18n="env.asyncDesc">拦截并修改异步操作的结果</p>
                </div>
            `;
        default:
            return '';
    }
};
