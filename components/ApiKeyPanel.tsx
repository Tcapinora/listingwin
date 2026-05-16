"use client";

import { Copy, Eye, EyeOff, KeyRound, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";

type ApiKeyResponse = {
  apiKey?: string;
  error?: string;
};

function maskApiKey(apiKey: string) {
  if (!apiKey) {
    return "";
  }

  return `${apiKey.slice(0, 12)}••••••••••••••••${apiKey.slice(-8)}`;
}

export function ApiKeyPanel() {
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(false);

  const displayValue = useMemo(
    () => (visible ? apiKey : maskApiKey(apiKey)),
    [apiKey, visible],
  );

  async function retrieveApiKey() {
    setLoading(true);
    setError("");
    setCopied(false);

    try {
      const response = await fetch("/api/account/api-key", {
        cache: "no-store",
      });
      const payload = (await response.json()) as ApiKeyResponse;

      if (!response.ok || !payload.apiKey) {
        throw new Error(payload.error || "Could not retrieve API key.");
      }

      setApiKey(payload.apiKey);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Could not retrieve API key.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function copyApiKey() {
    if (!apiKey) {
      return;
    }

    try {
      await navigator.clipboard.writeText(apiKey);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.prompt("Copy API key", apiKey);
    }
  }

  return (
    <section className="rounded-3xl border border-blue-100 bg-white p-6 shadow-card lg:col-span-2">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
            <KeyRound size={14} />
            API access
          </div>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight">
            Manage account API key
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
            Retrieve the key for this ListingWin account when connecting private
            workflows or future integrations. Keep it private and only share it
            with systems you control.
          </p>
        </div>

        <div className="rounded-3xl bg-slate-950 p-5 text-white">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <ShieldCheck size={17} className="text-blue-300" />
              Private account key
            </div>
            <button
              type="button"
              onClick={() => setVisible((current) => !current)}
              disabled={!apiKey}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label={visible ? "Hide API key" : "Show API key"}
              title={visible ? "Hide API key" : "Show API key"}
            >
              {visible ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <div className="mt-4 min-h-14 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-mono text-sm text-blue-50">
            {apiKey ? displayValue : "No key retrieved yet"}
          </div>

          {error ? (
            <p className="mt-3 rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-100">
              {error}
            </p>
          ) : null}

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={retrieveApiKey}
              disabled={loading}
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-wait disabled:opacity-70"
            >
              {loading ? "Retrieving..." : apiKey ? "Refresh key" : "Retrieve API key"}
            </button>
            <button
              type="button"
              onClick={copyApiKey}
              disabled={!apiKey}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Copy size={15} />
              {copied ? "Copied" : "Copy key"}
            </button>
          </div>

          <p className="mt-4 text-xs leading-5 text-slate-400">
            Use it as <span className="font-mono text-slate-200">Authorization: Bearer YOUR_KEY</span>.
            This is generated from a private Vercel secret and is not stored in
            the browser until you retrieve it.
          </p>
        </div>
      </div>
    </section>
  );
}
