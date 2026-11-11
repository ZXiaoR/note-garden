/* ==========================================================================
   PlopUI Theme & Surface Controller for note-garden (assets/plop-garden.js)
   Persists chosen paper surface across Home and Topic Subpages.
   ========================================================================== */
(() => {
  const STORAGE_SURFACE_KEY = 'note-garden-plop-surface';
  const STORAGE_SUBPAGE_MODE_KEY = 'note-garden-subpage-mode';

  const savedSurface = localStorage.getItem(STORAGE_SURFACE_KEY) || 'mat';
  document.documentElement.setAttribute('data-plop-surface', savedSurface);

  // Global helper to switch surface on Home or Subpages
  window.setPlopSurface = function (surface, btn) {
    document.documentElement.setAttribute('data-plop-surface', surface);
    localStorage.setItem(STORAGE_SURFACE_KEY, surface);
    if (btn && btn.parentElement) {
      btn.parentElement.querySelectorAll('.plop-sticker-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    }
  };

  // Sync active button state on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    const currentSurface = document.documentElement.getAttribute('data-plop-surface') || 'mat';
    document.querySelectorAll('[data-surface-btn]').forEach(btn => {
      if (btn.getAttribute('data-surface-btn') === currentSurface) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // If on a topic subpage that includes plop-garden.js, inject a floating sticker switcher
    if (document.body && !document.body.classList.contains('plop-garden-body')) {
      const savedMode = localStorage.getItem(STORAGE_SUBPAGE_MODE_KEY) || 'plop';
      if (savedMode === 'plop') {
        document.documentElement.setAttribute('data-note-theme', 'plop');
      }

      const bar = document.createElement('div');
      bar.style.cssText = 'position:fixed;bottom:18px;right:20px;z-index:9999;display:flex;gap:8px;align-items:center;';
      bar.innerHTML = `
        <a href="../index.html" class="plop-sticker-btn" style="text-decoration:none;">🌱 返回花园首页</a>
        <button type="button" class="plop-sticker-btn active" id="toggle-plop-subpage">
          🎨 切换手账/暗黑模式
        </button>
      `;
      document.body.appendChild(bar);

      const toggleBtn = document.getElementById('toggle-plop-subpage');
      if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
          const cur = document.documentElement.getAttribute('data-note-theme');
          const next = cur === 'plop' ? 'dark' : 'plop';
          if (next === 'plop') {
            document.documentElement.setAttribute('data-note-theme', 'plop');
          } else {
            document.documentElement.removeAttribute('data-note-theme');
          }
          localStorage.setItem(STORAGE_SUBPAGE_MODE_KEY, next);
        });
      }
    }
  });
})();
