// ========== ПЕРЕКЛЮЧАТЕЛЬ СВЕТЛОЙ/ТЁМНОЙ ТЕМЫ ==========
document.addEventListener('DOMContentLoaded', function () {
    var root = document.documentElement;
    var btn = document.getElementById('themeToggle');
    if (!btn) return;

    var icon = btn.querySelector('i');

    function isLight() {
        return root.getAttribute('data-theme') === 'light';
    }

    function updateIcon() {
        if (!icon) return;
        if (isLight()) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }

    // Иконка должна сразу соответствовать теме, применённой ранним inline-скриптом в <head>
    updateIcon();

    btn.addEventListener('click', function () {
        var next = isLight() ? 'dark' : 'light';

        if (next === 'light') {
            root.setAttribute('data-theme', 'light');
        } else {
            root.removeAttribute('data-theme');
        }

        try {
            localStorage.setItem('theme', next);
        } catch (e) {}

        updateIcon();
    });
});
