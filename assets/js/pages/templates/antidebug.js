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
                <div class="ad-card ad-card-debugger">
                    <div class="card">
                        <div class="wrap">
                            <div class="terminal">
                                <div class="head">
                                    <div class="title">
                                        <svg viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M20 19V7H4v12h16m0-16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16m-7 14v-2h5v2h-5m-3.42-4L5.57 9H8.4l3.3 3.29c.39.39.39 1.03 0 1.42L8.42 17H5.59l4-4Z"/>
                                        </svg>
                                        <span>Debugger Control</span>
                                    </div>
                                </div>
                                <div class="body" id="debuggerTerminal">
                                    <div class="output" id="debuggerOutput">
                                        <div class="pre">Welcome to Obscura, <span id="terminal-time"></span></div>
                                        <div class="pre">Type "help" for available commands.</div>
                                        <div class="pre"><br></div>
                                    </div>
                                    <div class="input-line">
                                        <span class="prompt">obscura@JJH ~ %</span>
                                        <input type="text" id="debuggerInput" class="cmd-input" autocomplete="off" spellcheck="false" placeholder="">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="ad-card-status">
                        <span class="status-indicator active" id="debuggerStatus"></span>
                        <span class="status-text" id="debuggerStatusText">Running</span>
                    </div>
                </div>
            `;
        case 'console':
            return `
                <div class="ad-card ad-card-console">
                    <div class="standee-grid">
                        <div class="standee-card" data-mojoslot="log:debug" data-standee data-standee-title="Debug" data-standee-sub="– console.debug –"></div>
                        <div class="standee-card" data-mojoslot="log:log" data-standee data-standee-title="Log" data-standee-sub="– console.log –"></div>
                        <div class="standee-card" data-mojoslot="log:info" data-standee data-standee-title="Info" data-standee-sub="– console.info –"></div>
                        <div class="standee-card" data-mojoslot="log:warn" data-standee data-standee-title="Warn" data-standee-sub="– console.warn –"></div>
                        <div class="standee-card" data-mojoslot="log:error" data-standee data-standee-title="Error" data-standee-sub="– console.error –"></div>
                        <div class="standee-card" data-mojoslot="log:table" data-standee data-standee-title="Table" data-standee-sub="– console.table –"></div>
                        <div class="standee-card" data-mojoslot="log:dir" data-standee data-standee-title="Dir" data-standee-sub="– console.dir –"></div>
                        <div class="standee-card" data-mojoslot="log:dirxml" data-standee data-standee-title="Dirxml" data-standee-sub="– console.dirxml –"></div>
                        <div class="standee-card" data-mojoslot="ctrl:trace" data-standee data-standee-title="Trace" data-standee-sub="– console.trace –"></div>
                        <div class="standee-card" data-mojoslot="ctrl:clear" data-standee data-standee-title="Clear" data-standee-sub="– console.clear –"></div>
                        <div class="standee-card" data-mojoslot="ctrl:assert" data-standee data-standee-title="Assert" data-standee-sub="– console.assert –"></div>
                        <div class="standee-card" data-mojoslot="ctrl:count" data-standee data-standee-title="Count" data-standee-sub="– console.count –"></div>
                        <div class="config-card" data-mojoslot="config:array">
                            <div class="config-icon">
                                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h18v18H3V3m2 2v14h14V5H5m2 2h10v2H7V7m0 4h10v2H7v-2m0 4h6v2H7v-2z"/></svg>
                            </div>
                            <div class="config-label">Array 长度</div>
                        </div>
                        <div class="config-card" data-mojoslot="config:table">
                            <div class="config-icon">
                                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h18v18H3V3m2 2v14h14V5H5m2 2h10v2H7V7m0 4h10v2H7v-2m0 4h6v2H7v-2z"/></svg>
                            </div>
                            <div class="config-label">Table 长度</div>
                        </div>
                    </div>
                </div>
            `;
        default:
            return '';
    }
};
