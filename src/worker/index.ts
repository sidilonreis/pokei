import { Hono } from "hono";

type Event = {
  id: string;
  type: string;
  timestamp: number;
  payload: any;
};

const app = new Hono<{ Bindings: { LEDGER: KVNamespace; USAGE: KVNamespace } }>();

// HEALTH CHECK
app.get("/health", async (c) => {
  const ledgerTest = await c.env.LEDGER?.get("events");
  const usageTest = await c.env.USAGE?.get("global_usage");

  return c.json({
    status: "ok",
    bindings: {
      LEDGER: !!c.env?.LEDGER,
      USAGE: !!c.env?.USAGE,
    },
    kv_test: {
      ledger_has_data: !!ledgerTest,
      usage_has_data: !!usageTest,
    },
  });
});

// RUN JOB (GRAVA NO KV)
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

  const usageRaw = await c.env.USAGE.get("global_usage");
  const usage = usageRaw ? Number(usageRaw) : 0;

  await c.env.USAGE.put("global_usage", String(usage + 1));

  return c.json({
    ok: true,
    event,
    saved: true,
  });
});

// EVENTS
app.get("/events", async (c) => {
  const data = await c.env.LEDGER.get("events");
  return c.json(data ? JSON.parse(data) : []);
});

export default app;
