export function initTheme() {
    const themeBtn = document.getElementById('themeBtn');
    const html = document.documentElement;
    const sunIcon = themeBtn.querySelector('.sun-icon');
    const moonIcon = themeBtn.querySelector('.moon-icon');

    // Function to update icon visibility
    const updateIcons = (isDark) => {
        if (sunIcon) sunIcon.style.display = isDark ? 'block' : 'none';
        if (moonIcon) moonIcon.style.display = isDark ? 'none' : 'block';
    };

    // Initialize theme from local storage
    if (localStorage.getItem('theme') === 'dark') {
        html.classList.add('dark');
    }

    // Initial check
    updateIcons(html.classList.contains('dark'));

    themeBtn.addEventListener('click', () => {
        html.classList.toggle('dark');
        const isDark = html.classList.contains('dark');
        updateIcons(isDark);
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
}