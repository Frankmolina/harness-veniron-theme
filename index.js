/**
 * Veniron Theme — Host half.
 *
 * Sirve el fondo 4K de Vendetta desde el propio Mac. La imagen nunca sale del
 * equipo: el cliente la pide a esta ruta del Harness.
 */
import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

export const inject = ['webServer', 'sessionQuery'];

export const BACKGROUND_ROUTE = '/api/veniron-theme/background';
export const DASHBOARD_ROUTE = '/api/veniron-theme/dashboard';
export const MARK_ROUTE = '/api/veniron-theme/mark';
export const BACKGROUND_PATH = join(
  homedir(),
  'Pictures/Wallpapers/V_de_Vendetta_4K_rosa.jpg'
);


function json(res, code, payload) {
  res.writeHead(code, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
  });
  res.end(JSON.stringify(payload));
}

function titleOf(observation) {
  if (!observation || observation.status !== 'fulfilled') return undefined;
  const value = observation.value && observation.value.title;
  return value && typeof value.title === 'string' ? value.title : undefined;
}

function titleUpdatedAt(observation) {
  if (!observation || observation.status !== 'fulfilled') return 0;
  const value = observation.value && observation.value.title;
  return Number(value && value.updatedAt) || 0;
}

/**
 * GET /api/veniron-theme/dashboard
 *
 * Datos reales para el panel de inicio: cuántas sesiones hay, cuántas están
 * vivas y cuántas trabajan ahora (mismo criterio que Mission Control: el turno
 * abierto en `turnBoundaryOf`). Read-only, sin mutaciones.
 */
async function dashboard(ctx, signal) {
  const query = ctx.sessionQuery;
  const sessions = ctx.get('sessions');
  const agents = ctx.get('agents');
  const meter = ctx.get('tokenMeter');
  const model = ctx.get('agentDefaultModel');

  const records = await query.listSessions(signal);
  let observations = [];
  try {
    const ids = records.slice(0, 200).map((record) => record.header.id);
    observations = ids.length ? await query.readTitleSnapshots(ids, signal) : [];
  } catch {
    observations = [];
  }
  const observationById = new Map(observations.map((entry) => [entry.sessionId, entry]));

  const counts = { total: records.length, live: 0, running: 0 };
  const items = records.map((record) => {
    const id = record.header.id;
    const observation = observationById.get(id);
    let running = false;
    try {
      const session = sessions && sessions.get ? sessions.get(id) : undefined;
      if (session && agents && typeof agents.turnBoundaryOf === 'function') {
        running = agents.turnBoundaryOf(session).openTurnStartSeq !== null;
      }
    } catch {
      running = false;
    }
    if (record.live) counts.live += 1;
    if (running) counts.running += 1;
    return {
      id,
      title: titleOf(observation) || (record.header.cwd ? record.header.cwd.split('/').pop() : id),
      cwd: record.header.cwd || null,
      live: record.live === true,
      running,
      createdAt: record.header.createdAt,
      updatedAt: Math.max(record.header.createdAt, titleUpdatedAt(observation)),
    };
  }).sort((left, right) => right.updatedAt - left.updatedAt);

  // Tokens de la sesión más reciente, si el medidor del Host los da.
  let usage = null;
  try {
    const newest = items.find((item) => item.live) || items[0];
    const session = newest && sessions && sessions.get ? sessions.get(newest.id) : undefined;
    if (session && meter && typeof meter.measure === 'function') {
      const measured = meter.measure(session);
      if (measured && typeof measured === 'object') usage = measured;
    }
  } catch {
    usage = null;
  }

  let selection = null;
  try {
    if (model && typeof model.currentSelection === 'function') selection = model.currentSelection();
  } catch {
    selection = null;
  }

  return {
    ok: true,
    generatedAt: new Date().toISOString(),
    counts,
    items: items.slice(0, 12),
    usage,
    model: selection,
  };
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
        path: DASHBOARD_ROUTE,
        handler: async (req, res) => {
          if (req.method !== 'GET') {
            json(res, 405, { error: 'method not allowed' });
            return;
          }
          const controller = new AbortController();
          const timer = setTimeout(() => controller.abort(), 8000);
          try {
            const payload = await dashboard(ctx, controller.signal);
            json(res, 200, payload);
          } catch (error) {
            json(res, 500, { error: error instanceof Error ? error.message : String(error) });
          } finally {
            clearTimeout(timer);
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
