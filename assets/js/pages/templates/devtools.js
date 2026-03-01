import { ROUTES } from '../../core/router.js';

export const devtoolsTemplate = `
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

export const getDevToolsContentTemplate = (view) => {
    switch (view) {
        case 'curl':
            return `
                <div class="dt-card">
                    <h3 class="dt-card-title" data-i18n="devtools.curl">Curl Converter</h3>
                    <p class="dt-card-desc" data-i18n="devtools.curlDesc">将 Curl 命令转换为各种编程语言的请求代码</p>
                </div>
            `;
        default:
            return '';
    }
};
