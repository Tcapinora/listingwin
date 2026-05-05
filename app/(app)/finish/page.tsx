"use client";

import Link from "next/link";
import { ArrowRight, MonitorPlay, Target } from "lucide-react";

export default function FinishPage() {
  return (
    <section className="mx-auto max-w-4xl rounded-[2rem] bg-white p-7 shadow-card ring-1 ring-slate-200/70 sm:p-10">
      <p className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-800">
        Presentation complete
      </p>
      <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
        What would you like to do next?
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
        Keep the flow simple after the vendor meeting: reopen the presentation
        or move into the closing workspace.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/presentation"
          className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6 transition hover:border-blue-200 hover:bg-blue-50"
        >
          <MonitorPlay className="text-blue-700" size={24} />
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">
            Vendor Presentation
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Reopen the clean vendor-facing presentation.
          </p>
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-800">
            Open presentation
            <ArrowRight size={16} />
          </span>
        </Link>

        <Link
          href="/draft"
          className="rounded-[1.5rem] bg-blue-700 p-6 text-white shadow-card transition hover:bg-blue-800"
        >
          <Target size={24} />
          <h2 className="mt-4 text-2xl font-semibold tracking-tight">
            Agent Workspace
          </h2>
          <p className="mt-2 text-sm leading-6 text-blue-100">
            Use the closing tools, buyer database, scripts, and Form 6 explainer.
          </p>
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold">
            Open workspace
            <ArrowRight size={16} />
          </span>
        </Link>
      </div>
    </section>
  );
}
