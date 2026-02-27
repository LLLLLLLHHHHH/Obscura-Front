// GrassGenerator 组件：在 header 内生成卡通风格的草地
// 设计目标：
// 1) 高性能：对象池复用、一次性动画、避免频繁创建销毁
// 2) 可配置：草地密度、颜色范围、生长速度、弯曲强度等参数可调
// 3) 组件化：提供 generateGrass、updateTheme、setDensity、setGrowthSpeed 等接口
// 4) 视觉：卡通感，叶片稀疏分布，不从一个点挤出，符合自然过渡
// 5) 交互：鼠标触碰、滑动、分级响应、效果衰减

export class GrassGenerator {
    /**
     * @param {HTMLElement} headerEl - 目标 header 元素
     * @param {Object} config - 配置项
     */
    constructor(headerEl, config = {}) {
        this.headerEl = headerEl;
        // 默认配置范围，确保随机值符合自然视觉效果
        this.config = {
            // 草地密度范围（簇数量）
            densityRange: [80, 150],
            // 每簇草的叶片数量范围
            bladesPerClusterRange: [5, 8],
            // 整体缩放范围
            scaleRange: [0.7, 1.0],
            // 绿色系 H 值范围（HSL）
            hueRange: [60, 135],
            // 饱和度范围
            satRange: [60, 85],
            // 亮度范围
            lightRange: [15, 55],
            // 生长动画完成时间（秒）
            growthDurationRange: [1.0, 5.0],
            // 弯曲强度范围（度）
            bendDegRange: [15, 30],
            // 每簇基底点稀疏半径（像素）
            baseSpreadPx: 6,
            // 基底贴合 header 底部，无额外上移
            headerPaddingBottom: 0,
            // 交互相关配置
            interaction: {
                // 是否启用交互
                enabled: true,
                // 鼠标感应半径（像素）
                radius: 60,
                // 速度阈值（像素/秒）：低于 slow 为轻微，高于 fast 为强烈
                velocityThreshold: { slow: 2, medium: 8, fast: 20 },
                // 分级响应配置
                responseLevels: {
                    // 轻微：慢速移动
                    light: { bendMultiplier: 0.3, decayTime: 0.5 },
                    // 明显：中等速度
                    medium: { bendMultiplier: 0.6, decayTime: 1.0 },
                    // 强烈：快速滑动
                    heavy: { bendMultiplier: 1.0, decayTime: 1.5 }
                },
                // 效果衰减时间范围（秒）
                decayRange: [0.5, 1.5],
                // 鼠标方向对草的影响系数（0-1）
                directionInfluence: 0.7,
                // 最大弯曲角度（度）
                maxBendAngle: 60,
                // 阻尼系数（越小停得越快）
                dampingFactor: 0.92,
                // 刚度系数（越大回弹越快）
                stiffness: 0.15
            },
            ...config
        };

        this.canvas = null;
        this.ctx = null;

        this.maxClusters = this.config.densityRange[1];
        this.maxBladesPerCluster = this.config.bladesPerClusterRange[1];
        this.maxBlades = this.maxClusters * this.maxBladesPerCluster;
        this.bladePool = new Array(this.maxBlades);
        for (let i = 0; i < this.maxBlades; i++) this.bladePool[i] = this._createEmptyBlade();

        this.poolIndex = 0;

        this.clusters = [];
        this.animating = false;
        this._raf = null;
        this._lastTs = 0;

        this.isDark = document.documentElement.classList.contains('dark');
        this._ensureCanvas();

        this._resizeTimeout = null;
        window.addEventListener('resize', () => {
            if (this._resizeTimeout) clearTimeout(this._resizeTimeout);
            this._resizeTimeout = setTimeout(() => {
                this._ensureCanvas();
                if (!this.isDark) {
                    this.generateGrass();
                }
            }, 200);
        });

        this._initInteraction();
    }

    _createEmptyBlade() {
        return {
            x: 0, y: 0,
            length: 0, width: 0,
            bendDeg: 0,
            angleDeg: 0,
            color: 'hsl(120,70%,50%)',
            progress: 0,
            growthDuration: 1.0,
            scale: 1.0,
            // 交互相关属性
            velocityX: 0,
            velocityY: 0,
            bendOffset: 0,
            bendVelocity: 0,
            isInteracting: false,
            interactionTime: 0,
            lastMouseX: 0,
            lastMouseY: 0,
            lastMouseTime: 0
        };
    }

