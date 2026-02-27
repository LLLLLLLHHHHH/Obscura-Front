// MeteorShower 流星系统：暗黑主题下在 header 内生成流星特效
// 设计目标：
// 1) 对角线运动轨迹（从左上到右下，15-30度）
// 2) 主题切换到暗黑时 20% 概率一次性生成流星雨
// 3) 配置化系统，支持外部修改参数
// 4) 物理特效：拖尾渐变、光晕、模糊、大小渐变
// 5) 单例模式，destroy 清理资源

export class MeteorShower {
    /**
     * @param {HTMLElement} headerEl - 目标 header 元素
     * @param {Object} config - 配置对象
     */
    constructor(headerEl, config = {}) {
        this.headerEl = headerEl;
        // 默认配置对象，包含所有可调整参数及详细注释
        this.config = {
            // 触发概率：主题切换到暗黑时生成流星的概率 (0-1)
            probability: 0.2,
            // 最大数量：单次触发时最多生成的流星数量
            maxCount: 5,
            // 最小速度：流星最小运动速度 (像素/帧)
            minVelocity: 3,
            // 最大速度：流星最大运动速度 (像素/帧)
            maxVelocity: 8,
            // 拖尾长度：流星拖尾的像素长度
            trailLength: 100,
            // 颜色数组：流星的自然色彩
            colors: ['#eb8789ff', '#e6b0b2ff', '#e6adadff', '#ffe0e0ff', '#fff0f1ff'],
            // 消失动画时长：流星消失的过渡时间 (毫秒)
            fadeDuration: 1500,
            // 轨迹角度范围：对角线运动的基础角度区间 (度)，相对于水平向右
            // 15-30度表示从左上向右下倾斜
            angleRange: [15, 30],
            // 随机扰动因子：每颗流星角度的随机偏移 (度)
           扰动因子: 5,
            // 速度衰减系数：模拟大气阻力 (0-1，越小衰减越快)
            velocityDecay: 0.96,
            // 最小生命周期：流星存活最短时间 (毫秒)
            minLife: 800,
            // 最大生命周期：流星存活最长时间 (毫秒)
            maxLife: 2000,
            // 最大同时存在的流星数量：防止切换应用后积压
            maxConcurrent: 8,
            ...config
        };

        // 验证配置合理性
        this._validateConfig();

        // 容器元素
        this.container = null;
        // 活跃的流星实例数组
        this.meteors = [];
        // 计时器 ID
        this._timerId = null;
        // 运行状态
        this._isRunning = false;
        // 计时器 ID（用于定时生成流星）
        this._intervalId = null;
        // 定时触发间隔（毫秒）
        this._intervalMs = 3000;
        // 上次生成时间（用于去重，防止重复触发）
        this._lastGenTime = 0;

        // 创建流星容器
        this._ensureContainer();
    }

    // 配置验证函数：确保参数合理性
    _validateConfig() {
        const c = this.config;
        if (c.probability < 0 || c.probability > 1) {
            c.probability = Math.max(0, Math.min(1, c.probability));
        }
        c.maxCount = Math.max(1, Math.floor(c.maxCount) || 5);
        c.minVelocity = Math.max(1, c.minVelocity || 3);
        c.maxVelocity = Math.max(c.minVelocity, c.maxVelocity || 8);
        c.trailLength = Math.max(20, c.trailLength || 100);
        c.fadeDuration = Math.max(100, c.fadeDuration || 1500);
        c.angleRange = Array.isArray(c.angleRange) ? c.angleRange : [15, 30];
        c.angleRange[0] = Math.max(5, c.angleRange[0]);
        c.angleRange[1] = Math.min(60, c.angleRange[1]);
        c.扰动因子 = Math.max(0, c.扰动因子 || 5);
        c.velocityDecay = Math.max(0.8, Math.min(1, c.velocityDecay || 0.96));
        c.minLife = Math.max(200, c.minLife || 800);
        c.maxLife = Math.max(c.minLife, c.maxLife || 2000);
        if (!Array.isArray(c.colors) || c.colors.length === 0) {
            c.colors = ['#87CEEB'];
        }
    }

