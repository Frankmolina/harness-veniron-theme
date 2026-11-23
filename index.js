/**
 * Veniron Theme — Host half.
 *
 * Sirve el fondo 4K de Vendetta desde el propio Mac. La imagen nunca sale del
 * equipo: el cliente la pide a esta ruta del Harness.
 */
import { readFileSync, readdirSync, statSync, realpathSync } from 'node:fs';
import { execFile } from 'node:child_process';
import { homedir } from 'node:os';
import { join, resolve, basename } from 'node:path';

export const inject = ['webServer'];

export const BACKGROUND_ROUTE = '/api/veniron-theme/background';
export const MARK_ROUTE = '/api/veniron-theme/mark';
export const LAUNCHER_ROUTE = '/api/veniron-theme/launcher';
export const OPEN_ROUTE = '/api/veniron-theme/open';
export const BACKGROUND_PATH = join(
  homedir(),
  'Pictures/Wallpapers/V_de_Vendetta_4K_rosa.jpg'
);



// ---------------------------------------------------------------------------
// Lanzador: lista carpetas y scripts de Frank y los abre con `open`.
// Solo se abre lo que ya existía dentro del home, por ruta real y sin shell.
// ---------------------------------------------------------------------------

const HOME = homedir();
const FOLDER_ROOTS = [
  'Desktop/CREADOR',
  'Deepseek_Hardness',
  'Deepseek_Hardness/Harness/plugins',
  'Deepseek_Hardness/Test_IO',
  'Deepseek_Hardness/uTest',
  'Deepseek_Hardness/Salud',
  'Deepseek_Hardness/Simulador_Compraventa',
  'Deepseek_Hardness/Casa_Sacedon',
  'Deepseek_Hardness/Linux_Director',
  'Deepseek_Hardness/Musica',
  'Deepseek_Hardness/Peliculas_Cine',
  'Deepseek_Hardness/Ciberseguridad',
  'Deepseek_Hardness/RecLlamadas',
];

const SCRIPT_DIRS = ['bin', 'Deepseek_Hardness'];

function safeInsideHome(target) {
  try {
    const real = realpathSync(resolve(target));
    return real === HOME || real.startsWith(HOME + '/') ? real : null;
  } catch {
    return null;
  }
}

function isDir(path) {
  try { return statSync(path).isDirectory(); } catch { return false; }
}

function isFile(path) {
  try { return statSync(path).isFile(); } catch { return false; }
}

function listLauncher() {
  const folders = FOLDER_ROOTS
    .map((relative) => join(HOME, relative))
    .filter(isDir)
    .map((path) => ({ name: basename(path), path, kind: 'folder', hint: path.replace(HOME, '~') }));

  const scripts = [];
  for (const dir of SCRIPT_DIRS) {
    const absolute = join(HOME, dir);
    let entries = [];
    try { entries = readdirSync(absolute); } catch { continue; }
    for (const entry of entries) {
      if (entry.startsWith('.')) continue;
      if (/\.bak-|\.bak$|~$|__pycache__/i.test(entry)) continue;
      const full = join(absolute, entry);
      if (!isFile(full)) continue;
      // Scripts de Frank: unos llevan extensión y otros no (bin/ tiene
      // ejecutables sin extensión, como `nave` o `memoria-busca`).
      let executable = false;
      try { executable = (statSync(full).mode & 0o111) !== 0; } catch { executable = false; }
      if (!executable && !/\.(sh|py|mjs|js|command|zsh)$/i.test(entry)) continue;
      scripts.push({ name: entry, path: full, kind: 'script' });
    }
  }
  scripts.sort((left, right) => left.name.localeCompare(right.name));

  return {
    ok: true,
    home: HOME,
    folders,
    scripts: scripts.slice(0, 80).map((item) => ({
      name: item.name,
      path: item.path,
      kind: 'script',
      hint: item.path.replace(HOME, '~'),
    })),
  };
}

