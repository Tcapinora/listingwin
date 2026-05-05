"use client";

import Link from "next/link";
import { ArrowRight, Building2, Clock3, Plus, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { PrimaryLink } from "@/components/Buttons";
import { useListing } from "@/components/ListingProvider";
import { useAgentProfile } from "@/components/AgentProfileProvider";

export default function DashboardPage() {
  const { listing } = useListing();
  const { profile } = useAgentProfile();
  const hasListing = Boolean(listing.details.address.trim());
  const hasImages = Boolean(
    listing.propertyPhotos.length || listing.assets.propertyPhoto,
  );
  const status = hasImages ? "Ready" : hasListing ? "Draft" : "New";
  const lastEdited = "Saved in this browser";
  const address = listing.details.address || "No listings yet";

  return (
    <>
      <section className="overflow-hidden rounded-[2.25rem] bg-gradient-to-br from-blue-950 via-blue-900 to-blue-700 p-7 text-white shadow-soft sm:p-10 lg:p-12">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.75fr] lg:items-end">
          <div>
            <p className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-blue-50 ring-1 ring-white/15">
              ListingWin workspace
            </p>
            <h1 className="mt-7 max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
              Ready to win your next listing?
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-blue-100">
              Build a premium seller presentation in a guided flow. Start with
              the address, add the media, generate the pack, then review and
              present.
            </p>
            <div className="mt-8">
              <PrimaryLink href="/create">
                <span className="inline-flex items-center gap-2">
                  <Plus size={18} />
                  Create New Listing
                </span>
              </PrimaryLink>
            </div>
          </div>

          <div className="rounded-[1.75rem] bg-white/10 p-5 ring-1 ring-white/15 backdrop-blur">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-blue-800">
                <Sparkles size={19} />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">
                  Simple agent flow
                </p>
                <p className="text-xs text-blue-100">1 screen = 1 decision</p>
              </div>
            </div>
            <div className="mt-5 grid gap-2 text-sm text-blue-50">
              {[
                "Create listing",
                "Add property details",
                "Upload media",
                "Generate content",
                "Review and export",
              ].map((item, index) => (
                <div
                  key={item}
                  className="flex items-center justify-between rounded-2xl bg-white/8 px-4 py-3"
                >
                  <span>{item}</span>
                  <span className="text-blue-200">{index + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <PageHeader
        eyebrow="Your Listings"
        title="Pick up where you left off."
        description={
          hasListing
            ? "Your current presentation is saved locally and ready to continue."
            : "No listings yet. Create your first listing in under 60 seconds."
        }
      />

      <section className="grid gap-5 lg:grid-cols-2">
        {hasListing ? (
          <article className="rounded-[1.75rem] bg-white p-6 shadow-card ring-1 ring-blue-50">
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
                Continue
                <ArrowRight size={16} />
              </Link>
            </div>
          </article>
        ) : (
          <article className="rounded-[1.75rem] bg-white p-8 text-center shadow-card ring-1 ring-blue-50 lg:col-span-2">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-blue-700">
              <Building2 size={24} />
            </div>
            <h2 className="mt-5 text-2xl font-semibold tracking-tight">
              No listings yet.
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Create your first listing in under 60 seconds.
            </p>
            <div className="mt-7">
              <PrimaryLink href="/create">Create New Listing</PrimaryLink>
            </div>
          </article>
        )}
      </section>
    </>
  );
}