    // 创建流星容器
    _ensureContainer() {
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.className = 'meteor-shower';
            this.container.setAttribute('aria-hidden', 'true');
            this.headerEl.appendChild(this.container);
        }
    }

    // 工具：生成指定范围随机数
    _rand(min, max) {
        return min + Math.random() * (max - min);
    }

    // 工具：生成指定范围随机整数
    _randInt(min, max) {
        return Math.floor(this._rand(min, max + 1));
    }

    // 工具：从数组随机取一项
    _pick(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    // 创建单个流星元素及数据
    // 从 header 左侧出发，向右侧运动（水平方向）
    _createMeteor() {
        const rect = this.headerEl.getBoundingClientRect();
        
        // 起始位置：从 header 左侧外部进入，y 在中间区域随机
        const startX = -this._rand(50, 150); // 从左边 50-150px 外开始
        const startY = this._rand(rect.height * 0.1, rect.height * 0.9); // y 在 header 垂直中间区域

        // 运动参数：水平向右 + 轻微向下倾斜 (-5 到 15 度)
        // 负角度表示稍微向上，正角度表示向下
        const baseAngle = this._rand(-5, 15);
        const 扰动 = this._rand(-this.config.扰动因子, this.config.扰动因子);
        const angle = baseAngle + 扰动; // 度
        const angleRad = (angle * Math.PI) / 180;
        const velocity = this._rand(this.config.minVelocity, this.config.maxVelocity);
        const life = this._rand(this.config.minLife, this.config.maxLife);

        // 物理属性：初速度 vx, vy（向右下方运动）
        const vx = Math.cos(angleRad) * velocity;
        const vy = Math.sin(angleRad) * velocity;

        // 外观属性
        const color = this._pick(this.config.colors);
        const size = this._rand(2, 4); // 头部大小
        const trailLen = this._rand(this.config.trailLength * 0.7, this.config.trailLength);

        // 创建 DOM 元素
        const el = document.createElement('div');
        el.className = 'meteor';
        el.style.cssText = `
            position: absolute;
            left: ${startX}px;
            top: ${startY}px;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: 50%;
            box-shadow: 
                0 0 ${size * 2}px ${color},
                0 0 ${size * 4}px ${color},
                0 0 ${size * 6}px rgba(255, 255, 255, 0.8);
            filter: blur(0.5px);
            opacity: 0;
            transform: translate(-50%, -50%);
            pointer-events: none;
        `;

        // 拖尾元素（方向与运动方向相反）
        const trail = document.createElement('div');
        trail.className = 'meteor-trail';
        const trailAngle = angle + 180; // 反向
        trail.style.cssText = `
            position: absolute;
            left: 50%;
            top: 50%;
            width: ${trailLen}px;
            height: ${size * 0.6}px;
            background: linear-gradient(to left, ${color} 0%, ${color} 30%, transparent 100%);
            transform-origin: left center;
            transform: translateY(-50%) rotate(${trailAngle}deg);
            filter: blur(0.5px);
            opacity: 0;
            pointer-events: none;
        `;
        el.appendChild(trail);
        this.container.appendChild(el);

        // 流星数据结构
        return {
            el,
            trail,
            x: startX,
            y: startY,
            vx,
            vy,
            angle,
            velocity,
            life,
            age: 0,
            size,
            color,
            decay: this.config.velocityDecay,
            progress: 0 // 0-1 表示二次贝塞尔曲线进度
        };
    }

    // 线性插值
    _lerp(a, b, t) {
        return a + (b - a) * t;
    }

    // 二次贝塞尔曲线计算：模拟受重力影响的抛物线轨迹
    _quadBezier(t, p0, p1, p2) {
        const mt = 1 - t;
        return mt * mt * p0 + 2 * mt * t * p1 + t * t * p2;
    }

    // 更新单颗流星位置与状态
    _updateMeteor(meteor, dt) {
        const c = this.config;
        meteor.age += dt * 1000; // 毫秒

        // 计算二次贝塞尔曲线进度
        meteor.progress = Math.min(1, meteor.age / meteor.life);

        // 基于进度计算当前位置（从左到右的水平运动轨迹）
        const rect = this.headerEl.getBoundingClientRect();
        
        // 起点：header 左侧外部
        const startX = -150;
        const startY = rect.height * 0.5;
        // 终点：header 右侧外部
        const endX = rect.width + 150;
        const endY = rect.height * 0.6; // 稍微向下倾斜
        // 控制点：中间偏右，模拟轻微下坠
        const ctrlX = rect.width * 0.6;
        const ctrlY = rect.height * 0.65;

        meteor.x = this._quadBezier(meteor.progress, startX, ctrlX, endX);
        meteor.y = this._quadBezier(meteor.progress, startY, ctrlY, endY);

        // 速度随时间衰减（模拟大气阻力）
        meteor.velocity *= Math.pow(meteor.decay, dt * 60);

        // 计算头部大小渐变（头部大尾部小）
        const sizeScale = 1 - meteor.progress * 0.5;
        const currentSize = meteor.size * sizeScale;

        // 透明度计算
        let opacity = 1;
        // 淡入
        if (meteor.age < 100) {
            opacity = meteor.age / 100;
        }
        // 淡出
        if (meteor.progress > 0.7) {
            opacity = 1 - (meteor.progress - 0.7) / 0.3;
        }

        // 更新 DOM
        meteor.el.style.left = meteor.x + 'px';
        meteor.el.style.top = meteor.y + 'px';
        meteor.el.style.opacity = opacity;
        meteor.el.style.width = currentSize + 'px';
        meteor.el.style.height = currentSize + 'px';

        // 拖尾更新
        if (meteor.trail) {
            meteor.trail.style.opacity = opacity * 0.8;
            meteor.trail.style.width = (c.trailLength * (1 - meteor.progress * 0.3)) + 'px';
        }

        // 生命周期结束
        return meteor.age >= meteor.life;
    }

    // 主更新循环：仅更新现有流星，不生成新流星
    _tick(timestamp) {
        if (!this._lastTs) this._lastTs = timestamp;
        const dt = Math.min((timestamp - this._lastTs) / 1000, 0.1); // 秒
        this._lastTs = timestamp;

        // 更新现有流星
        for (let i = this.meteors.length - 1; i >= 0; i--) {
            const meteor = this.meteors[i];
            const dead = this._updateMeteor(meteor, dt);
            if (dead) {
                // 移除 DOM
                if (meteor.el && meteor.el.parentNode) {
                    meteor.el.parentNode.removeChild(meteor.el);
                }
                this.meteors.splice(i, 1);
            }
        }

        // 如果还有流星在运行，继续动画
        if (this.meteors.length > 0) {
            this._timerId = requestAnimationFrame(this._tick.bind(this));
        } else {
            // 所有流星消亡后停止
            this._isRunning = false;
            this._timerId = null;
        }
    }

    // 触发流星雨：根据 20% 概率生成一次流星
    trigger() {
        const now = Date.now();
        
        // 如果已经有太多流星在运行，跳过本次触发（防止积压）
        if (this.meteors.length >= this.config.maxConcurrent) {
            return false;
        }
        
        // 防止短时间内重复触发（1秒内最多触发一次）
        if (now - this._lastGenTime < 1000) {
            return false;
        }
        
        // 20% 概率触发
        if (Math.random() < this.config.probability) {
            this._lastGenTime = now;
            
            // 生成 1-5 颗流星，但不超过最大并发限制
            const remaining = this.config.maxConcurrent - this.meteors.length;
            const count = Math.min(this._randInt(1, this.config.maxCount), remaining);
            for (let i = 0; i < count; i++) {
                // 错开每颗流星的生成时间，避免同时出现
                setTimeout(() => {
                    // 再次检查并发限制
                    if (this.meteors.length >= this.config.maxConcurrent) return;
                    
                    this.meteors.push(this._createMeteor());
                    // 如果是第一个，启动动画循环
                    if (!this._isRunning && this.meteors.length === 1) {
                        this._isRunning = true;
                        this._lastTs = 0;
                        this._timerId = requestAnimationFrame(this._tick.bind(this));
                    }
                }, i * 80); // 每颗间隔 80ms
            }
            return true;
        }
        return false;
    }

    // 启动流星系统：每隔3秒判断一次是否生成流星
    start() {
        if (this._intervalId) return; // 已经在运行
        // 立即尝试触发一次
        this.trigger();
        // 每隔3秒触发一次
        this._intervalId = setInterval(() => {
            this.trigger();
        }, this._intervalMs);
    }

    // 停止流星系统
    stop(clearMeteors = true) {
        this._isRunning = false;
        // 停止定时器
        if (this._intervalId) {
            clearInterval(this._intervalId);
            this._intervalId = null;
        }
        // 停止动画帧
        if (this._timerId) {
            cancelAnimationFrame(this._timerId);
            this._timerId = null;
        }
        // 清除所有流星
        if (clearMeteors) {
            this._clearAllMeteors();
        }
    }

    // 清除所有流星
    _clearAllMeteors() {
        for (const meteor of this.meteors) {
            if (meteor.el && meteor.el.parentNode) {
                meteor.el.parentNode.removeChild(meteor.el);
            }
        }
        this.meteors = [];
    }

    // 资源清理
    destroy() {
        this.stop();
        // 移除所有流星 DOM
        for (const meteor of this.meteors) {
            if (meteor.el && meteor.el.parentNode) {
                meteor.el.parentNode.removeChild(meteor.el);
            }
        }
        this.meteors = [];
        // 移除容器
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
            this.container = null;
        }
    }

    // 更新配置
    setConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this._validateConfig();
    }

    // 获取当前配置
    getConfig() {
        return { ...this.config };
    }
}

// 单例实例
let _instance = null;

/**
 * 获取 MeteorShower 单例
 * @param {HTMLElement} headerEl - header 元素
 * @param {Object} config - 配置
 * @returns {MeteorShower}
 */
export function getMeteorShower(headerEl, config) {
    if (!_instance && headerEl) {
        _instance = new MeteorShower(headerEl, config);
    }
    return _instance;
}

/**
 * 销毁单例
 */
export function destroyMeteorShower() {
    if (_instance) {
        _instance.destroy();
        _instance = null;
    }
}