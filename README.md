# Harness Veniron Theme — piel «Agentic OS»

Tema visual para DeepSeek Harness, instalado como plugin cliente del perfil
`desktop`. No toca la estructura de la app: sólo cambia tokens `--dsw-alias-*`,
pinta capas de fondo decorativas y afina unos pocos detalles con selectores
seguros. Desactivarlo (o desinstalarlo) devuelve la app a su aspecto original al
instante.

## Qué hace esta versión (1.1.0)

Inspirada en el dashboard «Agentic OS» que sale en el vídeo de Jack Roberts
(*I Tested Uncensored AI…*, 7-nov-2026, min. 3:35 y 10:00):

- **Fondo**: negro azulado con tres degradados radiales (violeta arriba a la
  derecha, cian abajo a la izquierda, rosa abajo al centro), una rejilla de
  44 px enmascarada con degradado, grano fino (`feTurbulence`) y viñeta suave.
- **Superficies de cristal**: capas 1/2 con blanco al 3,5 % y 5,5 %, bordes de
  1 px al 7 % y 13 %, radios 8/12/16/22 px.
- **Acento**: violeta `#A78BFA` para marca y estados de negocio; el botón
  principal (enviar/confirmar) lleva degradado violeta → fucsia → rosa.
- **Texto**: `#ECECF3` primario, `#A6A3BC` secundario (contraste > 7:1 sobre el
  fondo), terciario violeta claro.
- **Identidad**: la máscara de Vendetta queda como resplandor difuminado
  (`blur 26px`, opacidad 7 %) y sigue coronando la cuenta en la barra lateral.
- **Detalles**: scrollbar de 9 px violeta, selección violeta, foco visible de
  2 px, código con fondo casi negro y texto lavanda.

### Orbe de estado (1.2.0)

Esfera flotante de 52 px en la esquina inferior derecha, registrada en el slot
`conversation.composer.dock` (id `veniron-orb`, orden 40). Sólo afirma lo que
puede saber leyendo la sesión activa con `useSession`:

- **Reposo**: núcleo teal que respira cada 5,2 s, anillo tenue.
- **Trabajando** (`session.running === true`): núcleo magenta, halo y un arco
  cónico girando cada 1,15 s.
- **Acaba de terminar**: destello teal de 0,95 s.
- `prefers-reduced-motion` desactiva todas las animaciones.
- `title` y `aria-label` anuncian «Veniron en reposo / trabajando / ha terminado».

No lee el micrófono ni el TTS: si no hay señal fiable de «escuchando» o
«hablando», no lo inventa.

### Panel «Veniron OS» (1.3.0)

Página propia en el slot `main` (key `veniron-home`) con entrada en
`sidebar.panellist` (orden 8). Datos reales, sin cifras inventadas:

- Ruta Host `GET /api/veniron-theme/dashboard`: reutiliza `sessionQuery` para el
  corpus de sesiones y `agents.turnBoundaryOf(session).openTurnStartSeq` para
  saber quién trabaja ahora (mismo criterio que Mission Control, no un polling
  del estado del agente).
- Devuelve `counts {total, live, running}`, las 12 sesiones más recientes y el
  objeto medido por `tokenMeter.measure()` de la sesión viva más reciente.
- La tarjeta de tokens es defensiva: si el medidor no da cifras, muestra «—».
- Refresco cada 10 s; clic en una fila abre esa sesión.

## Estructura

| Archivo | Papel |
|---|---|
| `client.js` | Mitad cliente: tokens, CSS y capas de fondo decorativas. |
| `index.js` | Mitad host: sirve la máscara 4K y el icono de cuenta desde el Mac. |
| `cordis.patch.yml` | Inserta la fila del plugin en el perfil. |
| `icon.svg` | Icono del plugin (máscara con degradado violeta→rosa). |
| `mark.jpg` | Icono pequeño que sustituye al avatar en «Iniciado sesión». |

## Reversible

```bash
cd ~/Deepseek_Hardness/Harness/plugins/veniron-theme
git log --oneline        # commits: 53d5888 tema JARVIS · cdb436e estado previo · …
git revert <commit>      # o: git checkout 53d5888 -- client.js index.js package.json icon.svg
```

El fondo 4K se sirve desde `~/Pictures/Wallpapers/V_de_Vendetta_4K_rosa.jpg`;
si falta, la ruta responde 404 y el tema sigue funcionando sin ese detalle.
