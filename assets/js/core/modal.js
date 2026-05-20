// assets/js/core/modal.js

export function initPlaceholderModal() {
    const modalOverlay = document.getElementById('devModalOverlay');
    const closeButtons = document.querySelectorAll('.dev-modal-close');

    if (!modalOverlay) return;

    function showModal() {
        const modal = modalOverlay.querySelector('.dev-modal');
        if (modal?.classList.contains('minimizing')) {
            modal.classList.remove('minimizing');
        }
        modalOverlay.classList.add('visible');
    }

    function hideModal() {
        modalOverlay.classList.remove('visible');
    }

    // Close modal when close buttons are clicked
    closeButtons.forEach(btn => {
        btn.addEventListener('click', hideModal);
    });

    // Close modal when clicking on the overlay
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            hideModal();
        }
    });

    // Close modal with the Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('visible')) {
            hideModal();
        }
    });

    // Attach to placeholder cards without a route.
    const placeholderCards = document.querySelectorAll('.tool-card:not([data-tool])');
    placeholderCards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            showModal();
        });
    });

    // Add functionality to mac controls
    const macRed = modalOverlay.querySelector('.mac-control-red');
    const macYellow = modalOverlay.querySelector('.mac-control-yellow');

    if (macRed) {
        macRed.addEventListener('click', (e) => {
            e.stopPropagation();
            hideModal();
        });
    }

    if (macYellow) {
        macYellow.addEventListener('click', (e) => {
            e.stopPropagation();
            const modal = modalOverlay.querySelector('.dev-modal');
            if (!modal) return;

            modal.classList.add('minimizing');
            modal.addEventListener('animationend', hideModal, { once: true });
        });
    }
}
