export const getPlaceholderTemplate = ({ route, titleKey, descKey, fallbackTitle, fallbackDesc }) => `
    <div class="placeholder-tool">
        <div class="placeholder-sidebar">
            <nav class="placeholder-nav">
                <a href="#${route}" class="placeholder-nav-item active" data-view="placeholder">
                    <span data-i18n="${titleKey}">${fallbackTitle}</span>
                </a>
            </nav>
        </div>
        <div class="placeholder-main">
            <div class="placeholder-header">
                <div class="keycap" id="placeholderBackBtn" role="button" tabindex="0">
                    <span class="letter">ESC</span>
                </div>
                <input type="checkbox" id="nav-toggle" class="nav-toggle-checkbox">
                <label for="nav-toggle" class="nav-toggle-label">
                    <span class="toggle-bar" id="bar1"></span>
                    <span class="toggle-bar" id="bar2"></span>
                    <span class="toggle-bar" id="bar3"></span>
                </label>
            </div>
            <div class="placeholder-content" id="placeholderContent">
                <div class="placeholder-card">
                    <h3 class="placeholder-card-title" data-i18n="${titleKey}">${fallbackTitle}</h3>
                    <p class="placeholder-card-desc" data-i18n="${descKey}">${fallbackDesc}</p>
                </div>
            </div>
        </div>
    </div>
`;
