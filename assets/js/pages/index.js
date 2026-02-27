import { initTheme } from '../core/theme.js';
import { initEffects } from '../core/effects.js';
import { initSmoothScroll } from '../core/utils.js';
import { initI18nModule } from '../i18n/index.js';
import { initDevModal } from '../core/modal.js';
import { GrassGenerator } from '../core/grass.js';
import { getMeteorShower } from '../core/meteor.js';

document.addEventListener('DOMContentLoaded', async () => {
    initTheme();
    initEffects();
    initSmoothScroll();
    await initI18nModule();
    initDevModal();
    // 初始化草地系统（仅在 header 内，不改变原有布局）
    const headerEl = document.querySelector('header');
    if (headerEl) {
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