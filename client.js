/**
 * Veniron Theme — piel «Agentic OS» + orbe de estado para el Harness.
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
        background-color: #0b0a0d !important;
        background-image:
          radial-gradient(1100px 680px at 86% -14%, rgba(124,58,237,.20), transparent 62%),
          radial-gradient(900px 560px at -6% 106%, rgba(20,224,200,.10), transparent 60%),
          radial-gradient(720px 480px at 52% 118%, rgba(255,46,136,.09), transparent 66%),
          linear-gradient(180deg, #0b0a0d 0%, #0a0a0c 55%, #09090b 100%) !important;
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
          linear-gradient(rgba(255,255,255,.032) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,.032) 1px, transparent 1px);
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
        --veniron-periwinkle: #8B8CFF;
        --veniron-magenta: #FF2E88;
        --veniron-coral: #E8734A;
        --veniron-teal: #14E0C8;
        --veniron-ink: #0b0a0d;
        --veniron-text: #F2F2F5;
        --veniron-text-dim: #9A9AA3;
        --veniron-border: rgba(255,255,255,.07);
        --veniron-border-strong: rgba(255,255,255,.13);
        --veniron-glass: rgba(255,255,255,.035);

        --dsw-radius-sm: 8px;
        --dsw-radius-md: 12px;
        --dsw-radius-lg: 20px;
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
        outline: 2px solid rgba(139,140,255,.85);
        outline-offset: 2px;
        border-radius: 6px;
      }

      /* Botón principal (enviar / confirmar): degradado violeta→rosa. */
      button[class*="primary"],
      button[class*="send"],
      [class*="send-button"],
      [class*="composer"] button[class*="accent"] {
        background-image: linear-gradient(135deg, #FF2E88 0%, #FF5A3C 100%) !important;
        border-color: transparent !important;
        color: #FFFFFF !important;
        box-shadow: 0 8px 26px rgba(255,46,136,.32);
      }

      /* Costuras del video: sidebar separada por un hairline, tarjetas casi
         del color del fondo con un brillo interno de 1 px. */
      [class*="sidebar"], [class*="Sidebar"] {
        border-right: 1px solid rgba(255,255,255,.06) !important;
      }
      [class*="card"] {
        box-shadow:
          inset 0 1px 0 rgba(255,255,255,.04),
          0 18px 40px -24px rgba(0,0,0,.9);
      }

      /* Red de seguridad: si algún componente sigue con color claro, forzamos
         contraste legible. Va después de los tokens para ganar siempre. */
      code, kbd, samp {
        background: rgba(139,140,255,.14) !important;
        color: #E6E6FF !important;
        border-color: rgba(139,140,255,.28) !important;
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

      /* ---------- Orbe de estado (Live · Listening del video) ---------- */
      .veniron-orb {
        position: fixed;
        right: 20px;
        bottom: 104px;
        z-index: 2147483200;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 52px;
        height: 52px;
        border-radius: 50%;
        background: radial-gradient(circle at 50% 42%, rgba(20,20,28,.86), rgba(8,8,12,.82));
        -webkit-backdrop-filter: blur(10px);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,.10);
        box-shadow:
          0 12px 34px -14px rgba(0,0,0,.95),
          inset 0 1px 0 rgba(255,255,255,.06);
        pointer-events: auto;
        transition: transform .22s ease, border-color .22s ease;
      }
      .veniron-orb:hover {
        transform: scale(1.05);
        border-color: rgba(255,255,255,.15);
      }
      .veniron-orb-halo,
      .veniron-orb-ring,
      .veniron-orb-core {
        position: absolute;
        border-radius: 50%;
      }
      .veniron-orb-halo {
        inset: -4px;
        background: radial-gradient(circle, rgba(20,224,200,.34), rgba(20,224,200,.08) 55%, transparent 72%);
        filter: blur(5px);
        animation: veniron-breathe 5.2s ease-in-out infinite;
      }
      .veniron-orb-core {
        width: 20px;
        height: 20px;
        background:
          radial-gradient(circle at 32% 26%, rgba(255,255,255,.92) 0%, rgba(255,255,255,0) 26%),
          radial-gradient(circle at 40% 34%, #B9FFF6 0%, #14E0C8 46%, #08655C 100%);
        box-shadow: 0 0 12px rgba(20,224,200,.6), inset 0 -1px 2px rgba(0,0,0,.35);
        animation: veniron-breathe 5.2s ease-in-out infinite;
      }
      .veniron-orb-ring {
        inset: 6px;
        border: 1px solid rgba(20,224,200,.26);
        opacity: .55;
      }

      .veniron-orb.is-busy .veniron-orb-halo {
        inset: -6px;
        background: radial-gradient(circle, rgba(255,46,136,.42), rgba(139,140,255,.14) 58%, transparent 74%);
        filter: blur(6px);
        animation: veniron-breathe 1.6s ease-in-out infinite;
      }
      .veniron-orb.is-busy .veniron-orb-core {
        width: 18px;
        height: 18px;
        background:
          radial-gradient(circle at 32% 26%, rgba(255,255,255,.95) 0%, rgba(255,255,255,0) 26%),
          radial-gradient(circle at 40% 34%, #FFD9E8 0%, #FF2E88 54%, #8C0B4E 100%);
        box-shadow: 0 0 14px rgba(255,46,136,.7), inset 0 -1px 2px rgba(0,0,0,.35);
        animation: veniron-breathe 1.2s ease-in-out infinite;
      }
      .veniron-orb.is-busy .veniron-orb-ring {
        border: 0;
        opacity: 1;
        background: conic-gradient(
          from 0deg,
          transparent 0deg 210deg,
          rgba(139,140,255,.85) 255deg,
          #FF2E88 330deg,
          transparent 360deg
        );
        -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 2.4px), #000 calc(100% - 2.2px));
        mask: radial-gradient(farthest-side, transparent calc(100% - 2.4px), #000 calc(100% - 2.2px));
        animation: veniron-spin 1.15s linear infinite;
      }
      .veniron-orb.is-flash .veniron-orb-core {
        background: radial-gradient(circle at 34% 28%, #FFFFFF 0%, #14E0C8 55%, #0A7E73 100%);
        box-shadow: 0 0 18px rgba(20,224,200,.9);
        animation: veniron-flash .9s ease-out 1;
      }


      @keyframes veniron-breathe {
        0%, 100% { transform: scale(.92); opacity: .72; }
        50%      { transform: scale(1.08); opacity: 1; }
      }
      @keyframes veniron-spin { to { transform: rotate(360deg); } }
      @keyframes veniron-flash {
        0%   { transform: scale(1.6); opacity: 1; }
        60%  { transform: scale(1);   opacity: 1; }
        100% { transform: scale(.92); opacity: .8; }
      }
      @media (prefers-reduced-motion: reduce) {
        .veniron-orb-halo, .veniron-orb-core, .veniron-orb-ring { animation: none !important; }
      }
    `;

    const TOKENS = {
      // Lienzo y superficies
      '--dsw-alias-bg-base':          { light: 'rgba(11,10,13,.58)',      dark: 'rgba(11,10,13,.58)' },
      '--dsw-alias-bg-layer-1':       { light: 'rgba(255,255,255,.032)',  dark: 'rgba(255,255,255,.032)' },
      '--dsw-alias-bg-layer-2':       { light: 'rgba(255,255,255,.05)',   dark: 'rgba(255,255,255,.05)' },
      '--dsw-alias-bg-overlay':       { light: 'rgba(12,12,16,.97)',      dark: 'rgba(12,12,16,.97)' },
      '--dsw-alias-border-l1':        { light: 'rgba(255,255,255,.07)',   dark: 'rgba(255,255,255,.07)' },
      '--dsw-alias-border-l2':        { light: 'rgba(255,255,255,.11)',   dark: 'rgba(255,255,255,.11)' },

      // Marca y texto
      '--dsw-alias-brand-primary':    { light: '#8B8CFF',                 dark: '#8B8CFF' },
      '--dsw-alias-label-primary':    { light: '#F2F2F5',                 dark: '#F2F2F5' },
      '--dsw-alias-label-secondary':  { light: '#9A9AA3',                 dark: '#9A9AA3' },

      // Estados
      '--dsw-alias-state-error-primary':   { light: '#FF4D5E',            dark: '#FF4D5E' },
      '--dsw-alias-state-idle-primary':    { light: '#6E6E78',            dark: '#6E6E78' },
      '--dsw-alias-state-success-primary': { light: '#14E0C8',            dark: '#14E0C8' },
      '--dsw-alias-state-warn-primary':    { light: '#F0B429',            dark: '#F0B429' },

      // Barra lateral
      '--dsw-specific-sidebar-fill':  { light: 'rgba(10,10,13,.55)',      dark: 'rgba(10,10,13,.55)' },

      // Chat: burbujas, código, caja de escribir, menús
      '--dsw-specific-bubble':            { light: 'rgba(255,255,255,.06)', dark: 'rgba(255,255,255,.06)' },
      '--dsw-specific-bubble-highlight':  { light: 'rgba(255,255,255,.09)', dark: 'rgba(255,255,255,.09)' },
      '--dsw-alias-markdown-inline-code': { light: 'rgba(255,255,255,.08)', dark: 'rgba(255,255,255,.08)' },
      '--dsw-alias-markdown-code-block':  { light: 'rgba(9,9,11,.95)',      dark: 'rgba(9,9,11,.95)' },
      '--dsw-alias-markdown-code-block-banner': { light: 'rgba(255,255,255,.04)', dark: 'rgba(255,255,255,.04)' },
      '--dsw-specific-input-major':       { light: 'rgba(10,10,16,.90)',    dark: 'rgba(10,10,16,.90)' },
      '--dsw-specific-login-input':       { light: 'rgba(10,10,16,.90)',    dark: 'rgba(10,10,16,.90)' },
      '--dsw-specific-menu':              { light: 'rgba(12,12,19,.97)',    dark: 'rgba(12,12,19,.97)' },
      '--dsw-specific-selector':          { light: 'rgba(255,255,255,.06)', dark: 'rgba(255,255,255,.06)' },
      '--dsw-specific-tip':               { light: 'rgba(12,12,19,.97)',    dark: 'rgba(12,12,19,.97)' },
      '--dsw-specific-file-upload-track': { light: 'rgba(139,140,255,.18)', dark: 'rgba(139,140,255,.18)' },
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

    // Orbe de estado: la esfera del video, en miniatura, junto al composer.
    // Solo afirma lo que sabe: la sesión está trabajando o está en reposo.
    function VenironOrb(props) {
      const useSession = typeof props.useSession === 'function' ? props.useSession : null;
      const busy = useSession === null
        ? false
        : useSession((session) => (session ? session.running === true : false));
      const [flash, setFlash] = React.useState(false);
      const was = React.useRef(false);

      React.useEffect(() => {
        if (was.current && !busy) {
          setFlash(true);
          const timer = window.setTimeout(() => setFlash(false), 950);
          was.current = busy;
          return () => window.clearTimeout(timer);
        }
        was.current = busy;
        return undefined;
      }, [busy]);

      const label = busy
        ? 'Veniron trabajando'
        : flash
          ? 'Veniron ha terminado'
          : 'Veniron en reposo';
      const className =
        'veniron-orb' + (busy ? ' is-busy' : '') + (flash ? ' is-flash' : '');

      return React.createElement(
        'div',
        { className, title: label, 'aria-label': label, role: 'img' },
        [
          React.createElement('span', { key: 'halo', className: 'veniron-orb-halo' }),
          React.createElement('span', { key: 'ring', className: 'veniron-orb-ring' }),
          React.createElement('span', { key: 'core', className: 'veniron-orb-core' }),
        ],
      );
    }

    return {
      inject: ['theme', 'slots'],
      apply(ctx) {
        ctx.effect(() => {
          if (!ctx.slots) return undefined;
          return ctx.slots.inject('conversation.composer.dock', () =>
            ctx.slots.register(
              {
                name: 'conversation.composer.dock',
                id: 'veniron-orb',
                order: 40,
                label: () => 'Veniron',
              },
              VenironOrb,
            ),
          );
        }, 'veniron-theme: orbe de estado');

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
