// GrassGenerator 组件：在 header 内生成卡通风格的草地
// 设计目标：
// 1) 高性能：对象池复用、一次性动画、避免频繁创建销毁
// 2) 可配置：草地密度、颜色范围、生长速度、弯曲强度等参数可调
// 3) 组件化：提供 generateGrass、updateTheme、setDensity、setGrowthSpeed 等接口
// 4) 视觉：卡通感，叶片稀疏分布，不从一个点挤出，符合自然过渡

export class GrassGenerator {
    /**
     * @param {HTMLElement} headerEl - 目标 header 元素
     * @param {Object} config - 配置项
     */
    constructor(headerEl, config = {}) {
        this.headerEl = headerEl;
        // 默认配置范围，确保随机值符合自然视觉效果
        this.config = {
            densityRange: [80, 150],          // 每次生成簇数量范围
            bladesPerClusterRange: [5, 8],   // 每簇草的叶片数量范围
            scaleRange: [0.7, 1.0],          // 调小整体缩放，避免草过大
            hueRange: [60, 135],             // 绿色系 H 值范围（HSL）
            satRange: [60, 85],              // 饱和度范围
            lightRange: [15, 55],            // 亮度范围
            growthDurationRange: [1.0, 5.0], // 生长动画完成时间（秒）
            bendDegRange: [15, 30],          // 弯曲强度范围（度）
            baseSpreadPx: 6,                 // 每簇基底点稀疏半径（像素），避免从同一点挤出
            headerPaddingBottom: 0,          // 基底贴合 header 底部，无额外上移
            ...config
        };

        // 画布与上下文
        this.canvas = null;
        this.ctx = null;

        // 对象池：预先创建最大可能数量的 Blade 实例，重复使用以降低 GC 压力
        this.maxClusters = this.config.densityRange[1];
        this.maxBladesPerCluster = this.config.bladesPerClusterRange[1];
        this.maxBlades = this.maxClusters * this.maxBladesPerCluster;
        this.bladePool = new Array(this.maxBlades);
        for (let i = 0; i < this.maxBlades; i++) this.bladePool[i] = this._createEmptyBlade();

        // 当前帧使用的叶片计数
        this.poolIndex = 0;

        // 数据结构：簇与叶片
        this.clusters = [];
        this.animating = false;
        this._raf = null;
        this._lastTs = 0;

        // 主题状态：浅色显示，暗色隐藏
        this.isDark = document.documentElement.classList.contains('dark');
        this._ensureCanvas();
    }

    // 创建空叶片占位，供对象池使用
    _createEmptyBlade() {
        return {
            x: 0, y: 0,              // 基底坐标
            length: 0, width: 0,     // 叶片长度/宽度（像素）
            bendDeg: 0,              // 弯曲度（度），用于计算二次贝塞尔控制点
            angleDeg: 0,             // 初始朝向角度（度）
            color: 'hsl(120,70%,50%)',
            progress: 0,             // 生长进度 [0,1]
            growthDuration: 1.0,     // 单片生长时长（秒），由簇统一设置
            scale: 1.0,              // 随簇缩放
        };
    }

    // 确保在 header 内部存在画布，并设置尺寸与样式
    _ensureCanvas() {
        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
            this.canvas.className = 'grass-canvas';
            this.canvas.setAttribute('aria-hidden', 'true');
            this.headerEl.appendChild(this.canvas);
            this.ctx = this.canvas.getContext('2d');
        }
        // 根据 header 当前大小适配画布尺寸
        const rect = this.headerEl.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        this.canvas.width = Math.floor(rect.width * dpr);
        this.canvas.height = Math.floor(rect.height * dpr);
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    // 工具：在范围内生成随机数（浮点）
    _rand(min, max) { return min + Math.random() * (max - min); }

    // 工具：在范围内生成随机整数
    _randInt(min, max) { return Math.floor(this._rand(min, max + 1)); }

