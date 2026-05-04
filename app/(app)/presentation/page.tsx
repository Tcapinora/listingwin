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
import { PageHeader } from "@/components/PageHeader";
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
      <PageHeader
        eyebrow="Seller Presentation"
        title="Run the appraisal in a clean, premium order."
        description="A guided seller presentation: price story, market proof, marketing vision, visual previews, sale calendar, and next steps."
        action={
          <div className="no-print flex flex-wrap gap-3">
            <Link
              href="/mockups"
              className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-5 py-3 text-sm font-semibold text-blue-900 shadow-sm"
            >
              <Pencil size={16} />
              Edit Mockups
            </Link>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-5 py-3 text-sm font-semibold text-blue-900 shadow-sm"
              onClick={() => {
                savePresentationSnapshot(presentationListing, presentationProfile);
                setSaved(true);
                window.setTimeout(() => setSaved(false), 2200);
              }}
            >
              <Save size={16} />
              {saved ? "Saved" : "Save to Account"}
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-5 py-3 text-sm font-semibold text-blue-900 shadow-sm"
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
              {shareStatus || "Copy Share Link"}
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-card hover:bg-blue-800"
              onClick={() => window.print()}
            >
              <Download size={16} />
              Print / PDF
            </button>
          </div>
        }
      />

      {!readiness.isReady ? (
        <section className="mb-8 rounded-[2rem] border border-blue-100 bg-white p-6 shadow-card lg:p-8">
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
      <div className="rounded-[2rem] border border-blue-100 bg-white p-4 shadow-card lg:p-8">
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
      </div>
      ) : null}
    </>
  );
}
