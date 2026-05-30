import { Hono } from "hono";

const app = new Hono();
const API_KEY = 'CONTROLPLANE_DEV_KEY';

// Middleware de autenticação (ignora a rota raiz)
app.use("*", async (c, next) => {
  if (c.req.path === "/") return await next();
  
  const key = c.req.header('x-api-key');
  if (key !== API_KEY) {
    return c.text('Unauthorized', 401);
  }
  await next();
});

// Rota raiz
app.get("/", (c) => c.text("Pokei API está online!"));

// EXECUTE
app.post("/api/execute", async (c) => {
  const body = await c.req.text();
  return c.text(`Execute received: ${body}`);
});

// EVENTS STREAM (SSE)
app.get("/api/events/stream", (c) => {
  c.header('Content-Type', 'text/event-stream');
  c.header('Cache-Control', 'no-cache');
  c.header('Connection', 'keep-alive');
  
  return c.streamText(async (stream) => {
    await stream.write(': keep-alive\n\n');
    await stream.sleep(1000);
    await stream.write('event: message\n');
    await stream.write('data: {"msg":"heartbeat"}\n\n');
  });
});

// QR CODE
app.get("/qr", (c) => {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="200" fill="#fff"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
        font-family="sans-serif" font-size="12" fill="#000">QR Placeholder</text>
</svg>`;
  c.header('Content-Type', 'image/svg+xml');
  c.header('Cache-Control', 'no-cache');
  return c.body(svg);
});

// OBSERVABILITY
app.get("/api/observability/*", (c) => {
  if (c.req.path.endsWith('/health')) {
    return c.json({ status: 'ok', timestamp: Date.now() });
  }
  return c.json({
    cpu: '0.1%',
    memory: '12MB',
    uptime: performance.now(),
  });
});

export default app;
