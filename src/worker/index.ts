import { Hono } from "hono";

const app = new Hono();

// HEALTH
app.get("/health", (c: any) => {
  return c.json({
    ok: true,
  });
});

// RUN
app.post("/run", async (c: any) => {
  const body = await c.req.json();

  const event = {
    id: crypto.randomUUID(),
    type: "job.executed",
    timestamp: Date.now(),
    payload: body,
  };

  const raw = await c.env.LEDGER.get("events");

  const ledger = raw ? JSON.parse(raw) : [];

  ledger.push(event);

  await c.env.LEDGER.put("events", JSON.stringify(ledger));

  return c.json({
    ok: true,
    event,
  });
});

// EVENTS
app.get("/events", async (c: any) => {
  const raw = await c.env.LEDGER.get("events");

  return c.json(raw ? JSON.parse(raw) : []);
});

export default app;
