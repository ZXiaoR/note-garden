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

  // 1. 全站已完成专题注册表（新增文章只需在此处加一行，所有页面右侧跨专题目录自动同步）
  const NOTE_GARDEN_TOPICS = [
    { path: 'ai/index.html', title: '🧠 Gemini 4 Carbon', dot: '' },
    { path: 'ai/memory.html', title: '🌙 Agent 记忆架构', dot: 'pink' },
    { path: 'pi-agent/index.html', title: '🤖 Coding Agent (pi)', dot: 'periwinkle' },
    { path: 'mysql/index.html', title: '🐬 MySQL 架构与锁', dot: 'mint' },
    { path: 'postgres/index.html', title: '🐘 PostgreSQL 进阶', dot: 'periwinkle' },
    { path: 'redis/index.html', title: '🧱 Redis 原理与集群', dot: 'pink' },
    { path: 'go/index.html', title: '🐹 Go GMP 与 GC', dot: 'mustard' },
    { path: 'os/index.html', aliases: ['os/principles.html', 'os/principles'], title: '🖥️ Linux 操作系统', dot: 'mint' },
    { path: 'mq/index.html', title: '📨 消息队列对比', dot: '' }
  ];
  window.NOTE_GARDEN_TOPICS = NOTE_GARDEN_TOPICS;

  // 2. 立即恢复用户上次选择的桌面材质，并标记章节片段待加载，避免首屏闪烁
  document.documentElement.classList.add('plop-sections-pending');
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
      const old = btn.innerText;
      btn.innerText = '✅ 已复制!';
      setTimeout(() => {
        btn.innerText = old;
      }, 1800);
    });
  };

  // 5. 随机跳转一篇已完成专题笔记（供首页玩具贴纸按钮使用）
  window.jumpRandomTopic = function (prefix = '') {
    if (!NOTE_GARDEN_TOPICS.length) return;
    const pick = NOTE_GARDEN_TOPICS[Math.floor(Math.random() * NOTE_GARDEN_TOPICS.length)];
    window.location.href = prefix + pick.path;
  };

  // 6. 自动注入共享手绘吉祥物与贴纸 SVG Sprite（如果页面未内联定义）
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
        </defs>
      </svg>
    `;
    document.body.insertBefore(wrap, document.body.firstChild);
  }

  // 7. 自动渲染右侧跨专题书签目录 ([data-plop-topics])
  function renderTopicTabs() {
    const containers = document.querySelectorAll('[data-plop-topics]');
    if (!containers.length) return;

    const pathname = window.location.pathname || '';
    containers.forEach(container => {
      const explicitRoot = container.getAttribute('data-root');
      const isRootPage =
        explicitRoot === '.' ||
        explicitRoot === '' ||
        document.body.classList.contains('plop-garden-body');
      const prefix = explicitRoot !== null ? explicitRoot : isRootPage ? '' : '../';

      container.innerHTML = NOTE_GARDEN_TOPICS.map(item => {
        const isCurrent =
          !isRootPage &&
          (pathname.endsWith('/' + item.path) ||
            (item.path.endsWith('/index.html') &&
              pathname.endsWith('/' + item.path.replace('/index.html', '/'))) ||
            (Array.isArray(item.aliases) &&
              item.aliases.some(alias => pathname.endsWith('/' + alias))));
        const dotClass = item.dot ? `ear-dot ${item.dot}` : 'ear-dot';
        const activeClass = isCurrent ? ' active' : '';
        return `<a href="${prefix}${item.path}" class="plop-ear-tab${activeClass}">
          <span class="${dotClass}"></span>
          <span>${item.title}</span>
        </a>`;
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
      document.querySelectorAll('[data-edition-target]').forEach(a => {
        const base = a.getAttribute('data-edition-target');
        if (!base) return;
        let targetHash = currentId;
        if (base.includes('principles.html') && currentId === 'linux-cmd') {
          targetHash = 'tools';
        }
        a.setAttribute('href', currentId && currentId !== 'why' ? `${base}#${targetHash}` : base);
      });
    }

    refreshScrollSpy = onScroll;
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // 10. 自动并行加载拆分的纯 HTML 章节子文件 ([data-plop-section="sections/01-xxx.html"])
  const SECTION_CACHE_PREFIX = 'plop-sec-v2:';
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
    if (!slots.length) {
      document.documentElement.classList.remove('plop-sections-pending');
      return;
    }

    const urls = slots.map(slot => slot.getAttribute('data-plop-section'));

    // Fast path: if all fragments are already in sessionStorage, mount them synchronously in 0ms
    let cachedFragments = null;
    try {
      const candidates = urls.map(u => sessionStorage.getItem(getSectionCacheKey(u)));
      if (candidates.every(Boolean)) {
        cachedFragments = candidates;
      }
    } catch (e) {}

    if (cachedFragments) {
      slots.forEach((slot, idx) => {
        slot.outerHTML = cachedFragments[idx];
      });
      document.documentElement.classList.remove('plop-sections-pending');
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
          const res = await fetch(url);
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

      document.documentElement.classList.remove('plop-sections-pending');
      refreshScrollSpy();
      if (window.location.hash) {
        revealHashTarget(true);
      }
      prefetchSiblingEdition();
    } catch (err) {
      document.documentElement.classList.remove('plop-sections-pending');
      document.documentElement.classList.add('plop-sections-failed');
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

  // 11. DOM 就绪后统一初始化
  document.addEventListener('DOMContentLoaded', () => {
    ensurePlopSvgSprite();
    renderTopicTabs();

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
