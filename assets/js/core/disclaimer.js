// assets/js/core/disclaimer.js
// 免责声明弹窗逻辑

export function initDisclaimerModal() {
    const overlay = document.getElementById('disclaimerModalOverlay');
    const agreeBtn = document.getElementById('disclaimerAgree');
    const disagreeBtn = document.getElementById('disclaimerDisagree');
    const closeXBtn = document.getElementById('disclaimerCloseX');

    if (!overlay) return;

    const DISCLAIMER_KEY = 'obscura_disclaimer_agreed';
    const DISCLAIMER_EXPIRY_DAYS = 7;

    function showModal() {
        overlay.classList.add('visible');
    }

    function hideModal() {
        overlay.classList.remove('visible');
    }

    function handleAgree() {
        const expiryTime = Date.now() + (DISCLAIMER_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
        localStorage.setItem(DISCLAIMER_KEY, expiryTime.toString());
        hideModal();
    }

    function handleDisagree() {
        localStorage.removeItem(DISCLAIMER_KEY);
        hideModal();
        window.location.href = 'about:blank';
    }

    if (agreeBtn) {
        agreeBtn.addEventListener('click', handleAgree);
    }

    if (disagreeBtn) {
        disagreeBtn.addEventListener('click', handleDisagree);
    }

    if (closeXBtn) {
        closeXBtn.addEventListener('click', handleDisagree);
    }

    const macRed = overlay.querySelector('.mac-control-red');
    if (macRed) {
        macRed.addEventListener('click', (e) => {
            e.stopPropagation();
            handleDisagree();
        });
    }

    setTimeout(() => {
        const storedValue = localStorage.getItem(DISCLAIMER_KEY);
        if (!storedValue) {
            showModal();
            return;
        }
        const expiryTime = parseInt(storedValue, 10);
        if (isNaN(expiryTime) || Date.now() > expiryTime) {
            localStorage.removeItem(DISCLAIMER_KEY);
            showModal();
        }
    }, 500);
}