    _ensureCanvas() {
        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
            this.canvas.className = 'grass-canvas';
            this.canvas.setAttribute('aria-hidden', 'true');
            this.headerEl.appendChild(this.canvas);
            this.ctx = this.canvas.getContext('2d');
        }
        const rect = this.headerEl.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        this.canvas.width = Math.floor(rect.width * dpr);
        this.canvas.height = Math.floor(rect.height * dpr);
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    _rand(min, max) { return min + Math.random() * (max - min); }
    _randInt(min, max) { return Math.floor(this._rand(min, max + 1)); }

    _randHsl() {
        const h = this._rand(this.config.hueRange[0], this.config.hueRange[1]);
        const s = this._rand(this.config.satRange[0], this.config.satRange[1]);
        const l = this._rand(this.config.lightRange[0], this.config.lightRange[1]);
        return `hsl(${h}, ${s}%, ${l}%)`;
    }

    _chooseLayout(bladeCount) {
        const modes = ['three', 'fan', 'circle', 'asym'];
        if (bladeCount === 3) return 'three';
        return modes[this._randInt(0, modes.length - 1)];
    }

    _layoutBlades(bladeCount, baseX, baseY, scale) {
        const blades = [];
        const spread = this.config.baseSpreadPx * scale;
        const bendMin = this.config.bendDegRange[0];
        const bendMax = this.config.bendDegRange[1];
        const layout = this._chooseLayout(bladeCount);

        if (layout === 'three') {
            const angles = [-this._rand(15, 30), this._rand(-5, 5), this._rand(15, 30)];
            for (let i = 0; i < 3; i++) {
                const offsetX = this._rand(-spread, spread);
                blades.push({ angleDeg: angles[i], bendDeg: Math.abs(angles[i]), offsetX });
            }
        } else if (layout === 'fan') {
            const start = -30, end = 30;
            for (let i = 0; i < bladeCount; i++) {
                const t = bladeCount === 1 ? 0.5 : i / (bladeCount - 1);
                const angle = start + t * (end - start) + this._rand(-5, 5);
                const offsetX = this._rand(-spread, spread);
                const bend = this._rand(bendMin, bendMax);
                blades.push({ angleDeg: angle, bendDeg: bend, offsetX });
            }
        } else if (layout === 'circle') {
            for (let i = 0; i < bladeCount; i++) {
                const angle = this._rand(-20, 20) + (i % 2 === 0 ? -10 : 10);
                const offsetX = this._rand(-spread, spread);
                const bend = this._rand(bendMin, bendMax);
                blades.push({ angleDeg: angle, bendDeg: bend, offsetX });
            }
        } else {
            for (let i = 0; i < bladeCount; i++) {
                const angle = this._rand(-35, 35);
                const offsetX = this._rand(-spread * 1.2, spread * 1.2);
                const bend = this._rand(bendMin, bendMax);
                blades.push({ angleDeg: angle, bendDeg: bend, offsetX });
            }
        }

        const results = [];
        for (let i = 0; i < blades.length; i++) {
            const blade = this._getBladeFromPool();
            blade.x = baseX + blades[i].offsetX;
            blade.y = baseY - this.config.headerPaddingBottom;
            blade.length = this._rand(18, 36) * scale;
            blade.width = this._rand(3, 6) * scale;
            blade.bendDeg = blades[i].bendDeg;
            blade.angleDeg = blades[i].angleDeg;
            blade.color = this._randHsl();
            blade.progress = 0;
            blade.velocityX = 0;
            blade.velocityY = 0;
            blade.bendOffset = 0;
            blade.bendVelocity = 0;
            blade.isInteracting = false;
            blade.interactionTime = 0;
            blade.lastMouseX = 0;
            blade.lastMouseY = 0;
            blade.lastMouseTime = 0;
            results.push(blade);
        }
        return results;
    }

    _getBladeFromPool() {
        if (this.poolIndex >= this.bladePool.length) {
            this.poolIndex = 0;
        }
        return this.bladePool[this.poolIndex++];
    }

    _initInteraction() {
        this.growthComplete = false;
        this.mouseX = -1000;
        this.mouseY = -1000;
        this.lastMouseX = -1000;
        this.lastMouseY = -1000;
        this.lastMouseTime = 0;
        this.mouseVelocity = 0;
        this.mouseDirection = 0;
        this.isMouseOver = false;

        if (!this.config.interaction?.enabled) return;

        this.canvas.addEventListener('mouseenter', (e) => {
            this.isMouseOver = true;
            this._updateMousePos(e);
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.isMouseOver = false;
            this.mouseX = -1000;
            this.mouseY = -1000;
        });

        this.canvas.addEventListener('mousemove', (e) => {
            if (!this.growthComplete) return;
            this._updateMousePos(e);
        });
    }

    _updateMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const now = performance.now();

