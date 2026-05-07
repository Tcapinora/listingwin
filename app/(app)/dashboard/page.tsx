"use client";

import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock3,
  MonitorPlay,
  Plus,
  Sparkles,
} from "lucide-react";
import { PrimaryLink } from "@/components/Buttons";
import { useListing } from "@/components/ListingProvider";
import { useAgentProfile } from "@/components/AgentProfileProvider";
import { demoAgentProfile, demoListingState } from "@/lib/demoData";

export default function DashboardPage() {
  const { listing, setListing } = useListing();
  const { profile, replaceProfile } = useAgentProfile();
  const hasListing = Boolean(listing.details.address.trim());
  const hasImages = Boolean(
    listing.propertyPhotos.length || listing.assets.propertyPhoto,
  );
  const status = hasImages ? "Ready" : hasListing ? "Draft" : "New";
  const lastEdited = "Saved in this browser";
  const address = listing.details.address || "No listings yet";
  const workflow = [
    {
      title: "Build the vendor presentation",
      text: "Prepare the marketing story in the office before the appraisal.",
    },
    {
      title: "Show the seller their campaign",
      text: "Scroll through the presentation so they can picture their property with your marketing.",
    },
    {
      title: "Open Agent Workspace",
      text: "After presenting, use your closing tools for price, buyer proof, follow-up, and next steps.",
    },
  ];
  const firstRunGuide = [
    {
      title: "1. Build",
      subtitle: "Prepare before the appraisal",
      text: "Add the property, photos, signboards, buyers, sale calendar, and marketing previews in the Builder.",
    },
    {
      title: "2. Present",
      subtitle: "Show you are the marketing expert",
      text: "Show the seller your agency marketing, how their property will look, and how you sell a property from launch to buyer demand.",
    },
    {
      title: "3. Close",
      subtitle: "Move into Agent Workspace",
      text: "After the seller has seen the campaign, use the workspace for price, objections, buyer proof, follow-up, and next steps.",
    },
  ];

  return (
    <>
      <section className="overflow-hidden rounded-[2.25rem] bg-white p-7 shadow-card ring-1 ring-slate-200/70 sm:p-10 lg:p-12">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.8fr] lg:items-end">
          <div>
            <p className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-800 ring-1 ring-blue-100">
              ListingWin for agents
            </p>
            <h1 className="mt-7 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
              Make the seller feel the campaign has already started.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
              Create the vendor presentation, show the seller their property
              inside your marketing, then move into the workspace to close
              while momentum is high.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <PrimaryLink href="/create">
                <span className="inline-flex items-center gap-2">
                  <Plus size={18} />
                  Start Builder
                </span>
              </PrimaryLink>
              <Link
                href="/draft"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-300 hover:text-blue-900"
              >
                <MonitorPlay size={17} />
                Agent Workspace
              </Link>
              <button
                type="button"
                onClick={() => {
                  replaceProfile(demoAgentProfile);
                  setListing(demoListingState);
                }}
                className="inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold text-slate-500 transition hover:text-blue-900"
              >
                Load demo listing
              </button>
            </div>
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-500">
              First time here? Start with Builder. The seller sees the Vendor
              Presentation. The Agent Workspace comes after the seller has seen
              the marketing.
            </p>
          </div>

          <div className="rounded-[1.75rem] bg-slate-50/80 p-5 ring-1 ring-slate-200">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-blue-800 shadow-sm">
                <Sparkles size={19} />
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-950">
                  Seller attachment flow
                </p>
                <p className="text-xs text-slate-500">
                  Marketing first. Closing second.
                </p>
              </div>
            </div>
            <div className="mt-5 grid gap-2 text-sm">
              {workflow.map((item, index) => (
                <div
                  key={item.title}
                  className="rounded-2xl bg-white px-4 py-4 shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:shadow-card"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-blue-700 text-xs font-semibold text-white">
                      {index + 1}
                    </span>
                    <span className="font-semibold text-slate-950">
                      {item.title}
                    </span>
                  </div>
                  <p className="mt-2 pl-10 text-sm leading-6 text-slate-500">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-[2rem] bg-white p-6 shadow-card ring-1 ring-slate-200/70 sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-700">
              First time using ListingWin?
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              Build the presentation, show the campaign, close the listing.
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              ListingWin is built for agents before a listing appraisal. It
              helps the seller see your marketing before they choose an agent.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {firstRunGuide.map((card) => (
              <article
                key={card.title}
                className="rounded-[1.5rem] bg-slate-50 p-5 ring-1 ring-slate-200/70"
              >
                <span className="grid h-9 w-9 place-items-center rounded-full bg-blue-700 text-white">
                  <CheckCircle2 size={17} />
                </span>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                  {card.subtitle}
                </p>
                <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {card.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-[2rem] bg-blue-950 p-6 text-white shadow-card sm:p-8">
        <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-200">
              The simple rule
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              The seller sees the presentation. The agent uses the workspace.
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-blue-100">
              During the appointment, stay in the clean Vendor Presentation.
              Once the seller understands the campaign, open Agent Workspace to
              go deeper and close.
            </p>
          </div>
          <Link
            href="/create"
            className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-blue-950 shadow-card transition hover:bg-blue-50"
          >
            <span className="inline-flex items-center gap-2">
              Start Builder
              <ArrowRight size={16} />
            </span>
          </Link>
        </div>
      </section>

      <section className="mt-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-700">
            Your Presentations
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            Pick up where you left off.
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            {hasListing
              ? "Your current vendor presentation is saved locally and ready to continue."
              : "No presentations yet. Create your first one in under 60 seconds."}
          </p>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        {hasListing ? (
          <article className="overflow-hidden rounded-[1.75rem] bg-white shadow-card ring-1 ring-blue-50">
            <div className="h-2 bg-blue-700" />
            <div className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-700">
                <Building2 size={21} />
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  status === "Ready"
                    ? "bg-blue-700 text-white"
                    : "bg-blue-50 text-blue-800"
                }`}
              >
                {status}
              </span>
            </div>
            <h2 className="mt-6 text-2xl font-semibold tracking-tight">
              {address}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {profile.agencyName || listing.details.agencyName || "Agency"} ·{" "}
              {profile.agentName || listing.details.agentName || "Agent"}
            </p>
            <p className="mt-5 inline-flex items-center gap-2 text-sm text-slate-500">
              <Clock3 size={16} />
              {lastEdited}
            </p>
            <div className="mt-7">
              <Link
                href={hasImages ? "/mockups" : "/upload"}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-700 px-5 py-3.5 text-sm font-semibold text-white shadow-card transition hover:bg-blue-800 sm:w-auto"
              >
                Continue Presentation
                <ArrowRight size={16} />
              </Link>
            </div>
            </div>
          </article>
        ) : (
          <article className="rounded-[1.75rem] bg-white p-8 text-center shadow-card ring-1 ring-blue-50 lg:col-span-2">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-blue-700">
              <Building2 size={24} />
            </div>
            <h2 className="mt-5 text-2xl font-semibold tracking-tight">
              No presentations yet.
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Create your first vendor presentation in under 60 seconds.
            </p>
            <div className="mt-7">
              <div className="flex flex-col justify-center gap-3 sm:flex-row">
                <PrimaryLink href="/create">Create Vendor Presentation</PrimaryLink>
                <button
                  type="button"
                  onClick={() => {
                    replaceProfile(demoAgentProfile);
                    setListing(demoListingState);
                  }}
                  className="inline-flex items-center justify-center rounded-full border border-blue-200 bg-white px-5 py-3 text-sm font-semibold text-blue-900 shadow-sm transition hover:border-blue-300"
                >
                  Load demo listing
                </button>
              </div>
            </div>
          </article>
        )}
      </section>
    </>
  );
}
