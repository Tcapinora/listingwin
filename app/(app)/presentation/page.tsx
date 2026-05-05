"use client";

import Image from "next/image";
import Link from "next/link";
import {
  BadgeCheck,
  Download,
  Link2,
  Mail,
  Pencil,
  Phone,
  Save,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useListing } from "@/components/ListingProvider";
import { useAgentProfile } from "@/components/AgentProfileProvider";
import {
  getShareUrl,
  savePresentationSnapshot,
} from "@/lib/presentationHistory";
import {
  HeroPresentation,
  PresentationGrid,
} from "@/components/PresentationSections";
import { demoAgentProfile, demoListingState } from "@/lib/demoData";
import { presentationReadiness } from "@/lib/readiness";

export default function PresentationPage() {
  const { listing } = useListing();
  const { profile } = useAgentProfile();
  const [saved, setSaved] = useState(false);
  const [shareStatus, setShareStatus] = useState("");
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    setDemoMode(new URLSearchParams(window.location.search).get("demo") === "1");
  }, []);
  const presentationListing = demoMode ? demoListingState : listing;
  const presentationProfile = demoMode ? demoAgentProfile : profile;
  const agentName =
    presentationProfile.agentName || presentationListing.details.agentName;
  const agencyName =
    presentationProfile.agencyName || presentationListing.details.agencyName;
  const phone = presentationProfile.phone || presentationListing.details.phone;
  const email = presentationProfile.email || presentationListing.details.email;
  const logo =
    presentationProfile.agencyLogo || presentationListing.assets.agencyLogo;
  const readiness = presentationReadiness(
    presentationListing,
    presentationProfile,
  );

  return (
    <>
      <section className="no-print sticky top-0 z-40 border-b border-slate-200/70 bg-white/94 px-4 py-3 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="#presentation-start"
              className="inline-flex items-center gap-2 rounded-full bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-card"
            >
              Vendor Presentation
            </a>
            <p className="text-sm font-medium text-slate-500">
              Client-facing view. Keep it simple and scroll.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/details"
              className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2.5 text-sm font-semibold text-blue-900 shadow-sm"
            >
              <Pencil size={16} />
              Edit Builder
            </Link>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2.5 text-sm font-semibold text-blue-900 shadow-sm"
              onClick={() => {
                savePresentationSnapshot(presentationListing, presentationProfile);
                setSaved(true);
                window.setTimeout(() => setSaved(false), 2200);
              }}
            >
              <Save size={16} />
              {saved ? "Saved" : "Save"}
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2.5 text-sm font-semibold text-blue-900 shadow-sm"
              onClick={async () => {
                const presentation = savePresentationSnapshot(
                  presentationListing,
                  presentationProfile,
                );
                const shareUrl = getShareUrl(presentation.id);

                try {
                  await navigator.clipboard.writeText(shareUrl);
                  setShareStatus("Link copied");
                } catch {
                  setShareStatus(shareUrl);
                }

                window.setTimeout(() => setShareStatus(""), 3000);
              }}
            >
              <Link2 size={16} />
              {shareStatus || "Share"}
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-card hover:bg-blue-800"
              onClick={() => window.print()}
            >
              <Download size={16} />
              Print / PDF
            </button>
          </div>
        </div>
      </section>

      {!readiness.isReady ? (
        <section className="mx-auto my-8 max-w-6xl rounded-[2rem] border border-blue-100 bg-white p-6 shadow-card lg:p-8">
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-800">
                <Sparkles size={16} />
                Presentation needs a little more detail
              </p>
              <h2 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950">
                Start from a polished demo or finish the seller details first.
              </h2>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                This prevents the seller view from opening with weak placeholder
                content. For testing, load a complete demo listing. For a real
                appraisal, complete the missing items below.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/presentation?demo=1"
                  className="inline-flex items-center gap-2 rounded-full bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-card hover:bg-blue-800"
                >
                  Load demo presentation
                </Link>
                <Link
                  href="/create"
                  className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-5 py-3 text-sm font-semibold text-blue-900"
                >
                  Continue setup
                </Link>
              </div>
            </div>
            <div className="grid gap-3">
              {readiness.checks.map((check) => (
                <Link
                  key={check.label}
                  href={check.href}
                  className="flex items-center justify-between gap-4 rounded-2xl bg-blue-50/70 p-4 text-sm font-semibold text-slate-800 transition hover:bg-blue-50"
                >
                  <span>{check.label}</span>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs ${
                      check.ready
                        ? "bg-blue-700 text-white"
                        : "bg-white text-slate-500"
                    }`}
                  >
                    {check.ready ? <BadgeCheck size={13} /> : null}
                    {check.ready ? "Ready" : "Finish"}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {readiness.isReady ? (
      <div
        id="presentation-start"
        className="mx-auto max-w-7xl px-4 py-6 sm:px-5 lg:px-8 lg:py-8"
      >
        <section className="mb-6 rounded-[2rem] bg-white p-5 shadow-card ring-1 ring-blue-50 lg:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">
            Vendor presentation
          </p>
          <div className="mt-3 grid gap-4 lg:grid-cols-[1fr_0.55fr] lg:items-end">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                Guide the seller from uncertainty to confidence.
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
                Everything below is designed to be shown in the listing
                appointment: price story, current competition, marketing
                visuals, sale calendar, buyer database, and next steps.
              </p>
            </div>
            <div className="rounded-[1.5rem] bg-blue-50 p-4 text-sm leading-6 text-blue-900 ring-1 ring-blue-100">
              Agent-only follow-up, scripts, Form 6 explanation, and campaign
              reporting stay in the Agent Workspace after this presentation.
            </div>
          </div>
        </section>

        <HeroPresentation listing={presentationListing} />
        <PresentationGrid listing={presentationListing} />

        <section className="mt-10 overflow-hidden rounded-3xl bg-blue-950 text-white shadow-soft">
          <div className="grid gap-0 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="flex min-h-56 items-center justify-center bg-white p-8">
              {logo ? (
                <Image
                  src={logo}
                  alt={`${agencyName || "Agency"} logo`}
                  width={260}
                  height={120}
                  className="max-h-28 w-auto object-contain"
                  unoptimized
                />
              ) : (
                <div className="rounded-3xl border border-blue-100 px-8 py-5 text-center text-2xl font-semibold text-blue-950">
                  {agencyName || "Agency"}
                </div>
              )}
            </div>
            <div className="p-8 lg:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-200">
                Presented by
              </p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight">
                {agentName || "Agent name"}
              </h2>
              <p className="mt-2 text-lg text-blue-100">
                {agencyName || "Agency name"}
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="flex items-center gap-2 text-sm font-semibold text-blue-100">
                    <Phone size={16} />
                    Phone
                  </p>
                  <p className="mt-2 text-xl font-semibold">
                    {phone || "Phone number"}
                  </p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="flex items-center gap-2 text-sm font-semibold text-blue-100">
                    <Mail size={16} />
                    Email
                  </p>
                  <p className="mt-2 break-words text-xl font-semibold">
                    {email || "Email address"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="no-print mt-8 rounded-[2rem] bg-white p-6 shadow-card ring-1 ring-blue-50 lg:p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.55fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">
              Close the appointment
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                Ready to move into the Agent Workspace?
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                Once the presentation is finished, move straight into the
                practical closing tools: follow-up, objections, Form 6
                explanation, notes, and next steps.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <Link
                href="/finish"
                className="inline-flex items-center justify-center rounded-full bg-blue-700 px-6 py-4 text-sm font-semibold text-white shadow-card"
              >
                Finish presentation
              </Link>
              <Link
                href="/details"
                className="inline-flex items-center justify-center rounded-full border border-blue-200 bg-white px-6 py-4 text-sm font-semibold text-blue-900 shadow-sm"
              >
                Edit setup
              </Link>
            </div>
          </div>
        </section>
      </div>
      ) : null}
    </>
  );
}