    // 工具：生成 HSL 颜色字符串
    _randHsl() {
        const h = this._rand(this.config.hueRange[0], this.config.hueRange[1]);
        const s = this._rand(this.config.satRange[0], this.config.satRange[1]);
        const l = this._rand(this.config.lightRange[0], this.config.lightRange[1]);
        return `hsl(${h}, ${s}%, ${l}%)`;
    }

    // 生成一个草簇的布局方案（分布模式）
    _chooseLayout(bladeCount) {
        // 支持的模式：三瓣左右中、扇形、圆形、不对称
        const modes = ['three', 'fan', 'circle', 'asym'];
        // 3 片倾向用 three
        if (bladeCount === 3) return 'three';
        return modes[this._randInt(0, modes.length - 1)];
    }

    // 根据布局模式生成每片的角度与基底偏移，确保“不要从一个点挤出”
    _layoutBlades(bladeCount, baseX, baseY, scale) {
        const blades = [];
        const spread = this.config.baseSpreadPx * scale; // 基底稀疏半径随缩放变化
        const bendMin = this.config.bendDegRange[0];
        const bendMax = this.config.bendDegRange[1];
        const layout = this._chooseLayout(bladeCount);

        if (layout === 'three') {
            // 三瓣：左-中-右，左/右分别弯曲 15-30 度，中间直或±5 度微倾斜
            const angles = [-this._rand(15, 30), this._rand(-5, 5), this._rand(15, 30)];
            for (let i = 0; i < 3; i++) {
                const offsetX = this._rand(-spread, spread);
                blades.push({ angleDeg: angles[i], bendDeg: Math.abs(angles[i]), offsetX });
            }
        } else if (layout === 'fan') {
            // 扇形：中心左右展开，角度从 -30~30 均匀或随机分布
            const start = -30, end = 30;
            for (let i = 0; i < bladeCount; i++) {
                const t = bladeCount === 1 ? 0.5 : i / (bladeCount - 1);
                const angle = start + t * (end - start) + this._rand(-5, 5); // 微随机
                const offsetX = this._rand(-spread, spread);
                const bend = this._rand(bendMin, bendMax);
                blades.push({ angleDeg: angle, bendDeg: bend, offsetX });
            }
        } else if (layout === 'circle') {
            // 圆形：围绕中心均匀分布，角度 360 度分段，但草从底部长出，这里使用较小正角偏向上
            for (let i = 0; i < bladeCount; i++) {
                const angle = this._rand(-20, 20) + (i % 2 === 0 ? -10 : 10); // 保持向上偏移
                const offsetX = this._rand(-spread, spread);
                const bend = this._rand(bendMin, bendMax);
                blades.push({ angleDeg: angle, bendDeg: bend, offsetX });
            }
        } else {
            // 不对称：随机角度与偏移，整体向上但左右不平衡
            for (let i = 0; i < bladeCount; i++) {
                const angle = this._rand(-35, 35);
                const offsetX = this._rand(-spread, spread * 1.2);
                const bend = this._rand(bendMin, bendMax);
                blades.push({ angleDeg: angle, bendDeg: bend, offsetX });
            }
        }

        // 转换为实际 Blade 属性（基底坐标，长度/宽度，颜色等）
        const results = [];
        for (let i = 0; i < blades.length; i++) {
            const blade = this._getBladeFromPool();
            // 基底坐标贴底部：从 header 的边框线处生长
            blade.x = baseX + blades[i].offsetX;
            blade.y = baseY - this.config.headerPaddingBottom;
            blade.length = this._rand(18, 36) * scale; // 叶片长度（调小）
            blade.width = this._rand(3, 6) * scale;    // 叶片宽度（调小）
            blade.bendDeg = blades[i].bendDeg;         // 弯曲度用于控制点偏移
            blade.angleDeg = blades[i].angleDeg;       // 初始方向角
            blade.color = this._randHsl();             // 卡通绿色系
            blade.progress = 0;
            results.push(blade);
        }
        return results;
    }

