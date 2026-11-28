/* ==========================================================================
   PlopUI Shared Shell & Workbench Controller for note-garden (assets/plop-garden.js)
   - Zero-framework, zero-build shared runtime for Home & Sketchbook Subpages:
     1. Surface persistence (mat / poster / notebook / kraft / riso)
     2. Auto-injected SVG mascot & sticker sprite (#plop-buddy-cap, #plop-buddy-beanie, #plop-buddy-girl, etc.)
     3. Single-source-of-truth cross-topic directory ([data-plop-topics])
     4. Modular HTML section loader ([data-plop-section="sections/01-xxx.html"])
     5. Shared copyText(), <details> hash auto-expand, and automatic Scroll-Spy + reading progress
     6. Legacy subpage theme switcher fallback
   ========================================================================== */
(() => {
  const STORAGE_SURFACE_KEY = 'note-garden-plop-surface';
  const STORAGE_SUBPAGE_MODE_KEY = 'note-garden-subpage-mode';

  // 1. 全站已完成专题注册表（新增文章只需在此处加一行，所有页面跨专题目录自动按分组同步）
  const NOTE_GARDEN_TOPICS = [
    { path: 'ai/index.html', icon: 'plop-ico-spark', title: 'Gemini 4 Carbon', dot: '', group: 'ai' },
    { path: 'ai/memory.html', icon: 'plop-ico-moon', title: 'Agent 记忆架构', dot: 'pink', group: 'ai' },
    { path: 'ai/context-memory.html', icon: 'plop-ico-puzzle', title: '上下文与记忆工程', dot: 'mustard', group: 'ai' },
    { path: 'ai/qdrant.html', icon: 'plop-ico-target', title: 'Qdrant 与 RAG 检索', dot: 'tomato', group: 'ai', recent: true },
    { path: 'ai/sse-idempotency.html', icon: 'plop-ico-radar', title: 'SSE · 幂等 · 上下文压缩', dot: 'mustard', group: 'ai', recent: true },
    { path: 'ai/agent-production.html', icon: 'plop-ico-shield', title: 'Agent 生产工程化全景', dot: 'pink', group: 'ai', recent: true },
    { path: 'pi-agent/index.html', icon: 'plop-ico-bot', title: 'Coding Agent (pi)', dot: 'periwinkle', group: 'ai' },
    { path: 'pi-agent/guide.html', icon: 'plop-ico-compass', title: 'Pi 源码与架构权衡', dot: 'mint', group: 'ai' },
    { path: 'mysql/index.html', aliases: ['mysql/principles.html', 'mysql/principles'], icon: 'plop-ico-db', title: 'MySQL 基础与原理', dot: 'mint', group: 'db' },
    { path: 'postgres/index.html', aliases: ['postgres/principles.html', 'postgres/principles'], icon: 'plop-ico-pg', title: 'PostgreSQL 基础与原理', dot: 'periwinkle', group: 'db' },
    { path: 'redis/index.html', aliases: ['redis/principles.html', 'redis/principles'], icon: 'plop-ico-redis', title: 'Redis 基础与原理', dot: 'pink', group: 'db' },
    { path: 'go/index.html', aliases: ['go/principles.html', 'go/principles'], icon: 'plop-ico-code', title: 'Go 语言与原理', dot: 'mustard', group: 'sys' },
    { path: 'node/index.html', aliases: ['node/principles.html', 'node/principles'], icon: 'plop-ico-hex', title: 'Node.js 基础与原理', dot: 'mint', group: 'sys' },
    { path: 'os/index.html', aliases: ['os/principles.html', 'os/principles'], icon: 'plop-ico-cpu', title: 'Linux 操作系统', dot: 'mint', group: 'sys' },
    { path: 'mq/index.html', aliases: ['mq/principles.html', 'mq/principles'], icon: 'plop-ico-mq', title: '消息队列基础与原理', dot: '', group: 'sys' },
    { path: 'backend/reliability.html', icon: 'plop-ico-shield', title: '稳定性七件套与防线', dot: 'tomato', group: 'sys', recent: true },
    { path: 'browser/index.html', aliases: ['browser/principles.html', 'browser/principles'], icon: 'plop-ico-globe', title: '浏览器工作原理', dot: 'periwinkle', group: 'sys' },
    { path: 'webrtc/index.html', aliases: ['webrtc/principles.html', 'webrtc/principles'], icon: 'plop-ico-video', title: '音视频与 WebRTC', dot: 'mint', group: 'sys', recent: true }
  ];

  const TOPIC_GROUPS = [
    { key: 'ai', icon: 'plop-ico-bot', label: 'AI 与 Agent', theme: '' },
    { key: 'db', icon: 'plop-ico-db', label: '数据库缓存', theme: 'mint' },
    { key: 'sys', icon: 'plop-ico-cog', label: '后端与系统', theme: 'periwinkle' }
  ];
  window.NOTE_GARDEN_TOPICS = NOTE_GARDEN_TOPICS;

  function plopIconHtml(id) {
    return `<svg class="plop-ico" aria-hidden="true"><use href="#${id}"></use></svg>`;
  }

  // 2. 立即恢复用户上次选择的桌面材质，避免首屏闪烁
  try {
    const savedSurface = localStorage.getItem(STORAGE_SURFACE_KEY);
    if (savedSurface) {
      document.documentElement.setAttribute('data-plop-surface', savedSurface);
    } else if (!document.documentElement.hasAttribute('data-plop-surface')) {
      document.documentElement.setAttribute('data-plop-surface', 'mat');
    }
  } catch (e) {}

  // 3. 统一材质切换函数（兼容首页 setPlopSurface 与内页 setSurface）
  function applySurface(surface, btn) {
    document.documentElement.setAttribute('data-plop-surface', surface);
    try {
      localStorage.setItem(STORAGE_SURFACE_KEY, surface);
    } catch (e) {}
    if (btn && btn.parentElement) {
      btn.parentElement
        .querySelectorAll('.plop-sticker-btn, .sticker-btn')
        .forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    }
  }
  window.setPlopSurface = applySurface;
  window.setSurface = applySurface;

  // 4. 统一代码块 / 模板一键复制工具
  window.copyText = function (id, btn) {
    const el = document.getElementById(id);
    if (!el) return;
    const text = el.textContent || el.innerText || '';
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(text).then(() => {
      if (!btn) return;
      const old = btn.innerHTML;
      btn.textContent = '✓ 已复制';
      setTimeout(() => {
        btn.innerHTML = old;
      }, 1800);
    });
  };

  // 5. 自动注入共享手绘吉祥物与贴纸 SVG Sprite（如果页面未内联定义）
  function ensurePlopSvgSprite() {
    if (!document.body || document.getElementById('plop-buddy-cap')) return;
    const wrap = document.createElement('div');
    wrap.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none;';
    wrap.setAttribute('aria-hidden', 'true');
    wrap.innerHTML = `
      <svg width="0" height="0" focusable="false" aria-hidden="true">
        <defs>
          <symbol id="plop-buddy-cap" viewBox="2 4 86 70">
            <g fill="var(--plop-paper)" stroke="var(--plop-paper)" stroke-width="10" stroke-linejoin="round">
              <path d="M16 48 C 14 28, 28 18, 44 18 C 60 18, 70 30, 68 46 C 66 60, 56 66, 42 66 C 26 66, 17 60, 16 48 Z"></path>
              <path d="M62 34 C 72 29, 83 31, 83 37 C 77 42, 68 42, 62 40 Z"></path>
            </g>
            <g fill="none" stroke="var(--plop-ink)" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 48 C 14 28, 28 18, 44 18 C 60 18, 70 30, 68 46 C 66 60, 56 66, 42 66 C 26 66, 17 60, 16 48 Z" fill="var(--plop-paper)"></path>
              <path d="M18 49 C 9 45, 7 59, 18 61" fill="var(--plop-paper)"></path>
              <path d="M16 41 C 15 18, 60 10, 68 36 C 50 32, 32 34, 16 41 Z" stroke="none" fill="var(--plop-bubblegum)" transform="translate(2 1.5)"></path>
              <path d="M16 41 C 15 18, 60 10, 68 36 C 50 32, 32 34, 16 41 Z"></path>
              <path d="M62 34 C 72 29, 83 31, 83 37 C 77 42, 68 42, 62 40 Z" fill="var(--plop-paper)"></path>
              <circle cx="40" cy="15" r="2.6" stroke="none" fill="var(--plop-ink)"></circle>
            </g>
            <ellipse cx="46" cy="47" rx="2.6" ry="3.8" fill="var(--plop-ink)"></ellipse>
            <ellipse cx="58" cy="46" rx="2.6" ry="3.8" fill="var(--plop-ink)"></ellipse>
            <path d="M46 56 C 51 61, 58 60, 62 53" fill="none" stroke="var(--plop-ink)" stroke-width="3.2" stroke-linecap="round"></path>
          </symbol>

          <symbol id="plop-buddy-beanie" viewBox="2 2 56 56">
            <path d="M30 15 C 42 15, 48 23, 47 34 C 46 45, 39 51, 29 51 C 19 51, 12 44, 12 33 C 12 22, 18 15, 30 15 Z" fill="var(--plop-paper)" stroke="var(--plop-ink)" stroke-width="3" stroke-linejoin="round"></path>
            <ellipse cx="23" cy="39" rx="3" ry="1.8" fill="var(--plop-bubblegum)"></ellipse>
            <ellipse cx="43" cy="38" rx="2.4" ry="1.6" fill="var(--plop-bubblegum)"></ellipse>
            <path d="M12 29 C 11 12, 47 10, 47 28 Z" fill="var(--plop-mustard)" transform="translate(1.5 1.2)"></path>
            <path d="M12 29 C 11 12, 47 10, 47 28 Z" fill="none" stroke="var(--plop-ink)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path>
            <circle cx="29" cy="9" r="4" fill="var(--plop-paper)" stroke="var(--plop-ink)" stroke-width="2.6"></circle>
            <ellipse cx="28" cy="33" rx="2" ry="3.1" fill="var(--plop-ink)"></ellipse>
            <ellipse cx="38" cy="32" rx="2" ry="3.1" fill="var(--plop-ink)"></ellipse>
            <path d="M28.5 40 C 30 46, 38 46, 40 39 Z" fill="var(--plop-tomato)" stroke="var(--plop-ink)" stroke-width="2.3" stroke-linejoin="round"></path>
          </symbol>

          <symbol id="plop-buddy-girl" viewBox="6 4 52 54">
            <path d="M13 42 C 11 24, 20 14, 32 14 C 44 14, 53 24, 51 42 C 50 50, 46 53, 42 52 L 22 52 C 18 53, 14 50, 13 42 Z" fill="#1E2D7D" stroke="var(--plop-ink)" stroke-width="3.2" stroke-linejoin="round"></path>
            <path d="M32 14 C 31 7, 23 5, 21 9 C 21 13, 27 14, 32 14 Z" fill="var(--plop-mint)" stroke="var(--plop-ink)" stroke-width="2.6" stroke-linejoin="round"></path>
            <path d="M32 14 C 33 7, 41 5, 43 9 C 43 13, 37 14, 32 14 Z" fill="var(--plop-mint)" stroke="var(--plop-ink)" stroke-width="2.6" stroke-linejoin="round"></path>
            <circle cx="16.5" cy="39" r="4" fill="var(--plop-paper)" stroke="var(--plop-ink)" stroke-width="2.8"></circle>
            <circle cx="47.5" cy="39" r="4" fill="var(--plop-paper)" stroke="var(--plop-ink)" stroke-width="2.8"></circle>
            <path d="M18 36 C 18 24, 24 20, 32 20 C 40 20, 46 24, 46 36 C 46 47, 40 52, 32 52 C 24 52, 18 47, 18 36 Z" fill="var(--plop-paper)" stroke="var(--plop-ink)" stroke-width="3" stroke-linejoin="round"></path>
            <path d="M17 33 C 17 21, 24 16, 32 16 C 40 16, 47 21, 47 33 C 43 27, 39 29, 36 25 C 33 29, 28 29, 25 25 C 22 29, 19 28, 17 33 Z" fill="#1E2D7D" stroke="var(--plop-ink)" stroke-width="3" stroke-linejoin="round"></path>
            <rect x="40" y="21" width="7.5" height="3.6" rx="1.8" transform="rotate(18 40 21)" fill="var(--plop-bubblegum)" stroke="var(--plop-ink)" stroke-width="2"></rect>
            <ellipse cx="21.5" cy="43.5" rx="3.2" ry="2" fill="var(--plop-bubblegum)"></ellipse>
            <ellipse cx="42.5" cy="43.5" rx="3.2" ry="2" fill="var(--plop-bubblegum)"></ellipse>
            <circle cx="25.5" cy="38" r="2.3" fill="var(--plop-ink)"></circle>
            <circle cx="38.5" cy="38" r="2.3" fill="var(--plop-ink)"></circle>
            <circle cx="24.8" cy="37.2" r="0.8" fill="var(--plop-paper)"></circle>
            <circle cx="37.8" cy="37.2" r="0.8" fill="var(--plop-paper)"></circle>
            <circle cx="25.5" cy="38" r="6.3" fill="rgba(197, 212, 247, 0.28)" stroke="var(--plop-tomato)" stroke-width="2.8"></circle>
            <circle cx="38.5" cy="38" r="6.3" fill="rgba(197, 212, 247, 0.28)" stroke="var(--plop-tomato)" stroke-width="2.8"></circle>
            <path d="M31.8 37.5 Q 32 36 32.2 37.5" fill="none" stroke="var(--plop-tomato)" stroke-width="2.8" stroke-linecap="round"></path>
            <path d="M22 34.5 L 24 33" fill="none" stroke="var(--plop-paper)" stroke-width="1.6" stroke-linecap="round"></path>
            <path d="M35 34.5 L 37 33" fill="none" stroke="var(--plop-paper)" stroke-width="1.6" stroke-linecap="round"></path>
            <path d="M29 46 C 30.8 48.6, 33.2 48.6, 35 46" fill="none" stroke="var(--plop-ink)" stroke-width="2.6" stroke-linecap="round"></path>
          </symbol>

          <symbol id="plop-sticker-coffee" viewBox="0 0 64 64">
            <path d="M14 24 L 46 24 L 43 52 C 42 56, 36 58, 30 58 C 24 58, 18 56, 17 52 Z" fill="var(--plop-mustard)" stroke="var(--plop-ink)" stroke-width="3.2" stroke-linejoin="round"/>
            <path d="M46 28 C 55 28, 56 42, 44 44" fill="none" stroke="var(--plop-ink)" stroke-width="3.2" stroke-linecap="round"/>
            <ellipse cx="30" cy="24" rx="16" ry="4.5" fill="var(--plop-paper)" stroke="var(--plop-ink)" stroke-width="3"/>
            <path d="M22 15 C 20 10, 26 9, 24 5" fill="none" stroke="var(--plop-tomato)" stroke-width="2.6" stroke-linecap="round"/>
            <path d="M32 14 C 30 9, 36 8, 34 4" fill="none" stroke="var(--plop-tomato)" stroke-width="2.6" stroke-linecap="round"/>
            <circle cx="25" cy="38" r="2.2" fill="var(--plop-ink)"/>
            <circle cx="35" cy="38" r="2.2" fill="var(--plop-ink)"/>
            <path d="M27 44 C 29 47, 32 47, 34 44" fill="none" stroke="var(--plop-ink)" stroke-width="2.5" stroke-linecap="round"/>
          </symbol>

          <symbol id="plop-sticker-star" viewBox="0 0 64 64">
            <path d="M32 6 L 39 24 L 58 26 L 43 38 L 48 56 L 32 46 L 16 56 L 21 38 L 6 26 L 25 24 Z" fill="var(--plop-mustard)" stroke="var(--plop-ink)" stroke-width="3.2" stroke-linejoin="round"/>
            <circle cx="27" cy="31" r="2.3" fill="var(--plop-ink)"/>
            <circle cx="37" cy="31" r="2.3" fill="var(--plop-ink)"/>
            <path d="M28 38 C 30 41, 34 41, 36 38" fill="none" stroke="var(--plop-ink)" stroke-width="2.4" stroke-linecap="round"/>
          </symbol>

          <!-- Unified Hand-Drawn Riso Sticker Icon Library (24x24, #2848D8 Cobalt Ink + Pastel Fills) -->
          <symbol id="plop-ico-home" viewBox="0 0 24 24">
            <path d="M4.5 10.5 V19.5 C4.5 20.1 4.9 20.5 5.5 20.5 H18.5 C19.1 20.5 19.5 20.1 19.5 19.5 V10.5 Z" fill="var(--plop-paper)" stroke="var(--plop-ink)" stroke-width="2.1" stroke-linejoin="round"/>
            <path d="M2.5 11.2 L12 3.2 L21.5 11.2 Z" fill="var(--plop-tomato)" stroke="var(--plop-ink)" stroke-width="2.1" stroke-linejoin="round"/>
            <path d="M9.8 20.5 V14.2 C9.8 13.5 10.3 13 11 13 H13 C13.7 13 14.2 13.5 14.2 14.2 V20.5 Z" fill="var(--plop-mustard)" stroke="var(--plop-ink)" stroke-width="2" stroke-linejoin="round"/>
          </symbol>
          <symbol id="plop-ico-top" viewBox="0 0 24 24">
            <path d="M12 3.8 L5.2 11.2 H9.3 V17.2 C9.3 17.8 9.7 18.2 10.3 18.2 H13.7 C14.3 18.2 14.7 17.8 14.7 17.2 V11.2 H18.8 Z" fill="var(--plop-mustard)" stroke="var(--plop-ink)" stroke-width="2.2" stroke-linejoin="round"/>
            <line x1="6.5" y1="21" x2="17.5" y2="21" stroke="var(--plop-ink)" stroke-width="2.2" stroke-linecap="round"/>
          </symbol>
          <symbol id="plop-ico-sprout" viewBox="0 0 24 24">
            <path d="M12 13.5 C10.2 8.8 5.2 7.5 3.6 9.8 C3.6 13.4 7.8 15 12 13.5 Z" fill="var(--plop-mint)" stroke="var(--plop-ink)" stroke-width="2.1" stroke-linejoin="round"/>
            <path d="M12 11.8 C13.8 6.8 19 5.5 20.4 8 C20.4 11.8 16.2 13.4 12 11.8 Z" fill="var(--plop-mint)" stroke="var(--plop-ink)" stroke-width="2.1" stroke-linejoin="round"/>
            <path d="M12 20 V11.5" fill="none" stroke="var(--plop-ink)" stroke-width="2.2" stroke-linecap="round"/>
            <path d="M7.5 20.2 C10 19.2 14 19.2 16.5 20.2" fill="none" stroke="var(--plop-mustard)" stroke-width="2.4" stroke-linecap="round"/>
          </symbol>
          <symbol id="plop-ico-book" viewBox="0 0 24 24">
            <path d="M3 5.5 C6.5 4.5 10 5.2 12 6.8 C14 5.2 17.5 4.5 21 5.5 V18.8 C17.5 17.8 14 18.5 12 20 C10 18.5 6.5 17.8 3 18.8 Z" fill="var(--plop-paper)" stroke="var(--plop-ink)" stroke-width="2.1" stroke-linejoin="round"/>
            <line x1="12" y1="6.8" x2="12" y2="20" stroke="var(--plop-ink)" stroke-width="2"/>
            <path d="M15.2 5.2 V12 L17 10.6 L18.8 12 V5.3 Z" fill="var(--plop-tomato)" stroke="var(--plop-ink)" stroke-width="1.8" stroke-linejoin="round"/>
          </symbol>
          <symbol id="plop-ico-blueprint" viewBox="0 0 24 24">
            <rect x="4.5" y="3.5" width="15" height="17" rx="2.5" fill="var(--plop-periwinkle)" stroke="var(--plop-ink)" stroke-width="2.1"/>
            <line x1="8.2" y1="3.5" x2="8.2" y2="20.5" stroke="var(--plop-ink)" stroke-width="2"/>
            <path d="M14 8 L15.1 10.6 L17.8 10.9 L15.8 12.7 L16.3 15.4 L14 14 L11.7 15.4 L12.2 12.7 L10.2 10.9 L12.9 10.6 Z" fill="var(--plop-mustard)" stroke="var(--plop-ink)" stroke-width="1.7" stroke-linejoin="round"/>
          </symbol>
          <symbol id="plop-ico-folder" viewBox="0 0 24 24">
            <path d="M3 7.5 C3 6.4 3.9 5.5 5 5.5 H9.5 L11.5 8 H19 C20.1 8 21 8.9 21 10 V18 C21 19.1 20.1 20 19 20 H5 C3.9 20 3 19.1 3 18 Z" fill="var(--plop-mustard)" stroke="var(--plop-ink)" stroke-width="2.1" stroke-linejoin="round"/>
            <rect x="5.5" y="11" width="13" height="9" rx="1.5" fill="var(--plop-paper)" stroke="var(--plop-ink)" stroke-width="1.9"/>
          </symbol>
          <symbol id="plop-ico-dice" viewBox="0 0 24 24">
            <rect x="4" y="4" width="16" height="16" rx="3.5" fill="var(--plop-bubblegum)" stroke="var(--plop-ink)" stroke-width="2.1"/>
            <circle cx="8.5" cy="8.5" r="1.5" fill="var(--plop-ink)"/>
            <circle cx="12" cy="12" r="1.5" fill="var(--plop-ink)"/>
            <circle cx="15.5" cy="15.5" r="1.5" fill="var(--plop-ink)"/>
          </symbol>
          <symbol id="plop-ico-palette" viewBox="0 0 24 24">
            <path d="M12 3.5 C7 3.5 3 7.3 3 12 C3 16.8 7 20.5 11.5 20.5 C13 20.5 14 19.5 14 18.2 C14 17.2 13.4 16.6 13.4 15.8 C13.4 14.8 14.3 14 15.5 14 H17.2 C19.5 14 21 12.2 21 9.8 C21 6.2 17 3.5 12 3.5 Z" fill="var(--plop-paper)" stroke="var(--plop-ink)" stroke-width="2.1"/>
            <circle cx="8" cy="10" r="1.6" fill="var(--plop-tomato)"/>
            <circle cx="12" cy="7.8" r="1.6" fill="var(--plop-mustard)"/>
            <circle cx="16" cy="9.8" r="1.6" fill="var(--plop-mint)"/>
          </symbol>
          <symbol id="plop-ico-sw-mat" viewBox="0 0 24 24">
            <rect x="4" y="4" width="16" height="16" rx="3.2" fill="#2E6B55" stroke="var(--plop-ink)" stroke-width="2.1"/>
            <line x1="4" y1="12" x2="20" y2="12" stroke="#FFF8E7" stroke-width="1.4"/>
            <line x1="12" y1="4" x2="12" y2="20" stroke="#FFF8E7" stroke-width="1.4"/>
          </symbol>
          <symbol id="plop-ico-sw-poster" viewBox="0 0 24 24">
            <path d="M5 3.5 H14.5 L19 8 V20.5 H5 Z" fill="var(--plop-paper)" stroke="var(--plop-ink)" stroke-width="2.1" stroke-linejoin="round"/>
            <path d="M14.5 3.5 V8 H19 Z" fill="var(--plop-mustard)" stroke="var(--plop-ink)" stroke-width="1.9" stroke-linejoin="round"/>
          </symbol>
          <symbol id="plop-ico-sw-note" viewBox="0 0 24 24">
            <rect x="5" y="3.5" width="14" height="17" rx="2.2" fill="var(--plop-paper)" stroke="var(--plop-ink)" stroke-width="2.1"/>
            <line x1="8.5" y1="3.5" x2="8.5" y2="20.5" stroke="var(--plop-bubblegum)" stroke-width="1.8"/>
            <line x1="5" y1="9.5" x2="19" y2="9.5" stroke="var(--plop-periwinkle)" stroke-width="1.6"/>
            <line x1="5" y1="14.5" x2="19" y2="14.5" stroke="var(--plop-periwinkle)" stroke-width="1.6"/>
          </symbol>
          <symbol id="plop-ico-sw-kraft" viewBox="0 0 24 24">
            <rect x="4" y="4.5" width="16" height="15" rx="2.5" fill="#D9B98E" stroke="var(--plop-ink)" stroke-width="2.1"/>
            <rect x="9.5" y="4.5" width="5" height="6" fill="var(--plop-mustard)" stroke="var(--plop-ink)" stroke-width="1.8"/>
          </symbol>
          <symbol id="plop-ico-sw-riso" viewBox="0 0 24 24">
            <circle cx="12" cy="7" r="3.6" fill="var(--plop-bubblegum)" stroke="var(--plop-ink)" stroke-width="1.9"/>
            <circle cx="16.8" cy="10.6" r="3.6" fill="var(--plop-bubblegum)" stroke="var(--plop-ink)" stroke-width="1.9"/>
            <circle cx="15" cy="16.2" r="3.6" fill="var(--plop-bubblegum)" stroke="var(--plop-ink)" stroke-width="1.9"/>
            <circle cx="9" cy="16.2" r="3.6" fill="var(--plop-bubblegum)" stroke="var(--plop-ink)" stroke-width="1.9"/>
            <circle cx="7.2" cy="10.6" r="3.6" fill="var(--plop-bubblegum)" stroke="var(--plop-ink)" stroke-width="1.9"/>
            <circle cx="12" cy="12" r="3.2" fill="var(--plop-mustard)" stroke="var(--plop-ink)" stroke-width="2"/>
          </symbol>
          <symbol id="plop-ico-spark" viewBox="0 0 24 24">
            <path d="M11 3 L13.4 9.2 L19.5 11.5 L13.4 13.8 L11 20 L8.6 13.8 L2.5 11.5 L8.6 9.2 Z" fill="var(--plop-mustard)" stroke="var(--plop-ink)" stroke-width="2.1" stroke-linejoin="round"/>
            <circle cx="18.5" cy="5.5" r="2" fill="var(--plop-bubblegum)" stroke="var(--plop-ink)" stroke-width="1.7"/>
          </symbol>
          <symbol id="plop-ico-moon" viewBox="0 0 24 24">
            <path d="M18.5 15.2 C14.2 16.2 9.8 12.8 10.2 8 C10.4 6.2 11.2 4.6 12.4 3.5 C7.2 4 3.5 8.5 4 13.8 C4.5 18.8 9 22 14 21 C16.4 20.5 18.4 18.8 19.5 16.5 C19.2 15.8 18.8 15.4 18.5 15.2 Z" fill="var(--plop-mustard)" stroke="var(--plop-ink)" stroke-width="2.1" stroke-linejoin="round"/>
            <circle cx="17.5" cy="7.5" r="2" fill="var(--plop-periwinkle)" stroke="var(--plop-ink)" stroke-width="1.8"/>
          </symbol>
          <symbol id="plop-ico-puzzle" viewBox="0 0 24 24">
            <path d="M5 7 H9.5 C9.5 5.2 12.5 5.2 12.5 7 H17 V11.5 C18.8 11.5 18.8 14.5 17 14.5 V19 H5 V14.5 C6.8 14.5 6.8 11.5 5 11.5 Z" fill="var(--plop-mint)" stroke="var(--plop-ink)" stroke-width="2.1" stroke-linejoin="round"/>
          </symbol>
          <symbol id="plop-ico-target" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="8.5" fill="var(--plop-tomato)" stroke="var(--plop-ink)" stroke-width="2.1"/>
            <circle cx="12" cy="12" r="5.2" fill="var(--plop-paper)" stroke="var(--plop-ink)" stroke-width="1.9"/>
            <circle cx="12" cy="12" r="2.1" fill="var(--plop-mustard)" stroke="var(--plop-ink)" stroke-width="1.7"/>
          </symbol>
          <symbol id="plop-ico-radar" viewBox="0 0 24 24">
            <path d="M5.5 17.5 C3.2 14.2 3.2 9.8 5.5 6.5" fill="none" stroke="var(--plop-ink)" stroke-width="2.2" stroke-linecap="round"/>
            <path d="M18.5 6.5 C20.8 9.8 20.8 14.2 18.5 17.5" fill="none" stroke="var(--plop-ink)" stroke-width="2.2" stroke-linecap="round"/>
            <path d="M8.5 15 C7.2 13.2 7.2 10.8 8.5 9" fill="none" stroke="var(--plop-ink)" stroke-width="2.1" stroke-linecap="round"/>
            <path d="M15.5 9 C16.8 10.8 16.8 13.2 15.5 15" fill="none" stroke="var(--plop-ink)" stroke-width="2.1" stroke-linecap="round"/>
            <circle cx="12" cy="12" r="2.8" fill="var(--plop-tomato)" stroke="var(--plop-ink)" stroke-width="2"/>
          </symbol>
          <symbol id="plop-ico-horn" viewBox="0 0 24 24">
            <path d="M4 10.2 H7.5 L16.5 5.5 V18.5 L7.5 13.8 H4 C3.4 13.8 3 13.4 3 12.8 V11.2 C3 10.6 3.4 10.2 4 10.2 Z" fill="var(--plop-mustard)" stroke="var(--plop-ink)" stroke-width="2.1" stroke-linejoin="round"/>
            <path d="M6.5 13.8 L8 19.2 H10.5 L9.2 14.2" fill="var(--plop-tomato)" stroke="var(--plop-ink)" stroke-width="1.9" stroke-linejoin="round"/>
            <path d="M19.5 9.2 C20.8 10.8 20.8 13.2 19.5 14.8" fill="none" stroke="var(--plop-ink)" stroke-width="2.1" stroke-linecap="round"/>
          </symbol>
          <symbol id="plop-ico-shield" viewBox="0 0 24 24">
            <path d="M12 3.2 L19.5 6.2 V11.8 C19.5 16.4 16.3 19.6 12 21 C7.7 19.6 4.5 16.4 4.5 11.8 V6.2 Z" fill="var(--plop-mint)" stroke="var(--plop-ink)" stroke-width="2.1" stroke-linejoin="round"/>
            <path d="M8.8 12.2 L11.1 14.5 L15.5 9.8" fill="none" stroke="var(--plop-ink)" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/>
          </symbol>
          <symbol id="plop-ico-bot" viewBox="0 0 24 24">
            <line x1="12" y1="3.5" x2="12" y2="7" stroke="var(--plop-ink)" stroke-width="2.1" stroke-linecap="round"/>
            <circle cx="12" cy="3.5" r="1.8" fill="var(--plop-tomato)" stroke="var(--plop-ink)" stroke-width="1.7"/>
            <rect x="4.5" y="7" width="15" height="12.5" rx="3.5" fill="var(--plop-periwinkle)" stroke="var(--plop-ink)" stroke-width="2.1"/>
            <rect x="7.2" y="10" width="9.6" height="5" rx="2" fill="var(--plop-paper)" stroke="var(--plop-ink)" stroke-width="1.8"/>
            <circle cx="9.8" cy="12.5" r="1.2" fill="var(--plop-ink)"/>
            <circle cx="14.2" cy="12.5" r="1.2" fill="var(--plop-ink)"/>
          </symbol>
          <symbol id="plop-ico-compass" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="8.8" fill="var(--plop-paper)" stroke="var(--plop-ink)" stroke-width="2.1"/>
            <polygon points="16.2,7.8 13.5,13.5 7.8,16.2 10.5,10.5" fill="var(--plop-tomato)" stroke="var(--plop-ink)" stroke-width="1.8" stroke-linejoin="round"/>
            <circle cx="12" cy="12" r="1.5" fill="var(--plop-mustard)" stroke="var(--plop-ink)" stroke-width="1.5"/>
          </symbol>
          <symbol id="plop-ico-db" viewBox="0 0 24 24">
            <path d="M5 7 V17 C5 19 8.1 20.5 12 20.5 C15.9 20.5 19 19 19 17 V7" fill="var(--plop-mint)" stroke="var(--plop-ink)" stroke-width="2.1" stroke-linejoin="round"/>
            <ellipse cx="12" cy="7" rx="7" ry="3.2" fill="var(--plop-mustard)" stroke="var(--plop-ink)" stroke-width="2.1"/>
            <path d="M5 12 C5 13.8 8.1 15.2 12 15.2 C15.9 15.2 19 13.8 19 12" fill="none" stroke="var(--plop-ink)" stroke-width="2"/>
          </symbol>
          <symbol id="plop-ico-pg" viewBox="0 0 24 24">
            <path d="M4.5 7 V16.8 C4.5 18.8 7.6 20.2 11.5 20.2 C15.4 20.2 18.5 18.8 18.5 16.8 V7" fill="var(--plop-periwinkle)" stroke="var(--plop-ink)" stroke-width="2.1"/>
            <ellipse cx="11.5" cy="7" rx="7" ry="3" fill="var(--plop-paper)" stroke="var(--plop-ink)" stroke-width="2.1"/>
            <circle cx="17" cy="16.5" r="3.5" fill="var(--plop-mustard)" stroke="var(--plop-ink)" stroke-width="1.9"/>
          </symbol>
          <symbol id="plop-ico-redis" viewBox="0 0 24 24">
            <polygon points="12,13 20.5,17 12,21 3.5,17" fill="var(--plop-bubblegum)" stroke="var(--plop-ink)" stroke-width="2" stroke-linejoin="round"/>
            <polygon points="12,8.2 20.5,12.2 12,16.2 3.5,12.2" fill="var(--plop-paper)" stroke="var(--plop-ink)" stroke-width="2" stroke-linejoin="round"/>
            <polygon points="12,3.4 20.5,7.4 12,11.4 3.5,7.4" fill="var(--plop-mustard)" stroke="var(--plop-ink)" stroke-width="2.1" stroke-linejoin="round"/>
          </symbol>
          <symbol id="plop-ico-code" viewBox="0 0 24 24">
            <rect x="3.5" y="4.5" width="17" height="15" rx="3" fill="var(--plop-paper)" stroke="var(--plop-ink)" stroke-width="2.1"/>
            <path d="M3.5 8.5 H20.5" stroke="var(--plop-ink)" stroke-width="1.9"/>
            <path d="M8 12 L10.8 14.2 L8 16.4" fill="none" stroke="var(--plop-tomato)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="12.5" y1="16.4" x2="16" y2="16.4" stroke="var(--plop-ink)" stroke-width="2.2" stroke-linecap="round"/>
          </symbol>
          <symbol id="plop-ico-hex" viewBox="0 0 24 24">
            <polygon points="12,3.2 19.8,7.6 19.8,16.4 12,20.8 4.2,16.4 4.2,7.6" fill="var(--plop-mint)" stroke="var(--plop-ink)" stroke-width="2.1" stroke-linejoin="round"/>
            <circle cx="12" cy="12" r="3.4" fill="var(--plop-mustard)" stroke="var(--plop-ink)" stroke-width="2"/>
          </symbol>
          <symbol id="plop-ico-cpu" viewBox="0 0 24 24">
            <rect x="6" y="6" width="12" height="12" rx="2.5" fill="var(--plop-mint)" stroke="var(--plop-ink)" stroke-width="2.1"/>
            <rect x="9.2" y="9.2" width="5.6" height="5.6" rx="1" fill="var(--plop-paper)" stroke="var(--plop-ink)" stroke-width="1.9"/>
            <path d="M9 3 V6 M15 3 V6 M9 18 V21 M15 18 V21 M3 9 H6 M3 15 H6 M18 9 H21 M18 15 H21" stroke="var(--plop-ink)" stroke-width="2.1" stroke-linecap="round"/>
          </symbol>
          <symbol id="plop-ico-mq" viewBox="0 0 24 24">
            <rect x="4" y="6" width="16.5" height="12" rx="2.5" fill="var(--plop-paper)" stroke="var(--plop-ink)" stroke-width="2.1"/>
            <path d="M4.5 7 L12.2 13 L20 7 Z" fill="var(--plop-mustard)" stroke="var(--plop-ink)" stroke-width="2" stroke-linejoin="round"/>
            <line x1="1.8" y1="10" x2="4" y2="10" stroke="var(--plop-tomato)" stroke-width="2.2" stroke-linecap="round"/>
            <line x1="1.8" y1="14" x2="4" y2="14" stroke="var(--plop-tomato)" stroke-width="2.2" stroke-linecap="round"/>
          </symbol>
          <symbol id="plop-ico-globe" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="8.6" fill="var(--plop-periwinkle)" stroke="var(--plop-ink)" stroke-width="2.1"/>
            <ellipse cx="12" cy="12" rx="4" ry="8.6" fill="var(--plop-mint)" stroke="var(--plop-ink)" stroke-width="1.9"/>
            <line x1="3.6" y1="12" x2="20.4" y2="12" stroke="var(--plop-ink)" stroke-width="1.9"/>
          </symbol>
          <symbol id="plop-ico-video" viewBox="0 0 24 24">
            <rect x="3" y="6.5" width="12.5" height="11" rx="2.5" fill="var(--plop-mint)" stroke="var(--plop-ink)" stroke-width="2.1"/>
            <polygon points="15.5,10 21,7.2 21,16.8 15.5,14" fill="var(--plop-mustard)" stroke="var(--plop-ink)" stroke-width="2.1" stroke-linejoin="round"/>
            <circle cx="7.2" cy="10.2" r="1.6" fill="var(--plop-tomato)"/>
          </symbol>
          <symbol id="plop-ico-map" viewBox="0 0 24 24">
            <polygon points="3,6 9,4 9,18 3,20" fill="var(--plop-mint)" stroke="var(--plop-ink)" stroke-width="2" stroke-linejoin="round"/>
            <polygon points="9,4 15,6 15,20 9,18" fill="var(--plop-paper)" stroke="var(--plop-ink)" stroke-width="2" stroke-linejoin="round"/>
            <polygon points="15,6 21,4 21,18 15,20" fill="var(--plop-mustard)" stroke="var(--plop-ink)" stroke-width="2" stroke-linejoin="round"/>
          </symbol>
          <symbol id="plop-ico-scale" viewBox="0 0 24 24">
            <line x1="12" y1="4" x2="12" y2="20" stroke="var(--plop-ink)" stroke-width="2.2" stroke-linecap="round"/>
            <line x1="5" y1="7.5" x2="19" y2="7.5" stroke="var(--plop-ink)" stroke-width="2.1" stroke-linecap="round"/>
            <path d="M3.2 14 H8.8 C8.8 16.2 3.2 16.2 3.2 14 Z" fill="var(--plop-mustard)" stroke="var(--plop-ink)" stroke-width="1.9" stroke-linejoin="round"/>
            <path d="M15.2 14 H20.8 C20.8 16.2 15.2 16.2 15.2 14 Z" fill="var(--plop-mint)" stroke="var(--plop-ink)" stroke-width="1.9" stroke-linejoin="round"/>
            <path d="M6 7.5 L3.8 14 M6 7.5 L8.2 14 M18 7.5 L15.8 14 M18 7.5 L20.2 14" stroke="var(--plop-ink)" stroke-width="1.6"/>
            <line x1="8.5" y1="20" x2="15.5" y2="20" stroke="var(--plop-ink)" stroke-width="2.2" stroke-linecap="round"/>
          </symbol>
          <symbol id="plop-ico-blocks" viewBox="0 0 24 24">
            <rect x="3.5" y="12.5" width="8" height="7.5" rx="1.8" fill="var(--plop-mint)" stroke="var(--plop-ink)" stroke-width="2"/>
            <rect x="12.5" y="12.5" width="8" height="7.5" rx="1.8" fill="var(--plop-bubblegum)" stroke="var(--plop-ink)" stroke-width="2"/>
            <rect x="8" y="4.2" width="8" height="7.5" rx="1.8" fill="var(--plop-mustard)" stroke="var(--plop-ink)" stroke-width="2.1"/>
          </symbol>
          <symbol id="plop-ico-flow" viewBox="0 0 24 24">
            <path d="M4.5 9.5 C5.8 5.8 9.8 4 14 4.8 C16.2 5.2 18 6.5 19 8.2" fill="none" stroke="var(--plop-ink)" stroke-width="2.2" stroke-linecap="round"/>
            <polygon points="19.8,4.5 20.2,9.5 15.4,8.6" fill="var(--plop-mustard)" stroke="var(--plop-ink)" stroke-width="1.8" stroke-linejoin="round"/>
            <path d="M19.5 14.5 C18.2 18.2 14.2 20 10 19.2 C7.8 18.8 6 17.5 5 15.8" fill="none" stroke="var(--plop-ink)" stroke-width="2.2" stroke-linecap="round"/>
            <polygon points="4.2,19.5 3.8,14.5 8.6,15.4" fill="var(--plop-mint)" stroke="var(--plop-ink)" stroke-width="1.8" stroke-linejoin="round"/>
          </symbol>
          <symbol id="plop-ico-rocket" viewBox="0 0 24 24">
            <path d="M14.5 4 C18.5 3.5 20.5 5.5 20 9.5 C19.4 13.8 15.5 17.2 11.5 18.5 L5.5 12.5 C6.8 8.5 10.2 4.6 14.5 4 Z" fill="var(--plop-paper)" stroke="var(--plop-ink)" stroke-width="2.1" stroke-linejoin="round"/>
            <circle cx="14.2" cy="9.8" r="2.2" fill="var(--plop-mustard)" stroke="var(--plop-ink)" stroke-width="1.9"/>
            <path d="M5.5 15 L3.5 20.5 L9 18.5 Z" fill="var(--plop-tomato)" stroke="var(--plop-ink)" stroke-width="1.9" stroke-linejoin="round"/>
          </symbol>
          <symbol id="plop-ico-flask" viewBox="0 0 24 24">
            <path d="M9.5 4 H14.5 M10.5 4 V9.2 L5.2 18.2 C4.6 19.2 5.3 20.5 6.5 20.5 H17.5 C18.7 20.5 19.4 19.2 18.8 18.2 L13.5 9.2 V4" fill="var(--plop-paper)" stroke="var(--plop-ink)" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M7.4 14.5 H16.6 L18.6 18 C19.1 19 18.4 20.2 17.3 20.2 H6.7 C5.6 20.2 4.9 19 5.4 18 Z" fill="var(--plop-mint)" stroke="var(--plop-ink)" stroke-width="1.9" stroke-linejoin="round"/>
          </symbol>
          <symbol id="plop-ico-wave" viewBox="0 0 24 24">
            <path d="M3 10.5 C5.5 7.5 8.5 7.5 11 10.5 C13.5 13.5 16.5 13.5 21 9.5" fill="none" stroke="var(--plop-ink)" stroke-width="2.4" stroke-linecap="round"/>
            <path d="M3 16 C5.5 13 8.5 13 11 16 C13.5 19 16.5 19 21 15" fill="none" stroke="var(--plop-tomato)" stroke-width="2.4" stroke-linecap="round"/>
          </symbol>
          <symbol id="plop-ico-chart" viewBox="0 0 24 24">
            <rect x="4" y="12.5" width="4" height="7.5" rx="1" fill="var(--plop-mint)" stroke="var(--plop-ink)" stroke-width="2"/>
            <rect x="10" y="8.5" width="4" height="11.5" rx="1" fill="var(--plop-periwinkle)" stroke="var(--plop-ink)" stroke-width="2"/>
            <rect x="16" y="4.5" width="4" height="15.5" rx="1" fill="var(--plop-mustard)" stroke="var(--plop-ink)" stroke-width="2"/>
            <line x1="2.5" y1="20" x2="21.5" y2="20" stroke="var(--plop-ink)" stroke-width="2.1" stroke-linecap="round"/>
          </symbol>
          <symbol id="plop-ico-link" viewBox="0 0 24 24">
            <rect x="3.2" y="8.5" width="9.5" height="7" rx="3.5" fill="var(--plop-mustard)" stroke="var(--plop-ink)" stroke-width="2.1"/>
            <rect x="11.3" y="8.5" width="9.5" height="7" rx="3.5" fill="var(--plop-mint)" stroke="var(--plop-ink)" stroke-width="2.1"/>
          </symbol>
          <symbol id="plop-ico-clock" viewBox="0 0 24 24">
            <line x1="9.5" y1="3" x2="14.5" y2="3" stroke="var(--plop-ink)" stroke-width="2.2" stroke-linecap="round"/>
            <circle cx="12" cy="13" r="8" fill="var(--plop-paper)" stroke="var(--plop-ink)" stroke-width="2.1"/>
            <path d="M12 8.5 V13 L15.2 14.8" fill="none" stroke="var(--plop-tomato)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
          </symbol>
          <symbol id="plop-ico-bulb" viewBox="0 0 24 24">
            <path d="M9 17 H15 M9.8 20 H14.2" stroke="var(--plop-ink)" stroke-width="2.1" stroke-linecap="round"/>
            <path d="M12 3.5 C8.4 3.5 5.8 6.2 5.8 9.6 C5.8 12 7.2 13.8 8.8 15.2 V17 H15.2 V15.2 C16.8 13.8 18.2 12 18.2 9.6 C18.2 6.2 15.6 3.5 12 3.5 Z" fill="var(--plop-mustard)" stroke="var(--plop-ink)" stroke-width="2.1" stroke-linejoin="round"/>
          </symbol>
          <symbol id="plop-ico-warn" viewBox="0 0 24 24">
            <path d="M12 3.8 L21 19.5 H3 Z" fill="var(--plop-mustard)" stroke="var(--plop-ink)" stroke-width="2.2" stroke-linejoin="round"/>
            <line x1="12" y1="9.5" x2="12" y2="14" stroke="var(--plop-ink)" stroke-width="2.3" stroke-linecap="round"/>
            <circle cx="12" cy="17" r="1.2" fill="var(--plop-tomato)"/>
          </symbol>
          <symbol id="plop-ico-check" viewBox="0 0 24 24">
            <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" fill="var(--plop-mint)" stroke="var(--plop-ink)" stroke-width="2.1"/>
            <path d="M7.8 12.2 L10.8 15.2 L16.5 9" fill="none" stroke="var(--plop-ink)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
          </symbol>
          <symbol id="plop-ico-cross" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="8.5" fill="var(--plop-bubblegum)" stroke="var(--plop-ink)" stroke-width="2.1"/>
            <path d="M9 9 L15 15 M15 9 L9 15" stroke="var(--plop-tomato)" stroke-width="2.4" stroke-linecap="round"/>
          </symbol>
          <symbol id="plop-ico-flame" viewBox="0 0 24 24">
            <path d="M12.5 3.2 C13 7.2 18.5 8.8 18.5 14 C18.5 17.8 15.6 20.5 12 20.5 C8.4 20.5 5.5 17.8 5.5 13.8 C5.5 10.5 7.8 8.2 9.2 6.8 C9.2 9 10.5 9.8 11.2 9.8 C10.6 7.2 11.2 4.8 12.5 3.2 Z" fill="var(--plop-tomato)" stroke="var(--plop-ink)" stroke-width="2.1" stroke-linejoin="round"/>
            <path d="M12 12.2 C13.5 13.5 14.5 14.8 14.5 16.5 C14.5 18 13.4 19.2 12 19.2 C10.6 19.2 9.5 18 9.5 16.5 C9.5 14.8 10.8 13.5 12 12.2 Z" fill="var(--plop-mustard)"/>
          </symbol>
          <symbol id="plop-ico-pin" viewBox="0 0 24 24">
            <circle cx="12" cy="9.5" r="5" fill="var(--plop-tomato)" stroke="var(--plop-ink)" stroke-width="2.1"/>
            <circle cx="12" cy="9.5" r="1.8" fill="var(--plop-paper)"/>
            <line x1="12" y1="14.5" x2="12" y2="20.8" stroke="var(--plop-ink)" stroke-width="2.2" stroke-linecap="round"/>
          </symbol>
          <symbol id="plop-ico-ruler" viewBox="0 0 24 24">
            <rect x="3" y="8" width="18" height="8" rx="2" fill="var(--plop-mustard)" stroke="var(--plop-ink)" stroke-width="2.1"/>
            <path d="M7 8 V11.5 M11 8 V13 M15 8 V11.5 M18.5 8 V11.5" stroke="var(--plop-ink)" stroke-width="1.9" stroke-linecap="round"/>
          </symbol>
          <symbol id="plop-ico-search" viewBox="0 0 24 24">
            <circle cx="10.5" cy="10.5" r="6.2" fill="var(--plop-periwinkle)" stroke="var(--plop-ink)" stroke-width="2.1"/>
            <line x1="15.2" y1="15.2" x2="20.2" y2="20.2" stroke="var(--plop-ink)" stroke-width="2.8" stroke-linecap="round"/>
          </symbol>
          <symbol id="plop-ico-lock" viewBox="0 0 24 24">
            <path d="M8 10.5 V7.5 C8 5.3 9.8 3.5 12 3.5 C14.2 3.5 16 5.3 16 7.5 V10.5" fill="none" stroke="var(--plop-ink)" stroke-width="2.2" stroke-linecap="round"/>
            <rect x="5" y="10.5" width="14" height="10" rx="2.5" fill="var(--plop-mustard)" stroke="var(--plop-ink)" stroke-width="2.1"/>
            <circle cx="12" cy="15.5" r="1.6" fill="var(--plop-ink)"/>
          </symbol>
          <symbol id="plop-ico-cog" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="6.5" fill="var(--plop-periwinkle)" stroke="var(--plop-ink)" stroke-width="2.1"/>
            <circle cx="12" cy="12" r="2.6" fill="var(--plop-paper)" stroke="var(--plop-ink)" stroke-width="1.9"/>
            <path d="M12 2.8 V5.2 M12 18.8 V21.2 M2.8 12 H5.2 M18.8 12 H21.2 M5.5 5.5 L7.2 7.2 M16.8 16.8 L18.5 18.5 M18.5 5.5 L16.8 7.2 M7.2 16.8 L5.5 18.5" stroke="var(--plop-ink)" stroke-width="2.2" stroke-linecap="round"/>
          </symbol>
          <symbol id="plop-ico-cloud" viewBox="0 0 24 24">
            <path d="M6.8 18.5 H17.5 C19.8 18.5 21.2 16.8 21.2 14.8 C21.2 12.9 19.8 11.4 18 11.2 C17.4 7.6 14.4 5.5 11.2 5.8 C8.2 6 6.2 8.2 5.8 11 C3.9 11.4 2.8 13 2.8 14.8 C2.8 16.9 4.5 18.5 6.8 18.5 Z" fill="var(--plop-paper)" stroke="var(--plop-ink)" stroke-width="2.1" stroke-linejoin="round"/>
          </symbol>
          <symbol id="plop-ico-doc" viewBox="0 0 24 24">
            <rect x="5" y="4.5" width="14" height="16" rx="2.2" fill="var(--plop-paper)" stroke="var(--plop-ink)" stroke-width="2.1"/>
            <rect x="8.5" y="2.8" width="7" height="3.5" rx="1.2" fill="var(--plop-mustard)" stroke="var(--plop-ink)" stroke-width="1.8"/>
            <path d="M8.5 10.5 H15.5 M8.5 14 H15.5 M8.5 17.2 H13" stroke="var(--plop-ink)" stroke-width="1.9" stroke-linecap="round"/>
          </symbol>
          <symbol id="plop-ico-bolt" viewBox="0 0 24 24">
            <polygon points="13.5,2.8 5.2,13.2 11.4,13.2 10.2,21.2 18.8,10.8 12.6,10.8" fill="var(--plop-mustard)" stroke="var(--plop-ink)" stroke-width="2.1" stroke-linejoin="round"/>
          </symbol>
          <symbol id="plop-ico-box" viewBox="0 0 24 24">
            <polygon points="12,3.2 20,7.5 12,11.8 4,7.5" fill="var(--plop-mustard)" stroke="var(--plop-ink)" stroke-width="2" stroke-linejoin="round"/>
            <polygon points="4,7.5 12,11.8 12,20.5 4,16.2" fill="var(--plop-paper)" stroke="var(--plop-ink)" stroke-width="2" stroke-linejoin="round"/>
            <polygon points="20,7.5 12,11.8 12,20.5 20,16.2" fill="var(--plop-periwinkle)" stroke="var(--plop-ink)" stroke-width="2" stroke-linejoin="round"/>
          </symbol>
          <symbol id="plop-ico-news" viewBox="0 0 24 24">
            <rect x="3.5" y="4.5" width="17" height="15" rx="2.2" fill="var(--plop-paper)" stroke="var(--plop-ink)" stroke-width="2.1"/>
            <rect x="6.5" y="7.5" width="5" height="5" fill="var(--plop-mustard)" stroke="var(--plop-ink)" stroke-width="1.7"/>
            <path d="M14 8 H17.5 M14 11.5 H17.5 M6.5 15.5 H17.5" stroke="var(--plop-ink)" stroke-width="1.9" stroke-linecap="round"/>
          </symbol>
        </defs>
      </svg>
    `;
    document.body.insertBefore(wrap, document.body.firstChild);
  }

  // 7. 自动渲染右侧跨专题书签目录 ([data-plop-topics]) —— 按领域分组折叠，避免超出屏幕视口
  function isTopicActive(item, pathname) {
    return (
      pathname.endsWith('/' + item.path) ||
      (item.path.endsWith('/index.html') &&
        pathname.endsWith('/' + item.path.replace('/index.html', '/'))) ||
      (Array.isArray(item.aliases) &&
        item.aliases.some(alias => pathname.endsWith('/' + alias)))
    );
  }

  function renderEarTabLink(item, prefix, isCurrent) {
    const dotClass = item.dot ? `ear-dot ${item.dot}` : 'ear-dot';
    const activeClass = isCurrent ? ' active' : '';
    const ico = item.icon ? plopIconHtml(item.icon) : `<span class="${dotClass}"></span>`;
    return `<a href="${prefix}${item.path}" class="plop-ear-tab${activeClass}">
      ${ico}
      <span>${item.title}</span>
    </a>`;
  }

  function renderTopicTabs() {
    const containers = document.querySelectorAll('[data-plop-topics]');
    if (!containers.length) return;

    const pathname = window.location.pathname || '';
    const activeTopic = NOTE_GARDEN_TOPICS.find(t => isTopicActive(t, pathname));
    const openGroupKey = activeTopic ? activeTopic.group : 'ai';

    containers.forEach(container => {
      const explicitRoot = container.getAttribute('data-root');
      const isRootPage =
        explicitRoot === '.' ||
        explicitRoot === '' ||
        document.body.classList.contains('plop-garden-body');
      const prefix = explicitRoot !== null ? explicitRoot : isRootPage ? '' : '../';

      // 自动只展开当前所属分组并高亮当前文章，其余两组默认折叠
      container.innerHTML = TOPIC_GROUPS.map(g => {
        const items = NOTE_GARDEN_TOPICS.filter(t => t.group === g.key);
        const themeClass = g.theme ? ` ${g.theme}` : '';
        const openAttr = g.key === openGroupKey ? ' open' : '';
        return `<details class="plop-topic-group${themeClass}"${openAttr}>
          <summary>
            <span style="display:inline-flex;align-items:center;gap:5px;">${plopIconHtml(g.icon)}<span>${g.label} (${items.length})</span></span>
            <span class="plop-topic-group-caret">▾</span>
          </summary>
          <div class="plop-topic-group-list">
            ${items.map(item => renderEarTabLink(item, prefix, !isRootPage && isTopicActive(item, pathname))).join('')}
          </div>
        </details>`;
      }).join('');
    });
  }

  // 8. 锚点跳转时若目标位于折叠抽屉 <details> 内，自动展开对应抽屉
  function revealHashTarget(shouldScroll = false) {
    const id = decodeURIComponent((window.location.hash || '').slice(1));
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;
    for (let el = target; el; el = el.parentElement) {
      if (el.tagName === 'DETAILS') el.open = true;
    }
    if (shouldScroll) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // 9. 自动绑定左侧阅读进度条与章节 Scroll-Spy 高亮
  let refreshScrollSpy = () => {};
  function initWorkbenchScrollSpy() {
    const bar = document.getElementById('read-progress-bar');
    const txt = document.getElementById('read-progress-text');
    const tocLinks = Array.from(document.querySelectorAll('[data-toc]'));
    if (!bar && !txt && !tocLinks.length) return;

    function onScroll() {
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop;
      const maxScroll = Math.max(1, doc.scrollHeight - window.innerHeight);
      const pct = Math.min(100, Math.max(0, Math.round((scrollTop / maxScroll) * 100)));
      if (bar) bar.style.width = pct + '%';
      if (txt) txt.textContent = pct + '%';

      const sections = tocLinks
        .map(a => document.getElementById(a.getAttribute('data-toc')))
        .filter(Boolean);
      if (!sections.length) return;

      let currentId = sections[0].id;
      for (const sec of sections) {
        if (sec.getBoundingClientRect().top <= 140) {
          currentId = sec.id;
        }
      }
      tocLinks.forEach(a => {
        a.classList.toggle('active', a.getAttribute('data-toc') === currentId);
      });
      document.querySelectorAll('.plop-mobile-toc a').forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + currentId);
      });

      // 同步「入门篇 ⇄ 原理篇」切换按钮的当前章节锚点，实现“读到哪一章，切过去就是哪一章”
      const curPath = window.location.pathname || '';
      const isMqPage = curPath.includes('/mq/');
      const mqToPrinciplesMap = {
        overview: 'push-pull',
        concepts: 'push-pull',
        quickstart: 'push-pull',
        scenarios: 'tx-delay',
        reliable: 'eos',
        order: 'advanced',
        arch: 'storage',
        production: 'rebalance',
        quiz: 'advanced'
      };
      const mqToPracticeMap = {
        'push-pull': 'overview',
        eos: 'reliable',
        'tx-delay': 'scenarios',
        storage: 'arch',
        isr: 'reliable',
        rebalance: 'production',
        advanced: 'order'
      };
      const principlesAnchorMap = {
        'linux-cmd': 'tools',
        overview: 'why',
        quickstart: 'why',
        scenarios: 'lock',
        production: 'fast',
        quiz: 'cheat'
      };
      const practiceAnchorMap = {
        why: 'overview',
        fast: 'production',
        lock: 'scenarios'
      };
      document.querySelectorAll('[data-edition-target]').forEach(a => {
        const base = a.getAttribute('data-edition-target');
        if (!base) return;
        let targetHash = currentId;
        if (isMqPage) {
          if (base.includes('principles.html') && mqToPrinciplesMap[currentId]) {
            targetHash = mqToPrinciplesMap[currentId];
          } else if (base.includes('index.html') && mqToPracticeMap[currentId]) {
            targetHash = mqToPracticeMap[currentId];
          }
        } else if (base.includes('principles.html') && principlesAnchorMap[currentId]) {
          targetHash = principlesAnchorMap[currentId];
        } else if (base.includes('index.html') && curPath.includes('/redis/') && practiceAnchorMap[currentId]) {
          targetHash = practiceAnchorMap[currentId];
        }
        const isTopChapter =
          !targetHash || targetHash === 'why' || targetHash === 'overview' || targetHash === 'push-pull';
        a.setAttribute('href', !isTopChapter ? `${base}#${targetHash}` : base);
      });
    }

    refreshScrollSpy = onScroll;
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // 10. 自动并行加载拆分的纯 HTML 章节子文件 ([data-plop-section="sections/01-xxx.html"])
  const SECTION_CACHE_PREFIX = 'plop-sec-v15:';

  const EMOJI_TO_PLOP_ICON = {
    '🌱': 'plop-ico-sprout',
    '🌿': 'plop-ico-sprout',
    '🌳': 'plop-ico-sprout',
    '🌲': 'plop-ico-sprout',
    '⬆️': 'plop-ico-top',
    '⬆': 'plop-ico-top',
    '📖': 'plop-ico-book',
    '📚': 'plop-ico-book',
    '📘': 'plop-ico-blueprint',
    '🗂️': 'plop-ico-folder',
    '🗂': 'plop-ico-folder',
    '📂': 'plop-ico-folder',
    '📁': 'plop-ico-folder',
    '🎲': 'plop-ico-dice',
    '🎨': 'plop-ico-palette',
    '🟩': 'plop-ico-sw-mat',
    '📄': 'plop-ico-sw-poster',
    '📓': 'plop-ico-sw-note',
    '📦': 'plop-ico-sw-kraft',
    '🌸': 'plop-ico-sw-riso',
    '🧠': 'plop-ico-spark',
    '✨': 'plop-ico-spark',
    '🌙': 'plop-ico-moon',
    '🧩': 'plop-ico-puzzle',
    '🎯': 'plop-ico-target',
    '📡': 'plop-ico-radar',
    '📣': 'plop-ico-horn',
    '🛡️': 'plop-ico-shield',
    '🛡': 'plop-ico-shield',
    '🛟': 'plop-ico-shield',
    '🤖': 'plop-ico-bot',
    '🧭': 'plop-ico-compass',
    '🐬': 'plop-ico-db',
    '💽': 'plop-ico-db',
    '💾': 'plop-ico-db',
    '🗄️': 'plop-ico-db',
    '🗄': 'plop-ico-db',
    '🐘': 'plop-ico-pg',
    '🧱': 'plop-ico-blocks',
    '🏗️': 'plop-ico-blocks',
    '🏗': 'plop-ico-blocks',
    '🏛️': 'plop-ico-blocks',
    '🏛': 'plop-ico-blocks',
    '🏢': 'plop-ico-blocks',
    '🐹': 'plop-ico-code',
    '🟢': 'plop-ico-hex',
    '💻': 'plop-ico-code',
    '⌨️': 'plop-ico-code',
    '⌨': 'plop-ico-code',
    '☕': 'plop-ico-code',
    '🖥️': 'plop-ico-cpu',
    '🖥': 'plop-ico-cpu',
    '🐧': 'plop-ico-cpu',
    '📨': 'plop-ico-mq',
    '📬': 'plop-ico-mq',
    '📥': 'plop-ico-mq',
    '📮': 'plop-ico-mq',
    '🌐': 'plop-ico-globe',
    '📹': 'plop-ico-video',
    '🎬': 'plop-ico-video',
    '🎞️': 'plop-ico-video',
    '🎞': 'plop-ico-video',
    '📸': 'plop-ico-video',
    '🗺️': 'plop-ico-map',
    '🗺': 'plop-ico-map',
    '⚖️': 'plop-ico-scale',
    '⚖': 'plop-ico-scale',
    '🔀': 'plop-ico-flow',
    '🔄': 'plop-ico-flow',
    '♻️': 'plop-ico-flow',
    '♻': 'plop-ico-flow',
    '⏪': 'plop-ico-flow',
    '🚀': 'plop-ico-rocket',
    '🧪': 'plop-ico-flask',
    '🔬': 'plop-ico-flask',
    '🧬': 'plop-ico-flask',
    '🌊': 'plop-ico-wave',
    '🚰': 'plop-ico-wave',
    '📊': 'plop-ico-chart',
    '📈': 'plop-ico-chart',
    '🧮': 'plop-ico-chart',
    '🤝': 'plop-ico-link',
    '🔗': 'plop-ico-link',
    '🔌': 'plop-ico-link',
    '⏱️': 'plop-ico-clock',
    '⏱': 'plop-ico-clock',
    '⏳': 'plop-ico-clock',
    '🕰️': 'plop-ico-clock',
    '🕰': 'plop-ico-clock',
    '💡': 'plop-ico-bulb',
    '⚠️': 'plop-ico-warn',
    '⚠': 'plop-ico-warn',
    '🚨': 'plop-ico-warn',
    '🚒': 'plop-ico-warn',
    '🩺': 'plop-ico-warn',
    '🔔': 'plop-ico-warn',
    '🚧': 'plop-ico-warn',
    '❓': 'plop-ico-bulb',
    '✅': 'plop-ico-check',
    '☑️': 'plop-ico-check',
    '☑': 'plop-ico-check',
    '🏆': 'plop-ico-check',
    '🥇': 'plop-ico-check',
    '🥈': 'plop-ico-check',
    '🥉': 'plop-ico-check',
    '❌': 'plop-ico-cross',
    '🚫': 'plop-ico-cross',
    '💥': 'plop-ico-cross',
    '🗑️': 'plop-ico-cross',
    '🗑': 'plop-ico-cross',
    '🔥': 'plop-ico-flame',
    '📌': 'plop-ico-pin',
    '📍': 'plop-ico-pin',
    '🏷️': 'plop-ico-pin',
    '🏷': 'plop-ico-pin',
    '📏': 'plop-ico-ruler',
    '📐': 'plop-ico-ruler',
    '🔎': 'plop-ico-search',
    '🔍': 'plop-ico-search',
    '🔒': 'plop-ico-lock',
    '🔐': 'plop-ico-lock',
    '🔑': 'plop-ico-lock',
    '⚙️': 'plop-ico-cog',
    '⚙': 'plop-ico-cog',
    '🛠️': 'plop-ico-cog',
    '🛠': 'plop-ico-cog',
    '🔧': 'plop-ico-cog',
    '🧰': 'plop-ico-cog',
    '🎛️': 'plop-ico-cog',
    '🎛': 'plop-ico-cog',
    '☁️': 'plop-ico-cloud',
    '☁': 'plop-ico-cloud',
    '📋': 'plop-ico-doc',
    '📝': 'plop-ico-doc',
    '📜': 'plop-ico-doc',
    '📎': 'plop-ico-doc',
    '📰': 'plop-ico-news',
    '⚡': 'plop-ico-bolt',
    '🐳': 'plop-ico-box'
  };

  const EMOJI_KEYS_SORTED = Object.keys(EMOJI_TO_PLOP_ICON).sort((a, b) => b.length - a.length);
  const EMOJI_REPLACE_RE = new RegExp(
    EMOJI_KEYS_SORTED.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'),
    'g'
  );

  function upgradePlopIcons(root = document) {
    const selectors = [
      'h1', 'h2', 'h3', 'h4',
      '.chapter-q-pill',
      '.plop-tag',
      '.plop-code-head > span:first-child',
      '.plop-drawer-title',
      '.plop-callout > strong:first-child',
      '.mode-switch-btn',
      '.plop-edition-switch a',
      '.console-label',
      '.surface-switcher-label',
      '.sticker-btn',
      '.plop-sticker-btn',
      '.plop-pill-sticker',
      '.card-ico-blob',
      '.diecut-sticker span',
      '.plop-bridge span',
      'p > strong:first-child'
    ].join(',');

    root.querySelectorAll(selectors).forEach(el => {
      if (el.closest('pre, code, svg, script, style')) return;
      const isBackHome = el.classList && el.classList.contains('mode-switch-btn');
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      const textNodes = [];
      let n;
      while ((n = walker.nextNode())) {
        if (n.parentElement && n.parentElement.closest('pre, code, svg, script, style')) continue;
        EMOJI_REPLACE_RE.lastIndex = 0;
        if (EMOJI_REPLACE_RE.test(n.nodeValue)) {
          textNodes.push(n);
        }
      }
      textNodes.forEach(textNode => {
        const raw = textNode.nodeValue;
        EMOJI_REPLACE_RE.lastIndex = 0;
        let lastIdx = 0;
        let match;
        const frag = document.createDocumentFragment();
        while ((match = EMOJI_REPLACE_RE.exec(raw)) !== null) {
          if (match.index > lastIdx) {
            frag.appendChild(document.createTextNode(raw.slice(lastIdx, match.index)));
          }
          const icoId = isBackHome && match[0] === '🌱' ? 'plop-ico-home' : EMOJI_TO_PLOP_ICON[match[0]];
          const tmp = document.createElement('span');
          tmp.innerHTML = plopIconHtml(icoId);
          if (tmp.firstChild) frag.appendChild(tmp.firstChild);
          lastIdx = match.index + match[0].length;
        }
        if (lastIdx < raw.length) {
          frag.appendChild(document.createTextNode(raw.slice(lastIdx)));
        }
        if (textNode.parentNode) {
          textNode.parentNode.replaceChild(frag, textNode);
        }
      });
    });
  }

  function normalizePlopDrawers(root = document) {
    root.querySelectorAll('details.plop-drawer > summary').forEach(summary => {
      if (summary.querySelector(':scope > .plop-drawer-title')) return;
      const span = document.createElement('span');
      span.className = 'plop-drawer-title';
      while (summary.firstChild) {
        span.appendChild(summary.firstChild);
      }
      summary.appendChild(span);
    });
  }
  const prefetchedPages = new Set();

  function getSectionCacheKey(url, baseHref = window.location.href) {
    try {
      return SECTION_CACHE_PREFIX + new URL(url, baseHref).pathname;
    } catch (e) {
      return SECTION_CACHE_PREFIX + url;
    }
  }

  async function prefetchPageSections(pageHref) {
    if (!pageHref || pageHref.startsWith('#') || pageHref.startsWith('javascript:')) return;
    let pageUrl;
    try {
      pageUrl = new URL(pageHref, window.location.href);
    } catch (e) {
      return;
    }
    if (pageUrl.origin !== window.location.origin) return;
    const pageKey = pageUrl.pathname;
    if (prefetchedPages.has(pageKey)) return;
    prefetchedPages.add(pageKey);

    try {
      const pageRes = await fetch(pageUrl.href);
      if (!pageRes.ok) return;
      const html = await pageRes.text();
      const matches = Array.from(html.matchAll(/data-plop-section="([^"]+)"/g));
      if (!matches.length) return;
      await Promise.all(
        matches.map(async m => {
          const secRelUrl = m[1];
          const secAbsUrl = new URL(secRelUrl, pageUrl.href).href;
          const key = getSectionCacheKey(secRelUrl, pageUrl.href);
          if (sessionStorage.getItem(key)) return;
          const r = await fetch(secAbsUrl);
          if (r.ok) {
            sessionStorage.setItem(key, await r.text());
          }
        })
      );
    } catch (e) {}
  }

  function prefetchSiblingEdition() {
    const editionLink = document.querySelector('[data-edition-target]');
    if (!editionLink) return;
    const targetPage = editionLink.getAttribute('data-edition-target');
    if (!targetPage) return;
    setTimeout(() => prefetchPageSections(targetPage), 300);
  }

  async function loadPlopSections() {
    const slots = Array.from(document.querySelectorAll('[data-plop-section]'));
    if (!slots.length) return;

    const urls = slots.map(slot => slot.getAttribute('data-plop-section'));

    // Fast path: if all fragments are already in sessionStorage (and not on local dev server), mount synchronously
    const isLocalDev =
      window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    let cachedFragments = null;
    if (!isLocalDev) {
      try {
        const candidates = urls.map(u => sessionStorage.getItem(getSectionCacheKey(u)));
        if (candidates.every(Boolean)) {
          cachedFragments = candidates;
        }
      } catch (e) {}
    }

    if (cachedFragments) {
      slots.forEach((slot, idx) => {
        slot.outerHTML = cachedFragments[idx];
      });
      normalizePlopDrawers();
      upgradePlopIcons();
      refreshScrollSpy();
      if (window.location.hash) {
        revealHashTarget(true);
      }
      prefetchSiblingEdition();
      // Silently refresh cache in the background
      Promise.all(
        urls.map(async url => {
          const res = await fetch(url);
          if (res.ok) {
            const text = await res.text();
            try {
              sessionStorage.setItem(getSectionCacheKey(url), text);
            } catch (e) {}
          }
        })
      ).catch(() => {});
      return;
    }

    try {
      const fragments = await Promise.all(
        urls.map(async url => {
          const res = await fetch(url, isLocalDev ? { cache: 'no-store' } : undefined);
          if (!res.ok) throw new Error(`HTTP ${res.status} when loading ${url}`);
          const text = await res.text();
          try {
            sessionStorage.setItem(getSectionCacheKey(url), text);
          } catch (e) {}
          return text;
        })
      );

      slots.forEach((slot, idx) => {
        slot.outerHTML = fragments[idx];
      });

      normalizePlopDrawers();
      upgradePlopIcons();
      refreshScrollSpy();
      if (window.location.hash) {
        revealHashTarget(true);
      }
      prefetchSiblingEdition();
    } catch (err) {
      console.warn('[plop-garden] Section fragment load failed:', err);
      if (slots[0]) {
        const tip = document.createElement('div');
        tip.className = 'plop-callout warn';
        tip.style.marginTop = '20px';
        tip.style.marginBottom = '16px';
        tip.innerHTML = `
          <strong>💡 本地预览提示：</strong>当前页面已按章节拆分为独立的纯 HTML 小文件（<code>sections/*.html</code>）。<br>
          直接双击 <code>file://</code> 打开会被浏览器安全策略拦截静态片段请求（下方已为您保留章节摘要与直达链接）；如需完整拼接交互，请使用 VS Code <strong>Live Server</strong> 插件，或在项目根目录执行 <code>python3 -m http.server 8000</code> 后访问 <code>http://localhost:8000</code>（GitHub Pages 线上 HTTPS 环境原生支持，无需任何额外配置）。
        `;
        slots[0].parentNode.insertBefore(tip, slots[0]);
      }
    }
  }

  // 11. 文章内页右下角悬浮「专题切换球 + 回到顶部」组件
  function ensureFloatTopicDock() {
    if (!document.body || document.body.classList.contains('plop-garden-body')) return;
    const isPlopWorkbench = document.querySelector('.plop-console, .plop-craft-bar');
    if (!isPlopWorkbench || document.getElementById('plop-float-dock')) return;

    const dock = document.createElement('div');
    dock.className = 'plop-float-dock';
    dock.id = 'plop-float-dock';
    dock.innerHTML = `
      <div class="plop-float-topic-pop" id="plop-float-pop" role="dialog" aria-label="跨专题笔记目录">
        <div class="plop-float-pop-head">
          <span class="plop-float-pop-title">${plopIconHtml('plop-ico-folder')}<span>切换其他笔记 (${NOTE_GARDEN_TOPICS.length})</span></span>
          <button type="button" class="plop-float-pop-close" id="plop-float-close" aria-label="收起目录">✕</button>
        </div>
        <div class="plop-float-topic-body plop-index-tabs" data-plop-topics></div>
      </div>
      <div class="plop-float-actions">
        <button type="button" class="plop-float-top-btn" id="plop-float-top" title="回到顶部" aria-label="回到手账顶部">${plopIconHtml('plop-ico-top')}</button>
        <button type="button" class="plop-float-topic-btn" id="plop-float-toggle" aria-expanded="false" aria-controls="plop-float-pop">
          <svg width="22" height="22" class="anim-bob" style="flex-shrink:0;"><use href="#plop-buddy-beanie"></use></svg>
          <span>切换专题</span>
        </button>
      </div>
    `;
    document.body.appendChild(dock);

    const toggleBtn = document.getElementById('plop-float-toggle');
    const closeBtn = document.getElementById('plop-float-close');
    const topBtn = document.getElementById('plop-float-top');

    const setOpen = open => {
      dock.classList.toggle('open', open);
      if (toggleBtn) toggleBtn.setAttribute('aria-expanded', String(open));
    };

    if (toggleBtn) {
      toggleBtn.addEventListener('click', e => {
        e.stopPropagation();
        setOpen(!dock.classList.contains('open'));
      });
    }
    if (closeBtn) {
      closeBtn.addEventListener('click', () => setOpen(false));
    }
    if (topBtn) {
      topBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    document.addEventListener('click', e => {
      if (dock.classList.contains('open') && !dock.contains(e.target)) {
        setOpen(false);
      }
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && dock.classList.contains('open')) {
        setOpen(false);
      }
    });

    const syncTopBtn = () => {
      if (!topBtn) return;
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      topBtn.classList.toggle('visible', y > 300);
    };
    window.addEventListener('scroll', syncTopBtn, { passive: true });
    syncTopBtn();
  }

  // 12. DOM 就绪后统一初始化
  document.addEventListener('DOMContentLoaded', () => {
    ensurePlopSvgSprite();
    ensureFloatTopicDock();
    renderTopicTabs();
    normalizePlopDrawers();
    upgradePlopIcons();

    const currentSurface = document.documentElement.getAttribute('data-plop-surface') || 'mat';
    document.querySelectorAll('[data-surface-btn]').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-surface-btn') === currentSurface);
    });
    document.querySelectorAll('.plop-console .sticker-btn').forEach(btn => {
      const onclick = btn.getAttribute('onclick') || '';
      if (onclick.includes('setSurface') || onclick.includes('setPlopSurface')) {
        btn.classList.toggle('active', onclick.includes("'" + currentSurface + "'"));
      }
    });

    window.addEventListener('hashchange', () => revealHashTarget(false));
    document.addEventListener('click', e => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const hash = link.getAttribute('href');
      if (!hash || hash === '#') return;
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (target) {
        for (let el = target; el; el = el.parentElement) {
          if (el.tagName === 'DETAILS') el.open = true;
        }
      }
    });

    initWorkbenchScrollSpy();
    revealHashTarget(false);
    loadPlopSections();

    // 鼠标悬停或触控按下任何站内专题链接时，提前在后台把目标页的章节片段预热进 sessionStorage
    const onLinkHint = e => {
      const a = e.target.closest('a[href]');
      if (!a) return;
      const href = a.getAttribute('href');
      if (href && href.includes('.html')) {
        prefetchPageSections(href);
      }
    };
    document.addEventListener('pointerover', onLinkHint, { passive: true });
    document.addEventListener('pointerdown', onLinkHint, { passive: true });

    // 12. 尚未改造为手账工作台的旧版内页保留手账/暗黑模式切换支持
    const isPlopWorkbenchPage =
      document.body &&
      (document.body.classList.contains('plop-garden-body') ||
        document.querySelector('.plop-console, .plop-craft-bar'));

    if (document.body && !isPlopWorkbenchPage) {
      const savedMode = localStorage.getItem(STORAGE_SUBPAGE_MODE_KEY) || 'plop';
      if (savedMode === 'plop') {
        document.documentElement.setAttribute('data-note-theme', 'plop');
      }

      const themeControl = document.querySelector('[data-note-theme-control]');
      if (themeControl) {
        themeControl.innerHTML = `
          <button type="button" data-note-mode="plop" aria-pressed="false">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="3" width="15" height="18" rx="2"/><path d="M9 3v18M3 7h4M3 12h4M3 17h4M12 8h5M12 12h5"/></svg>
            手账
          </button>
          <button type="button" data-note-mode="dark" aria-pressed="false">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.5 13.1A8.7 8.7 0 0 1 10.9 3.5 8.8 8.8 0 1 0 20.5 13.1Z"/></svg>
            暗黑
          </button>`;
        const applyMode = mode => {
          if (mode === 'plop') document.documentElement.setAttribute('data-note-theme', 'plop');
          else document.documentElement.removeAttribute('data-note-theme');
          themeControl.querySelectorAll('[data-note-mode]').forEach(button => {
            button.setAttribute('aria-pressed', String(button.dataset.noteMode === mode));
          });
        };
        applyMode(savedMode === 'dark' ? 'dark' : 'plop');
        themeControl.addEventListener('click', event => {
          const button = event.target.closest('[data-note-mode]');
          if (!button) return;
          applyMode(button.dataset.noteMode);
          localStorage.setItem(STORAGE_SUBPAGE_MODE_KEY, button.dataset.noteMode);
        });
        return;
      }

      const bar = document.createElement('div');
      bar.style.cssText =
        'position:fixed;bottom:18px;right:20px;z-index:9999;display:flex;gap:8px;align-items:center;';
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
