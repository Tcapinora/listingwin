"use client";

import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { SaleCalendar } from "@/components/SaleCalendar";

export default function CalendarWorkspacePage() {
  return (
    <section className="mx-auto max-w-7xl">
      <div className="mb-8 rounded-[2rem] bg-white p-7 shadow-card ring-1 ring-slate-200/70 sm:p-10">
        <p className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-800">
          <CalendarDays size={16} />
          Calendar-only mode
        </p>
        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Run the campaign calendar on its own.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Use this standalone workspace when you only need to plan styling,
              trades, photography, open homes, launch tasks, and campaign dates
              without opening the presentation builder.
            </p>
          </div>
          <Link
            href="/details"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-blue-100 bg-white px-5 py-3 text-sm font-semibold text-blue-900 shadow-sm transition hover:bg-blue-50"
          >
            Back to builder
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <SaleCalendar standalone />
    </section>
  );
}
