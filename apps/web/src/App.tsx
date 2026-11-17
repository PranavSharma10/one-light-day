import { useEffect, useState } from "react";

type ApiState = "checking" | "ok" | "down";

export default function App() {
  const [api, setApi] = useState<ApiState>("checking");

  useEffect(() => {
    fetch("/api/healthz")
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((body: { ok: boolean }) => setApi(body.ok ? "ok" : "down"))
      .catch(() => setApi("down"));
  }, []);

  return (
    <main>
      <h1>One Light-Day</h1>
      <p>API: {api}</p>
    </main>
  );
}