// ========== СКРЫТИЕ ПЛАВАЮЩЕЙ КНОПКИ "ОСТАВИТЬ ЗАЯВКУ" ОКОЛО САМОЙ ФОРМЫ ==========
// На мобильных кнопка "оставить заявку" всегда плавает в правом нижнем углу,
// но когда пользователь долистал до самого блока с формой — она не нужна и прячется.
document.addEventListener('DOMContentLoaded', function () {
    var cta = document.querySelector('.hero-nav-btn');
    var form = document.getElementById('request-form');
    if (!cta || !form || !('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                cta.classList.add('cta-hidden');
            } else {
                cta.classList.remove('cta-hidden');
            }
        });
    }, { threshold: 0.15 });

    observer.observe(form);
});
