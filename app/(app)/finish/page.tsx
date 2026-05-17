"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, FileText, MonitorPlay, Target } from "lucide-react";
import { WorkflowPath } from "@/components/WorkflowPath";

export default function FinishPage() {
  return (
    <section className="mx-auto max-w-5xl">
      <WorkflowPath active="presentation" />

      <div className="mt-7 rounded-[2rem] bg-white p-7 shadow-card ring-1 ring-slate-200/70 sm:p-10">
        <p className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-800">
          Appraisal ready
        </p>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          Your appraisal is ready to run.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
          Start with the seller-facing appraisal, capture private notes in the
          workspace, then generate the proposal while the conversation is still
          fresh.
        </p>

        <div className="mt-7 grid gap-3 rounded-[1.5rem] bg-slate-50 p-3 ring-1 ring-slate-200/70 sm:grid-cols-3">
          {[
            ["1", "Vendor appraisal", "Show the campaign."],
            ["2", "Agent workspace", "Capture the close."],
            ["3", "Proposal", "Send the follow-up."],
          ].map(([step, title, text]) => (
            <div
              key={step}
              className="flex items-center gap-3 rounded-[1.25rem] bg-white p-4 shadow-sm"
            >
              <span className="grid h-9 w-9 place-items-center rounded-full bg-blue-50 text-sm font-semibold text-blue-800">
                {step}
              </span>
              <span>
                <span className="block text-sm font-semibold text-slate-950">
                  {title}
                </span>
                <span className="block text-xs text-slate-500">{text}</span>
              </span>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          <Link
            href="/presentation"
            className="premium-lift rounded-[2rem] bg-blue-700 p-7 text-white shadow-card transition hover:bg-blue-800"
          >
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/20">
              <MonitorPlay size={26} />
            </span>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight">
              Vendor Appraisal
            </h2>
            <p className="mt-2 text-sm leading-6 text-blue-100">
              Seller-facing. Clean, visual, and designed to show the campaign
              before the campaign.
            </p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold">
              <CheckCircle2 size={16} />
              Open appraisal
              <ArrowRight size={16} />
            </span>
          </Link>

          <Link
            href="/draft"
            className="premium-lift rounded-[2rem] border border-slate-200 bg-slate-50 p-7 transition hover:border-blue-200 hover:bg-blue-50"
          >
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-blue-700 shadow-sm ring-1 ring-blue-100">
              <Target size={26} />
            </span>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">
              Appraisal Workspace
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Private. Use this only after the seller has seen the presentation:
              checklist, objections, notes, and follow-up.
            </p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-800">
              Open workspace
              <ArrowRight size={16} />
            </span>
          </Link>

          <Link
            href="/proposal"
            className="premium-lift rounded-[2rem] border border-slate-200 bg-white p-7 transition hover:border-blue-200 hover:bg-blue-50"
          >
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-blue-700 ring-1 ring-blue-100">
              <FileText size={26} />
            </span>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">
              Proposal
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Follow-up document. Reuse everything captured and copy the seller
              link after the appraisal.
            </p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-800">
              Generate proposal
              <ArrowRight size={16} />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
