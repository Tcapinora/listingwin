"use client";

import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  Copy,
  FileText,
  MonitorPlay,
  Share2,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { useAgentProfile } from "@/components/AgentProfileProvider";
import { useListing } from "@/components/ListingProvider";
import { SaleCalendar } from "@/components/SaleCalendar";
import {
  BrochureBookPreview,
  FlyerPreview,
  MockupCard,
  PropertyPortalPreview,
  SocialPreview,
} from "@/components/MockupCards";
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
    ["Open seller presentation", "/presentation", MonitorPlay],
    ["Update buyer database", "#buyer-database", Users],
    ["Review sale calendar", "#sale-calendar", CalendarDays],
    ["Prepare Form 6", "#form-6", FileText],
  ];

  return (
    <>
      <section className="rounded-[2rem] bg-white p-6 shadow-card ring-1 ring-blue-50 sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.6fr] lg:items-end">
          <div>
            <div className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-800">
              Agent workspace
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Your seller presentation is complete
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              This is where the agent works after the seller-facing
              presentation: follow-up, buyer calls, campaign reporting, Form 6
              explanation, scripts, notes, and next steps.
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

        <div className="mt-8 grid gap-3 sm:grid-cols-4">
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

        <div className="mt-8 grid gap-3 lg:grid-cols-4">
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

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {[
            ["Listing Description", writeup],
            ["Social Caption", socialCaption],
            ["Key Features", keyFeatures],
          ].map(([title, content]) => (
            <article key={title} className="rounded-[1.5rem] bg-slate-50 p-5">
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-950">
                <FileText size={16} />
                {title}
              </div>
              <p className="text-sm leading-6 text-slate-600">{content}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-[1.5rem] bg-blue-950 p-5 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-200">
            Seller presentation
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/presentation"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-4 text-base font-semibold text-blue-950 shadow-card"
            >
              Open presentation
              <MonitorPlay size={18} />
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
              Copy Text
            </button>
          </div>
        </div>
      </section>

      <section
        id="buyer-database"
        className="mt-8 rounded-[2rem] bg-white p-6 shadow-card ring-1 ring-blue-50 sm:p-8"
      >
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-700">
            Agent-only command centre
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            The information the agent uses after the presentation
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            This material is intentionally not in the vendor presentation. It is
            the agent’s working area for follow-up, buyer matching, vendor
            reporting, objection handling, and appointment preparation.
          </p>
        </div>
      </section>

      <BuyerMatchEngineSection listing={listing} onUpdate={setListing} />
      <FollowUpAutomationSection listing={listing} onUpdate={setListing} />

      <section
        id="sale-calendar"
        className="mt-10 rounded-3xl border border-blue-100 bg-white p-7 shadow-card lg:p-8"
      >
        <div className="mb-6 max-w-3xl">
          <p className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-800">
            <CalendarDays size={16} />
            Agent sale calendar
          </p>
          <h2 className="mt-5 text-4xl font-semibold tracking-tight">
            Keep the campaign dates ready.
          </h2>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            Use this editable calendar to plan photography, signboard install,
            launch, open homes, follow-up calls, and seller check-ins.
          </p>
        </div>
        <SaleCalendar />
      </section>

      <VendorReportSection listing={listing} />
      <SellerFollowUpSection listing={listing} />
      <BuyerDemandSection listing={listing} />
      <CommissionDefenceSection />
      <AppraisalScriptSection listing={listing} />
      <AgentNotesSection listing={listing} />

      <div id="form-6">
        <Form6PrototypeSection />
      </div>

      <section className="mt-8 rounded-[2rem] bg-white p-6 shadow-card ring-1 ring-blue-50 sm:p-8">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-700">
              Final Preview
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              What the seller is about to see
            </h2>
          </div>
          <Link
            href="/details"
            className="inline-flex items-center justify-center rounded-full border border-blue-200 bg-white px-5 py-3 text-sm font-semibold text-blue-900 shadow-sm"
          >
            Edit Details
          </Link>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          <MockupCard title="Property portal">
            <PropertyPortalPreview listing={listing} />
          </MockupCard>
          <MockupCard title="Brochure book">
            <BrochureBookPreview listing={listing} />
          </MockupCard>
          <MockupCard title="Campaign flyer">
            <FlyerPreview listing={listing} />
          </MockupCard>
          <MockupCard title="Instagram post">
            <SocialPreview listing={listing} type="Instagram" />
          </MockupCard>
        </div>

        <div className="mt-8 flex justify-end">
          <Link
            href="/presentation"
            className="inline-flex items-center gap-2 rounded-full bg-blue-700 px-6 py-4 text-base font-semibold text-white shadow-card"
          >
            Continue
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}
