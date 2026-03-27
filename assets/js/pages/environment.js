import { router, ROUTES } from '../core/router.js';
import { environmentTemplate, getEnvContentTemplate } from './templates/environment.js';
import { refreshI18n } from '../i18n/index.js';

export class EnvironmentTool {
    constructor(container) {
        this.container = container;
        this.currentView = 'hooks';
        this.fingerprintState = {
            sections: [],
            items: [],
            drafts: {},
            currentValues: {},
            loading: false,
            loaded: false,
            error: null,
            filters: {
                section: 'all',
                permission: 'all',
                valueType: 'all',
                keyword: ''
            },
            pagination: {
                page: 1,
                pageSize: 6
            }
        };
        this.fingerprintEventsBound = false;
        this.handleWindowResize = null;
    }

    init() {
        this.render();
        this.bindEvents();
    }

    render() {
        this.container.innerHTML = environmentTemplate;
        refreshI18n();
    }

    bindEvents() {
        const backBtn = document.getElementById('envBackBtn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                router.navigate('');
            });
        }

        const navToggle = document.getElementById('nav-toggle');
        if (navToggle) {
            navToggle.addEventListener('change', (e) => {
                const sidebar = this.container.querySelector('.env-sidebar');
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
                const btn = document.getElementById('envBackBtn');
                if (btn) btn.classList.add('active');
            }
        };

        this.handleKeyUp = (e) => {
            if (e.key === 'Escape') {
                const btn = document.getElementById('envBackBtn');
                if (btn) btn.classList.remove('active');
                router.navigate('');
            }
        };

        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('keyup', this.handleKeyUp);

        const navItems = this.container.querySelectorAll('.env-nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const view = item.getAttribute('data-view');
                router.navigate(ROUTES[`ENVIRONMENT_${view.toUpperCase()}`]);
                
                const navToggle = document.getElementById('nav-toggle');
                if (navToggle && navToggle.checked) {
                    navToggle.checked = false;
                }
            });
        });

        this.bindFingerprintEvents();
    }

    navigate(view) {
        this.currentView = view;
        
        const navItems = this.container.querySelectorAll('.env-nav-item');
        navItems.forEach(item => {
            if (item.getAttribute('data-view') === view) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        const content = document.getElementById('envContent');
        if (!content) return;

        content.innerHTML = getEnvContentTemplate(view);
        refreshI18n();
        if (view === 'fingerprint') {
            this.renderFingerprintConsole();
        }
    }

    destroy() {
        if (this.handleKeyDown) {
            document.removeEventListener('keydown', this.handleKeyDown);
        }
        if (this.handleKeyUp) {
            document.removeEventListener('keyup', this.handleKeyUp);
        }
        if (this.handleWindowResize) {
            window.removeEventListener('resize', this.handleWindowResize);
            this.handleWindowResize = null;
        }
        if (this.container) {
            this.container.innerHTML = '';
        }
    }

    bindFingerprintEvents() {
        if (this.fingerprintEventsBound) {
            return;
        }

        const content = document.getElementById('envContent');
        if (!content) {
            return;
        }

        content.addEventListener('click', (event) => {
            const dropdownOption = event.target.closest('[data-fp-dropdown-option]');
            if (dropdownOption) {
                const filterKind = dropdownOption.getAttribute('data-fp-filter-kind');
                const nextValue = dropdownOption.getAttribute('data-value') || 'all';
                if (filterKind === 'permission') {
                    this.fingerprintState.filters.permission = nextValue;
                } else if (filterKind === 'type') {
                    this.fingerprintState.filters.valueType = nextValue;
                } else if (filterKind === 'section') {
                    this.fingerprintState.filters.section = nextValue;
                }
                this.fingerprintState.pagination.page = 1;
                this.renderFingerprintConsole();
                return;
            }

            const dropdownTrigger = event.target.closest('[data-fp-dropdown-trigger]');
            if (dropdownTrigger) {
                const dropdown = dropdownTrigger.closest('[data-fp-dropdown]');
                const wasOpen = dropdown ? dropdown.classList.contains('is-open') : false;
                content.querySelectorAll('[data-fp-dropdown].is-open').forEach((node) => {
                    node.classList.remove('is-open');
                });
                if (dropdown && !wasOpen) {
                    dropdown.classList.add('is-open');
                }
                return;
            }

            const pageBtn = event.target.closest('[data-fp-page]');
            if (pageBtn) {
                const direction = pageBtn.getAttribute('data-fp-page');
                const pageDelta = direction === 'prev' ? -1 : 1;
                this.fingerprintState.pagination.page += pageDelta;
                this.renderFingerprintConsole();
                return;
            }

            const resetBtn = event.target.closest('[data-fp-reset]');
            if (resetBtn) {
                this.fingerprintState.filters = {
                    section: 'all',
                    permission: 'all',
                    valueType: 'all',
                    keyword: ''
                };
                this.fingerprintState.pagination.page = 1;
                this.renderFingerprintConsole();
                return;
            }

            const retryBtn = event.target.closest('[data-fp-retry]');
            if (retryBtn) {
                this.fingerprintState.loaded = false;
                this.renderFingerprintConsole();
                return;
            }

            if (!event.target.closest('[data-fp-dropdown]')) {
                content.querySelectorAll('[data-fp-dropdown].is-open').forEach((node) => {
                    node.classList.remove('is-open');
                });
            }
        });

        content.addEventListener('input', (event) => {
            const keywordInput = event.target.closest('[data-fp-search]');
            if (keywordInput) {
                this.fingerprintState.filters.keyword = keywordInput.value;
                this.fingerprintState.pagination.page = 1;
                this.renderFingerprintConsole();
                return;
            }

            const valueInput = event.target.closest('[data-fp-input-id]');
            if (valueInput) {
                const itemId = valueInput.getAttribute('data-fp-input-id');
                if (!itemId) {
                    return;
                }
                if (valueInput.type === 'checkbox') {
                    this.fingerprintState.drafts[itemId] = valueInput.checked;
                } else {
                    this.fingerprintState.drafts[itemId] = valueInput.value;
                }
            }
        });

        if (!this.handleWindowResize) {
            this.handleWindowResize = () => {
                if (this.currentView !== 'fingerprint') {
                    return;
                }
                const changed = this.syncFingerprintPageSize();
                if (changed) {
                    this.fingerprintState.pagination.page = 1;
                    this.renderFingerprintConsole();
                }
            };
            window.addEventListener('resize', this.handleWindowResize);
        }

        this.fingerprintEventsBound = true;
    }

    getFingerprintPageSize() {
        const viewportWidth = window.innerWidth || 0;
        const viewportHeight = window.innerHeight || 0;
        if (viewportWidth <= 768) {
            return 4;
        }
        if (viewportHeight <= 900) {
            return 5;
        }
        return 6;
    }

    syncFingerprintPageSize() {
        const nextPageSize = this.getFingerprintPageSize();
        const currentPageSize = this.fingerprintState.pagination.pageSize;
        if (nextPageSize === currentPageSize) {
            return false;
        }
        this.fingerprintState.pagination.pageSize = nextPageSize;
        return true;
    }

    async loadFingerprintCatalog() {
        if (this.fingerprintState.loaded || this.fingerprintState.loading) {
            return;
        }

        this.fingerprintState.loading = true;
        this.fingerprintState.error = null;
        try {
            const response = await fetch('./assets/js/pages/environment/FingerprintCatalog.json');
            if (!response.ok) {
                throw new Error(`status ${response.status}`);
            }
            const catalog = await response.json();
            const sections = Object.entries(catalog).map(([sectionId, sectionData]) => ({
                id: sectionId,
                name: sectionData.name || sectionId
            }));
            const items = [];
            Object.entries(catalog).forEach(([sectionId, sectionData]) => {
                const fingerprints = Array.isArray(sectionData.fingerprints) ? sectionData.fingerprints : [];
                fingerprints.forEach((fingerprint) => {
                    items.push({
                        ...fingerprint,
                        sectionId,
                        editable: this.isEditableFingerprint(fingerprint)
                    });
                });
            });

            this.fingerprintState.sections = sections;
            this.fingerprintState.items = items;
            this.fingerprintState.currentValues = this.collectFingerprintCurrentValues(items);
            this.fingerprintState.loaded = true;
        } catch (error) {
            this.fingerprintState.error = error;
        } finally {
            this.fingerprintState.loading = false;
        }
    }

    isEditableFingerprint(fingerprint) {
        const editableTypes = ['boolean', 'string', 'number'];
        return editableTypes.includes(fingerprint.valueType) && fingerprint.collectMode === 'sync';
    }

    collectFingerprintCurrentValues(items) {
        return items.reduce((accumulator, item) => {
            const runtimeValue = this.readFingerprintRuntimeValue(item);
            if (runtimeValue !== undefined) {
                accumulator[item.id] = runtimeValue;
                if (item.editable && this.fingerprintState.drafts[item.id] === undefined) {
                    this.fingerprintState.drafts[item.id] = runtimeValue;
                }
            }
            return accumulator;
        }, {});
    }

    readFingerprintRuntimeValue(item) {
        if (item.collectMode !== 'sync') {
            return undefined;
        }
        const path = String(item.path || '');
        if (!path) {
            return undefined;
        }
        if (path.startsWith('matchMedia(')) {
            const queryMatch = path.match(/matchMedia\((['"])(.*?)\1\)\.matches/);
            if (!queryMatch) {
                return undefined;
            }
            const mediaQuery = queryMatch[2];
            if (!window.matchMedia) {
                return undefined;
            }
            return window.matchMedia(mediaQuery).matches;
        }
        const rootKey = path.split('.')[0];
        const rootMap = {
            navigator: window.navigator,
            screen: window.screen,
            performance: window.performance,
            window
        };
        let current = rootMap[rootKey];
        if (!current) {
            return undefined;
        }
        const segments = path.split('.').slice(1);
        for (const segment of segments) {
            if (current === null || current === undefined) {
                return undefined;
            }
            current = current[segment];
        }
        return current;
    }

    formatCurrentValue(item) {
        const value = this.fingerprintState.currentValues[item.id];
        if (value === undefined || value === null) {
            return '';
        }
        if (typeof value === 'object') {
            try {
                return JSON.stringify(value);
            } catch (_error) {
                return '';
            }
        }
        if (typeof value === 'boolean') {
            return value ? 'true' : 'false';
        }
        return String(value);
    }

    getDraftValue(item) {
        const existing = this.fingerprintState.drafts[item.id];
        if (existing !== undefined) {
            return existing;
        }
        const currentValue = this.fingerprintState.currentValues[item.id];
        if (currentValue !== undefined) {
            return currentValue;
        }
        if (item.valueType === 'boolean') {
            return false;
        }
        return '';
    }

    escapeHtml(text) {
        return String(text || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    getFilteredItems() {
        const { section, permission, valueType, keyword } = this.fingerprintState.filters;
        const normalizedKeyword = String(keyword || '').trim().toLowerCase();
        return this.fingerprintState.items.filter((item) => {
            if (section !== 'all' && item.sectionId !== section) {
                return false;
            }
            if (permission === 'editable' && !item.editable) {
                return false;
            }
            if (permission === 'readonly' && item.editable) {
                return false;
            }
            if (valueType !== 'all' && item.valueType !== valueType) {
                return false;
            }
            if (!normalizedKeyword) {
                return true;
            }
            const searchSpace = [
                item.id,
                item.title,
                item.path,
                item.recommended,
                item.mojoSlot,
                item.sectionId
            ].join(' ').toLowerCase();
            return searchSpace.includes(normalizedKeyword);
        });
    }

    captureFingerprintFocusState(root) {
        const active = document.activeElement;
        if (!(active instanceof HTMLElement) || !root.contains(active)) {
            return null;
        }

        if (active.matches('[data-fp-search]')) {
            return {
                type: 'search',
                selectionStart: active.selectionStart ?? null,
                selectionEnd: active.selectionEnd ?? null
            };
        }

        const inputId = active.getAttribute('data-fp-input-id');
        if (!inputId) {
            return null;
        }

        return {
            type: 'value',
            inputId,
            selectionStart: active.selectionStart ?? null,
            selectionEnd: active.selectionEnd ?? null
        };
    }

    restoreFingerprintFocusState(root, focusState) {
        if (!focusState) {
            return;
        }

        let target = null;
        if (focusState.type === 'search') {
            target = root.querySelector('[data-fp-search]');
        } else if (focusState.type === 'value') {
            const inputs = Array.from(root.querySelectorAll('[data-fp-input-id]'));
            target = inputs.find((input) => input.getAttribute('data-fp-input-id') === focusState.inputId) || null;
        }

        if (!(target instanceof HTMLElement)) {
            return;
        }

        target.focus();

        if (
            typeof target.setSelectionRange === 'function' &&
            focusState.selectionStart !== null &&
            focusState.selectionEnd !== null
        ) {
            target.setSelectionRange(focusState.selectionStart, focusState.selectionEnd);
        }
    }

    renderFingerprintControl(item) {
        if (!item.editable) {
            return `
                <span class="fp-readonly" data-i18n="env.fp.readonly">只读</span>
            `;
        }

        const currentValue = this.getDraftValue(item);
        if (item.valueType === 'boolean') {
            return `
                <label class="fp-switch">
                    <input type="checkbox" data-fp-input-id="${this.escapeHtml(item.id)}" ${currentValue ? 'checked' : ''}>
                    <span class="fp-switch-slider"></span>
                </label>
            `;
        }

        if (item.valueType === 'number') {
            return `
                <input
                    class="fp-input"
                    type="number"
                    data-fp-input-id="${this.escapeHtml(item.id)}"
                    value="${this.escapeHtml(currentValue)}"
                >
            `;
        }

        return `
            <input
                class="fp-input"
                type="text"
                data-fp-input-id="${this.escapeHtml(item.id)}"
                value="${this.escapeHtml(currentValue)}"
            >
        `;
    }

    renderFingerprintRows(items) {
        if (!items.length) {
            return `
                <div class="fp-empty">
                    <p data-i18n="env.fp.empty">当前筛选条件下无结果</p>
                </div>
            `;
        }

        return items.map((item) => `
            <article class="fp-row ${item.editable ? 'is-editable' : 'is-readonly'}">
                <div class="fp-row-accent"></div>
                <div class="fp-row-main">
                    <div class="fp-row-title-line">
                        <h4 class="fp-row-title">${this.escapeHtml(item.title)}</h4>
                        <span class="fp-chip">${this.escapeHtml(item.valueType)}</span>
                        <span class="fp-chip">${this.escapeHtml(item.collectMode)}</span>
                        <span class="fp-chip">${this.escapeHtml(item.sectionId)}</span>
                    </div>
                    <p class="fp-row-path">${this.escapeHtml(item.path)}</p>
                    <p class="fp-row-current">
                        <span data-i18n="env.fp.current">Value</span>:
                        <span class="fp-row-current-value">${this.escapeHtml(this.formatCurrentValue(item) || '-')}</span>
                    </p>
                </div>
                <div class="fp-row-control">
                    ${this.renderFingerprintControl(item)}
                </div>
            </article>
        `).join('');
    }

    renderFingerprintOptionLabel(option) {
        if (!option) {
            return '';
        }
        const label = this.escapeHtml(option.label);
        if (!option.i18nKey) {
            return label;
        }
        return `<span data-i18n="${option.i18nKey}">${label}</span>`;
    }

    renderFingerprintDropdown(filterKind, selectedValue, options, fieldId, fieldName, extraClass = '') {
        const selectedOption = options.find((option) => option.value === selectedValue) || options[0];
        const optionButtons = options.map((option) => `
            <button
                type="button"
                class="fp-select-option ${option.value === selectedOption.value ? 'is-active' : ''}"
                data-fp-dropdown-option
                data-fp-filter-kind="${this.escapeHtml(filterKind)}"
                data-value="${this.escapeHtml(option.value)}"
                role="option"
                aria-selected="${option.value === selectedOption.value ? 'true' : 'false'}"
            >
                ${this.renderFingerprintOptionLabel(option)}
            </button>
        `).join('');
        return `
            <div class="fp-selectbox ${extraClass}" data-fp-dropdown data-fp-filter-kind="${this.escapeHtml(filterKind)}">
                <button type="button" class="fp-select" data-fp-dropdown-trigger aria-haspopup="listbox">
                    <span class="fp-select-text">${this.renderFingerprintOptionLabel(selectedOption)}</span>
                    <svg class="fp-select-arrow" width="16" height="16" viewBox="0 0 512 512" aria-hidden="true"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                </button>
                <div class="fp-select-options" role="listbox">
                    ${optionButtons}
                </div>
                <input type="hidden" id="${this.escapeHtml(fieldId)}" name="${this.escapeHtml(fieldName)}" value="${this.escapeHtml(selectedOption.value)}">
            </div>
        `;
    }

    renderFingerprintShell(filteredItems, currentPageItems, totalPages) {
        const { sections, filters, pagination } = this.fingerprintState;
        const page = Math.min(Math.max(pagination.page, 1), totalPages);
        const prevDisabled = page <= 1 ? 'disabled' : '';
        const nextDisabled = page >= totalPages ? 'disabled' : '';
        const permissionOptions = [
            { value: 'all', label: '全部权限', i18nKey: 'env.fp.permissionAll' },
            { value: 'editable', label: '可修改', i18nKey: 'env.fp.permissionEditable' },
            { value: 'readonly', label: '只读', i18nKey: 'env.fp.permissionReadonly' }
        ];
        const typeOptions = [
            { value: 'all', label: '全部类型', i18nKey: 'env.fp.typeAll' },
            { value: 'boolean', label: 'boolean' },
            { value: 'string', label: 'string' },
            { value: 'number', label: 'number' },
            { value: 'array', label: 'array' },
            { value: 'object', label: 'object' }
        ];
        const sectionOptions = [
            { value: 'all', label: '全部', i18nKey: 'env.fp.sectionAll' },
            ...sections.map((section) => ({
                value: section.id,
                label: section.name || section.id
            }))
        ];

        return `
            <section class="fp-console" aria-label="fingerprint-console">
                <div class="fp-filters fp-filters-compact">
                    <div class="fp-search-wrapper">
                        <input
                            class="fp-search"
                            type="text"
                            value="${this.escapeHtml(filters.keyword)}"
                            data-fp-search
                            data-i18n-placeholder="env.fp.searchPlaceholder"
                            placeholder="搜索 id / path / slot"
                        >
                        <span class="fp-search-icon">
                            <svg width="16px" height="16px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="1" d="M14 5H20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path opacity="1" d="M14 8H17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M21 11.5C21 16.75 16.75 21 11.5 21C6.25 21 2 16.75 2 11.5C2 6.25 6.25 2 11.5 2" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path> <path opacity="1" d="M22 22L20 20" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                        </span>
                    </div>
                    ${this.renderFingerprintDropdown('permission', filters.permission, permissionOptions, 'fpPermissionFilter', 'fpPermissionFilter')}
                    ${this.renderFingerprintDropdown('type', filters.valueType, typeOptions, 'fpTypeFilter', 'fpTypeFilter')}
                    ${this.renderFingerprintDropdown('section', filters.section, sectionOptions, 'fpSectionFilter', 'fpSectionFilter', 'fp-section-select')}
                    <button type="button" class="fp-reset" data-fp-reset>
                        <span data-i18n="env.fp.reset">重置筛选</span>
                    </button>
                </div>

                <div class="fp-list">
                    ${this.renderFingerprintRows(currentPageItems)}
                </div>

                <div class="fp-footer">
                    <div class="fp-summary">
                        <span data-i18n="env.fp.total">总数</span>
                        <strong>${filteredItems.length}</strong>
                    </div>
                    <div class="fp-pagination">
                        <button type="button" class="fp-page-btn" data-fp-page="prev" ${prevDisabled}>
                            <span data-i18n="env.fp.prev">上一页</span>
                        </button>
                        <span class="fp-page-indicator">${page} / ${totalPages}</span>
                        <button type="button" class="fp-page-btn" data-fp-page="next" ${nextDisabled}>
                            <span data-i18n="env.fp.next">下一页</span>
                        </button>
                    </div>
                </div>
            </section>
        `;
    }

    async renderFingerprintConsole() {
        const root = document.getElementById('fpConsoleRoot');
        if (!root) {
            return;
        }

        this.syncFingerprintPageSize();

        await this.loadFingerprintCatalog();

        if (this.fingerprintState.loading && !this.fingerprintState.loaded) {
            root.innerHTML = `
                <div class="fp-loading">
                    <p data-i18n="env.fp.loading">正在加载指纹目录...</p>
                </div>
            `;
            refreshI18n();
            return;
        }

        if (this.fingerprintState.error) {
            root.innerHTML = `
                <div class="fp-error">
                    <p data-i18n="env.fp.loadFailed">指纹目录加载失败</p>
                    <button type="button" class="fp-retry" data-fp-retry>
                        <span data-i18n="env.fp.retry">重试</span>
                    </button>
                </div>
            `;
            refreshI18n();
            return;
        }

        const filteredItems = this.getFilteredItems();
        const totalPages = Math.max(1, Math.ceil(filteredItems.length / this.fingerprintState.pagination.pageSize));
        if (this.fingerprintState.pagination.page > totalPages) {
            this.fingerprintState.pagination.page = totalPages;
        }
        const start = (this.fingerprintState.pagination.page - 1) * this.fingerprintState.pagination.pageSize;
        const end = start + this.fingerprintState.pagination.pageSize;
        const currentPageItems = filteredItems.slice(start, end);
        const focusState = this.captureFingerprintFocusState(root);

        root.innerHTML = this.renderFingerprintShell(filteredItems, currentPageItems, totalPages);
        refreshI18n();
        this.restoreFingerprintFocusState(root, focusState);
    }
}
