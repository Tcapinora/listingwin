"use client";

import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Images,
  MonitorPlay,
  Plus,
  Smartphone,
  UserRound,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { PrimaryLink } from "@/components/Buttons";
import { useListing } from "@/components/ListingProvider";
import { useAgentProfile } from "@/components/AgentProfileProvider";
import {
  AppraisalCommandCentre,
  BuyerMatchEngineSection,
  DashboardValuePanel,
  FollowUpAutomationSection,
} from "@/components/ValueSections";
import { SaleCalendar } from "@/components/SaleCalendar";

export default function DashboardPage() {
  const { listing, setListing } = useListing();
  const { profile, isProfileComplete } = useAgentProfile();
  const hasListing = Boolean(listing.details.address);
  const agentName = profile.agentName || listing.details.agentName;
  const agencyName =
    profile.agencyName || listing.details.agencyName || "Plum Property";
  const hasImages = Boolean(
    listing.propertyPhotos.length || listing.assets.propertyPhoto,
  );
  const nextHref = !isProfileComplete
    ? "/account"
    : !hasListing
      ? "/create"
      : !hasImages
        ? "/upload"
        : "/mockups";
  const nextLabel = !isProfileComplete
    ? "Create account"
    : !hasListing
      ? "Add listing"
      : !hasImages
        ? "Upload property photos"
        : "Edit campaign visuals";

  const onboardingSteps = [
    {
      title: "Set up your agent profile",
      description: "Save your agency brand, contact details, and social links once.",
      done: isProfileComplete,
      icon: UserRound,
    },
    {
      title: "Create a vendor pitch",
      description: "Add the property address and campaign notes for the seller.",
      done: hasListing,
      icon: Building2,
    },
    {
      title: "Show the marketing vision",
      description: "Place signboards, social posts, brochures, flyers, and mobile previews.",
      done: hasImages,
      icon: Smartphone,
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Agent Workspace"
        title="Build the next appraisal presentation."
        description="One clear path: account, listing details, property images, campaign visuals, draft, then seller presentation."
        action={
          <div className="flex flex-wrap gap-3">
            <Link
              href="/presentation?demo=1"
              className="inline-flex items-center justify-center rounded-full border border-blue-200 bg-white px-5 py-3 text-sm font-semibold text-blue-900 shadow-sm transition hover:border-blue-300"
            >
              Open demo presentation
            </Link>
            <PrimaryLink href={nextHref}>
              <span className="inline-flex items-center gap-2">
                <Plus size={17} />
                {nextLabel}
              </span>
            </PrimaryLink>
          </div>
        }
      />

      <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-card lg:p-8">
        <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">
              Start here
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              Complete these three steps first.
            </h2>
          </div>
          <Link
            href={nextHref}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-card"
          >
            {nextLabel}
            <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {onboardingSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className="rounded-2xl border border-gray-200 bg-gray-50 p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-gray-950 shadow-sm">
                    <Icon size={18} />
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                      step.done
                        ? "bg-gray-950 text-white"
                        : "bg-white text-gray-500"
                    }`}
                  >
                    {step.done ? <BadgeCheck size={13} /> : null}
                    {step.done ? "Done" : `Step ${index + 1}`}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-semibold tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.85fr]">
        <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-card">
          <div className="mb-6 flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gray-950 text-white">
              <Building2 size={20} />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Current listing</h2>
              <p className="text-sm text-gray-500">
                Saved automatically in this browser
              </p>
            </div>
          </div>

          {hasListing ? (
            <div className="space-y-5">
              <div>
                <p className="text-sm text-gray-500">Property</p>
                <h3 className="mt-1 text-3xl font-semibold tracking-tight">
                  {listing.details.address}
                </h3>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">Agent</p>
                  <p className="mt-1 font-semibold">
                    {agentName || "Not added"}
                  </p>
                </div>
                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">Agency</p>
                  <p className="mt-1 font-semibold">
                    {agencyName}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/mockups"
                  className="inline-flex items-center gap-2 rounded-full bg-gray-950 px-5 py-3 text-sm font-semibold text-white"
                >
                  Continue mockups
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/presentation"
                  className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-800"
                >
                  <MonitorPlay size={16} />
                  Presentation Mode
                </Link>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-gray-50 p-8 text-center">
              <Images className="mx-auto text-gray-400" size={36} />
              <h3 className="mt-4 text-xl font-semibold">
                No listing in progress
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                Click Create New Listing to add the property address, price
                guide, and market proof, then upload photos and signboards.
              </p>
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-blue-100 bg-blue-50/70 p-7 shadow-card">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-700">
            Presentation shortcut
          </p>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950">
            Ready to show the seller?
          </h2>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            Review the draft first, then open the clean seller-facing
            presentation.
          </p>
          <div className="mt-6 grid gap-3">
            <Link
              href="/draft"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-card"
            >
              Review draft
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/presentation"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-blue-200 bg-white px-5 py-3 text-sm font-semibold text-blue-900"
            >
              Open presentation
              <MonitorPlay size={16} />
            </Link>
          </div>
        </div>
      </section>

      <details className="mt-8 rounded-3xl border border-blue-100 bg-white p-6 shadow-card">
        <summary className="cursor-pointer list-none text-xl font-semibold tracking-tight text-slate-950">
          Power tools: score, buyer match, follow-up, and calendar
        </summary>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          These are useful once the core presentation is set up. Keep them here
          so the dashboard stays simple for first-time users.
        </p>
        <DashboardValuePanel listing={listing} />
        <AppraisalCommandCentre listing={listing} />
        <BuyerMatchEngineSection listing={listing} onUpdate={setListing} />
        <FollowUpAutomationSection listing={listing} onUpdate={setListing} />
        <SaleCalendar />
      </details>
    </>
  );
}
