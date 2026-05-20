import { initTheme } from '../core/theme.js';
import { initEffects } from '../core/effects.js';
import { initSmoothScroll } from '../core/utils.js';
import { initI18nModule } from '../i18n/index.js';
import { initPlaceholderModal } from '../core/modal.js';
import { initDisclaimerModal } from '../core/disclaimer.js';
import { GrassGenerator } from '../core/grass.js';
import { getMeteorShower } from '../core/meteor.js';
import { getStarInteraction } from '../core/stars.js';
import { router } from '../core/router.js';
import VirtualKeyboard from '../core/virtual-keyboard.js';
import { initStandee } from '../core/standee.js';

let virtualKeyboard = null;
let standeeInstances = [];

document.addEventListener('DOMContentLoaded', async () => {
    initTheme();
    initEffects();
    initSmoothScroll();
    await initI18nModule();
    initPlaceholderModal();
    initDisclaimerModal();

    initVirtualKeyboard();
    initStandees();

    initToolCards();

    // 初始化草地系统（仅在 header 内，不改变原有布局）
    const headerEl = document.querySelector('header');
    if (headerEl) {
        // 初始化暗黑主题点击星星特效
        getStarInteraction(headerEl);

        // 创建 GrassGenerator 组件实例，使用默认配置
        const grass = new GrassGenerator(headerEl);
        // 初始生成（浅色主题下）
        grass.generateGrass();

        // 监听主题切换：当 html 的 class 变化时更新草地显示/隐藏
        const html = document.documentElement;
        const observer = new MutationObserver(() => {
            const isDark = html.classList.contains('dark');
            grass.updateTheme(isDark);
        });
        observer.observe(html, { attributes: true, attributeFilter: ['class'] });

        // 暴露接口：便于后续参数调试与扩展
        window.ObscuraGrass = grass;

        // 初始化流星系统（暗黑主题下显示）
        const isDarkInitial = html.classList.contains('dark');
        const meteor = getMeteorShower(headerEl);
        if (isDarkInitial) {
            meteor.start();
        }
        // 监听主题切换：暗黑主题启动流星，浅色主题停止
        const meteorObserver = new MutationObserver(() => {
            const isDark = html.classList.contains('dark');
            if (isDark) {
                meteor.start();
            } else {
                meteor.stop();
            }
        });
        meteorObserver.observe(html, { attributes: true, attributeFilter: ['class'] });
        window.ObscuraMeteor = meteor;
    }
});

function initToolCards() {
    const toolCards = document.querySelectorAll('.tool-card[data-tool]');
    toolCards.forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
            const tool = card.getAttribute('data-tool');
            router.navigate(tool);
        });
    });
}

function initStandees() {
    const standeeContainers = document.querySelectorAll('[data-standee]');
    standeeContainers.forEach(container => {
        const options = {};
        const title = container.getAttribute('data-standee-title');
        const sub = container.getAttribute('data-standee-sub');
        if (title) options.title = title;
        if (sub) options.sub = sub;
        const instance = initStandee(container, options);
        standeeInstances.push(instance);
    });
    window.ObscuraStandeeInstances = standeeInstances;
}

function initVirtualKeyboard() {
    const vkBtn = document.getElementById('vkBtn');
    if (!vkBtn) return;

    if (window.innerWidth <= 768) {
        vkBtn.style.display = 'none';
        return;
    }

    function insertTextToActiveElement(text) {
        const activeElement = document.activeElement;

        if (!activeElement) return false;

        const isEditable =
            activeElement.tagName === 'INPUT' ||
            activeElement.tagName === 'TEXTAREA' ||
            activeElement.isContentEditable;

        if (!isEditable) return false;

        if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
            const start = activeElement.selectionStart;
            const end = activeElement.selectionEnd;
            const value = activeElement.value;

            activeElement.value = value.substring(0, start) + text + value.substring(end);

            const newPos = start + text.length;
            activeElement.setSelectionRange(newPos, newPos);
        } else if (activeElement.isContentEditable) {
            document.execCommand('insertText', false, text);
        }

        activeElement.dispatchEvent(new Event('input', { bubbles: true }));
        activeElement.dispatchEvent(new Event('change', { bubbles: true }));

        return true;
    }

    function handleBackspace() {
        const activeElement = document.activeElement;

        if (!activeElement) return false;

        const isEditable =
            activeElement.tagName === 'INPUT' ||
            activeElement.tagName === 'TEXTAREA' ||
            activeElement.isContentEditable;

        if (!isEditable) return false;

        if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
            const start = activeElement.selectionStart;
            const end = activeElement.selectionEnd;

            if (start === end && start > 0) {
                const value = activeElement.value;
                activeElement.value = value.substring(0, start - 1) + value.substring(end);
                activeElement.setSelectionRange(start - 1, start - 1);
            } else if (start !== end) {
                const value = activeElement.value;
                activeElement.value = value.substring(0, start) + value.substring(end);
                activeElement.setSelectionRange(start, start);
            }
        } else if (activeElement.isContentEditable) {
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                if (range.startOffset > 0) {
                    range.setStart(range.startContainer, range.startOffset - 1);
                    range.deleteContents();
                }
            }
        }

        activeElement.dispatchEvent(new Event('input', { bubbles: true }));
        activeElement.dispatchEvent(new Event('change', { bubbles: true }));

        return true;
    }

    function handleSpecialKey(code, key) {
        const activeElement = document.activeElement;

        if (!activeElement) return false;

        const isEditable =
            activeElement.tagName === 'INPUT' ||
            activeElement.tagName === 'TEXTAREA' ||
            activeElement.isContentEditable;

        if (!isEditable) return false;

        switch (code) {
            case 'Enter':
                if (activeElement.tagName === 'TEXTAREA' || activeElement.isContentEditable) {
                    document.execCommand('insertText', false, '\n');
                } else {
                    activeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', bubbles: true }));
                    activeElement.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', code: 'Enter', bubbles: true }));
                }
                activeElement.dispatchEvent(new Event('change', { bubbles: true }));
                return true;
            case 'Tab':
                document.execCommand('insertText', false, '\t');
                return true;
            case 'Space':
                insertTextToActiveElement(' ');
                return true;
            case 'ArrowLeft':
            case 'ArrowRight':
            case 'ArrowUp':
            case 'ArrowDown':
                return false;
            default:
                return false;
        }
    }

    virtualKeyboard = new VirtualKeyboard({
        visible: false,
        defaultPosition: { x: -20, y: -20 },
        onInput: (data) => {
            const { code, key, state } = data;

            if (code === 'Backspace') {
                handleBackspace();
                return;
            }

            if (handleSpecialKey(code, key)) {
                return;
            }

            let textToInsert = key;

            if (state.shift || state.capsLock) {
                if (key.length === 1 && /[a-z]/.test(key)) {
                    textToInsert = key.toUpperCase();
                }
            }

            if (textToInsert && textToInsert.length > 0) {
                insertTextToActiveElement(textToInsert);
            }
        }
    });

    vkBtn.addEventListener('click', () => {
        virtualKeyboard.toggle();
        vkBtn.classList.toggle('active', virtualKeyboard.keyboardEl.style.display !== 'none');
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth <= 768) {
            vkBtn.style.display = 'none';
            if (virtualKeyboard) {
                virtualKeyboard.hide();
            }
        } else {
            vkBtn.style.display = 'flex';
        }
    });

    window.virtualKeyboard = virtualKeyboard;
}
