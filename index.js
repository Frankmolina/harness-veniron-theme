/**
 * Veniron Theme — Host half.
 *
 * Sirve el fondo 4K de Vendetta desde el propio Mac. La imagen nunca sale del
 * equipo: el cliente la pide a esta ruta del Harness.
 */
import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

export const inject = ['webServer'];

export const BACKGROUND_ROUTE = '/api/veniron-theme/background';
export const MARK_ROUTE = '/api/veniron-theme/mark';
export const BACKGROUND_PATH = join(
  homedir(),
  'Pictures/Wallpapers/V_de_Vendetta_4K_rosa.jpg'
);


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
