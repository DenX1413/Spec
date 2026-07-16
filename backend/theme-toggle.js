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

        // С этого момента пользователь сделал осознанный выбор — запоминаем именно его
        try {
            localStorage.setItem('theme', next);
        } catch (e) {}

        updateIcon();
    });

    // Пока пользователь ни разу не переключал тему вручную, сайт следует за системной темой
    // устройства live — если её сменить в настройках ОС, страница обновится без перезагрузки.
    if (window.matchMedia) {
        var systemLightQuery = window.matchMedia('(prefers-color-scheme: light)');
        var onSystemThemeChange = function (e) {
            var hasManualChoice;
            try {
                hasManualChoice = !!localStorage.getItem('theme');
            } catch (err) {
                hasManualChoice = false;
            }
            if (hasManualChoice) return;

            if (e.matches) {
                root.setAttribute('data-theme', 'light');
            } else {
                root.removeAttribute('data-theme');
            }
            updateIcon();
        };

        if (typeof systemLightQuery.addEventListener === 'function') {
            systemLightQuery.addEventListener('change', onSystemThemeChange);
        } else if (typeof systemLightQuery.addListener === 'function') {
            // Старые браузеры (Safari <14)
            systemLightQuery.addListener(onSystemThemeChange);
        }
    }
});