    // 从对象池获取一个叶片实例
    _getBladeFromPool() {
        if (this.poolIndex >= this.bladePool.length) {
            // 超出上限时复用第一个（极端情况下），避免创建新对象
            this.poolIndex = 0;
        }
        return this.bladePool[this.poolIndex++];
    }

    // 生成草地（一次性动画 -> 持久化）
    generateGrass() {
        this._ensureCanvas();
        if (this.isDark) {
            // 暗色主题下不生成
            this._clearCanvas();
            return;
        }

        // 重置
        this.clusters.length = 0;
        this.poolIndex = 0;
        this._clearCanvas();

        const rect = this.headerEl.getBoundingClientRect();
        const clusterCount = this._randInt(this.config.densityRange[0], this.config.densityRange[1]);

        for (let c = 0; c < clusterCount; c++) {
            const scale = this._rand(this.config.scaleRange[0], this.config.scaleRange[1]);
            const bladesPerCluster = this._randInt(this.config.bladesPerClusterRange[0], this.config.bladesPerClusterRange[1]);
            // 簇的水平位置分布在 header 宽度范围内，略远离左右边缘
            const baseX = this._rand(rect.width * 0.05, rect.width * 0.95);
            // 基底对齐底部边框线（1px），避免悬空
            const baseY = rect.height - 1;
            const blades = this._layoutBlades(bladesPerCluster, baseX, baseY, scale);
            const growthDuration = this._rand(this.config.growthDurationRange[0], this.config.growthDurationRange[1]);
            for (const b of blades) b.growthDuration = growthDuration;
            this.clusters.push({ blades, scale, done: false });
        }

        // 启动一次性生长动画
        this.animating = true;
        this._lastTs = 0;
        const step = (ts) => {
            if (!this.animating) return;
            if (!this._lastTs) this._lastTs = ts;
            const dt = (ts - this._lastTs) / 1000; // 秒
            this._lastTs = ts;
            let allDone = true;
            this._clearCanvas();
            for (const cluster of this.clusters) {
                let clusterDone = true;
                for (const blade of cluster.blades) {
                    // 生长进度推进（不同叶片共享簇的生长时长）
                    if (blade.progress < 1) {
                        blade.progress = Math.min(1, blade.progress + dt / blade.growthDuration);
                        clusterDone = false;
                        allDone = false;
                    }
                    this._drawBlade(blade);
                }
                cluster.done = clusterDone;
            }
            if (!allDone) {
                this._raf = requestAnimationFrame(step);
            } else {
                // 完成后停止动画，画面保持（持久化）
                this.animating = false;
                this._raf = null;
            }
        };
        this._raf = requestAnimationFrame(step);
    }

    // 通过二次贝塞尔曲线绘制单片叶子，考虑长度、宽度、弯曲度的自然过渡
    _drawBlade(blade) {
        const ctx = this.ctx;
        const baseX = blade.x;
        const baseY = blade.y;

        // 进度控制高度（卡通感：生长时从根部向上逐渐延伸）
        const length = blade.length * blade.progress;
        const width = blade.width * Math.max(0.4, blade.progress); // 逐渐变宽但保持柔和

        // 将角度与弯曲度换算为控制点偏移，公式：
        // 控制点位置 = 末端点的 50% 处，沿着垂直方向偏移 bend，水平方向基于 angleDeg
        const angleRad = (blade.angleDeg * Math.PI) / 180;
        const bendRad = (blade.bendDeg * Math.PI) / 180;

        // 顶点坐标（朝向角度）
        const tipX = baseX + Math.sin(angleRad) * length;
        const tipY = baseY - Math.cos(angleRad) * length;

        // 控制点（位于叶片中段），沿垂直方向弯曲偏移，随宽度与弯曲度平滑过渡
        const midX = baseX + Math.sin(angleRad) * (length * 0.5);
        const midY = baseY - Math.cos(angleRad) * (length * 0.5);
        const ctrlX = midX + Math.sin(angleRad + bendRad) * (width * 0.8);
        const ctrlY = midY - Math.cos(angleRad + bendRad) * (width * 0.8);

        // 叶片轮廓：左右两条二次贝塞尔形成闭合路径，生成卡通叶片
        ctx.beginPath();
        // 左侧边
        ctx.moveTo(baseX, baseY);
        ctx.quadraticCurveTo(ctrlX - width * 0.5, ctrlY, tipX, tipY);
        // 右侧边
        ctx.quadraticCurveTo(ctrlX + width * 0.5, ctrlY, baseX, baseY);
        ctx.closePath();

        // 填充与描边（卡通风格：高饱和绿+略深描边）
        ctx.fillStyle = blade.color;
        ctx.strokeStyle = 'rgba(40, 80, 40, 0.6)';
        ctx.lineWidth = 1;
        ctx.fill();
        ctx.stroke();

        // 简单高光：增加卡通质感
        ctx.beginPath();
        ctx.moveTo(baseX, baseY);
        ctx.quadraticCurveTo(ctrlX, ctrlY, tipX, tipY);
        ctx.strokeStyle = 'rgba(255,255,255,0.12)';
        ctx.lineWidth = 0.6;
        ctx.stroke();
    }

