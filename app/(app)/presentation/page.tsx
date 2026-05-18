"use client";

import Image from "next/image";
import Link from "next/link";
import {
  BadgeCheck,
  Link2,
  Mail,
  MoreHorizontal,
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
import { LiveCampaignPhotoButton } from "@/components/LiveCampaignPhotoButton";
import { EmailPresentationButton } from "@/components/EmailPresentationButton";
import { demoAgentProfile, demoListingState } from "@/lib/demoData";
import { getPropertyPhotos } from "@/lib/listingImages";
import { presentationReadiness } from "@/lib/readiness";

export default function PresentationPage() {
  const { listing, setListing } = useListing();
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
  const isLiveVision = presentationListing.campaignVisionMode !== "professional";
  const propertyPhotos = getPropertyPhotos(presentationListing);
  const updatePropertyPhotos = (photos: string[]) => {
    if (demoMode) {
      return;
    }

    setListing((current) => ({
      ...current,
      propertyPhotos: photos,
      assets: {
        ...current.assets,
        propertyPhoto: photos[0] || "",
      },
    }));
  };

  const updateVisionSettings = (
    patch: Partial<
      Pick<
        typeof listing,
        "useLiveCampaignPreview" | "campaignVisionMode"
      >
    >,
  ) => {
    if (demoMode) {
      return;
    }

    setListing((current) => ({
      ...current,
      ...patch,
    }));
  };

  return (
    <>
      <section className="no-print sticky top-0 z-40 border-b border-white/80 bg-white/90 px-4 py-3 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="#presentation-start"
              className="inline-flex items-center gap-2 rounded-full bg-blue-950 px-5 py-3 text-sm font-semibold text-white shadow-card transition hover:-translate-y-0.5 hover:bg-blue-900"
            >
              Campaign Vision Preview
            </a>
            <p className="max-w-xl text-sm font-medium text-slate-500">
              Seller-facing. Show the campaign before the campaign, then move
              into the private workspace and proposal.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {!demoMode && presentationListing.useLiveCampaignPreview ? (
              <LiveCampaignPhotoButton
                photos={propertyPhotos}
                onChange={updatePropertyPhotos}
                label="Add vision photos"
              />
            ) : null}
            <Link
              href="/finish"
              className="inline-flex items-center justify-center rounded-full bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-card transition hover:-translate-y-0.5 hover:bg-blue-800"
            >
              Finish appraisal
            </Link>
            <details className="group relative">
              <summary className="inline-flex cursor-pointer list-none items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-3 text-sm font-semibold text-blue-900 shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-50">
                <MoreHorizontal size={16} />
                Actions
              </summary>
              <div className="absolute right-0 top-14 z-50 grid w-[min(20rem,calc(100vw-2rem))] gap-2 rounded-[1.5rem] bg-white p-3 shadow-soft ring-1 ring-blue-100">
                <Link
                  href="/details"
                  className="inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-blue-900 transition hover:bg-blue-50"
                >
                  <Pencil size={16} />
                  Edit Preparation
                </Link>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-left text-sm font-semibold text-blue-900 transition hover:bg-blue-50"
                  onClick={() => {
                    savePresentationSnapshot(
                      presentationListing,
                      presentationProfile,
                    );
                    setSaved(true);
                    window.setTimeout(() => setSaved(false), 2200);
                  }}
                >
                  <Save size={16} />
                  {saved ? "Saved" : "Save appraisal"}
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-left text-sm font-semibold text-blue-900 transition hover:bg-blue-50"
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
                  {shareStatus || "Copy appraisal link"}
                </button>
                <EmailPresentationButton
                  listing={presentationListing}
                  profile={presentationProfile}
                />
              </div>
            </details>
          </div>
        </div>
      </section>

      {!readiness.isReady ? (
        <section className="no-print mx-auto my-6 max-w-6xl rounded-[1.5rem] border border-blue-100 bg-white/90 p-5 shadow-card">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <p className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-800">
                <Sparkles size={16} />
                Presentation opened
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                A few setup items are still light, but the Appraisal
                is open. Use the edit links if you want to strengthen any
                section before showing the seller.
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:min-w-[420px]">
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

      <section className="no-print mx-auto my-6 max-w-6xl rounded-[2rem] bg-gradient-to-br from-blue-950 via-slate-950 to-blue-900 p-5 text-white shadow-soft">
        <div className="grid gap-5 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-200">
              Photo mode
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">
              {isLiveVision
                ? "Use this during the appraisal"
                : "Use this after professional photos"}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100/80">
              {isLiveVision
                ? "Recommended while you are sitting with the seller. Quick photos become polished concept previews so the seller can picture the campaign."
                : "Switch to this later when professional photography is ready and you want the proposal to feel final."}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-center">
            {[
              ["live", "During appraisal", "Best for live photos"],
              ["professional", "After pro photos", "Best for final proposal"],
            ].map(([mode, label, sub]) => (
              <button
                key={mode}
                type="button"
                onClick={() =>
                  updateVisionSettings({
                    campaignVisionMode: mode as "live" | "professional",
                  })
                }
                className={`rounded-[1.25rem] px-4 py-3 text-left transition ${
                  presentationListing.campaignVisionMode === mode
                    ? "bg-white text-blue-950"
                    : "bg-white/10 text-white ring-1 ring-white/10 hover:bg-white/15"
                }`}
              >
                <span className="block text-sm font-semibold">{label}</span>
                <span className="mt-1 block text-xs opacity-70">{sub}</span>
              </button>
            ))}
            <button
              type="button"
              onClick={() =>
                updateVisionSettings({
                  useLiveCampaignPreview:
                    !presentationListing.useLiveCampaignPreview,
                })
              }
              className={`rounded-[1.25rem] px-4 py-3 text-sm font-semibold transition ${
                presentationListing.useLiveCampaignPreview
                  ? "bg-blue-500 text-white"
                  : "bg-white/10 text-blue-100 ring-1 ring-white/10"
              }`}
            >
              Quick photo preview {presentationListing.useLiveCampaignPreview ? "On" : "Off"}
            </button>
            <p className="text-xs leading-5 text-blue-100/75 sm:col-span-3">
              Quick photo preview means optional appraisal photos flow into the
              mockups. Turn it off when you only want to show example marketing
              until professional photography is ready.
            </p>
          </div>
        </div>
      </section>

      <div
        id="presentation-start"
        className="page-enter mx-auto max-w-6xl bg-white px-4 py-10 shadow-soft ring-1 ring-white/80 sm:px-6 lg:px-8 lg:py-14"
      >
        <HeroPresentation listing={presentationListing} />

        <PresentationGrid
          listing={presentationListing}
          onUpdate={demoMode ? undefined : setListing}
        />

        <section className="presentation-slide mt-24 border-t border-slate-200/80 py-20 sm:py-24">
          <div className="no-print mb-8 flex justify-end">
            <Link
              href="/account"
              className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2.5 text-sm font-semibold text-blue-900 shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-50"
            >
              <Pencil size={15} />
              Edit agency section
            </Link>
          </div>
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-700">
              Our approach
            </p>
            <h2 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950 lg:text-5xl">
              The seller can see the team, experience, and process.
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-slate-600">
              {presentationListing.agentPitchContent.ourApproach ||
                "End the presentation by making the seller feel this agent and team have already started working for them: brand, reach, proof, preparation, communication, and a clear launch plan."}
            </p>
          </div>

          {presentationProfile.agentTeamPhotos.length ? (
            <div className="mx-auto mt-16 grid max-w-4xl gap-5 sm:grid-cols-2">
              {presentationProfile.agentTeamPhotos.map((photo, index) => (
                <div
                  key={`${photo.slice(0, 32)}-${index}`}
                  className="relative aspect-[4/3] overflow-hidden bg-slate-100"
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

          <div className="mt-16 grid gap-10 md:grid-cols-2">
            {[
              [
                "Our difference",
                presentationListing.agentPitchContent.ourDifference ||
                  presentationProfile.defaultMarketingText ||
                  "The seller can see the campaign before it exists: portals, social, brochures, signboards, timing, and buyer demand.",
              ],
              [
                "Team and experience",
                presentationListing.agentPitchContent.teamExperience ||
                  `${agencyName || "The agency"} brings team support, database reach, local market proof, and a repeatable launch process to the property.`,
              ],
              [
                "Communication process",
                presentationListing.agentPitchContent.communicationProcess ||
                  "Show the seller how owners and buyers are kept informed, so the campaign feels organised from appraisal to launch.",
              ],
              [
                "About the agent",
                presentationListing.agentPitchContent.aboutAgent ||
                  `${agentName || "The agent"} brings preparation, local buyer knowledge, and a clear process to help the seller feel confident choosing the campaign.`,
              ],
            ].map(([title, text]) => (
              <article key={title}>
                <h3 className="text-2xl font-semibold tracking-tight text-slate-950">
                  {title}
                </h3>
                <p className="mt-4 text-base leading-8 text-slate-600">{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="presentation-slide mt-12 overflow-hidden rounded-[2.5rem] bg-blue-950 p-7 text-white shadow-soft lg:p-10">
          <div className="no-print mb-6 flex justify-end">
            <Link
              href="/account"
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-blue-950 shadow-card transition hover:-translate-y-0.5 hover:bg-blue-50"
            >
              <Pencil size={15} />
              Edit contact details
            </Link>
          </div>
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
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
            <div className="flex min-h-56 items-center justify-center rounded-[2rem] bg-white/5 p-8 ring-1 ring-inset ring-white/10">
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
          </div>
        </section>

        <section className="no-print presentation-slide mt-12 rounded-[2.25rem] bg-white/90 p-7 shadow-card ring-1 ring-white/80 backdrop-blur lg:p-9">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.55fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">
                Next step
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                Ready to generate the proposal?
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                The seller has now seen the campaign. Use the private workspace
                if you need to capture notes, then generate the proposal while
                the appraisal is still fresh.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <Link
                href="/proposal"
                className="inline-flex items-center justify-center rounded-full bg-blue-700 px-6 py-4 text-sm font-semibold text-white shadow-card transition hover:-translate-y-0.5 hover:bg-blue-800"
              >
                Generate Proposal
              </Link>
              <Link
                href="/details"
                className="inline-flex items-center justify-center rounded-full border border-blue-200 bg-white px-6 py-4 text-sm font-semibold text-blue-900 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300"
              >
                Edit preparation
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