        if (this.lastMouseTime > 0) {
            const dt = (now - this.lastMouseTime) / 1000;
            if (dt > 0) {
                const dx = x - this.lastMouseX;
                const dy = y - this.lastMouseY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                this.mouseVelocity = dist / dt;
                this.mouseDirection = Math.atan2(dy, dx);
            }
        }

        this.lastMouseX = this.mouseX;
        this.lastMouseY = this.mouseY;
        this.mouseX = x;
        this.mouseY = y;
        this.lastMouseTime = now;
    }

    _getVelocityLevel() {
        const vt = this.config.interaction.velocityThreshold;
        if (this.mouseVelocity < vt.slow) return 'light';
        if (this.mouseVelocity < vt.medium) return 'medium';
        return 'heavy';
    }

    _calculateInteraction(blade, dt) {
        if (!this.config.interaction?.enabled || !this.growthComplete) return;

        const conf = this.config.interaction;
        const dx = blade.x - this.mouseX;
        const dy = blade.y - this.mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < conf.radius) {
            const influence = 1 - (dist / conf.radius);
            const level = this._getVelocityLevel();
            const levelConfig = conf.responseLevels[level];

            const directionDiff = this.mouseDirection - (blade.angleDeg * Math.PI / 180);
            const dirFactor = Math.sin(directionDiff) * conf.directionInfluence;

            const targetBend = dirFactor * conf.maxBendAngle * influence * levelConfig.bendMultiplier;

            blade.bendVelocity += (targetBend - blade.bendOffset) * conf.stiffness * influence;
            blade.bendVelocity *= conf.dampingFactor;
            blade.bendOffset += blade.bendVelocity * dt * 60;

            blade.isInteracting = true;
            blade.interactionTime += dt;
        } else {
            if (blade.isInteracting) {
                const decayTime = conf.responseLevels[
                    blade.interactionTime < 0.3 ? 'light' :
                    blade.interactionTime < 0.8 ? 'medium' : 'heavy'
                ].decayTime;

                blade.bendVelocity -= blade.bendOffset * (1 / decayTime) * dt;
                blade.bendVelocity *= conf.dampingFactor;
                blade.bendOffset += blade.bendVelocity * dt * 60;

                if (Math.abs(blade.bendOffset) < 0.1 && Math.abs(blade.bendVelocity) < 0.1) {
                    blade.bendOffset = 0;
                    blade.bendVelocity = 0;
                    blade.isInteracting = false;
                    blade.interactionTime = 0;
                }
            }
        }
    }

    generateGrass() {
        if (this._raf) {
            cancelAnimationFrame(this._raf);
            this._raf = null;
        }

        this._ensureCanvas();
        this.growthComplete = false;

        if (this.isDark) {
            this._clearCanvas();
            return;
        }

        this.clusters.length = 0;
        this.poolIndex = 0;
        this._clearCanvas();

        const rect = this.headerEl.getBoundingClientRect();

        const baseWidth = 1440;
        const widthRatio = rect.width / baseWidth;
        const minDensity = Math.max(5, Math.floor(this.config.densityRange[0] * widthRatio));
        const maxDensity = Math.max(10, Math.floor(this.config.densityRange[1] * widthRatio));

        const clusterCount = this._randInt(minDensity, maxDensity);

        for (let c = 0; c < clusterCount; c++) {
            const scale = this._rand(this.config.scaleRange[0], this.config.scaleRange[1]);
            const bladesPerCluster = this._randInt(this.config.bladesPerClusterRange[0], this.config.bladesPerClusterRange[1]);
            const baseX = this._rand(rect.width * 0.05, rect.width * 0.95);
            const baseY = rect.height - 1;
            const blades = this._layoutBlades(bladesPerCluster, baseX, baseY, scale);
            const growthDuration = this._rand(this.config.growthDurationRange[0], this.config.growthDurationRange[1]);
            for (const b of blades) b.growthDuration = growthDuration;
            this.clusters.push({ blades, scale, done: false });
        }

        this.animating = true;
        this._lastTs = 0;
        const step = (ts) => {
            if (!this.animating) return;
            if (!this._lastTs) this._lastTs = ts;
            const dt = (ts - this._lastTs) / 1000;
            this._lastTs = ts;
            let allDone = true;
            this._clearCanvas();
            for (const cluster of this.clusters) {
                let clusterDone = true;
                for (const blade of cluster.blades) {
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
                this.animating = false;
                this._raf = null;
                this.growthComplete = true;
                this._startIdleAnimation();
            }
        };
        this._raf = requestAnimationFrame(step);
    }

    _drawBlade(blade) {
        const ctx = this.ctx;
        const baseX = blade.x;
        const baseY = blade.y;

        const length = blade.length * blade.progress;
        const width = blade.width * Math.max(0.4, blade.progress);

        const angleRad = (blade.angleDeg * Math.PI) / 180;
        const bendRad = (blade.bendDeg * Math.PI) / 180;

        const tipX = baseX + Math.sin(angleRad) * length;
        const tipY = baseY - Math.cos(angleRad) * length;

        const midX = baseX + Math.sin(angleRad) * (length * 0.5);
        const midY = baseY - Math.cos(angleRad) * (length * 0.5);

        let ctrlX = midX + Math.sin(angleRad + bendRad) * (width * 0.8);
        let ctrlY = midY - Math.cos(angleRad + bendRad) * (width * 0.8);

        if (blade.progress >= 1 && blade.bendOffset !== 0) {
            const bendOffsetRad = (blade.bendOffset * Math.PI) / 180;
            ctrlX += Math.sin(bendOffsetRad) * length * 0.3;
            ctrlY -= Math.cos(bendOffsetRad) * length * 0.3 * 0.5;
        }

        ctx.beginPath();
        ctx.moveTo(baseX, baseY);
        ctx.quadraticCurveTo(ctrlX - width * 0.5, ctrlY, tipX, tipY);
        ctx.quadraticCurveTo(ctrlX + width * 0.5, ctrlY, baseX, baseY);
        ctx.closePath();

        ctx.fillStyle = blade.color;
        ctx.strokeStyle = 'rgba(40, 80, 40, 0.6)';
        ctx.lineWidth = 1;
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(baseX, baseY);
        ctx.quadraticCurveTo(ctrlX, ctrlY, tipX, tipY);
        ctx.strokeStyle = 'rgba(255,255,255,0.12)';
        ctx.lineWidth = 0.6;
        ctx.stroke();
    }

    _clearCanvas() {
        if (!this.ctx) return;
        const rect = this.headerEl.getBoundingClientRect();
        this.ctx.clearRect(0, 0, rect.width, rect.height);
    }

    _startIdleAnimation() {
        if (!this.config.interaction?.enabled || !this.growthComplete) return;

        let lastTime = 0;
        const animate = (ts) => {
            if (!this.growthComplete) return;

            const dt = lastTime === 0 ? 0.016 : Math.min((ts - lastTime) / 1000, 0.1);
            lastTime = ts;

            this._clearCanvas();
            for (const cluster of this.clusters) {
                for (const blade of cluster.blades) {
                    if (blade.progress < 1) continue;
                    this._calculateInteraction(blade, dt);
                    this._drawBlade(blade);
                }
            }

            this._idleRaf = requestAnimationFrame(animate);
        };

        this._idleRaf = requestAnimationFrame(animate);
    }

    _stopIdleAnimation() {
        if (this._idleRaf) {
            cancelAnimationFrame(this._idleRaf);
            this._idleRaf = null;
        }
    }

    updateTheme(isDark) {
        this.isDark = !!isDark;
        if (this.isDark) {
            if (this._raf) cancelAnimationFrame(this._raf);
            this.animating = false;
            this._raf = null;
            this._stopIdleAnimation();
            this.growthComplete = false;
            this._clearCanvas();
            if (this.canvas) this.canvas.style.visibility = 'hidden';
        } else {
            if (this.canvas) this.canvas.style.visibility = 'visible';
            this.generateGrass();
        }
    }

    setDensity(density) {
        if (typeof density === 'number') {
            const n = Math.max(1, Math.min(40, density));
            this.config.densityRange = [n, n];
        } else if (density && typeof density === 'object') {
            const min = Math.max(1, density.min || this.config.densityRange[0]);
            const max = Math.max(min, Math.min(60, density.max || this.config.densityRange[1]));
            this.config.densityRange = [min, max];
        }
    }

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

    setColorRange({ hue, sat, light }) {
        if (hue) this.config.hueRange = [hue.min ?? this.config.hueRange[0], hue.max ?? this.config.hueRange[1]];
        if (sat) this.config.satRange = [sat.min ?? this.config.satRange[0], sat.max ?? this.config.satRange[1]];
        if (light) this.config.lightRange = [light.min ?? this.config.lightRange[0], light.max ?? this.config.lightRange[1]];
    }

    setBendStrength({ min, max }) {
        const a = Math.max(5, min ?? this.config.bendDegRange[0]);
        const b = Math.max(a, Math.min(60, max ?? this.config.bendDegRange[1]));
        this.config.bendDegRange = [a, b];
    }

    setInteractionConfig(config) {
        if (!this.config.interaction) {
            this.config.interaction = {};
        }
        Object.assign(this.config.interaction, config);
    }
}
