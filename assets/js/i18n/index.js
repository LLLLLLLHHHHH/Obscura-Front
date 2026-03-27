const locales = {
    'zh': null,
    'en': null
};

let currentLocale = 'zh';
let loadedLocales = new Set();

async function loadLocale(locale) {
    if (locales[locale] || loadedLocales.has(locale)) {
        return locales[locale];
    }

    try {
        const url = `./assets/js/i18n/locales/${locale}.json`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to load ${locale}.json`);
        }
        const data = await response.json();
        locales[locale] = data;
        loadedLocales.add(locale);
        if (locale === currentLocale) {
            localeReady = true;
        }
        return data;
    } catch (error) {
        console.error(`Error loading locale ${locale}:`, error);
        return null;
    }
}

function getLocale() {
    return currentLocale;
}

async function setLocale(locale) {
    if (!locales[locale]) {
        await loadLocale(locale);
    }
    if (!locales[locale]) {
        console.error(`Locale ${locale} not found`);
        return;
    }
    currentLocale = locale;
    localeReady = true;
    localStorage.setItem('locale', locale);
    updatePage();
    window.dispatchEvent(new CustomEvent('obscura:locale-changed', {
        detail: { locale: currentLocale }
    }));
}

let localeReady = false;

function t(key) {
    if (!localeReady) {
        return key;
    }
    const keys = key.split('.');
    let value = locales[currentLocale];

    for (const k of keys) {
        if (value && typeof value === 'object') {
            value = value[k];
        } else {
            return key;
        }
    }

    return value || key;
}

function updatePage() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        let translation = t(key);
        if (el.hasAttribute('data-i18n-n')) {
            const n = el.getAttribute('data-i18n-n');
            translation = translation.replace('{n}', n);
        }
        if (translation) {
            el.textContent = translation;
        }
    });

    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        const translation = t(key);
        if (translation) {
            el.setAttribute('data-tooltip', translation);
            el.removeAttribute('title'); // 移除原生 title 防止双重显示
        }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        const translation = t(key);
        if (translation) {
            el.setAttribute('placeholder', translation);
        }
    });

    document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
        const key = el.getAttribute('data-i18n-aria-label');
        const translation = t(key);
        if (translation) {
            el.setAttribute('aria-label', translation);
        }
    });

    const langBtn = document.getElementById('langBtn');
    if (langBtn) {
        const langText = langBtn.querySelector('.lang-text');
        if (langText) {
            // 反转显示：当前是 zh 显示 EN，当前是 en 显示 中
            langText.textContent = currentLocale === 'zh' ? 'EN' : '中';
        }
    }

    updateHtmlLang();
}

function updateHtmlLang() {
    document.documentElement.lang = currentLocale;
}

async function initI18n() {
    const savedLocale = localStorage.getItem('locale');
    if (savedLocale && (locales[savedLocale] || loadedLocales.has(savedLocale))) {
        currentLocale = savedLocale;
    } else if (savedLocale) {
        currentLocale = savedLocale;
    } else {
        const browserLang = navigator.language;
        if (browserLang.startsWith('en')) {
            currentLocale = 'en';
        }
    }

    await loadLocale(currentLocale);
    updateHtmlLang();
}

let i18nReadyResolve;
const i18nReady = new Promise(resolve => {
    i18nReadyResolve = resolve;
});

export async function initI18nModule() {
    await initI18n();
    localeReady = true;
    i18nReadyResolve();
    updatePage();

    const langBtn = document.getElementById('langBtn');
    if (langBtn) {
        langBtn.addEventListener('click', () => {
            const newLocale = currentLocale === 'zh' ? 'en' : 'zh';
            setLocale(newLocale);
        });
    }
}

function refreshI18n() {
    updatePage();
}

export { t, getLocale, setLocale, i18nReady, refreshI18n };
