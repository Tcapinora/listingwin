"use client";

import Image from "next/image";
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
      title: "Paste the appraisal mess",
      text: "Drop in notes, links, property details, and comparable sale text. ListingWin turns it into a clean property profile.",
    },
    {
      title: "Show the campaign live",
      text: "Put the seller’s home inside your portal, social, brochure, flyer, signboard, and calendar previews.",
    },
    {
      title: "Close with confidence",
      text: "Move into the private workspace for the checklist, objections, follow-up message, and next decision.",
    },
  ];
  const firstRunGuide = [
    {
      title: "1. Build",
      subtitle: "Prepare before the appraisal",
      text: "Paste messy appraisal notes, generate the property profile, review comparable sales, and add property photos.",
    },
    {
      title: "2. Present",
      subtitle: "Build the campaign live",
      text: "Show the seller your agency marketing, then optionally add real photos so their property appears inside the campaign immediately.",
    },
    {
      title: "3. Close",
      subtitle: "Move into Agent Workspace",
      text: "After the seller has seen the campaign, use the workspace for price, objections, buyer proof, follow-up, and next steps.",
    },
  ];

  return (
    <>
      <section className="relative overflow-hidden rounded-[2.75rem] bg-white shadow-soft ring-1 ring-white/80">
        <div className="absolute inset-y-0 right-0 hidden w-[42%] lg:block">
          <Image
            src="/landing/central-avenue-front.jpg"
            alt="Premium property exterior used in ListingWin"
            fill
            priority
            sizes="42vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/70 to-white/5" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent" />
        </div>
        <div className="relative grid gap-12 p-7 sm:p-10 lg:grid-cols-[1.05fr_0.82fr] lg:items-center lg:p-14">
          <div>
            <p className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-800 ring-1 ring-blue-100">
              The appraisal room painkiller
            </p>
            <h1 className="mt-7 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
              Show the seller the campaign before the campaign.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
              ListingWin helps agents walk into an appraisal with proof, not
              promises. Paste the messy appraisal info, generate the property
              presentation, and show the seller what their home looks like with
              your marketing.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <PrimaryLink href="/create">
                <span className="inline-flex items-center gap-2">
                  <Plus size={18} />
                  Start Appraisal Builder
                </span>
              </PrimaryLink>
              <Link
                href="/presentation"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-900"
              >
                <MonitorPlay size={17} />
                Open Vendor Presentation
              </Link>
              <Link
                href="/draft"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-900"
              >
                <CheckCircle2 size={17} />
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
              First time here? Start with the Appraisal Builder. Everything
              else flows from that.
            </p>
          </div>

          <div className="rounded-[2rem] bg-slate-950/95 p-6 text-white shadow-soft backdrop-blur">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-blue-800 shadow-sm">
                <Sparkles size={19} />
              </span>
              <div>
              <p className="text-sm font-semibold text-white">
                  What agents do in ListingWin
                </p>
                <p className="text-xs text-blue-100">
                  Paste. Present. Close.
                </p>
              </div>
            </div>
            <div className="mt-5 grid gap-3 text-sm">
              {workflow.map((item, index) => (
                <div
                  key={item.title}
                  className="rounded-2xl bg-white/10 px-4 py-4 ring-1 ring-white/10"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-xs font-semibold text-blue-900">
                      {index + 1}
                    </span>
                    <span className="font-semibold text-white">
                      {item.title}
                    </span>
                  </div>
                  <p className="mt-2 pl-10 text-sm leading-6 text-blue-100">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-[2.25rem] bg-white/90 p-7 shadow-card ring-1 ring-white/80 sm:p-9">
        <div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-700">
              First time using ListingWin?
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              Three moves. No confusion.
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              ListingWin is not another admin dashboard. It is a guided
              appraisal flow that shows agents exactly what to do next.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {firstRunGuide.map((card) => (
              <article
                key={card.title}
                className="premium-lift rounded-[1.75rem] bg-slate-50 p-6 ring-1 ring-slate-200/70"
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

      <section className="mt-8 rounded-[2.25rem] bg-blue-50/90 p-7 text-blue-950 shadow-card ring-1 ring-blue-100 sm:p-9">
        <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">
              The simple rule
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              One clear path: Builder → Presentation → Workspace.
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-blue-900/75">
              The Builder is only for the property appraisal. The Vendor
              Presentation is seller-facing. The Agent Workspace is private and
              used after the seller has seen the campaign.
            </p>
          </div>
          <Link
            href="/create"
            className="inline-flex items-center justify-center rounded-full bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-card transition hover:-translate-y-0.5 hover:bg-blue-800"
          >
            <span className="inline-flex items-center gap-2">
              Start Appraisal Builder
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
                <PrimaryLink href="/create">Start Appraisal Builder</PrimaryLink>
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
