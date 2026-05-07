"use client";

import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Copy,
  FileText,
  Handshake,
  Share2,
  Target,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { useAgentProfile } from "@/components/AgentProfileProvider";
import { useListing } from "@/components/ListingProvider";
import {
  AgentNotesSection,
  AppraisalScriptSection,
  BuyerDemandSection,
  BuyerMatchEngineSection,
  CommissionDefenceSection,
  FollowUpAutomationSection,
  Form6PrototypeSection,
  SellerFollowUpSection,
  VendorReportSection,
} from "@/components/ValueSections";
import { generatePropertyWriteup } from "@/lib/copy";
import { getListingWinInsight } from "@/lib/listingScore";
import {
  getShareUrl,
  savePresentationSnapshot,
} from "@/lib/presentationHistory";

export default function DraftPage() {
  const { listing, setListing } = useListing();
  const { profile, isProfileComplete } = useAgentProfile();
  const [shareStatus, setShareStatus] = useState("");
  const insight = getListingWinInsight(listing, profile);
  const writeup = generatePropertyWriteup(listing.details);
  const keyFeatures =
    listing.details.keyFeatures ||
    listing.details.notes ||
    "Street appeal, buyer-focused presentation, clear campaign plan, and strong launch assets.";
  const socialCaption = `${listing.details.headline || "New listing opportunity"} ${
    listing.details.address ? `at ${listing.details.address}` : ""
  }. A polished campaign launch designed to create attention, urgency, and buyer confidence.`;

  const hasProperty = Boolean(listing.details.address.trim());
  const hasImages = Boolean(
    listing.propertyPhotos.length || listing.assets.propertyPhoto,
  );
  const checks = [
    ["Agent profile", isProfileComplete],
    ["Property details", hasProperty],
    ["Media uploaded", hasImages],
    ["Listing pack created", true],
  ];
  const quickActions: Array<[string, string, LucideIcon]> = [
    ["Call Matched Buyers", "#buyer-database", Users],
    ["Plan Follow-Up", "#follow-up", Target],
    ["Form 6 Explainer", "#form-6", FileText],
  ];
  const workspaceStages: Array<[string, string, string]> = [
    [
      "1",
      "Call the right people",
      "Use the buyer database and follow-up plan to create movement straight after the appraisal.",
    ],
    [
      "2",
      "Handle the hard conversations",
      "Use price, buyer demand, campaign reporting, and fee confidence to answer vendor concerns.",
    ],
    [
      "3",
      "Make the next step easy",
      "Explain the Form 6, capture notes, and leave with a clear commitment path.",
    ],
  ];

  return (
    <>
      <section className="rounded-[2rem] bg-white p-6 shadow-card ring-1 ring-slate-200/70 sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.6fr] lg:items-end">
          <div>
            <div className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-800">
              Close & next steps
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Close while the seller understands the value.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              The seller has seen the agency marketing, campaign method, and
              database proof. Use this workspace to handle emotion, commission,
              price concerns, seller situation, follow-up, compliance, and the
              next decision.
            </p>
          </div>
          <div className="rounded-[1.5rem] bg-blue-50 p-5 ring-1 ring-blue-100">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-blue-900">
                  ListingWin score
                </p>
                <p className="mt-2 text-5xl font-semibold tracking-tight text-blue-950">
                  {insight.score}
                </p>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-blue-800">
                {insight.label}
              </span>
            </div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-white">
              <div
                className="h-full rounded-full bg-blue-700"
                style={{ width: `${insight.score}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-[1.75rem] bg-slate-950 p-5 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-200">
            Start here
          </p>
          <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                Turn attachment into a decision.
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                The seller has just seen their home in market. Now use the
                workspace to answer the emotional questions underneath the
                decision: “Can I trust this?”, “Will buyers care?”, “What
                happens next?”, and “Am I safe choosing this agent?”
              </p>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                Keep the seller’s situation in mind: growing family,
                separation, deceased estate, downsizing, or a lifestyle move.
                The close should match the reason they are selling.
              </p>
            </div>
            <Link
              href="#buyer-database"
              className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-blue-950 shadow-card"
            >
              Start closing with buyer proof
            </Link>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-4">
          {checks.map(([label, done]) => (
            <div
              key={String(label)}
              className="flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700"
            >
              {done ? (
                <BadgeCheck className="text-blue-700" size={16} />
              ) : (
                <CheckCircle2 className="text-slate-300" size={16} />
              )}
              {label}
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-3 lg:grid-cols-3">
          {quickActions.map(([label, href, ActionIcon]) => {
            return (
              <Link
                key={label}
                href={href}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-50 px-5 py-3 text-sm font-semibold text-blue-900 transition hover:bg-blue-100"
              >
                <ActionIcon size={16} />
                {label}
              </Link>
            );
          })}
        </div>

        <details className="mt-6 rounded-[1.5rem] bg-slate-50 p-5">
          <summary className="cursor-pointer text-sm font-semibold text-slate-950">
            View prepared notes and copy
          </summary>
          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            {[
              ["Vendor follow-up copy", writeup],
              ["Social caption", socialCaption],
              ["Property strengths", keyFeatures],
              [
                "Property weaknesses",
                listing.details.priceNotes ||
                  "Add likely objections here: price sensitivity, presentation work, access, noise, renovation items, or stronger competing properties.",
              ],
            ].map(([title, content]) => (
              <article key={title} className="rounded-[1.5rem] bg-white p-5">
                <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-950">
                  <FileText size={16} />
                  {title}
                </div>
                <p className="text-sm leading-6 text-slate-600">{content}</p>
              </article>
            ))}
          </div>
        </details>

        <div className="mt-6 rounded-[1.5rem] bg-blue-950 p-5 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-200">
            Finish the appointment
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/finish"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-4 text-base font-semibold text-blue-950 shadow-card"
            >
              Finish appraisal
              <ArrowRight size={18} />
            </Link>
            <button
              type="button"
              onClick={async () => {
                const presentation = savePresentationSnapshot(listing, profile);
                const shareUrl = getShareUrl(presentation.id);

                try {
                  await navigator.clipboard.writeText(shareUrl);
                  setShareStatus("Share link copied");
                } catch {
                  setShareStatus(shareUrl);
                }

                window.setTimeout(() => setShareStatus(""), 3000);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white/10 px-6 py-4 text-base font-semibold text-white ring-1 ring-white/15"
            >
              <Share2 size={18} />
              {shareStatus || "Share"}
            </button>
            <button
              type="button"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(
                    `${writeup}\n\n${socialCaption}\n\n${keyFeatures}`,
                  );
                  setShareStatus("Text copied");
                } catch {
                  setShareStatus("Copy unavailable");
                }

                window.setTimeout(() => setShareStatus(""), 2500);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white/10 px-6 py-4 text-base font-semibold text-white ring-1 ring-white/15"
            >
              <Copy size={18} />
              Copy Follow-Up
            </button>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-3">
        {workspaceStages.map(([number, title, text]) => (
          <article
            key={title}
            className="rounded-[1.75rem] bg-white p-5 shadow-card ring-1 ring-slate-200/70"
          >
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-blue-700 text-sm font-semibold text-white">
                {number}
              </span>
              <h2 className="text-lg font-semibold tracking-tight text-slate-950">
                {title}
              </h2>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-500">{text}</p>
          </article>
        ))}
      </section>

      <section
        id="buyer-database"
        className="mt-8 rounded-[2rem] bg-white p-6 shadow-card ring-1 ring-blue-50 sm:p-8"
      >
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-700">
            Buyer and follow-up tools
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            Prove there is already demand, then keep the seller close.
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            This is where the agent turns the marketing presentation into a
            real next step: who to call, what to say, and how to keep momentum
            after the appraisal.
          </p>
        </div>
      </section>

      <section id="follow-up" className="mt-10 rounded-[2rem] bg-slate-950 p-6 text-white shadow-soft sm:p-8">
        <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-blue-100">
          <Target size={16} />
          Follow-up plan
        </p>
        <h2 className="mt-5 text-3xl font-semibold tracking-tight">
          Decide who gets called first.
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
          Use the buyer matches and reminders below to leave the appointment
          with a call list, a message, and a reason for the seller to stay
          emotionally engaged.
        </p>
      </section>

      <BuyerMatchEngineSection listing={listing} onUpdate={setListing} />
      <FollowUpAutomationSection listing={listing} onUpdate={setListing} />

      <section className="mt-10 rounded-[2rem] bg-white p-6 shadow-card ring-1 ring-slate-200/70 sm:p-8">
        <p className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-800">
          <Handshake size={16} />
          Vendor confidence tools
        </p>
        <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950">
          Go deeper into the seller’s emotional decision.
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          Use these tools after the marketing presentation to talk through
          trust, fear, price, campaign confidence, fee value, and what the owner
          needs to feel before saying yes.
        </p>
      </section>

      <VendorReportSection listing={listing} />
      <SellerFollowUpSection listing={listing} />
      <BuyerDemandSection listing={listing} />
      <CommissionDefenceSection />
      <AppraisalScriptSection listing={listing} />
      <AgentNotesSection listing={listing} />

      <section className="mt-10 rounded-[2rem] bg-white p-6 shadow-card ring-1 ring-slate-200/70 sm:p-8">
        <p className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-800">
          <FileText size={16} />
          Form 6 and agreement explanation
        </p>
        <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950">
          Explain the paperwork without making it feel heavy.
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          Walk through the appointment documents in plain language so the
          vendor feels informed before they proceed through the agency’s normal
          signing process.
        </p>
      </section>

      <div id="form-6">
        <Form6PrototypeSection />
      </div>

      <section className="mt-10 rounded-[2rem] bg-blue-950 p-6 text-white shadow-soft sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-200">
          Finish
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight">
          Finish the appraisal and return to the dashboard.
        </h2>
        <Link
          href="/dashboard"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-4 text-sm font-semibold text-blue-950 shadow-card"
        >
          Finish appraisal
          <ArrowRight size={18} />
        </Link>
      </section>
    </>
  );
}