    // 清空画布
    _clearCanvas() {
        if (!this.ctx) return;
        const rect = this.headerEl.getBoundingClientRect();
        this.ctx.clearRect(0, 0, rect.width, rect.height);
    }

    // 主题更新：浅色显示，暗色隐藏
    updateTheme(isDark) {
        this.isDark = !!isDark;
        if (this.isDark) {
            // 暗色主题：清空并隐藏画布（持久化终止）
            if (this._raf) cancelAnimationFrame(this._raf);
            this.animating = false;
            this._raf = null;
            this._clearCanvas();
            if (this.canvas) this.canvas.style.visibility = 'hidden';
        } else {
            // 浅色主题：显示并重新生成草地
            if (this.canvas) this.canvas.style.visibility = 'visible';
            this.generateGrass();
        }
    }

    // 参数化：设置草地密度（簇数量范围的上限/固定值）
    setDensity(density) {
        // density 可为整数：固定簇数量；或对象 {min, max}
        if (typeof density === 'number') {
            const n = Math.max(1, Math.min(40, density));
            this.config.densityRange = [n, n];
        } else if (density && typeof density === 'object') {
            const min = Math.max(1, density.min || this.config.densityRange[0]);
            const max = Math.max(min, Math.min(60, density.max || this.config.densityRange[1]));
            this.config.densityRange = [min, max];
        }
    }

    // 参数化：设置生长速度（秒），可为固定值或范围
    setGrowthSpeed(speed) {
        if (typeof speed === 'number') {
            const s = Math.max(0.2, Math.min(5.0, speed));
            this.config.growthDurationRange = [s, s];
        } else if (speed && typeof speed === 'object') {
            const min = Math.max(0.2, speed.min || this.config.growthDurationRange[0]);
            const max = Math.max(min, Math.min(6.0, speed.max || this.config.growthDurationRange[1]));
            this.config.growthDurationRange = [min, max];
        }
    }

    // 参数化：设置颜色范围（HSL 的 H、S、L 范围）
    setColorRange({ hue, sat, light }) {
        if (hue) this.config.hueRange = [hue.min ?? this.config.hueRange[0], hue.max ?? this.config.hueRange[1]];
        if (sat) this.config.satRange = [sat.min ?? this.config.satRange[0], sat.max ?? this.config.satRange[1]];
        if (light) this.config.lightRange = [light.min ?? this.config.lightRange[0], light.max ?? this.config.lightRange[1]];
    }

    // 参数化：设置弯曲强度（度）
    setBendStrength({ min, max }) {
        const a = Math.max(5, min ?? this.config.bendDegRange[0]);
        const b = Math.max(a, Math.min(60, max ?? this.config.bendDegRange[1]));
        this.config.bendDegRange = [a, b];
    }
}