import { Hono } from "hono";

type Event = {
  id: string;
  type: string;
  timestamp: number;
  payload: any;
};

const app = new Hono();

// HEALTH
app.get("/health", async (c) => {
  return c.json({
    ok: true,
  });
});

// RUN
app.post("/run", async (c) => {
  const env = c.env as any;

  const body = await c.req.json();

  const event: Event = {
    id: crypto.randomUUID(),
    type: "job.executed",
    timestamp: Date.now(),
    payload: body,
  };

  const raw = await env.LEDGER.get("events");

  const ledger: Event[] = raw ? JSON.parse(raw) : [];

  ledger.push(event);

  await env.LEDGER.put("events", JSON.stringify(ledger));

  return c.json({
    ok: true,
    event,
  });
});

// EVENTS
app.get("/events", async (c) => {
  const env = c.env as any;

  const raw = await env.LEDGER.get("events");

  return c.json(raw ? JSON.parse(raw) : []);
});

export default app;
