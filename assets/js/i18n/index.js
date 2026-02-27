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
        const response = await fetch(`./assets/js/i18n/locales/${locale}.json`);
        if (!response.ok) {
            throw new Error(`Failed to load ${locale}.json`);
        }
        const data = await response.json();
        locales[locale] = data;
        loadedLocales.add(locale);
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
    localStorage.setItem('locale', locale);
    updatePage();
}

function t(key) {
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
        const translation = t(key);
        if (translation) {
            el.textContent = translation;
        }
    });

    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        const translation = t(key);
        if (translation) {
            el.setAttribute('title', translation);
        }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        const translation = t(key);
        if (translation) {
            el.setAttribute('placeholder', translation);
        }
    });

    const langBtn = document.getElementById('langBtn');
    if (langBtn) {
        const langText = langBtn.querySelector('.lang-text');
        if (langText) {
            langText.textContent = currentLocale === 'zh' ? '中' : 'EN';
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

export async function initI18nModule() {
    await initI18n();
    updatePage();
    
    const langBtn = document.getElementById('langBtn');
    if (langBtn) {
        langBtn.addEventListener('click', () => {
            const newLocale = currentLocale === 'zh' ? 'en' : 'zh';
            setLocale(newLocale);
        });
    }
}

export { t, getLocale, setLocale };