
"use client";

import { useEffect, useState } from "react";

type HealthResponse = {
  status: string;
  service: string;
  version: string;
};

export default function Home() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function checkBackend() {
      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_API_BASE_URL ??
          "http://127.0.0.1:8000";

        const response = await fetch(
          `${baseUrl}/api/health`,
          {
            signal: controller.signal,
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(`Backend returned HTTP ${response.status}`);
        }

        const data = (await response.json()) as HealthResponse;

        setHealth(data);
        setError(null);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void checkBackend();

    return () => controller.abort();
  }, []);

  return (
    <main className="min-h-screen bg-[#080b12] text-white flex items-center justify-center p-6">
      <section className="w-full max-w-2xl space-y-8">

        <header className="space-y-3">
          <p className="text-cyan-400 text-sm tracking-[0.3em] font-semibold">
            ATLAS / TRADING INTELLIGENCE
          </p>

          <h1 className="text-5xl font-bold tracking-tight">
            Welcome to ATLAS.
          </h1>

          <p className="text-slate-400">
            Your intelligent futures trading workspace.
          </p>
        </header>

        <div className="rounded-2xl border border-slate-700 bg-[#111827] p-7 transition-all duration-300 hover:border-cyan-500/50 hover:-translate-y-1">

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">
              Backend Connection
            </h2>

            <span className="text-xs text-slate-400">
              System Status
            </span>
          </div>

          {loading && (
            <div className="animate-pulse text-cyan-400">
              Connecting to ATLAS backend...
            </div>
          )}

          {health && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400 font-semibold">
                  Backend Connected
                </span>
              </div>

              <div className="space-y-2 text-sm text-slate-300">
                <p>Status: {health.status}</p>
                <p>Service: {health.service}</p>
                <p>Version: {health.version}</p>
              </div>
            </div>
          )}

          {error && (
            <div className="text-red-400 space-y-2">
              <p>Backend connection failed.</p>
              <p className="text-sm">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="rounded-lg bg-red-500/10 px-4 py-2 hover:bg-red-500/20 transition"
              >
                Retry connection
              </button>
            </div>
          )}

        </div>

        <p className="text-xs text-slate-500">
          ATLAS v0.1.0 · Development Environment · Paper Trading Only
        </p>

      </section>
    </main>
  );
}
