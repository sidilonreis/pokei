import { Hono } from "hono";

type Event = {
  id: string;
  type: string;
  timestamp: number;
  payload: any;
};

const app = new Hono();

// memória temporária (depois vira KV/D1)
const ledger: Event[] = [];

// health check
app.get("/health", (c) => {
  return c.json({
    status: "ok",
    service: "controlplane-engine",
    events: ledger.length,
  });
});

// execução de job (core do SaaS)
app.post("/run", async (c) => {
  const body = await c.req.json();

  const event: Event = {
    id: crypto.randomUUID(),
    type: "job.executed",
    timestamp: Date.now(),
    payload: body,
  };

  ledger.push(event);

  return c.json({
    ok: true,
    event,
  });
});

// stream simples (base de observabilidade futura)
app.get("/events", (c) => {
  return c.json(ledger);
});

export default app;
