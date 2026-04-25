// ========== ПЕРЕКЛЮЧАТЕЛЬ ТЕМЫ ==========
document.addEventListener('DOMContentLoaded', function() {
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Проверяем сохраненную тему или системные настройки
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        updateButtonText('dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        updateButtonText('light');
    }
    
    // Обработчик клика
    themeToggleBtn.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateButtonText(newTheme);
    });
    
    // Обновление текста кнопки
    function updateButtonText(theme) {
        const span = themeToggleBtn.querySelector('span');
        if (theme === 'dark') {
            span.textContent = 'Светлая тема';
        } else {
            span.textContent = 'Темная тема';
        }
    }
    
    // Слушаем изменение системной темы
    prefersDarkScheme.addEventListener('change', function(e) {
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            updateButtonText(newTheme);
        }
    });
});