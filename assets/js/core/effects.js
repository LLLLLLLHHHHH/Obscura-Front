export function initEffects() {
    // Tool Card Spotlight & Click
    document.querySelectorAll('.tool-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });

    });

    // Hero Parallax
    initHeroMouseParallax();
}

function initHeroMouseParallax() {
    const root = document.documentElement;
    let rafId = null;

    function updateFromMouse(clientX, clientY) {
        const w = window.innerWidth;
        const h = window.innerHeight;
        if (w <= 0 || h <= 0) return;

        const x = (clientX / w - 0.5) * 2;
        const y = (clientY / h - 0.5) * 2;

        root.style.setProperty('--hero-mouse-x', String(x));
        root.style.setProperty('--hero-mouse-y', String(y));
    }

    function onMouseMove(e) {
        if (rafId !== null) return;
        rafId = requestAnimationFrame(() => {
            rafId = null;
            updateFromMouse(e.clientX, e.clientY);
        });
    }

    function onMouseLeave() {
        if (rafId !== null) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
            rafId = null;
            root.style.setProperty('--hero-mouse-x', '0');
            root.style.setProperty('--hero-mouse-y', '0');
        });
    }

    document.addEventListener('mousemove', onMouseMove, { passive: true });
    document.body.addEventListener('mouseleave', onMouseLeave, { passive: true });
}