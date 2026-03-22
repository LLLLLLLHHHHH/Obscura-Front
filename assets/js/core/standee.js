export class Standee {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      title: options.title || 'Info',
      sub: options.sub || '– Console Info –',
      origX: options.origX ?? -8,
      origY: options.origY ?? 30,
      frontAngle: options.frontAngle ?? 32,
      backAngle: options.backAngle ?? -32,
      translateZ: options.translateZ ?? 0.5,
      sensitivity: options.sensitivity ?? 0.4,
      longPressDelay: options.longPressDelay ?? 250,
      riseTime: options.riseTime ?? 420,
      riseBackTime: options.riseBackTime ?? 650,
      ...options,
    };

    this.isDragging = false;
    this.isFolded = false;
    this.isAnimating = false;
    this.startX = null;
    this.startY = null;
    this.pressTime = null;
    this.currentRotX = this.options.origX;
    this.currentRotY = this.options.origY;
    this.pointerId = null;
    this.mojoslot = this.container.dataset.mojoslot || null;

    this.render();
    this.bindEvents();
    this.updateTransform();
  }

  render() {
    this.container.innerHTML = `
      <div class="standee-scene">
        <div class="standee" id="standee">
          <div class="back"></div>
          <div class="front">
            <div class="text">
              <div class="title">${this.options.title}</div>
              <div class="sub">${this.options.sub}</div>
            </div>
          </div>
          <div class="shadow"></div>
        </div>
      </div>
    `;
    this.standee = this.container.querySelector('.standee');
    this.front = this.standee.querySelector('.front');
    this.back = this.standee.querySelector('.back');
  }

  bindEvents() {
    this.standee.addEventListener('pointerdown', this.onPointerDown.bind(this));
    this.standee.addEventListener('pointermove', this.onPointerMove.bind(this));
    this.standee.addEventListener('pointerup', this.onPointerUp.bind(this));
    this.standee.addEventListener('pointercancel', this.onPointerCancel.bind(this));
  }

  onPointerDown(e) {
    if (e.button !== 0) return;
    if (this.isAnimating) return;

    if (this.isFolded) {
      this.unfoldUp();
      return;
    }

    this.isDragging = false;
    this.pressTime = Date.now();
    this.startX = e.clientX;
    this.startY = e.clientY;
    this.pointerId = e.pointerId;
    this.standee.classList.remove('fold-rise');
    this.standee.setPointerCapture(e.pointerId);
    e.preventDefault();
  }

  onPointerMove(e) {
    if (this.isAnimating || this.startX === null) return;

    if (!this.isDragging && Date.now() - this.pressTime >= this.options.longPressDelay) {
      this.isDragging = true;
    }

    if (this.isDragging) {
      const dx = e.clientX - this.startX;
      const dy = e.clientY - this.startY;
      this.currentRotY = this.options.origY + dx * this.options.sensitivity;
      this.currentRotX = this.options.origX + dy * this.options.sensitivity;
      this.updateTransform();
    }
  }

  onPointerUp(e) {
    this.standee.releasePointerCapture(e.pointerId);

    if (this.isAnimating) return;

    if (this.isDragging) {
      this.isDragging = false;
      this.springBack(e.pointerId);
    } else {
      this.foldDown();
    }
    this.pressTime = null;
    this.startX = null;
    this.startY = null;
    this.pointerId = null;
  }

  onPointerCancel(e) {
    this.standee.releasePointerCapture(e.pointerId);
    if (this.isDragging) {
      this.isDragging = false;
      this.springBack(e.pointerId);
    }
    this.pressTime = null;
    this.startX = null;
    this.startY = null;
    this.pointerId = null;
  }

  updateTransform() {
    this.standee.style.transform =
      `rotateX(${this.currentRotX}deg) rotateY(${this.currentRotY}deg)`;
  }

  springBack(pointerId) {
    this.isAnimating = true;
    this.isDragging = false;
    if (pointerId !== undefined) {
      try {
        this.standee.releasePointerCapture(pointerId);
      } catch (_) {}
    }
    this.standee.classList.add('fold-rise');
    this.currentRotX = this.options.origX;
    this.currentRotY = this.options.origY;
    this.updateTransform();

    setTimeout(() => {
      this.standee.classList.remove('fold-rise');
      this.front.style.transform = `rotateX(${this.options.frontAngle}deg) translateZ(${this.options.translateZ}px)`;
      this.back.style.transform = `rotateX(${this.options.backAngle}deg) translateZ(-${this.options.translateZ}px)`;
      this.isAnimating = false;
      this.isDragging = false;
      this.startX = null;
      this.startY = null;
      this.pressTime = null;
    }, this.options.riseBackTime);
  }

  foldDown() {
    if (this.isAnimating) return;
    this.isAnimating = true;
    this.isFolded = true;

    this.front.style.transform = `rotateX(0deg) translateZ(${this.options.translateZ}px)`;
    this.back.style.transform = `rotateX(0deg) translateZ(-${this.options.translateZ}px)`;

    setTimeout(() => {
      this.standee.classList.add('fold-flat', 'fold-closed');
      this.currentRotX = 0;
      this.currentRotY = 0;
      this.updateTransform();
      this.isAnimating = false;
      this.isDragging = false;
      this.startX = null;
      this.startY = null;
      this.pressTime = null;
    }, this.options.riseTime);
  }

  unfoldUp() {
    if (this.isAnimating) return;
    this.isAnimating = true;
    this.standee.classList.remove('fold-closed', 'fold-flat');

    setTimeout(() => {
      this.standee.classList.add('fold-rise');
      this.front.style.transform = `rotateX(${this.options.frontAngle}deg) translateZ(${this.options.translateZ}px)`;
      this.back.style.transform = `rotateX(${this.options.backAngle}deg) translateZ(-${this.options.translateZ}px)`;

      this.currentRotX = this.options.origX;
      this.currentRotY = this.options.origY;
      this.updateTransform();

      setTimeout(() => {
        this.standee.classList.remove('fold-rise');
        this.isFolded = false;
        this.isAnimating = false;
        this.isDragging = false;
        this.startX = null;
        this.startY = null;
        this.pressTime = null;
      }, this.options.riseBackTime);
    }, 50);
  }

  setTitle(title) {
    const titleEl = this.standee.querySelector('.title');
    if (titleEl) titleEl.textContent = title;
  }

  setSub(sub) {
    const subEl = this.standee.querySelector('.sub');
    if (subEl) subEl.textContent = sub;
  }

  setTheme(titleGlow, subGlow) {
    if (titleGlow) {
      this.standee.style.setProperty('--standee-title-glow', titleGlow);
    }
    if (subGlow) {
      this.standee.style.setProperty('--standee-sub-glow', subGlow);
    }
  }

  destroy() {
    this.standee.removeEventListener('pointerdown', this.onPointerDown);
    this.standee.removeEventListener('pointermove', this.onPointerMove);
    this.standee.removeEventListener('pointerup', this.onPointerUp);
    this.standee.removeEventListener('pointercancel', this.onPointerCancel);
    this.container.innerHTML = '';
  }
}

export function initStandee(container, options) {
  return new Standee(container, options);
}
