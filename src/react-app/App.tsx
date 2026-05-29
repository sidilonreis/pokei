import { useEffect, useState } from "react";
import "./App.css";

type Event = {
  id: string;
  type: string;
  timestamp: number;
  payload: any;
};

export default function App() {
  const [health, setHealth] = useState<any>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);

  const API = "";

  async function loadHealth() {
    const res = await fetch(`${API}/health`);
    const data = await res.json();
    setHealth(data);
  }

  async function runJob() {
    setLoading(true);

    await fetch(`${API}/run`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "test-job",
        time: Date.now(),
      }),
    });

    await loadEvents();
    await loadHealth();

    setLoading(false);
  }

  async function loadEvents() {
    const res = await fetch(`${API}/events`);
    const data = await res.json();
    setEvents(data);
  }

  useEffect(() => {
    loadHealth();
    loadEvents();

    const interval = setInterval(() => {
      loadEvents();
      loadHealth();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>⚙️ ControlPlane SaaS</h1>

      <div style={{ marginBottom: 20 }}>
        <h3>🟢 Health</h3>
        <pre>{JSON.stringify(health, null, 2)}</pre>
      </div>

      <button onClick={runJob} disabled={loading}>
        {loading ? "Executando..." : "🚀 Run Job"}
      </button>

      <div style={{ marginTop: 20 }}>
        <h3>📡 Events</h3>
        <pre>{JSON.stringify(events, null, 2)}</pre>
      </div>
    </div>
  );
}
