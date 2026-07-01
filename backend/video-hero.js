// ========== ВИДЕО В HERO-БЛОКАХ: без зацикливания, реплей только при возврате к блоку ==========
document.addEventListener('DOMContentLoaded', function () {
    const videos = document.querySelectorAll('.video-hero .video-bg');
    if (!videos.length) return;

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            const video = entry.target;
            if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                video.currentTime = 0;
                video.play().catch(function () {});
            } else {
                video.pause();
            }
        });
    }, { threshold: [0, 0.5, 1] });

    videos.forEach(function (video) {
        video.muted = true;
        video.playsInline = true;
        observer.observe(video);
    });
});
