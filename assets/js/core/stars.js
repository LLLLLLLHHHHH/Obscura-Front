// StarInteraction: 暗黑主题下 Header 星星点击交互特效
// 设计目标：
// 1) 交互反馈：点击 Header 空白区域生成星星
// 2) 视觉多样性：支持五角星/四棱星，随机大小、旋转、颜色
// 3) 配置化：支持外部修改参数
// 4) 性能优化：防抖、动画结束自动销毁、容器管理

export class StarInteraction {
    /**
     * @param {HTMLElement} headerEl - 目标 header 元素
     * @param {Object} config - 配置对象
     */
    constructor(headerEl, config = {}) {
        this.headerEl = headerEl;
        
        // 默认配置
        this.config = {
            // 防抖间隔 (毫秒)
            debounceMs: 100,
            // 星星大小范围 (像素)
            sizeRange: [10, 20],
            // 动画持续时间范围 (秒)
            durationRange: [0.5, 1.5],
            // 颜色配置 (HSL)
            colors: {
                hueRange: [40, 60],    // 金色/黄色系
                satRange: [80, 100],
                lightRange: [60, 80]
            },
            // 光晕半径范围 (像素)
            glowRadiusRange: [5, 15],
            // 五角星出现的概率 (0-1)，其余为四棱星
            fivePointProbability: 0.5,
            ...config
        };

        this.container = null;
        this._lastClickTime = 0;
        this._boundHandleClick = this._handleClick.bind(this);

        this._init();
    }

    // 初始化
    _init() {
        this._ensureContainer();
        if (this.headerEl) {
            this.headerEl.addEventListener('click', this._boundHandleClick);
        }
    }

    // 创建容器
    _ensureContainer() {
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.className = 'star-interaction-container';
            this.container.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 10;
                overflow: hidden;
            `;
            this.container.setAttribute('aria-hidden', 'true');
            this.headerEl.appendChild(this.container);
        }
    }

    // 处理点击事件
    _handleClick(e) {
        // 仅在暗黑模式下生效
        if (!document.documentElement.classList.contains('dark')) return;

        // 检查点击目标是否为交互元素（避免覆盖按钮点击）
        if (e.target.closest('button') || e.target.closest('a') || e.target.closest('.interactive')) return;

        const now = Date.now();
        if (now - this._lastClickTime < this.config.debounceMs) return;
        this._lastClickTime = now;

        const rect = this.headerEl.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        this._createStar(x, y);
    }

    // 生成随机数
    _rand(min, max) {
        return Math.random() * (max - min) + min;
    }

    // 生成随机星星
    _createStar(x, y) {
        const star = document.createElement('div');
        star.classList.add('star-effect');
        
        // 随机参数
        const size = this._rand(this.config.sizeRange[0], this.config.sizeRange[1]);
        const rotation = this._rand(0, 360);
        const duration = this._rand(this.config.durationRange[0], this.config.durationRange[1]);
        const isFivePoint = Math.random() < this.config.fivePointProbability;
        
        const hue = this._rand(this.config.colors.hueRange[0], this.config.colors.hueRange[1]);
        const sat = this._rand(this.config.colors.satRange[0], this.config.colors.satRange[1]);
        const light = this._rand(this.config.colors.lightRange[0], this.config.colors.lightRange[1]);
        const color = `hsl(${hue}, ${sat}%, ${light}%)`;
        
        const glowRadius = this._rand(this.config.glowRadiusRange[0], this.config.glowRadiusRange[1]);

        // 设置样式
        star.style.left = `${x}px`;
        star.style.top = `${y}px`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        // 使用 CSS 变量控制动画
        star.style.setProperty('--star-rotation', `${rotation}deg`);
        star.style.setProperty('--star-scale', '1');
        star.style.animationDuration = `${duration}s`;

        // 生成 SVG
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("viewBox", "0 0 100 100");
        svg.style.width = "100%";
        svg.style.height = "100%";
        svg.style.overflow = "visible";

        const path = document.createElementNS(svgNS, "path");
        path.setAttribute("d", this._getStarPath(isFivePoint ? 'five-point' : 'four-point'));
        path.setAttribute("fill", color);
        
        // 使用 drop-shadow 实现发光
        path.style.filter = `drop-shadow(0 0 ${glowRadius}px ${color})`;

        svg.appendChild(path);
        star.appendChild(svg);

        this.container.appendChild(star);

        // 动画结束后移除
        star.addEventListener('animationend', () => {
            if (star.parentNode) {
                star.parentNode.removeChild(star);
            }
        });
    }

    // 获取 SVG 路径
    _getStarPath(type) {
        if (type === 'five-point') {
            return "M50 0 L61.8 35.3 L98.8 35.3 L68.8 57.1 L80.3 92.4 L50 70.6 L19.7 92.4 L31.2 57.1 L1.2 35.3 L38.2 35.3 Z";
        } else {
            // 四棱星
            return "M50 0 C55 25 75 45 100 50 C75 55 55 75 50 100 C45 75 25 55 0 50 C25 45 45 25 50 0 Z";
        }
    }

    // 销毁实例
    destroy() {
        if (this.headerEl) {
            this.headerEl.removeEventListener('click', this._boundHandleClick);
        }
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
        this.container = null;
    }
}

// 单例实例
let _instance = null;

/**
 * 获取 StarInteraction 单例
 * @param {HTMLElement} headerEl - header 元素
 * @param {Object} config - 配置
 * @returns {StarInteraction}
 */
export function getStarInteraction(headerEl, config) {
    if (!_instance && headerEl) {
        _instance = new StarInteraction(headerEl, config);
    }
    return _instance;
}

/**
 * 销毁单例
 */
export function destroyStarInteraction() {
    if (_instance) {
        _instance.destroy();
        _instance = null;
    }
}
