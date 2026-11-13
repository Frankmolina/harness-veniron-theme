/**
 * Veniron Theme — JARVIS básico para el Harness.
 *
 * No toca la estructura de la app: solo cambia tokens de tema y añade una capa
 * de fondo (máscara de Vendetta muy tenue) detrás del root translúcido.
 */
window.__ModuleLoader__.load({
  id: '@frank/veniron-theme',
  factory(require) {
    const React = require('react');

    const MASK = `data:image/svg+xml;utf8,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
        <path fill="#00D8FF" d="M128 28c-40 0-64 27-64 72 0 60 31 96 64 120 33-24 64-60 64-120 0-45-24-72-64-72z"/>
        <path fill="#03060a" d="M94 112c8-10 22-10 31 0-9 7-22 7-31 0zm37 0c8-10 22-10 31 0-9 7-22 7-31 0z"/>
        <path fill="#03060a" d="M96 144c13-8 22-7 32 0 10-7 19-8 32 0-12 12-20 15-32 9-12 6-20 3-32-9z"/>
        <path fill="#03060a" d="M116 168c9-5 17-5 24 0-5 21-8 28-12 33-4-5-7-12-12-33z"/>
      </svg>`
    )}`;

    const CSS = `
      html {
        background: #03060a !important;
      }
      #veniron-theme-bg {
        position: fixed;
        inset: 0;
        z-index: 2147483000;
        pointer-events: none;
        background-image: url("/api/veniron-theme/background");
        background-size: cover;
        background-position: center center;
        background-repeat: no-repeat;
        opacity: .13;
        mix-blend-mode: screen;
      }
      body { background: transparent !important; }
      #root, #app { background: transparent !important; }

      :root, html, body {
        --veniron-cyan: #00D8FF;
        --veniron-blue: #38B6FF;
        --veniron-ice: #E0F7FF;
        --veniron-amber: #FFB000;
        --veniron-green: #00FF66;
        --veniron-red: #FF1E1E;

        --dsw-alias-label-tertiary: rgba(0,216,255,.72);
        --dsw-alias-state-business-primary: #FFB000;
        --dsw-alias-interactive-bg-hover: rgba(0,216,255,.10);
        --dsw-alias-interactive-bg-active: rgba(0,216,255,.16);
        --dsw-alias-bg-layer-3: rgba(8,20,30,.88);
      }
      .veniron-mark { width: 18px; height: 18px; border-radius: 50%; object-fit: cover; box-shadow: 0 0 6px rgba(0,216,255,.45); }
      ::selection { background: rgba(0,216,255,.28); color: #E0F7FF; }
      * { scrollbar-color: rgba(0,216,255,.35) transparent; }
      *::-webkit-scrollbar-thumb { background: rgba(0,216,255,.35); border-radius: 999px; }
      *::-webkit-scrollbar-track { background: transparent; }
    `;

    const TOKENS = {
      '--dsw-alias-bg-base':          { light: 'rgba(3,6,10,.42)',        dark: 'rgba(3,6,10,.42)' },
      '--dsw-alias-bg-layer-1':       { light: 'rgba(6,14,20,.60)',       dark: 'rgba(6,14,20,.60)' },
      '--dsw-alias-bg-layer-2':       { light: 'rgba(8,20,30,.70)',       dark: 'rgba(8,20,30,.70)' },
      '--dsw-alias-bg-overlay':       { light: 'rgba(4,10,16,.94)',       dark: 'rgba(4,10,16,.94)' },
      '--dsw-alias-border-l1':        { light: 'rgba(56,182,255,.24)',    dark: 'rgba(56,182,255,.24)' },
      '--dsw-alias-border-l2':        { light: 'rgba(56,182,255,.42)',    dark: 'rgba(56,182,255,.42)' },
      '--dsw-alias-brand-primary':    { light: '#00D8FF',                 dark: '#00D8FF' },
      '--dsw-alias-label-primary':    { light: '#E0F7FF',                 dark: '#E0F7FF' },
      '--dsw-alias-label-secondary':  { light: '#38B6FF',                 dark: '#38B6FF' },
      '--dsw-alias-state-error-primary':   { light: '#FF1E1E',            dark: '#FF1E1E' },
      '--dsw-alias-state-idle-primary':    { light: '#38B6FF',            dark: '#38B6FF' },
      '--dsw-alias-state-success-primary': { light: '#00FF66',            dark: '#00FF66' },
      '--dsw-alias-state-warn-primary':    { light: '#FFB000',            dark: '#FFB000' },
      '--dsw-specific-sidebar-fill':  { light: 'rgba(3,10,16,.64)',       dark: 'rgba(3,10,16,.64)' },
    };

    function installMark(store) {
      if (store.img && store.img.isConnected) return;
      const candidates = Array.from(document.querySelectorAll('button, a, [role="button"]'));
      const launcher = candidates.find((el) =>
        /iniciado sesión|signed in/i.test(el.textContent || '')
      );
      if (!launcher) return;
      const icon = launcher.querySelector('svg, img');
      if (!icon) return;
      const img = document.createElement('img');
      img.id = 'veniron-account-mark';
      img.src = '/api/veniron-theme/mark';
      img.alt = '';
      img.className = 'veniron-mark';
      icon.style.display = 'none';
      icon.parentNode.insertBefore(img, icon);
      store.img = img;
      store.icon = icon;
    }

    return {
      inject: ['theme'],
      apply(ctx) {
        ctx.effect(() => {
          const disposeTokens = ctx.theme.overrideTokens('veniron-theme', TOKENS);
          const style = document.createElement('style');
          style.id = 'veniron-theme-style';
          style.textContent = CSS;
          document.head.appendChild(style);

          const bg = document.createElement('div');
          bg.id = 'veniron-theme-bg';
          document.body.appendChild(bg);

          const store = { img: null, icon: null };
          installMark(store);
          const observer = new MutationObserver(() => installMark(store));
          observer.observe(document.body, { childList: true, subtree: true });

          return () => {
            disposeTokens();
            style.remove();
            bg.remove();
            observer.disconnect();
            if (store.img) store.img.remove();
            if (store.icon) store.icon.style.display = '';
          };
        });
      },
    };
  },
});
