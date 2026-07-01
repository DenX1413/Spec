// ========== ВИДЕО В HERO-БЛОКАХ: без зацикливания, реплей только при возврате к блоку ==========
document.addEventListener('DOMContentLoaded', function () {
    const videos = document.querySelectorAll('.video-hero .video-bg');
    if (!videos.length) return;

    const FADE_MS = 700;

    function fadeIn(video) {
        video.style.opacity = '1';
    }

    function fadeOutThenPause(video) {
        video.style.opacity = '0';
        clearTimeout(video._pauseTimeout);
        video._pauseTimeout = setTimeout(function () {
            video.pause();
        }, FADE_MS);
    }

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            const video = entry.target;
            if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                clearTimeout(video._pauseTimeout);
                video.style.opacity = '0';
                video.currentTime = 0;
                video.play().catch(function () {});
                // Двойной rAF — гарантируем, что opacity:0 отрисован до начала перехода в opacity:1
                requestAnimationFrame(function () {
                    requestAnimationFrame(function () {
                        fadeIn(video);
                    });
                });
            } else {
                fadeOutThenPause(video);
            }
        });
    }, { threshold: [0, 0.5, 1] });

    videos.forEach(function (video) {
        video.muted = true;
        video.playsInline = true;
        observer.observe(video);
    });
});
