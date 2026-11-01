(function () {
  function init() {
    var header = document.getElementById('page-header');
    var box = document.getElementById('wp');
    if (!header || !box) return;
    if (box.parentNode !== header) header.insertBefore(box, header.firstChild);

    if (window.innerWidth < 768) return;

    var G = window.WebWallGL;
    if (!G || !G.mount) { console.warn('[wp] webwallgl 未加载，保留占位图'); return; }

    function showCanvas() {
      var cv = box.querySelector('canvas');
      if (cv) cv.style.opacity = '1';
    }

    G.mount(box, { source: G.httpSource('/wallpapers/2899043376') })
      .then(function (wp) {
        window.__wp = wp;
        showCanvas();
        requestAnimationFrame(showCanvas);
        console.log('[wp] 渲染成功，已立即切换');
      })
      .catch(function (e) {
        console.warn('[wp] 渲染失败，保留占位图', e);
      });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (en) {
          if (!window.__wp) return;
          if (en.isIntersecting) { window.__wp.resume && window.__wp.resume(); }
          else { window.__wp.pause && window.__wp.pause(); }
        });
      }, { threshold: 0 }).observe(header);
    }
    document.addEventListener('visibilitychange', function () {
      if (!window.__wp) return;
      if (document.hidden) { window.__wp.pause && window.__wp.pause(); }
      else { window.__wp.resume && window.__wp.resume(); }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();