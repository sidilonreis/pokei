import { Hono } from "hono";

type Event = {
  id: string;
  type: string;
  timestamp: number;
  payload: any;
};

const app = new Hono<{ Bindings: { LEDGER: KVNamespace; USAGE: KVNamespace } }>();

// HEALTH (TESTE DE BINDINGS)
app.get("/health", async (c) => {
  return c.json({
    ok: true,
    hasLedger: !!c.env.LEDGER,
    hasUsage: !!c.env.USAGE,
  });
});

// RUN JOB
app.post("/run", async (c) => {
  const body = await c.req.json();

  const event: Event = {
    id: crypto.randomUUID(),
    type: "job.executed",
    timestamp: Date.now(),
    payload: body,
  };

  // LEDGER
  const existing = await c.env.LEDGER.get("events");
  const ledger: Event[] = existing ? JSON.parse(existing) : [];

  ledger.push(event);

  await c.env.LEDGER.put("events", JSON.stringify(ledger));

  // USAGE
  const usageKey = "global_usage";

  const usageRaw = await c.env.USAGE.get(usageKey);
  const usage = usageRaw ? Number(usageRaw) : 0;

  await c.env.USAGE.put(usageKey, String(usage + 1));

  return c.json({
    ok: true,
    event,
  });
});

// EVENTS
app.get("/events", async (c) => {
  const existing = await c.env.LEDGER.get("events");
  const ledger = existing ? JSON.parse(existing) : [];

  return c.json(ledger);
});

export default app;
