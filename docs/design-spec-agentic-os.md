# Design Spec — "Agentic OS" (look & feel) para DeepSeek Harness

**Fuente:** vídeo YouTube *"I Tested Uncensored AI... It Should Probably Be Illegal…"* (Jack Roberts), descargado en `/tmp/yt_bc7_android.mp4` (640×360, 1362 s).
**Frames analizados (PNG sin recompresión, extraídos con ffmpeg):**
`/tmp/bc7/png/f215.png` (dashboard), `f585.png` (pantalla *Ask anything* + orbe *Live · Listening*), `f600.png` (chat), `f480.png` (Memory). Ampliaciones en `/tmp/bc7/crops/`.

**Método:** muestreo con Python/PIL (percentiles por región para descartar píxeles de texto/antialias) sobre color **8-bit sRGB del vídeo**, más ampliaciones LANCZOS para leer formas. Los colores del vídeo llevan compresión H.264 + posible tone-mapping: tomar los hex como **objetivo de diseño**, no como verdad absoluta.

**Escala:** la ventana de la app ocupa ≈ 546×338 px del frame 640×360 → ventana real ≈ 1512×824 (MacBook 14"). Factor de conversión **frame px × 2.8 ≈ px CSS**. Las medidas en px de abajo son "recomendadas para viewport ~1440–1512".

---

## 1. Colores reales muestreados

### 1.1 Superficies y estructura

| Zona | Hex muestreado | Muestra | Notas |
|---|---|---|---|
| Fondo de página (gutter entre secciones) | `#0c0b0e` | mediana (12,11,14) | near-black neutro, un punto cálido |
| Fondo de página (zona chat) | `#0f0f11` | mediana (15,15,17) | el chat usa un negro algo más azulado |
| Sidebar | `#0c0b0e` | mediana | **mismo negro que la página**; sólo la separa una línea de 1px |
| Borde separador sidebar | `#161618`–`#1a1a1f` | px del borde, x=78 (lum 22.7) | equivale a `rgba(255,255,255,.07)` sobre `#0c0b0e` |
| Superficie de tarjeta (hero / métricas) | `#101012` | mediana (16,16,18) | +2–4 niveles sobre la página: las tarjetas son *casi* del color del fondo |
| Superficie tarjeta gráfico (con glow violeta) | `#211724` | mediana (33,23,36) | el violeta es un **glow radial**, no el fill |
| Superficie tarjeta modelo (más clara) | `#26262d` | mediana (38,38,45) | tarjeta elevada, `--surface-2` |
| Borde de tarjeta | `#131215` (p95) → percibido `#1c1c20` | px del borde izquierdo del hero | `1px solid rgba(255,255,255,.06–.08)` |
| Burbuja de chat (usuario) | `#17171b` | mediana (23,23,27) | sin borde; +10 niveles sobre el fondo |
| Fila activa de lista de chats | `#232c3a` | p60 (35,44,58) | único sitio con tinte **azul** real |
| Contenedor de segmented control | `#16151c` | (22,21,28) | ligeramente más claro + violáceo |
| Chip / pill oscuro | `#0a0912`–`#121216` | — | casi negro, sólo lo define el borde |
| Botón primario segmentado (activo) | `#f0eff2` | p60 (240,239,242) | **blanco roto**, texto negro |

### 1.2 Texto

| Zona | Hex | Muestra | Notas |
|---|---|---|---|
| Texto primario (títulos y cuerpo) | `#ececee` → `#ffffff` | p99 (236,236,238); píxel máx `#ffffff` | blanco puro sólo en el núcleo de los glifos |
| Texto secundario (labels de nav, "Finances", etc.) | `#8a8a92` | estimado del borde de glifo | ver §5: el original está por debajo de AA |
| Texto dim / captions ("Clouds, weekly used") | `#5f6066` (medido ≈ `#464548` en antialias) | p95 de la región del caption | **contraste real ≈ 2:1 — no copiar tal cual** |
| Texto sobre botón blanco | `#0c0b0e` | — | 17:1 |

### 1.3 Acentos

| Zona | Hex | Muestra | Notas |
|---|---|---|---|
| **Acento principal (coral/naranja)** — cuadro del icono "sol" en el hero | `#da7655` / `#e8734a` | (218,118,85) y (216,118,92) | degradado coral→melocotón; es el color de marca |
| Acento coral claro (highlight) | `#ffe1cc` / `#ffeedb` | p90 | usado en glifos y brillos |
| **Acento secundario (azul/periwinkle)** — icono Claude | `#7c8cff` (medido `#94a0f8`–`#d3d6ff` con el glifo blanco mezclado) | p60 | azul-violeta de los "modelos cloud" |
| **Magenta/rosa (CTA + medidores)** — botón enviar y barras de audio | `#ff2e88` → `#ff5a3c` | p90 `#ec859d` (izq.) / `#db4850` (der.) | el botón es un **degradado rosa→naranja-rojo** |
| Rosa secundario (botón "Resync All") | `#ff6fae` | (237,128,174) | rosa más pastel |
| **Éxito / teal** — orbe *Live · Listening*, pill "On" | `#14e0c8` (núcleo `#19f9e0`), fondo pill `#152e27` | p80 (25,249,224) | turquesa eléctrico con glow |
| **Warn / oro** — wordmark "Cloud", puntos de estado | `#f0b429` (medido `#b6916c` mezclado con negro) | p95 | ámbar dorado con gradiente |
| Error / rojo | `#ff4d5e` | no se ve un error explícito; el rojo del botón es `#db4850` | — |

---

## 2. Paleta final propuesta (variables CSS)

```css
:root {
  /* Superficies */
  --bg:        #0b0a0d;   /* página */
  --surface:   #111114;   /* tarjetas, paneles */
  --surface-2: #17171c;   /* tarjeta elevada, hover, burbuja chat */
  --surface-3: #1e1e24;   /* chips, segmented, inputs */
  --border:    #26262c;   /* border-color base (≈ rgba(255,255,255,.07) sobre --surface) */
  --border-soft: rgba(255,255,255,.05);
  --border-strong: rgba(255,255,255,.11);

  /* Texto */
  --text:      #f2f2f5;
  --text-dim:  #9a9aa3;   /* secundario: 7:1 sobre --bg */
  --text-faint:#6e6e78;   /* terciario, sólo decorativo */

  /* Acentos */
  --accent:    #e8734a;   /* coral, marca / CTA suave */
  --accent-2:  #ff2e88;   /* magenta, CTA fuerte / focus */
  --accent-3:  #7c8cff;   /* periwinkle, modelos cloud / links */
  --ok:        #14e0c8;   /* teal, listening / éxito */
  --warn:      #f0b429;   /* oro, avisos / estado cloud */
  --err:       #ff4d5e;

  /* Derivados */
  --glow-accent: color-mix(in srgb, var(--accent) 45%, transparent);
  --glow-ok:     color-mix(in srgb, var(--ok) 55%, transparent);
  --grad-cta:    linear-gradient(135deg, #ff2e88 0%, #ff5a3c 100%);
  --grad-gold:   linear-gradient(180deg, #ffd98a 0%, #e8a33d 100%);

  /* Radios / sombras / blur */
  --r-card: 20px;  --r-inner: 12px;  --r-sm: 8px;  --r-pill: 999px;
  --shadow-card: 0 1px 0 rgba(255,255,255,.04) inset, 0 18px 40px -24px rgba(0,0,0,.9);
  --blur: 12px;
}
```

**Equivalencias con DeepSeek Harness** (customizar `--dsw-alias-*` sobre esta base):
`--dsw-alias-bg-base → --bg`, `--dsw-alias-bg-elevated → --surface`, `--dsw-alias-border-subtle → --border-soft`, `--dsw-alias-text-primary → --text`, `--dsw-alias-text-secondary → --text-dim`, `--dsw-alias-accent → --accent`, `--dsw-alias-accent-strong → --accent-2`.

---

## 3. Layout y componentes

### 3.1 Shell
- **Sidebar fija** ≈ **188–200 px** (medido 68 px de frame ×2.8). Fondo **igual al de página** `#0c0b0e`, separada por `1px solid rgba(255,255,255,.07)`. Sin sombra.
- Contenido con padding ≈ **32 px** y `max-width` ≈ 1320 px, desplazado a la izquierda (no centrado).
- **Topbar de app** ≈ **48–56 px**, transparente, sin borde inferior visible: breadcrumb `Agentic / local ▾` (13 px, dim) a la izquierda; a la derecha los chips `Chat`, `Voice`, `Cloud ▾`, un icono y un **toggle pill** (fondo `#161618`, knob blanco).
- Fondo global: negro casi plano + **gradientes radiales muy tenues** (violeta arriba-izquierda, teal junto al orbe) + **micro-sparkles** (puntos de 1–2 px, opacidad .15–.35) en la zona del grafo.

### 3.2 Sidebar
1. **Cabecera**: icono cuadrado 28 px, radio 8 px, coral con glifo asterisco/sol; wordmark "Agentic OS" en 15 px/600 y subtítulo "Next-gen AI Workspace" 9 px `--text-faint`.
2. **Label de sección** `WORKSPACE`, `TOOLS`: 9–10 px, `uppercase`, `letter-spacing: .14em`, `--text-faint`.
3. **Nav item**: alto ≈ **34 px**, radio **10 px**, icono 16 px + label 13 px `--text-dim`; *activo* = fondo `rgba(255,255,255,.06)` + texto `--text` (ligeramente violáceo: `#1a1a24`). Ítems: Dashboard, Inbox, Chat, Calendar, Memory.
4. **Tarjeta orbe** (opcional pero muy identificativa): imagen de nubes/nebulosa a sangre, radio 14 px, con **orbe teal** de Ø ≈ 76 px centrado (glow radial), label `Live · Listening` 11 px, y dos botones circulares 24 px (pause/stop) con `backdrop-filter: blur(8px)`.
5. **Footer**: `Settings` + fila de usuario (avatar 26 px, nombre 12 px, subtítulo 10 px dim, chevron).

### 3.3 Tarjetas
- Fila hero: **2 métricas + 1 tarjeta de modelo**. Radio **20 px**, borde 1px, fondo `--surface` con gradiente `#131316 → #0d0d10`, padding 24–32 px, `box-shadow` casi nula (sólo un `inset 0 1px 0 rgba(255,255,255,.04)`).
- **Glow**: detrás de cada icono/orbe, `radial-gradient` de 90–140 px con el color de acento a 30–40 % de opacidad + `filter: blur(24px)`.
- Contenido métrica: **orbe-planeta** Ø ≈ 90 px (esfera oscura con brillo superior, imagen/textura dentro, icono cuadrado 44 px radio 12 px en el centro); a la derecha número **48–56 px / 700 / tracking -0.03em** con el `%` en 18 px `--text-dim`; debajo caption 11 px dim.
- Tarjeta modelo: label `AI MODELS` 9 px uppercase; **wordmark "Cloud"** en display bold ~30 px con `--grad-gold` (`background-clip: text`); "3 models / 27 APIs" 10 px; fila de 3 chips con icono 22 px; fila de pills `◉ Cloud` (borde dorado 1px, texto oro) y `Local`, más un pill rojo al extremo.

### 3.4 Tarjeta del grafo luminoso
- Alto ≈ **266 px**, mismo radio/borde. Mitad izquierda = panel de control oscuro `rgba(0,0,0,.35)`:
  - filas `Models:` `[Cloud|Local]` (segmented: activo = pill **blanco** `#f0eff2` texto negro), `Connectors:` `[● On]` (verde/teal, fondo `#152e27`) `[🔒 Locked]`;
  - texto explicativo 10–11 px dim, `max-width 190 px`.
- Mitad derecha = **"río" de hilos luminosos**: 8–12 trazos de 1 px (coral, oro, magenta, periwinkle, blanco) que salen de un **nodo origen** (punto blanco con glow + label en pill oscuro `Your data · 1 req`) dibujado sobre un **campo de estrellas** (`radial-gradient` + puntos), serpentean y bajan en vertical hacia 5 iconos de proveedores. Debajo, fila de logos 16 px + `+34` y `more`.
- Implementación CSS: `background-image` con 2–3 `radial-gradient` + un `repeating-conic-gradient` muy sutil para el starfield; los hilos con `SVG` `stroke: currentColor` y `filter: drop-shadow(0 0 3px …)`, animados con `stroke-dashoffset` (efecto flujo).

### 3.5 Títulos de sección + segmented
- Label `YOUR BUSINESS, IN FOCUS` (9 px, uppercase, `.14em`, `--text-faint`).
- Título **"Room to grow."** ≈ **38–40 px / 600 / tracking -0.02em**, blanco, **con punto final**.
- **Segmented control**: contenedor pill (radio 999, alto 30 px, fondo `#16151c`), tabs 12 px dim; **activo = pill blanca** `#f0eff2` con texto `#0c0b0e` y sombra suave.
- A la derecha: input fantasma "Demo numbers on" + fila de 3 iconos sociales + pill `Connect account →`.

### 3.6 Input / composer
- Caja: ancho ≈ **650 px**, alto ≈ **100–110 px**, radio **16–18 px**, fondo `--surface` (`#111114`), borde 1px `rgba(255,255,255,.07)`, **sin sombra fuerte**.
- Placeholder `Ask anything…` 14 px `--text-faint`, arriba-izquierda; abajo-izquierda un `+`; abajo-derecha un chip de modelo (`icono + Qwen 3.5 27b ⌄`) y el **botón enviar circular Ø 30 px con `--grad-cta`** y glifo asterisco.
- **Barra de chips sobre la caja**: `⬡ Local · stays on this Mac · Qwen 3.5 27b` (izq., 11 px dim) y `✕ Reverse Engineer` (der., pill con borde).
- **Chips dentro de la caja** (bajo el placeholder): `Live · Listening`, `Ctrl` — pills 24 px con borde suave.

### 3.7 Chat
- Lista de chats (panel 200–220 px): header `Your chats` 12 px/600 + `×`; `+ New Chat` 12 px; **buscador** pill radio 10 px, fondo `#121216`, borde suave, icono lupa 12 px; filas 32 px radio 8 px, texto 12 px dim; **activa** con tinte azul `#232c3a` y texto claro.
- **Mensaje de usuario**: bloque **alineado a la derecha**, ancho máximo ~70 %, radio **14–16 px**, fondo `#17171b`, padding 12–14 px, texto 14 px `--text`, sin borde.
- **Mensaje de asistente**: **no es burbuja** → bloque plano a sangre: avatar cuadrado 20 px (radio 6) + nombre 12 px/600, línea de estado 11 px dim (`▷ Waiting for qwen 3.5 27b redo…`), y el cuerpo del mensaje a ancho completo del área.
- Fondo del área de chat `#0f0f11`; separadores sólo por espaciado y `--border-soft`.

### 3.8 Pantalla "Ask anything" y orbe
- **Hero centrado verticalmente**: icono cuadrado 36 px (radio 8–10, blanco con glifo periwinkle, **halo** `radial-gradient` 90 px) → título **"Ask anything."** ≈ **56–62 px / 600 / tracking -0.025em** → subtítulo 2 líneas, 13 px `--text-dim`, `max-width 380 px`, centrado → fila de **3 chips** (`Plan my day`, `Find something in my memory`, `Work through an idea`): pill 26–28 px, fondo `#141418`, borde `rgba(255,255,255,.08)`, texto 11 px dim.
- **Banner "Live · Listening"** sobre la caja: imagen de nebulosa a sangre, radio 16 px, alto ≈ 140 px; el **orbe** va envuelto en un **octógono/borde poligonal teal** de 1.5 px con glow; label `LIVE · LISTENING` 9 px uppercase teal `.18em`; título `Listening. Just talk.` 14 px/600 blanco; 3 pills translúcidas (`End`, `Mute on`, `Sound on`) con `backdrop-filter: blur(10px)`; panel de medidor a la derecha con barras rosas de 2–3 px.
- **Orbe**: esfera con `radial-gradient(circle at 35% 30%, #7fffe8 0%, #14e0c8 35%, #0a7f74 75%, #062f2c 100%)`, `box-shadow: 0 0 24px rgba(20,224,200,.55), inset -6px -8px 18px rgba(0,0,0,.5)`, animación de pulso 2–3 s.

### 3.9 Tipografía
- **UI**: sans neutral tipo **Inter / SF Pro / Helvetica Now** — pesos 400 (cuerpo), 500 (chips/labels), 600 (títulos, nombres), 700 (cifras grandes). Tracking negativo obligatorio en títulos: `-0.02em` a `-0.03em`.
- **Cuerpo**: 13–14 px, `line-height 1.5`; captions 11–12 px; labels de sección 9–10 px uppercase `.14em`.
- **Pantalla "Memory"**: título 20 px/600 + subtítulo 10 px dim; banner inferior con tinte coral.
- **Serif**: la UI del producto **no** usa serif en sus títulos grandes (`Room to grow.` y `Ask anything.` son sans grotesca compacta). El serif aparece en el **wordmark "Cloud"** (display bold con degradado oro) y en los rótulos editoriales del vídeo. Recomendación: sans para todo el UI + **display serif sólo como acento opcional** (`--font-display: "Instrument Serif", "Playfair Display", Georgia, serif`) en 1–2 títulos de marketing, si se quiere el aire editorial del vídeo.

---

## 4. Rasgos visuales codificables en CSS (los 12 que dan el salto de look)

| # | Rasgo | CSS |
|---|---|---|
| 1 | **Casi-negro cálido, no `#000`** | `--bg:#0b0a0d; color-scheme: dark;` |
| 2 | **Tarjetas apenas más claras que el fondo** (+3–6 niveles) | `background:#111114; border:1px solid rgba(255,255,255,.07); border-radius:20px;` |
| 3 | **Sin sombras duras; sólo inset hairline** | `box-shadow: inset 0 1px 0 rgba(255,255,255,.04), 0 18px 40px -24px rgba(0,0,0,.9);` |
| 4 | **Glow por color de acento detrás de iconos** | `::before{background:radial-gradient(circle,var(--glow-accent),transparent 70%);filter:blur(24px)}` |
| 5 | **Hairlines translúcidos en vez de grises** | `border-color: rgba(255,255,255,.07);` → se adapta a cualquier superficie |
| 6 | **Blanco roto como "primario" del sistema** (pill activa) | `.seg-active{background:#f0eff2;color:#0c0b0e;border-radius:999px}` |
| 7 | **Pills en todas partes** (chips, filtros, controles) | `border-radius:999px; height:26px; padding:0 12px; font-size:11px; border:1px solid rgba(255,255,255,.08);` |
| 8 | **Radios generosos y jerarquía de 3 niveles** | `--r-card:20px; --r-inner:12px; --r-sm:8px; --r-pill:999px` |
| 9 | **Vidrio sólo en overlays flotantes** | `background:rgba(10,10,12,.55); backdrop-filter:blur(12px) saturate(1.1);` |
| 10 | **Degradado de marca para el CTA** | `background:linear-gradient(135deg,#ff2e88,#ff5a3c); box-shadow:0 6px 18px -6px rgba(255,46,136,.5);` |
| 11 | **Texto con degradado oro para el estado "Cloud"** | `background:linear-gradient(180deg,#ffd98a,#e8a33d); -webkit-background-clip:text; color:transparent;` |
| 12 | **Tipografía apretada + punto final en los títulos** | `letter-spacing:-.025em; font-weight:600;` y el `"."` literal en "Ask anything." / "Room to grow." |
| 13 | **Fondo vivo pero contenido** (starfield + radiales tenues) | `background-image: radial-gradient(1200px 600px at 20% -10%, rgba(124,140,255,.10), transparent 60%), radial-gradient(800px 500px at 85% 30%, rgba(232,115,74,.07), transparent 60%);` |
| 14 | **Barras de progreso finas y de color de marca** | `height:3px; border-radius:999px; background:linear-gradient(90deg,#7c8cff,#ff2e88);` |

---

## 5. Accesibilidad — contrastes calculados (WCAG 2.1)

Combinaciones **medidas en el vídeo** (fondo real muestreado):

| Combinación | Ratio | Veredicto |
|---|---|---|
| `#ececee` sobre `#0c0b0e` (texto primario/página) | **16.6:1** | AAA |
| `#ececee` sobre `#101012` (texto primario/tarjeta) | **16.1:1** | AAA |
| `#ececee` sobre `#17171b` (texto en burbuja) | **15.2:1** | AAA |
| Caption dim real `#464548` sobre `#0c0b0e` | **2.06:1** | ✕ **falla** (es el defecto del original) |
| `#e8734a` coral sobre `#111114` | **6.27:1** | AA (texto), AA grande |
| `#ff2e88` magenta sobre `#111114` | **5.38:1** | AA |
| `#14e0c8` teal sobre `#111114` | **11.2:1** | AAA |
| `#f0b429` oro sobre `#111114` | **10.1:1** | AAA |
| `#ff4d5e` error sobre `#111114` | **5.8:1** | AA |
| `#9a9aa3` dim corregido sobre `#0b0a0d` | **7.08:1** | AAA |
| `#9a9aa3` sobre `#111114` | **6.75:1** | AA+ |
| Borde `#26262c` sobre `#0b0a0d` | **1.31:1** | decorativo (no es texto) |
| Texto negro `#0c0b0e` sobre pill blanca `#f0eff2` | **17.1:1** | AAA |

**Reglas de accesibilidad para el tema:**
1. **No replicar el dim original a 2:1**: usar `--text-dim:#9a9aa3` (7:1). Si se quiere el aire "fantasma" del vídeo, aplicar `opacity:.65` **sólo** a labels decorativos ≥ 12 px y nunca a texto funcional.
2. El coral `#e8734a` no se usa como texto pequeño sobre `--surface-2` (baja a ~5.5:1): para texto pequeño usar `#ff9b78` o blanco.
3. El oro `#f0b429` **sí** vale para texto y para borde de pill, pero el degradado `#ffd98a→#e8a33d` sólo en ≥ 24 px bold (el extremo claro baja el contraste).
4. **Nunca** texto dim sobre el glow/starfield: el fondo efectivo sube de luminancia; mantener el texto sobre superficie opaca.
5. `--accent-2` sobre el degradado del botón: texto blanco `#fff` sobre `#ff2e88` = 3.9:1 → sólo válido para iconos/14 px bold; para texto normal usar el pill blanco.
6. Foco visible: `outline: 2px solid rgba(124,140,255,.9); outline-offset: 2px;` — el periwinkle es el color de foco más legible sobre negro (13.5:1).
7. Movimiento: el pulso del orbe y el flujo del grafo deben respetar `@media (prefers-reduced-motion: reduce)` (dejar estático).

---

## 6. Resumen de medidas (checklist de implementación)

| Token | Valor |
|---|---|
| sidebar | 190–200 px, fondo = `--bg`, borde der. `rgba(255,255,255,.07)` |
| topbar | 52 px, transparente |
| nav item | 34 px alto, radio 10 px, icono 16, label 13 |
| card | radio 20 px, borde 1px, padding 24–32, superficie `--surface` |
| card grande / hero | alto ~224 px |
| métrica numérica | 52 px / 700 / `-0.03em` |
| título sección | 38 px / 600 / `-0.02em` |
| hero "Ask anything." | 60 px / 600 / `-0.025em` |
| burbuja chat | radio 15 px, bg `#17171b`, max-width 70 % |
| composer | 650×105 px, radio 17 px |
| chip/pill | alto 26 px, radio 999, 11 px |
| orbe | Ø 76–90 px, glow 24 px |
| blur overlays | 8–14 px |
| gap grid | 10–12 px |
