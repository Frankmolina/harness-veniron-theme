/**
 * Veniron Theme — piel «Agentic OS» para el Harness.
 *
 * Inspirada en la app que sale en el vídeo de Jack Roberts (Agentic OS):
 * negro azulado, superficies de cristal, bordes de 1 px casi invisibles,
 * acentos violeta/rosa y un fondo con gradientes + rejilla + grano.
 *
 * No toca la estructura de la app: solo cambia tokens de tema, pinta capas
 * de fondo decorativas (pointer-events: none) y afina unos pocos detalles
 * con selectores seguros (código, scrollbar, selección, botón principal).
 */
window.__ModuleLoader__.load({
  id: '@frank/veniron-theme',
  factory(require) {
    const React = require('react');

    // Máscara de Vendetta muy tenue: la identidad de la casa, no el centro.
    const MASK = `data:image/svg+xml;utf8,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
        <path fill="#A78BFA" d="M128 28c-40 0-64 27-64 72 0 60 31 96 64 120 33-24 64-60 64-120 0-45-24-72-64-72z"/>
        <path fill="#05050a" d="M94 112c8-10 22-10 31 0-9 7-22 7-31 0zm37 0c8-10 22-10 31 0-9 7-22 7-31 0z"/>
        <path fill="#05050a" d="M96 144c13-8 22-7 32 0 10-7 19-8 32 0-12 12-20 15-32 9-12 6-20 3-32-9z"/>
        <path fill="#05050a" d="M116 168c9-5 17-5 24 0-5 21-8 28-12 33-4-5-7-12-12-33z"/>
      </svg>`
    )}`;

    // Grano fino (feTurbulence): quita el aspecto plano de los degradados.
    const NOISE = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/></svg>")`;

    const CSS = `
      /* ---------- Fondo: gradientes + rejilla + grano + viñeta ---------- */
      html {
        background-color: #06060a !important;
        background-image:
          radial-gradient(1100px 680px at 88% -12%, rgba(124,58,237,.26), transparent 60%),
          radial-gradient(1000px 620px at -8% 108%, rgba(34,211,238,.14), transparent 60%),
          radial-gradient(760px 520px at 52% 118%, rgba(244,63,94,.12), transparent 65%),
          linear-gradient(180deg, #09090f 0%, #06060a 55%, #050507 100%) !important;
        background-attachment: fixed !important;
      }
      body { background: transparent !important; }
      #root, #app { background: transparent !important; }

      .veniron-layer {
        position: fixed;
        inset: 0;
        pointer-events: none;
      }
      #veniron-grid {
        z-index: 2147482900;
        opacity: .55;
        background-image:
          linear-gradient(rgba(255,255,255,.038) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,.038) 1px, transparent 1px);
        background-size: 44px 44px;
        -webkit-mask-image: radial-gradient(ellipse 90% 70% at 50% 38%, #000 0%, transparent 78%);
        mask-image: radial-gradient(ellipse 90% 70% at 50% 38%, #000 0%, transparent 78%);
      }
      #veniron-theme-bg {
        z-index: 2147482950;
        background-image: url("/api/veniron-theme/background");
        background-size: min(720px, 58vw) auto;
        background-position: center 40%;
        background-repeat: no-repeat;
        opacity: .07;
        filter: blur(26px);
        mix-blend-mode: screen;
      }
      #veniron-noise {
        z-index: 2147483000;
        opacity: .045;
        mix-blend-mode: overlay;
        background-image: ${NOISE};
        background-size: 160px 160px;
      }
      #veniron-vignette {
        z-index: 2147483100;
        background: radial-gradient(130% 95% at 50% 28%, transparent 58%, rgba(0,0,0,.42) 100%);
      }

      /* ---------- Tokens propios de la piel ---------- */
      :root, html, body {
        --veniron-violet: #A78BFA;
        --veniron-rose: #F43F5E;
        --veniron-cyan: #22D3EE;
        --veniron-ink: #06060a;
        --veniron-text: #ECECF3;
        --veniron-text-dim: #A6A3BC;
        --veniron-border: rgba(255,255,255,.07);
        --veniron-border-strong: rgba(255,255,255,.13);
        --veniron-glass: rgba(255,255,255,.035);

        --dsw-radius-sm: 8px;
        --dsw-radius-md: 12px;
        --dsw-radius-lg: 16px;
        --dsw-radius-xl: 22px;

        --dsw-alias-label-tertiary: rgba(196,181,253,.72);
        --dsw-alias-state-business-primary: #A78BFA;
        --dsw-alias-interactive-bg-hover: rgba(167,139,250,.09);
        --dsw-alias-interactive-bg-active: rgba(167,139,250,.15);
        --dsw-alias-bg-layer-3: rgba(16,16,24,.92);
      }

      /* ---------- Detalles ---------- */
      .veniron-mark {
        width: 18px; height: 18px; border-radius: 50%;
        object-fit: cover;
        box-shadow: 0 0 8px rgba(167,139,250,.55);
      }
      ::selection { background: rgba(167,139,250,.34); color: #FFFFFF; }

      * { scrollbar-color: rgba(167,139,250,.38) transparent; scrollbar-width: thin; }
      *::-webkit-scrollbar { width: 9px; height: 9px; }
      *::-webkit-scrollbar-thumb {
        background: rgba(167,139,250,.32);
        border-radius: 999px;
        border: 2px solid transparent;
        background-clip: padding-box;
      }
      *::-webkit-scrollbar-thumb:hover { background: rgba(167,139,250,.5); background-clip: padding-box; }
      *::-webkit-scrollbar-track { background: transparent; }

      *:focus-visible {
        outline: 2px solid rgba(167,139,250,.75);
        outline-offset: 2px;
        border-radius: 6px;
      }

      /* Botón principal (enviar / confirmar): degradado violeta→rosa. */
      button[class*="primary"],
      button[class*="send"],
      [class*="send-button"],
      [class*="composer"] button[class*="accent"] {
        background-image: linear-gradient(135deg, #A78BFA 0%, #E879F9 52%, #F43F5E 100%) !important;
        border-color: transparent !important;
        color: #FFFFFF !important;
        box-shadow: 0 6px 22px rgba(167,139,250,.30);
      }

      /* Red de seguridad: si algún componente sigue con color claro, forzamos
         contraste legible. Va después de los tokens para ganar siempre. */
      code, kbd, samp {
        background: rgba(167,139,250,.15) !important;
        color: #E4DBFF !important;
        border-color: rgba(167,139,250,.28) !important;
      }
      pre {
        background: rgba(9,9,14,.94) !important;
        color: #DDD8F5 !important;
        border-color: rgba(255,255,255,.08) !important;
      }
      pre code, pre code * { background: transparent !important; color: #DDD8F5 !important; }
      [data-role="user"], [data-message-role="user"] {
        color: #F1EEFF !important;
      }
    `;

    const TOKENS = {
      // Lienzo y superficies
      '--dsw-alias-bg-base':          { light: 'rgba(8,8,13,.55)',        dark: 'rgba(8,8,13,.55)' },
      '--dsw-alias-bg-layer-1':       { light: 'rgba(255,255,255,.035)',  dark: 'rgba(255,255,255,.035)' },
      '--dsw-alias-bg-layer-2':       { light: 'rgba(255,255,255,.055)',  dark: 'rgba(255,255,255,.055)' },
      '--dsw-alias-bg-overlay':       { light: 'rgba(10,10,16,.97)',      dark: 'rgba(10,10,16,.97)' },
      '--dsw-alias-border-l1':        { light: 'rgba(255,255,255,.07)',   dark: 'rgba(255,255,255,.07)' },
      '--dsw-alias-border-l2':        { light: 'rgba(255,255,255,.13)',   dark: 'rgba(255,255,255,.13)' },

      // Marca y texto
      '--dsw-alias-brand-primary':    { light: '#A78BFA',                 dark: '#A78BFA' },
      '--dsw-alias-label-primary':    { light: '#ECECF3',                 dark: '#ECECF3' },
      '--dsw-alias-label-secondary':  { light: '#A6A3BC',                 dark: '#A6A3BC' },

      // Estados
      '--dsw-alias-state-error-primary':   { light: '#FB7185',            dark: '#FB7185' },
      '--dsw-alias-state-idle-primary':    { light: '#8B8FA3',            dark: '#8B8FA3' },
      '--dsw-alias-state-success-primary': { light: '#34D399',            dark: '#34D399' },
      '--dsw-alias-state-warn-primary':    { light: '#FBBF24',            dark: '#FBBF24' },

      // Barra lateral
      '--dsw-specific-sidebar-fill':  { light: 'rgba(6,6,11,.62)',        dark: 'rgba(6,6,11,.62)' },

      // Chat: burbujas, código, caja de escribir, menús
      '--dsw-specific-bubble':            { light: 'rgba(167,139,250,.13)', dark: 'rgba(167,139,250,.13)' },
      '--dsw-specific-bubble-highlight':  { light: 'rgba(167,139,250,.20)', dark: 'rgba(167,139,250,.20)' },
      '--dsw-alias-markdown-inline-code': { light: 'rgba(167,139,250,.15)', dark: 'rgba(167,139,250,.15)' },
      '--dsw-alias-markdown-code-block':  { light: 'rgba(9,9,14,.93)',      dark: 'rgba(9,9,14,.93)' },
      '--dsw-alias-markdown-code-block-banner': { light: 'rgba(167,139,250,.09)', dark: 'rgba(167,139,250,.09)' },
      '--dsw-specific-input-major':       { light: 'rgba(10,10,16,.90)',    dark: 'rgba(10,10,16,.90)' },
      '--dsw-specific-login-input':       { light: 'rgba(10,10,16,.90)',    dark: 'rgba(10,10,16,.90)' },
      '--dsw-specific-menu':              { light: 'rgba(12,12,19,.97)',    dark: 'rgba(12,12,19,.97)' },
      '--dsw-specific-selector':          { light: 'rgba(167,139,250,.10)', dark: 'rgba(167,139,250,.10)' },
      '--dsw-specific-tip':               { light: 'rgba(12,12,19,.97)',    dark: 'rgba(12,12,19,.97)' },
      '--dsw-specific-file-upload-track': { light: 'rgba(167,139,250,.16)', dark: 'rgba(167,139,250,.16)' },
    };

    const LAYERS = ['veniron-grid', 'veniron-theme-bg', 'veniron-noise', 'veniron-vignette'];

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
          // La app arranca en modo claro en algunos equipos: forzamos oscuro
          // para que no queden superficies blancas con texto casi blanco.
          try { if (ctx.theme && ctx.theme.setTheme) ctx.theme.setTheme('dark'); } catch (e) {}

          const disposeTokens = ctx.theme.overrideTokens('veniron-theme', TOKENS);
          const style = document.createElement('style');
          style.id = 'veniron-theme-style';
          style.textContent = CSS;
          document.head.appendChild(style);

          // Capas decorativas: rejilla, máscara, grano y viñeta.
          const layers = LAYERS.map((id) => {
            const el = document.createElement('div');
            el.id = id;
            el.className = 'veniron-layer';
            if (id === 'veniron-theme-bg') el.style.backgroundImage = `url("${MASK}")`;
            document.body.appendChild(el);
            return el;
          });

          const store = { img: null, icon: null };
          installMark(store);
          const observer = new MutationObserver(() => installMark(store));
          observer.observe(document.body, { childList: true, subtree: true });

          return () => {
            disposeTokens();
            style.remove();
            for (const el of layers) el.remove();
            observer.disconnect();
            if (store.img) store.img.remove();
            if (store.icon) store.icon.style.display = '';
          };
        });
      },
    };
  },
});
