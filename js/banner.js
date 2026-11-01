(function () {
  var VIDEO = '/img/nilou-banner.mp4';
  var POSTER = '/img/wallpaper-poster.jpg';

  function init() {
    var header = document.getElementById('page-header');
    if (!header) return;
    if (header.querySelector('video.banner-video')) return;

    if (window.innerWidth < 768) return;

    var v = document.createElement('video');
    v.className = 'banner-video';
    v.src = VIDEO;
    v.poster = POSTER;
    v.autoplay = true;
    v.muted = true;
    v.loop = true;
    v.playsInline = true;
    v.setAttribute('muted', '');
    v.setAttribute('playsinline', '');
    v.setAttribute('webkit-playsinline', '');
    v.preload = 'auto';
    v.addEventListener('playing', function () { console.log('[banner] 视频已开始播放'); }, { once: true });
    v.addEventListener('error', function () { console.warn('[banner] 视频加载失败，保留占位图'); }, { once: true });
    header.insertBefore(v, header.firstChild);

    var p = v.play && v.play();
    if (p && p.catch) p.catch(function (e) { console.warn('[banner] 自动播放被拦截', e); });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (en) {
          if (en.isIntersecting) { v.play && v.play().catch(function () {}); }
          else { v.pause && v.pause(); }
        });
      }, { threshold: 0 }).observe(header);
    }
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { v.pause && v.pause(); }
      else { v.play && v.play().catch(function () {}); }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();