function readBody(req, limit = 4096) {
  return new Promise((resolveBody, rejectBody) => {
    let size = 0;
    const chunks = [];
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > limit) {
        rejectBody(new Error('body too large'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      try {
        resolveBody(chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf8')) : {});
      } catch (error) {
        rejectBody(new Error('invalid json'));
      }
    });
    req.on('error', rejectBody);
  });
}

function openTarget(kind, rawPath) {
  if (typeof rawPath !== 'string' || !rawPath.startsWith('/')) throw new Error('ruta no válida');
  const real = safeInsideHome(rawPath);
  if (!real) throw new Error('ruta fuera del home');
  if (kind === 'script') {
    if (!isFile(real)) throw new Error('el script no existe');
    execFile('open', ['-a', 'Terminal', real], () => {});
    return { opened: 'terminal', path: real };
  }
  if (!isDir(real)) throw new Error('la carpeta no existe');
  execFile('open', [real], () => {});
  return { opened: 'finder', path: real };
}

let cached = null;
let markCached = null;

function backgroundBytes() {
  if (!cached) cached = readFileSync(BACKGROUND_PATH);
  return cached;
}

function markBytes() {
  if (!markCached) markCached = readFileSync(new URL('./mark.jpg', import.meta.url));
  return markCached;
}

export function apply(ctx) {
  ctx.effect(() => {
    const disposers = [
      ctx.webServer.register({
        kind: 'exact',
        path: BACKGROUND_ROUTE,
        handler: (req, res) => {
          if (req.method !== 'GET' && req.method !== 'HEAD') {
            res.writeHead(405, { allow: 'GET, HEAD' });
            res.end('method not allowed');
            return;
          }
          let bytes;
          try {
            bytes = backgroundBytes();
          } catch {
            res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
            res.end('background not found');
            return;
          }
          res.writeHead(200, {
            'content-type': 'image/jpeg',
            'content-length': bytes.length,
            'cache-control': 'public, max-age=86400',
          });
          if (req.method === 'HEAD') {
            res.end();
            return;
          }
          res.end(bytes);
        },
      }),
      ctx.webServer.register({
        kind: 'exact',
        path: LAUNCHER_ROUTE,
        handler: (req, res) => {
          if (req.method !== 'GET') {
            res.writeHead(405, { allow: 'GET', 'content-type': 'text/plain; charset=utf-8' });
            res.end('method not allowed');
            return;
          }
          try {
            const body = Buffer.from(JSON.stringify(listLauncher()), 'utf8');
            res.writeHead(200, {
              'content-type': 'application/json; charset=utf-8',
              'cache-control': 'no-store',
              'content-length': body.length,
            });
            res.end(body);
          } catch (error) {
            res.writeHead(500, { 'content-type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }));
          }
        },
      }),
      ctx.webServer.register({
        kind: 'exact',
        path: OPEN_ROUTE,
        handler: async (req, res) => {
          if (req.method !== 'POST') {
            res.writeHead(405, { allow: 'POST', 'content-type': 'text/plain; charset=utf-8' });
            res.end('method not allowed');
            return;
          }
          try {
            const payload = await readBody(req);
            const result = openTarget(payload.kind === 'script' ? 'script' : 'folder', payload.path);
            const body = Buffer.from(JSON.stringify({ ok: true, ...result }), 'utf8');
            res.writeHead(200, { 'content-type': 'application/json; charset=utf-8', 'content-length': body.length });
            res.end(body);
          } catch (error) {
            res.writeHead(400, { 'content-type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ ok: false, error: error instanceof Error ? error.message : String(error) }));
          }
        },
      }),
      ctx.webServer.register({
        kind: 'exact',
        path: MARK_ROUTE,
        handler: (req, res) => {
          if (req.method !== 'GET' && req.method !== 'HEAD') {
            res.writeHead(405, { allow: 'GET, HEAD' });
            res.end('method not allowed');
            return;
          }
          let bytes;
          try {
            bytes = markBytes();
          } catch {
            res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
            res.end('mark not found');
            return;
          }
          res.writeHead(200, {
            'content-type': 'image/jpeg',
            'content-length': bytes.length,
            'cache-control': 'public, max-age=86400',
          });
          if (req.method === 'HEAD') {
            res.end();
            return;
          }
          res.end(bytes);
        },
      }),
    ];
    return () => {
      for (const dispose of disposers) dispose();
    };
  });
}
