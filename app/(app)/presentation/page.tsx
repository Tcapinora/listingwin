"use client";

import Image from "next/image";
import Link from "next/link";
import {
  BadgeCheck,
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
      <section className="no-print sticky top-0 z-40 border-b border-white/70 bg-[#F2F4F8]/86 px-4 py-3 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="#presentation-start"
              className="inline-flex items-center gap-2 rounded-full bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-card transition hover:-translate-y-0.5 hover:bg-blue-800"
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
              className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/92 px-4 py-2.5 text-sm font-semibold text-blue-900 shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
            >
              <Pencil size={16} />
              Edit Builder
            </Link>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/92 px-4 py-2.5 text-sm font-semibold text-blue-900 shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
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
              className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/92 px-4 py-2.5 text-sm font-semibold text-blue-900 shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
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
        className="page-enter mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14"
      >
        <section className="presentation-slide mb-10 rounded-[2.5rem] bg-white/86 p-7 shadow-soft ring-1 ring-white/80 backdrop-blur lg:p-10">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">
              Vendor presentation
            </p>
            <Link
              href="/details"
              className="no-print inline-flex w-fit items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2.5 text-sm font-semibold text-blue-900 shadow-sm transition hover:bg-blue-50"
            >
              <Pencil size={15} />
              Edit overview
            </Link>
          </div>
          <div className="mt-3 grid gap-4 lg:grid-cols-[1fr_0.55fr] lg:items-end">
            <div>
              <h2 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                Make the seller picture choosing this campaign.
              </h2>
              <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">
                This is the seller-facing emotional moment: show how their
                property will look, how buyers will experience it, and why
                momentum starts with this agent.
              </p>
            </div>
            <div className="rounded-[1.75rem] bg-blue-50/80 p-5 text-sm leading-7 text-blue-900 ring-1 ring-blue-100">
              Keep this view clean. Deeper objections, Form 6, follow-up, and
              decision-closing tools stay in the Agent Workspace.
            </div>
          </div>
        </section>

        <HeroPresentation listing={presentationListing} />
        <PresentationGrid listing={presentationListing} />

        <section className="presentation-slide mt-20 overflow-hidden rounded-[2.75rem] bg-white shadow-soft ring-1 ring-blue-100">
          <div className="no-print flex justify-end px-6 pt-6 lg:px-8">
            <Link
              href="/account"
              className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2.5 text-sm font-semibold text-blue-900 shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-50"
            >
              <Pencil size={15} />
              Edit agency section
            </Link>
          </div>
          <div className="grid gap-0 lg:grid-cols-[0.92fr_1.08fr] lg:items-stretch">
            <div>
              <div className="p-7 lg:p-10">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-700">
                  Our approach
                </p>
                <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 lg:text-5xl">
                  The seller can see the team, experience, and process.
                </h2>
                <p className="mt-5 max-w-xl text-base leading-8 text-slate-600">
                  End the presentation by making the seller feel this agent and
                  team have already started working for them: brand, reach,
                  proof, preparation, communication, and a clear launch plan.
                </p>
              </div>

              {presentationProfile.agentTeamPhotos.length ? (
                <div className="grid gap-3 px-7 pb-7 sm:grid-cols-2 lg:px-10 lg:pb-10">
                  {presentationProfile.agentTeamPhotos.map((photo, index) => (
                    <div
                      key={`${photo.slice(0, 32)}-${index}`}
                      className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-slate-100 shadow-card"
                    >
                      <Image
                        src={photo}
                        alt={`Agent or team photo ${index + 1}`}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="grid gap-4 bg-blue-950 p-7 text-white lg:p-12">
              {[
                [
                  "Our difference",
                  "The seller can see the campaign before it exists: portals, social, brochures, flyers, signboards, open homes, timing, and buyer demand.",
                ],
                [
                  "Team and experience",
                  `${agencyName || "The agency"} brings team support, database reach, local market proof, and a repeatable launch process to the property.`,
                ],
                [
                  "Communication process",
                  "Show the seller how owners and buyers are kept informed, so the campaign feels organised from appraisal to launch.",
                ],
              ].map(([title, text]) => (
                <article
                  key={title}
                  className="rounded-[1.75rem] bg-white/10 p-6 ring-1 ring-white/10"
                >
                  <h3 className="text-2xl font-semibold tracking-tight">
                    {title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-blue-100">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="presentation-slide mt-12 overflow-hidden rounded-[2.5rem] bg-blue-950 text-white shadow-soft">
          <div className="no-print flex justify-end px-6 pt-6 lg:px-8">
            <Link
              href="/account"
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-blue-950 shadow-card transition hover:-translate-y-0.5 hover:bg-blue-50"
            >
              <Pencil size={15} />
              Edit contact details
            </Link>
          </div>
          <div className="grid gap-0 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="flex min-h-56 items-center justify-center bg-blue-950 p-8 ring-1 ring-inset ring-white/10">
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
                <div className="rounded-3xl border border-white/20 bg-white/5 px-8 py-5 text-center text-2xl font-semibold text-white">
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

        <section className="no-print presentation-slide mt-12 rounded-[2.25rem] bg-white/90 p-7 shadow-card ring-1 ring-white/80 backdrop-blur lg:p-9">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.55fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">
              Close the appointment
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                Ready to move into the Agent Workspace?
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                Once the seller is attached to the marketing vision, move into
                the closing workspace to handle emotion, price, trust, and the
                next decision while momentum is fresh.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <Link
                href="/finish"
                className="inline-flex items-center justify-center rounded-full bg-blue-700 px-6 py-4 text-sm font-semibold text-white shadow-card transition hover:-translate-y-0.5 hover:bg-blue-800"
              >
                Finish presentation
              </Link>
              <Link
                href="/details"
                className="inline-flex items-center justify-center rounded-full border border-blue-200 bg-white px-6 py-4 text-sm font-semibold text-blue-900 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300"
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
