/* Google Analytics 4 — note-garden；目前正常统计，包括作者自己的访问。 */
(() => {
  if (location.protocol !== 'https:' || location.hostname !== 'zxiaor.github.io') return;
  const measurementId = 'G-W7L025WCL3';
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
  document.head.appendChild(script);
})();
