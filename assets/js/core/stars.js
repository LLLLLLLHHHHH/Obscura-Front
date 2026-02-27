// assets/js/core/stars.js
// 暗黑主题 Header 星星交互特效

export class StarInteraction {
    constructor(headerEl) {
        this.headerEl = headerEl;
        this.lastClickTime = 0;
        this.minInterval = 100; // 最小间隔 100ms，防抖
        this.init();
    }

    init() {
        if (!this.headerEl) return;
        this.headerEl.addEventListener('click', (e) => this.handleClick(e));
    }

    handleClick(e) {
        // 仅在暗黑模式下生效
        if (!document.documentElement.classList.contains('dark')) return;

        // 检查点击目标是否为 header 本身或其直接子元素（空白区域），避免覆盖按钮点击
        // 这里简单判断：如果是按钮或链接，则忽略
        if (e.target.closest('button') || e.target.closest('a') || e.target.closest('.interactive')) return;

        const now = Date.now();
        if (now - this.lastClickTime < this.minInterval) return;
        this.lastClickTime = now;

        const rect = this.headerEl.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        this.createStar(x, y);
    }

    createStar(x, y) {
        const star = document.createElement('div');
        star.classList.add('star-effect');
        
        // 随机参数
        const size = this.random(20, 50); // 大小 20-50px
        const rotation = this.random(0, 360); // 初始旋转
        const duration = this.random(0.5, 1.5); // 动画持续时间 0.5-1.5s
        const type = Math.random() > 0.5 ? 'five-point' : 'four-point'; // 五角星或四棱星
        const colorHue = this.random(40, 60); // 金色/黄色系
        const colorSat = this.random(80, 100);
        const colorLight = this.random(60, 80);
        const glowRadius = this.random(5, 15); // 光晕半径

        // 设置样式
        star.style.left = `${x}px`;
        star.style.top = `${y}px`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        // 使用 CSS 变量控制动画中的旋转和缩放
        star.style.setProperty('--star-rotation', `${rotation}deg`);
        star.style.setProperty('--star-scale', '1');
        star.style.animationDuration = `${duration}s`;
        
        // 生成 SVG
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("viewBox", "0 0 100 100");
        svg.style.width = "100%";
        svg.style.height = "100%";
        svg.style.overflow = "visible"; // 允许光晕溢出

        const path = document.createElementNS(svgNS, "path");
        path.setAttribute("d", this.getStarPath(type));
        path.setAttribute("fill", `hsl(${colorHue}, ${colorSat}%, ${colorLight}%)`);
        
        // 添加发光滤镜
        const filterId = `glow-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const defs = document.createElementNS(svgNS, "defs");
        const filter = document.createElementNS(svgNS, "filter");
        filter.setAttribute("id", filterId);
        filter.setAttribute("x", "-50%");
        filter.setAttribute("y", "-50%");
        filter.setAttribute("width", "200%");
        filter.setAttribute("height", "200%");
        
        const feGaussianBlur = document.createElementNS(svgNS, "feGaussianBlur");
        feGaussianBlur.setAttribute("in", "SourceGraphic");
        feGaussianBlur.setAttribute("stdDeviation", glowRadius / 5); // 模糊量
        
        filter.appendChild(feGaussianBlur);
        defs.appendChild(filter);
        svg.appendChild(defs);
        
        // 组合：原图形 + 发光层（或者是直接给路径加 drop-shadow，SVG滤镜更灵活）
        // 这里简单点，直接用 CSS drop-shadow 或者 SVG filter
        // 实际上 CSS drop-shadow 性能更好且简单
        path.style.filter = `drop-shadow(0 0 ${glowRadius}px hsl(${colorHue}, ${colorSat}%, ${colorLight}%))`;

        svg.appendChild(path);
        star.appendChild(svg);

        this.headerEl.appendChild(star);

        // 动画结束后移除
        star.addEventListener('animationend', () => {
            star.remove();
        });
    }

    getStarPath(type) {
        if (type === 'five-point') {
            // 五角星路径
            return "M50 0 L61.8 35.3 L98.8 35.3 L68.8 57.1 L80.3 92.4 L50 70.6 L19.7 92.4 L31.2 57.1 L1.2 35.3 L38.2 35.3 Z";
        } else {
            // 四棱星路径 (类似菱形但内凹)
            return "M50 0 C55 25 75 45 100 50 C75 55 55 75 50 100 C45 75 25 55 0 50 C25 45 45 25 50 0 Z";
        }
    }

    random(min, max) {
        return Math.random() * (max - min) + min;
    }
}
