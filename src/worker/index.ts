import { Hono } from "hono";

type Event = {
  id: string;
  type: string;
  timestamp: number;
  payload: any;
};

const app = new Hono<{ Bindings: { LEDGER: KVNamespace } }>();

// health check
app.get("/health", async (c) => {
  const existing = await c.env.LEDGER.get("events");
  const ledger = existing ? JSON.parse(existing) : [];

  return c.json({
    status: "ok",
    service: "controlplane-engine",
    events: ledger.length,
  });
});

// execução de job (AGORA COM KV)
app.post("/run", async (c) => {
  const body = await c.req.json();

  const event: Event = {
    id: crypto.randomUUID(),
    type: "job.executed",
    timestamp: Date.now(),
    payload: body,
  };

  const existing = await c.env.LEDGER.get("events");
  const ledger: Event[] = existing ? JSON.parse(existing) : [];

  ledger.push(event);

  await c.env.LEDGER.put("events", JSON.stringify(ledger));

  return c.json({
    ok: true,
    event,
  });
});

// eventos (AGORA LENDO DO KV)
app.get("/events", async (c) => {
  const existing = await c.env.LEDGER.get("events");
  const ledger = existing ? JSON.parse(existing) : [];

  return c.json(ledger);
});

export default app;
