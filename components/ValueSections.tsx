"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Bath,
  BadgeCheck,
  BedDouble,
  Car,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Flame,
  DollarSign,
  Eye,
  ExternalLink,
  FileText,
  Handshake,
  Link2,
  Megaphone,
  MessageSquareText,
  Ruler,
  ShieldCheck,
  Sparkles,
  Target,
  Timer,
  Trophy,
  Upload,
  Users,
} from "lucide-react";
import { useAgentProfile } from "@/components/AgentProfileProvider";
import { getBuyerMatches, getFollowUpPlan } from "@/lib/buyerMatch";
import { getPrimaryPropertyPhoto } from "@/lib/listingImages";
import { getListingWinInsight } from "@/lib/listingScore";
import { getPriceConfidence } from "@/lib/priceConfidence";
import type { BuyerLead, ListingState } from "@/lib/types";

const sellerBenefits = [
  {
    title: "They see the campaign before signing",
    description:
      "Instead of promising premium marketing, the agent can show the seller their property already presented across signage, print, social, and mobile.",
    icon: Eye,
  },
  {
    title: "They understand the buyer journey",
    description:
      "The presentation connects the front-yard signboard, digital ads, social posts, and printed material into one clear launch plan.",
    icon: Target,
  },
  {
    title: "They trust the agent is prepared",
    description:
      "A tailored mockup makes the appraisal feel considered, polished, and property-specific from the first conversation.",
    icon: ShieldCheck,
  },
];

const agentWins = [
  "Walk into the appraisal with a property-specific marketing story.",
  "Show sellers exactly what buyers will see on mobile and social.",
  "Turn generic marketing promises into visual proof.",
  "Save every pitch so the agent can reuse, share, and improve presentations.",
];

const premiumWorkflow = [
  "Pre-appraisal market review saved",
  "Pricing evidence ready",
  "Campaign assets visible",
  "Seller follow-up prepared",
  "Important sale dates mapped",
];

const sellerActions = [
  {
    id: "marketing",
    title: "Approve campaign direction",
    description:
      "The seller understands the proposed launch style, buyer-facing creative, and open-home story.",
  },
  {
    id: "pricing",
    title: "Review price evidence",
    description:
      "The agent can pause on pricing confidence and talk through the current market proof.",
  },
  {
    id: "follow-up",
    title: "Book next conversation",
    description:
      "Use the presentation as the next-step anchor instead of leaving the appraisal open-ended.",
  },
];

function normaliseUrl(url: string) {
  if (!url.trim()) {
    return "";
  }

  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

function scoreActionHref(item: string) {
  const lower = item.toLowerCase();

  if (lower.includes("agent") || lower.includes("logo") || lower.includes("social")) {
    return "/account";
  }

  if (lower.includes("photo") || lower.includes("signboard")) {
    return "/mockups";
  }

  if (lower.includes("market") || lower.includes("price") || lower.includes("address")) {
    return "/create";
  }

  return "/dashboard";
}

export function DashboardValuePanel({ listing }: { listing: ListingState }) {
  const { profile, isProfileComplete } = useAgentProfile();
  const hasListing = Boolean(listing.details.address);
  const hasPhotos = Boolean(
    listing.propertyPhotos.length || listing.assets.propertyPhoto,
  );
  const hasSignboard = Boolean(
    listing.assets.signboard1 || listing.assets.signboard2,
  );
  const hasMarketReview = listing.comparableProperties.some(
    (property) => property.address || property.url,
  );
  const hasPriceEvidence = Boolean(
    listing.details.sellerExpectedPrice && listing.details.agentPriceGuide,
  );
  const hasCalendar = listing.saleCalendarEvents.length > 0;
  const score = [
    isProfileComplete,
    hasListing,
    hasPhotos,
    hasSignboard,
    hasMarketReview,
    hasPriceEvidence,
    hasCalendar,
  ].filter(Boolean).length;
  const scorePercent = Math.round((score / 7) * 100);
  const agentName = profile.agentName || "Agent";

  const readiness = [
    {
      label: "Agent profile saved",
      done: isProfileComplete,
    },
    {
      label: "Listing address added",
      done: hasListing,
    },
    {
      label: "Property photos uploaded",
      done: hasPhotos,
    },
    {
      label: "Signboard options ready",
      done: hasSignboard,
    },
    {
      label: "Market review links added",
      done: hasMarketReview,
    },
    {
      label: "Price evidence entered",
      done: hasPriceEvidence,
    },
    {
      label: "Sale dates mapped",
      done: hasCalendar,
    },
  ];

  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
      <div className="rounded-3xl border border-blue-100 bg-white p-6 shadow-card">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">
              Listing Win Score
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              {scorePercent}% ready to pitch
            </h2>
          </div>
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-blue-700 text-xl font-semibold text-white">
            {score}/7
          </div>
        </div>

        <div className="mt-6 h-2 overflow-hidden rounded-full bg-blue-50">
          <div
            className="h-full rounded-full bg-blue-700 transition-all"
            style={{ width: `${scorePercent}%` }}
          />
        </div>

        <div className="mt-6 grid gap-3">
          {readiness.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between gap-3 rounded-2xl bg-blue-50/70 p-4 text-sm"
            >
              <span className="font-medium text-gray-800">{item.label}</span>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                  item.done
                    ? "bg-blue-700 text-white"
                    : "bg-white text-gray-500"
                }`}
              >
                {item.done ? <BadgeCheck size={13} /> : null}
                {item.done ? "Done" : "Needed"}
              </span>
            </div>
          ))}
        </div>

        <Link
          href={hasListing ? "/mockups" : "/create"}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800"
        >
          Build seller pitch
          <ArrowRight size={16} />
        </Link>
      </div>

      <div className="rounded-3xl bg-blue-950 p-6 text-white shadow-soft lg:p-8">
        <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-gray-200">
          <Sparkles size={16} />
          $39/mo command centre
        </p>
        <h2 className="mt-5 max-w-2xl text-4xl font-semibold tracking-tight">
          Give {agentName} the appraisal system they will not want to give up.
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-blue-100">
          The value is not a mockup. It is having the price story, market proof,
          campaign visuals, sale dates, seller talking points, and follow-up
          ready before the appraisal starts.
        </p>
        <div className="mt-7 grid gap-4 md:grid-cols-2">
          {[...agentWins, ...premiumWorkflow].map((win) => (
            <div
              key={win}
              className="rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <BadgeCheck className="text-white" size={18} />
              <p className="mt-3 text-sm leading-6 text-gray-200">{win}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AppraisalCommandCentre({ listing }: { listing: ListingState }) {
  const { isProfileComplete } = useAgentProfile();
  const checks = [
    {
      label: "Agent account ready",
      ready: isProfileComplete,
      action: "Add agent profile, logo, phone, email, and socials.",
    },
    {
      label: "Property story captured",
      ready: Boolean(listing.details.address && listing.details.notes),
      action: "Add address and appraisal notes.",
    },
    {
      label: "Market proof loaded",
      ready: listing.comparableProperties.some(
        (property) => property.address || property.url,
      ),
      action: "Add up to 3 current competing property links.",
    },
    {
      label: "Pricing conversation supported",
      ready: Boolean(
        listing.details.sellerExpectedPrice && listing.details.agentPriceGuide,
      ),
      action: "Add seller expected price and agent guide.",
    },
    {
      label: "Campaign creative prepared",
      ready: Boolean(
        listing.propertyPhotos.length &&
          (listing.assets.signboard1 || listing.assets.signboard2),
      ),
      action: "Upload property photos and signboard options.",
    },
    {
      label: "Sale timeline mapped",
      ready: listing.saleCalendarEvents.length > 0,
      action: "Add campaign dates to the sale calendar.",
    },
  ];
  const readyCount = checks.filter((check) => check.ready).length;

  return (
    <section className="mt-8 overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-card">
      <div className="grid lg:grid-cols-[0.75fr_1.25fr]">
        <div className="bg-blue-950 p-7 text-white lg:p-8">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-blue-100">
            <Trophy size={16} />
            Appraisal command centre
          </p>
          <h2 className="mt-5 text-4xl font-semibold tracking-tight">
            {readyCount}/6 readiness checks complete
          </h2>
          <p className="mt-4 text-sm leading-6 text-blue-100">
            A $39/month product should make the agent feel unusually prepared.
            This turns ListingWin into the pre-listing operating system, not
            just a design tool.
          </p>
          <Link
            href="/presentation"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-blue-950"
          >
            Open seller presentation
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid gap-3 p-5 lg:grid-cols-2 lg:p-7">
          {checks.map((check) => (
            <div
              key={check.label}
              className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4"
            >
              <div className="flex items-start gap-3">
                <span
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${
                    check.ready
                      ? "bg-blue-700 text-white"
                      : "bg-white text-blue-700"
                  }`}
                >
                  <CheckCircle2 size={17} />
                </span>
                <div>
                  <h3 className="font-semibold tracking-tight text-slate-950">
                    {check.label}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {check.ready ? "Ready for the seller meeting." : check.action}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SellerDecisionRoomSection({
  listing,
}: {
  listing: ListingState;
}) {
  const { profile } = useAgentProfile();
  const [activeAction, setActiveAction] = useState(sellerActions[0].id);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const agencyName =
    profile.agencyName || listing.details.agencyName || "Agency";
  const agentName = profile.agentName || listing.details.agentName || "Agent";
  const brandColor = profile.brandColor || "#123f53";
  const active =
    sellerActions.find((action) => action.id === activeAction) ||
    sellerActions[0];
  const signals = [
    {
      label: "Seller-ready link",
      value: "Live",
      detail: "Shareable presentation can be copied from the top bar.",
    },
    {
      label: "Most important section",
      value: "Pricing",
      detail: "Use this to guide the hardest conversation in the appraisal.",
    },
    {
      label: "Next step",
      value: "Follow-up",
      detail: "Keep the agent in control after the meeting.",
    },
  ];

  return (
    <section className="mt-10 overflow-hidden rounded-[2rem] border border-blue-100 bg-white shadow-card">
      <div
        className="grid gap-0 lg:grid-cols-[0.8fr_1.2fr]"
        style={{ borderTop: `8px solid ${brandColor}` }}
      >
        <div className="bg-blue-950 p-7 text-white lg:p-8">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-blue-100">
            <Handshake size={16} />
            Appraisal decision room
          </p>
          <h2 className="mt-5 text-4xl font-semibold tracking-tight">
            Turn the meeting into a clear seller decision.
          </h2>
          <p className="mt-4 text-sm leading-6 text-blue-100">
            Inspired by live proposal tools: the agent can guide the seller
            through proof, creative, and next steps without switching to a PDF
            or another deck.
          </p>
          <div className="mt-7 rounded-3xl bg-white/10 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-200">
              Presented by
            </p>
            <p className="mt-2 text-2xl font-semibold">{agentName}</p>
            <p className="mt-1 text-sm text-blue-100">{agencyName}</p>
          </div>
        </div>

        <div className="p-6 lg:p-8">
          <div className="grid gap-3 md:grid-cols-3">
            {sellerActions.map((action) => {
              const selected = activeAction === action.id;

              return (
                <button
                  key={action.id}
                  type="button"
                  onClick={() => setActiveAction(action.id)}
                  className={`rounded-3xl border p-4 text-left transition ${
                    selected
                      ? "border-blue-700 bg-blue-50"
                      : "border-gray-200 bg-white hover:border-blue-200"
                  }`}
                >
                  <span
                    className="grid h-9 w-9 place-items-center rounded-full text-sm font-semibold text-white"
                    style={{ backgroundColor: selected ? brandColor : "#64748b" }}
                  >
                    {sellerActions.indexOf(action) + 1}
                  </span>
                  <span className="mt-4 block text-sm font-semibold text-gray-950">
                    {action.title}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-5 rounded-3xl bg-gray-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">
              Selected seller moment
            </p>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-gray-950">
              {active.title}
            </h3>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              {active.description}
            </p>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {signals.map((signal) => (
              <div key={signal.label} className="rounded-2xl border border-gray-200 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                  {signal.label}
                </p>
                <p className="mt-2 text-xl font-semibold text-gray-950">
                  {signal.value}
                </p>
                <p className="mt-2 text-xs leading-5 text-gray-500">
                  {signal.detail}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/presentation"
              className="rounded-full px-5 py-3 text-sm font-semibold text-white shadow-card"
              style={{ backgroundColor: brandColor }}
            >
              Use in appraisal
            </Link>
            <button
              type="button"
              onClick={() => setCalendarOpen((value) => !value)}
              className="rounded-full border border-blue-100 bg-white px-5 py-3 text-sm font-semibold text-blue-900"
            >
              {calendarOpen ? "Hide sale calendar" : "View sale calendar"}
            </button>
          </div>

          {calendarOpen ? (
            <div className="mt-5 rounded-3xl border border-blue-100 bg-blue-50/70 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">
                Sale calendar
              </p>
              {listing.saleCalendarEvents.length ? (
                <div className="mt-4 grid gap-3">
                  {[...listing.saleCalendarEvents]
                    .sort((a, b) => a.date.localeCompare(b.date))
                    .slice(0, 6)
                    .map((event) => (
                      <div
                        key={event.id}
                        className="rounded-2xl bg-white p-4 text-sm"
                      >
                        <p className="font-semibold text-gray-950">
                          {event.date} · {event.type}
                        </p>
                        <p className="mt-1 text-gray-600">{event.title}</p>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  No dates added yet. Add photography, launch, open home, and
                  auction dates from the dashboard before the appraisal.
                </p>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export function SellerValueSection({ listing }: { listing: ListingState }) {
  const { profile } = useAgentProfile();
  const propertyPhoto = getPrimaryPropertyPhoto(listing);
  const agencyName =
    profile.agencyName || listing.details.agencyName || "the agency";
  const agentName = profile.agentName || listing.details.agentName || "your agent";

  return (
    <section className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-3xl border border-blue-100 bg-white p-7 shadow-card">
        <p className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-800">
          <Handshake size={16} />
          Seller confidence
        </p>
        <h2 className="mt-5 text-4xl font-semibold tracking-tight">
          The seller sees the launch plan before they sign.
        </h2>
        <p className="mt-5 text-base leading-8 text-gray-600">
          Show the marketing, price story, and campaign sequence clearly enough
          that the seller can picture the launch.
        </p>
        <div className="mt-6 grid gap-3">
          {sellerBenefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.title}
                className="grid gap-4 rounded-2xl bg-blue-50/70 p-4 sm:grid-cols-[44px_1fr]"
              >
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white shadow-sm">
                  <Icon size={18} />
                </div>
                <div>
                  <h3 className="font-semibold tracking-tight">
                    {benefit.title}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    {benefit.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-3xl bg-blue-950 p-7 text-white shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-200">
          Seller takeaway
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight">
          A clear plan the seller can remember.
        </h2>
        <div className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-white/5">
          <div
            className="relative aspect-[16/10] bg-gray-800"
            style={
              propertyPhoto
                ? {
                    backgroundImage: `linear-gradient(to top, rgba(0,0,0,.65), rgba(0,0,0,.05)), url(${propertyPhoto})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                : undefined
            }
          >
            <div className="absolute bottom-5 left-5 right-5">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-200">
                Campaign promise
              </p>
              <p className="mt-2 text-2xl font-semibold leading-tight">
                {listing.details.address || "Your property"} launched with a
                campaign the seller can see, understand, and approve.
              </p>
            </div>
          </div>
          <div className="grid gap-4 p-5 sm:grid-cols-3">
            <div>
              <Timer size={18} />
              <p className="mt-2 text-sm text-gray-300">Fast approval</p>
            </div>
            <div>
              <Link2 size={18} />
              <p className="mt-2 text-sm text-gray-300">Shareable preview</p>
            </div>
            <div>
              <MessageSquareText size={18} />
              <p className="mt-2 text-sm text-gray-300">Clear next steps</p>
            </div>
          </div>
        </div>
        <p className="mt-5 text-sm leading-6 text-gray-300">
          The seller should leave knowing what will happen next, how buyers
          will see the home, how price will be handled, and why {agentName} is
          prepared to run the campaign.
        </p>
      </div>
    </section>
  );
}

export function CampaignPlanSection({ listing }: { listing: ListingState }) {
  const { profile } = useAgentProfile();
  const agencyName =
    profile.agencyName || listing.details.agencyName || "Agency";
  const plan = [
    {
      title: "Launch creative",
      description:
        "Finalise property hero images, signboard placement, and branded print assets.",
    },
    {
      title: "Social proof",
      description:
        "Show how the listing will appear on the agent and agency social channels.",
    },
    {
      title: "Seller follow-up",
      description:
        "Send the shared presentation link after the appraisal so the vendor can revisit the pitch.",
    },
  ];

  return (
    <section className="mt-10 rounded-3xl border border-blue-100 bg-white p-7 shadow-card">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-800">
            <ClipboardCheck size={16} />
            Campaign plan
          </p>
          <h2 className="mt-5 text-4xl font-semibold tracking-tight">
            The seller can see the path from appraisal to launch.
          </h2>
        </div>
        <p className="max-w-md text-sm leading-6 text-gray-500">
          This turns {agencyName}’s marketing into a simple sequence the seller
          can understand and approve.
        </p>
      </div>

      <div className="mt-7 grid gap-4 lg:grid-cols-3">
        {plan.map((item, index) => (
          <div key={item.title} className="rounded-2xl bg-blue-50/70 p-5">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-blue-700 text-sm font-semibold text-white">
              {index + 1}
            </span>
            <h3 className="mt-5 text-xl font-semibold tracking-tight">
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function CampaignTimelineSection({ listing }: { listing: ListingState }) {
  const events = [...listing.saleCalendarEvents].sort((a, b) =>
    a.date.localeCompare(b.date),
  );

  return (
    <section className="mt-10 rounded-3xl border border-blue-100 bg-white p-7 shadow-card">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-800">
            <CalendarDays size={16} />
            Sale calendar
          </p>
          <h2 className="mt-5 text-4xl font-semibold tracking-tight">
            The seller can see exactly what happens next.
          </h2>
        </div>
        <p className="max-w-md text-sm leading-6 text-slate-600">
          These dates come from the agent’s sale calendar. It turns the pitch
          into an organised launch plan instead of a vague promise.
          <Link
            href="/dashboard"
            className="no-print ml-2 font-semibold text-blue-700 underline"
          >
            Edit calendar
          </Link>
        </p>
      </div>

      {events.length ? (
        <div className="mt-7 grid gap-4 lg:grid-cols-3">
          {events.slice(0, 9).map((event) => (
            <div key={event.id} className="rounded-2xl bg-blue-50/70 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
                {event.type}
              </p>
              <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
                {event.date}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {event.title}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-7 rounded-2xl bg-blue-50/70 p-6">
          <p className="text-sm leading-6 text-slate-600">
            No sale dates have been added yet. Add photography, launch, open
            home, auction, and seller follow-up dates on the dashboard calendar.
          </p>
        </div>
      )}
    </section>
  );
}

export function ListingWinScoreCard({
  listing,
  compact = false,
}: {
  listing: ListingState;
  compact?: boolean;
}) {
  const { profile } = useAgentProfile();
  const insight = getListingWinInsight(listing, profile);

  return (
    <section
      className={`rounded-3xl border border-gray-200 bg-white shadow-card ${
        compact ? "p-6" : "mt-10 p-7"
      }`}
    >
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700">
            <Trophy size={16} />
            ListingWin Score
          </p>
          <h2 className="mt-5 text-4xl font-semibold tracking-tight">
            {insight.score}/100
          </h2>
          <p className="mt-2 text-sm font-semibold text-gray-500">
            {insight.label}
          </p>
        </div>
        <div className="w-full max-w-sm">
          <div className="h-3 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-gray-950 transition-all"
              style={{ width: `${insight.score}%` }}
            />
          </div>
          <p className="mt-3 text-sm leading-6 text-gray-500">
            This score measures how ready the presentation is to win a listing:
            photos, signboards, agent profile, brand consistency, market proof,
            price evidence, and sale dates. Later, this can be strengthened with
            real image analysis for curb appeal, light, clutter, and photo quality.
          </p>
        </div>
      </div>

      <div className="mt-7 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <h3 className="text-lg font-semibold tracking-tight">
            3 seller recommendations
          </h3>
          <div className="mt-4 grid gap-3">
            {insight.suggestions.map((suggestion, index) => (
              <div key={suggestion} className="rounded-2xl bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                  Suggestion {index + 1}
                </p>
                <p className="mt-2 text-sm leading-6 text-gray-700">
                  {suggestion}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-gray-950 p-5 text-white">
          <h3 className="text-lg font-semibold tracking-tight">
            What to improve before the appraisal
          </h3>
          <div className="mt-4 grid gap-3">
            {insight.missingItems.length ? (
              insight.missingItems.slice(0, 4).map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between gap-3 rounded-2xl bg-white/8 p-3 text-sm"
                >
                  <span>{item}</span>
                  <Link
                    href={scoreActionHref(item)}
                    className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-950 transition hover:bg-blue-100"
                  >
                    Improve
                  </Link>
                </div>
              ))
            ) : (
              <p className="rounded-2xl bg-white/8 p-4 text-sm leading-6 text-gray-200">
                The pitch is in strong shape. Use the suggestions as seller
                talking points before the property goes live.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export function PriceConfidenceSection({ listing }: { listing: ListingState }) {
  const price = getPriceConfidence(listing);

  return (
    <section className="mt-10 rounded-3xl border border-blue-100 bg-white p-7 shadow-card">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-800">
            <DollarSign size={16} />
            Price confidence
          </p>
          <h2 className="mt-5 text-4xl font-semibold tracking-tight">
            {price.confidence}/100 pricing evidence confidence
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            {price.gapLabel}. This is an evidence-readiness gauge, not a
            valuation. It is based only on what the agent has entered: seller
            expectation, agent guide, reviewed market properties, property
            photos, and pricing notes.
          </p>
        </div>
        <div className="w-full max-w-sm rounded-3xl bg-blue-950 p-5 text-white">
          <div className="h-3 overflow-hidden rounded-full bg-white/15">
            <div
              className="h-full rounded-full bg-sky-300"
              style={{ width: `${price.confidence}%` }}
            />
          </div>
          <div className="mt-5 grid gap-3 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-blue-100">Seller expectation</span>
              <strong>{price.sellerPrice}</strong>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-blue-100">Agent guide</span>
              <strong>{price.guidePrice}</strong>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-blue-100">Expectation gap</span>
              <strong>{price.gapPercent}%</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-7 grid gap-4 lg:grid-cols-3">
        {price.evidence.map((item) => (
          <div key={item.label} className="rounded-2xl bg-blue-50/70 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
              {item.ready ? "Included" : "Missing"}
            </p>
            <h3 className="mt-3 text-xl font-semibold tracking-tight">
              {item.label}
            </h3>
            <p className="mt-2 text-2xl font-semibold text-blue-800">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-500">
        Use this as an appraisal-room confidence indicator: it tells the seller
        how well-supported the price conversation is before the campaign begins.
        Production can strengthen it with live on-market listings, sold results,
        suburb trends, and property portal data.
      </p>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl bg-blue-50/70 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
            Mathematical price
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            The evidence-based range: comparable properties, land size,
            condition, buyer depth, recent competing stock, and feedback from
            active buyers.
          </p>
        </div>
        <div className="rounded-2xl bg-blue-50/70 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
            Emotional price
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            The stretch result a campaign tries to create through presentation,
            urgency, emotional appeal, scarcity, open-home energy, and skilled
            negotiation.
          </p>
        </div>
      </div>
    </section>
  );
}

export function MarketExpertSection({ listing }: { listing: ListingState }) {
  const comparables = listing.comparableProperties.filter(
    (property) => property.address || property.url,
  );

  if (!comparables.length) {
    return (
      <section className="mt-10 rounded-3xl border border-blue-100 bg-white p-7 shadow-card">
        <p className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-800">
          <ExternalLink size={16} />
          Market review
        </p>
        <h2 className="mt-5 text-4xl font-semibold tracking-tight">
          Add competing property links before the appraisal.
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600">
          The agent can save up to three current market URLs on the Create
          Listing screen. They appear here as visual proof that the agent has
          reviewed the market and understands what the seller is competing
          against.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-10 rounded-3xl border border-blue-100 bg-white p-7 shadow-card">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-800">
            <ExternalLink size={16} />
            Market expert review
          </p>
          <h2 className="mt-5 text-4xl font-semibold tracking-tight">
            Current properties reviewed before this appraisal.
          </h2>
        </div>
        <p className="max-w-md text-sm leading-6 text-slate-600">
          These links are saved as prepared market proof in the MVP. Production
          can later read property data automatically, but the seller already sees
          that the agent has compared the right homes before the meeting.
        </p>
      </div>

      <div className="mt-7 grid gap-4 lg:grid-cols-3">
        {comparables.map((property, index) => {
          const url = normaliseUrl(property.url);
          return (
            <article
              key={`${property.address}-${index}`}
              className="rounded-3xl border border-blue-100 bg-blue-50/60 p-5"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
                Market option {index + 1}
              </p>
              <h3 className="mt-3 min-h-16 text-xl font-semibold tracking-tight text-slate-950">
                {property.address || "Comparable property"}
              </h3>

              <div className="mt-5 grid grid-cols-4 gap-2 text-sm">
                <div className="rounded-2xl bg-white p-3">
                  <BedDouble className="text-blue-700" size={17} />
                  <p className="mt-2 font-semibold">
                    {property.beds || "-"}
                  </p>
                  <p className="text-xs text-slate-500">Bed</p>
                </div>
                <div className="rounded-2xl bg-white p-3">
                  <Bath className="text-blue-700" size={17} />
                  <p className="mt-2 font-semibold">
                    {property.baths || "-"}
                  </p>
                  <p className="text-xs text-slate-500">Bath</p>
                </div>
                <div className="rounded-2xl bg-white p-3">
                  <Car className="text-blue-700" size={17} />
                  <p className="mt-2 font-semibold">
                    {property.cars || "-"}
                  </p>
                  <p className="text-xs text-slate-500">Car</p>
                </div>
                <div className="rounded-2xl bg-white p-3">
                  <Ruler className="text-blue-700" size={17} />
                  <p className="mt-2 font-semibold">
                    {property.blockSize || "-"}
                  </p>
                  <p className="text-xs text-slate-500">Land</p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Saved market URL
                </p>
                {url ? (
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 flex items-center gap-2 break-all text-sm font-semibold text-blue-800"
                  >
                    Open property link
                    <ExternalLink size={14} />
                  </a>
                ) : (
                  <p className="mt-2 text-sm text-slate-500">
                    URL not added yet
                  </p>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function BuyerDemandSection({ listing }: { listing: ListingState }) {
  const notes = listing.details.notes || "family-friendly lifestyle features";
  const buyers = [
    "Define the most likely buyer: family, upgrader, downsizer, investor, or prestige lifestyle buyer.",
    "Launch with consistent portal, social, brochure, signboard, and open-home creative so buyers see the same story everywhere.",
    "Use enquiry quality, inspection feedback, and competing stock to adjust the campaign in the first 7 to 10 days.",
  ];
  const actions = [
    "Call qualified buyers and buyer advocates already active in this area.",
    "Launch the first open home with a clear inspection hook and follow-up plan.",
    "Report buyer objections, enquiry quality, and market movement back to the seller.",
  ];

  return (
    <section className="mt-10 rounded-3xl bg-blue-950 p-7 text-white shadow-soft">
      <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-blue-100">
        <Users size={16} />
        Buyer demand plan
      </p>
      <h2 className="mt-5 text-4xl font-semibold tracking-tight">
        Show the seller who the campaign attracts.
      </h2>
      <div className="mt-7 grid gap-4 lg:grid-cols-3">
        {buyers.map((buyer) => (
          <div key={buyer} className="rounded-2xl bg-white/8 p-5">
            <Target size={18} />
            <p className="mt-3 text-sm leading-6 text-blue-50">{buyer}</p>
          </div>
        ))}
      </div>
      <p className="mt-6 text-sm leading-6 text-blue-100">
        Campaign angle: lead with {notes}. Tie the photos, signboard, social
        posts, and timing back to buyer competition.
      </p>
      <div className="mt-6 rounded-3xl bg-white/10 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-200">
          What the agent will do
        </p>
        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          {actions.map((action) => (
            <p key={action} className="rounded-2xl bg-white/10 p-4 text-sm leading-6 text-blue-50">
              {action}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CommissionDefenceSection() {
  const points = [
    "Premium marketing creates more buyer attention before negotiation starts.",
    "A stronger campaign gives the agent more leverage when defending price.",
    "The seller is not just paying for listing work; they are paying for buyer competition and negotiation skill.",
  ];

  return (
    <section className="mt-10 rounded-3xl border border-blue-100 bg-white p-7 shadow-card">
      <p className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-800">
        <ShieldCheck size={16} />
        Commission defence
      </p>
      <h2 className="mt-5 text-4xl font-semibold tracking-tight">
        Make the fee feel connected to the result.
      </h2>
      <div className="mt-7 grid gap-4 lg:grid-cols-3">
        {points.map((point) => (
          <div key={point} className="rounded-2xl bg-blue-50/70 p-5">
            <BadgeCheck className="text-blue-700" size={18} />
            <p className="mt-3 text-sm leading-6 text-slate-600">{point}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function AppraisalScriptSection({ listing }: { listing: ListingState }) {
  const address = listing.details.address || "this property";
  const scripts = [
    {
      title: "Opening",
      copy: `I’ve prepared this specifically for ${address}, so you can see how I would launch the home before we talk about signing anything.`,
    },
    {
      title: "Price expectation",
      copy: "Your price expectation matters. My job is to show where buyers are likely to see value, then build a campaign that gives us the best chance of stretching the result.",
    },
    {
      title: "Close",
      copy: "If this plan feels right, the next step is to lock in photography, signboard, launch timing, and the campaign assets so we can move quickly.",
    },
  ];

  return (
    <section className="mt-10 rounded-3xl border border-blue-100 bg-white p-7 shadow-card">
      <p className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-800">
        <MessageSquareText size={16} />
        In-room script assistant
      </p>
      <h2 className="mt-5 text-4xl font-semibold tracking-tight">
        Keep the appraisal conversation sharp.
      </h2>
      <div className="mt-7 grid gap-4 lg:grid-cols-3">
        {scripts.map((script) => (
          <div key={script.title} className="rounded-2xl bg-blue-50/70 p-5">
            <h3 className="text-lg font-semibold tracking-tight">
              {script.title}
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {script.copy}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function AgentNotesSection({ listing }: { listing: ListingState }) {
  const notes = listing.details.notes.trim();
  const priceNotes = listing.details.priceNotes.trim();

  if (!notes && !priceNotes) {
    return null;
  }

  return (
    <section className="mt-10 rounded-3xl border border-blue-100 bg-white p-7 shadow-card">
      <p className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-800">
        <FileText size={16} />
        Agent notes
      </p>
      <h2 className="mt-5 text-4xl font-semibold tracking-tight">
        Notes for the listing conversation.
      </h2>
      <div className="mt-7 grid gap-4 lg:grid-cols-2">
        {notes ? (
          <div className="rounded-2xl bg-blue-50/70 p-5">
            <h3 className="text-lg font-semibold tracking-tight">
              Property and campaign notes
            </h3>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600">
              {notes}
            </p>
          </div>
        ) : null}
        {priceNotes ? (
          <div className="rounded-2xl bg-blue-50/70 p-5">
            <h3 className="text-lg font-semibold tracking-tight">
              Price conversation notes
            </h3>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600">
              {priceNotes}
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function SellerFollowUpSection({ listing }: { listing: ListingState }) {
  const address = listing.details.address || "your property";

  return (
    <section className="mt-10 grid gap-6 lg:grid-cols-2">
      <div className="rounded-3xl border border-blue-100 bg-white p-7 shadow-card">
        <p className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-800">
          <FileText size={16} />
          Seller follow-up message
        </p>
        <h2 className="mt-5 text-3xl font-semibold tracking-tight">
          Keep the seller engaged after the appraisal.
        </h2>
        <p className="mt-5 rounded-2xl bg-blue-50/70 p-5 text-sm leading-7 text-slate-600">
          Thanks again for walking me through {address}. I’ve put together the
          campaign preview we discussed so you can revisit the marketing,
          pricing conversation, and next steps. My recommendation is that we
          prepare the property, finalise photography, and launch with a clear
          buyer-demand plan.
        </p>
      </div>

      <div className="rounded-3xl bg-blue-700 p-7 text-white shadow-soft">
        <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">
          <Megaphone size={16} />
          Seller decision plan
        </p>
        <h2 className="mt-5 text-3xl font-semibold tracking-tight">
          Convert interest into action.
        </h2>
        <div className="mt-6 grid gap-3 text-sm">
          {[
            "Confirm price strategy and campaign method",
            "Book photography and signboard install",
            "Approve social, brochure, flyer, and launch copy",
            "Send seller the shared ListingWin presentation link",
          ].map((step) => (
            <div key={step} className="rounded-2xl bg-white/12 p-4">
              {step}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function BuyerMatchEngineSection({
  listing,
  onUpdate,
}: {
  listing: ListingState;
  onUpdate?: (next: ListingState) => void;
}) {
  const matches = getBuyerMatches(listing);
  const [draft, setDraft] = useState<BuyerLead>({
    id: "",
    name: "",
    status: "Warm",
    budgetMin: "",
    budgetMax: "",
    suburbs: "",
    beds: "",
    notes: "",
    lastContact: "",
    nextFollowUp: "",
  });

  function addBuyer() {
    if (!onUpdate || !draft.name.trim()) {
      return;
    }

    onUpdate({
      ...listing,
      buyerLeads: [
        ...listing.buyerLeads,
        {
          ...draft,
          id: `buyer-${Date.now()}`,
          name: draft.name.trim(),
        },
      ],
    });
    setDraft({
      ...draft,
      id: "",
      name: "",
      budgetMin: "",
      budgetMax: "",
      suburbs: "",
      beds: "",
      notes: "",
    });
  }

  return (
    <section className="mt-10 overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-card">
      <div className="grid gap-0 lg:grid-cols-[0.82fr_1.18fr]">
        <div className="bg-slate-950 p-7 text-white lg:p-8">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-blue-100">
            <Users size={16} />
            Buyer match engine
          </p>
          <h2 className="mt-5 text-4xl font-semibold tracking-tight">
            Show the seller who the agent can call straight away.
          </h2>
          <p className="mt-4 text-sm leading-6 text-slate-300">
            Store buyer preferences, price ranges, suburb targets, and lead
            temperature. ListingWin then ranks the best matches for the
            property being appraised.
          </p>
          <div className="mt-6 rounded-2xl bg-white/10 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-200">
              Immediate alert
            </p>
            <p className="mt-3 text-2xl font-semibold">
              {matches[0]?.alert || "Add buyers to start matching"}
            </p>
            <p className="mt-2 text-sm text-slate-300">
              {matches[0]
                ? `${matches[0].name} is the strongest current match.`
                : "The agent can build a buyer list before the appraisal."}
            </p>
          </div>
        </div>

        <div className="grid gap-5 p-6 lg:p-8">
          <div className="grid gap-4 lg:grid-cols-3">
            {matches.slice(0, 3).map((buyer) => (
              <article
                key={buyer.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      {buyer.status} lead
                    </p>
                    <h3 className="mt-2 text-xl font-semibold tracking-tight">
                      {buyer.name}
                    </h3>
                  </div>
                  <span className="rounded-full bg-blue-700 px-3 py-1 text-xs font-semibold text-white">
                    {buyer.score}/100
                  </span>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-600">
                  {buyer.notes}
                </p>
                <div className="mt-4 grid gap-2 text-xs font-semibold text-slate-600">
                  <span>{buyer.budgetMin}-{buyer.budgetMax}</span>
                  <span>{buyer.suburbs}</span>
                  <span>{buyer.beds || "Any"}+ beds</span>
                </div>
                <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-semibold text-blue-900">
                  <Flame size={14} />
                  {buyer.alert}
                </p>
              </article>
            ))}
          </div>

          {onUpdate ? (
            <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5">
              <h3 className="text-lg font-semibold tracking-tight">
                Add buyer preference
              </h3>
              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <input
                  value={draft.name}
                  onChange={(event) =>
                    setDraft({ ...draft, name: event.target.value })
                  }
                  placeholder="Buyer name"
                  className="rounded-2xl border border-blue-100 bg-white px-4 py-3 text-sm outline-none focus:border-blue-400"
                />
                <input
                  value={draft.budgetMin}
                  onChange={(event) =>
                    setDraft({ ...draft, budgetMin: event.target.value })
                  }
                  placeholder="Min budget"
                  className="rounded-2xl border border-blue-100 bg-white px-4 py-3 text-sm outline-none focus:border-blue-400"
                />
                <input
                  value={draft.budgetMax}
                  onChange={(event) =>
                    setDraft({ ...draft, budgetMax: event.target.value })
                  }
                  placeholder="Max budget"
                  className="rounded-2xl border border-blue-100 bg-white px-4 py-3 text-sm outline-none focus:border-blue-400"
                />
                <input
                  value={draft.suburbs}
                  onChange={(event) =>
                    setDraft({ ...draft, suburbs: event.target.value })
                  }
                  placeholder="Preferred suburbs"
                  className="rounded-2xl border border-blue-100 bg-white px-4 py-3 text-sm outline-none focus:border-blue-400"
                />
              </div>
              <div className="mt-3 grid gap-3 md:grid-cols-[0.35fr_1fr_auto]">
                <select
                  value={draft.status}
                  onChange={(event) =>
                    setDraft({
                      ...draft,
                      status: event.target.value as BuyerLead["status"],
                    })
                  }
                  className="rounded-2xl border border-blue-100 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-blue-400"
                >
                  <option>Hot</option>
                  <option>Warm</option>
                  <option>Cold</option>
                </select>
                <input
                  value={draft.notes}
                  onChange={(event) =>
                    setDraft({ ...draft, notes: event.target.value })
                  }
                  placeholder="Buyer notes and preferences"
                  className="rounded-2xl border border-blue-100 bg-white px-4 py-3 text-sm outline-none focus:border-blue-400"
                />
                <button
                  type="button"
                  onClick={addBuyer}
                  className="rounded-full bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-card"
                >
                  Add buyer
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export function FollowUpAutomationSection({
  listing,
  onUpdate,
}: {
  listing: ListingState;
  onUpdate?: (next: ListingState) => void;
}) {
  const plan = getFollowUpPlan(listing);

  function toggleReminder(id: string) {
    if (!onUpdate) {
      return;
    }

    onUpdate({
      ...listing,
      followUpReminders: listing.followUpReminders.map((reminder) =>
        reminder.id === id ? { ...reminder, done: !reminder.done } : reminder,
      ),
    });
  }

  return (
    <section className="mt-10 rounded-3xl border border-blue-100 bg-white p-7 shadow-card lg:p-8">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-800">
            <Timer size={16} />
            Follow-up autopilot
          </p>
          <h2 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight">
            Remind the agent when to follow up and what to say.
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600">
            MVP reminders stay local. Production can connect this to CRM tasks,
            calendar alerts, email/SMS templates, and AI-generated scripts.
          </p>
        </div>
        <div className="rounded-2xl bg-blue-700 px-5 py-4 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">
            Next action
          </p>
          <p className="mt-1 text-xl font-semibold">{plan[0]?.title}</p>
        </div>
      </div>

      <div className="mt-7 grid gap-4 lg:grid-cols-2">
        {plan.map((item) => (
          <article
            key={item.id}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {item.dueDate} · {item.leadType}
                </p>
                <h3 className="mt-2 text-xl font-semibold tracking-tight">
                  {item.title}
                </h3>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  item.done
                    ? "bg-slate-950 text-white"
                    : "bg-blue-700 text-white"
                }`}
              >
                {item.done ? "Done" : "Due"}
              </span>
            </div>
            <p className="mt-4 rounded-2xl bg-white p-4 text-sm leading-6 text-slate-600">
              {item.suggestedMessage}
            </p>
            {onUpdate && item.id !== "generated-buyer-alert" ? (
              <button
                type="button"
                onClick={() => toggleReminder(item.id)}
                className="mt-4 rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-900"
              >
                {item.done ? "Mark as due" : "Mark done"}
              </button>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}

export function VendorReportSection({ listing }: { listing: ListingState }) {
  const { profile } = useAgentProfile();
  const brandColor = profile.brandColor || "#1d4ed8";
  const address = listing.details.address || "this property";
  const metrics = [
    ["Buyer enquiries", "84", "+18% vs local average"],
    ["Private inspections", "11", "5 high-intent buyers"],
    ["Open-home attendees", "47", "Across two opens"],
    ["Digital views", "6,420", "Portal and social reach"],
  ];
  const feedback = [
    {
      theme: "Presentation",
      count: "18 buyers",
      quote: "Loved the street appeal and the way the home felt ready to move into.",
    },
    {
      theme: "Price feedback",
      count: "9 buyers",
      quote: "Most active buyers indicated comfort around the current guide range.",
    },
    {
      theme: "Buyer objections",
      count: "6 buyers",
      quote: "Main hesitation was timing, not the home itself.",
    },
  ];

  return (
    <section className="mt-10 overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-card">
      <div className="p-7 text-white lg:p-8" style={{ backgroundColor: brandColor }}>
        <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">
          <Users size={16} />
          Vendor campaign report
        </p>
        <h2 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight">
          This is how the agent keeps the seller informed after launch.
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-white/80">
          Example report for {address}. In production, these numbers can connect
          to CRM, portal, email, and inspection data.
        </p>
      </div>

      <div className="grid gap-6 p-7 lg:p-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map(([label, value, detail]) => (
            <div key={label} className="rounded-2xl bg-blue-50/70 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                {label}
              </p>
              <p className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
                {value}
              </p>
              <p className="mt-2 text-sm text-slate-500">{detail}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {feedback.map((item) => (
            <article key={item.theme} className="rounded-2xl border border-slate-200 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                {item.theme}
              </p>
              <h3 className="mt-3 text-xl font-semibold tracking-tight">
                {item.count}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                “{item.quote}”
              </p>
            </article>
          ))}
        </div>

        <div className="rounded-2xl bg-slate-950 p-5 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-200">
            Agent recommendation
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-200">
            Keep the campaign live, follow up the strongest buyers within 24
            hours, and use price feedback from qualified inspections to guide
            the next seller conversation.
          </p>
        </div>
      </div>
    </section>
  );
}

export function Form6PrototypeSection() {
  const { profile } = useAgentProfile();
  const brandColor = profile.brandColor || "#1d4ed8";
  const [formName, setFormName] = useState("Standard agency Form 6.pdf");
  const [activePage, setActivePage] = useState("Appointment");
  const formPages = [
    {
      title: "Appointment",
      purpose:
        "Confirms the seller is appointing the agency to act for the sale of the property.",
      sellerQuestion: "Am I locked in from the moment I sign?",
      agentAnswer:
        "This page sets out the appointment and should be read with the term, commission, marketing, and special conditions before signing.",
      callouts: [
        ["Property", "Confirms the address and who owns the property."],
        ["Agent", "Shows the agency and licence details being appointed."],
        ["Term", "Explains when the appointment starts and ends."],
      ],
    },
    {
      title: "Commission",
      purpose:
        "Explains the commission structure and when commission becomes payable.",
      sellerQuestion: "When do I actually pay commission?",
      agentAnswer:
        "The agent can explain the trigger clearly, usually around a successful contract or settlement depending on the completed agreement.",
      callouts: [
        ["Rate", "Shows the agreed percentage or fee structure."],
        ["Trigger", "Explains when the fee is earned or payable."],
        ["GST", "Clarifies whether amounts include or exclude GST."],
      ],
    },
    {
      title: "Marketing",
      purpose:
        "Sets out approved marketing costs, advertising items, and seller authority for campaign spend.",
      sellerQuestion: "What am I paying for before the property sells?",
      agentAnswer:
        "This is where the agent ties the spend back to the campaign: photos, portals, signboard, social, brochures, and launch timing.",
      callouts: [
        ["Budget", "Shows the agreed campaign spend."],
        ["Items", "Lists the marketing channels being approved."],
        ["Timing", "Explains when marketing is ordered or charged."],
      ],
    },
    {
      title: "Signatures",
      purpose:
        "Confirms the seller has reviewed the appointment and the agency has explained the key terms.",
      sellerQuestion: "What should I check before signing?",
      agentAnswer:
        "The seller should confirm names, property, term, commission, marketing, special conditions, and dates are correct.",
      callouts: [
        ["Seller name", "Must match the owner or authorised signer."],
        ["Date", "Confirms when the appointment is made."],
        ["Signature", "Should only be completed once the seller is comfortable."],
      ],
    },
  ];
  const active = formPages.find((page) => page.title === activePage) || formPages[0];

  return (
    <section className="mt-10 rounded-3xl border border-blue-100 bg-white p-7 shadow-card lg:p-8">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
        <div>
          <p
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white"
            style={{ backgroundColor: brandColor }}
          >
            <FileText size={16} />
            Form 6 explainer concept
          </p>
          <h2 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight">
            Explain the appointment before anyone signs.
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600">
            ListingWin should not replace a signing system. Instead, it can help
            the agent walk the seller through the agency’s Form 6 in plain
            English: what each page means, why it matters, and the questions a
            seller usually asks before appointing an agent.
          </p>
        </div>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-blue-200 bg-white px-5 py-3 text-sm font-semibold text-blue-900 shadow-sm">
          <Upload size={16} />
          Upload agency Form 6
          <input
            type="file"
            accept="application/pdf,image/*"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                setFormName(file.name);
              }
            }}
          />
        </label>
      </div>

      <div className="mt-7 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <div className="relative min-h-[560px] overflow-hidden rounded-2xl bg-white p-6 shadow-inner">
            <div
              className="absolute inset-x-0 top-0 h-3"
              style={{ backgroundColor: brandColor }}
            />
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Uploaded document
            </p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight">
              {formName}
            </h3>

            <div className="mt-6 flex flex-wrap gap-2">
              {formPages.map((page) => (
                <button
                  key={page.title}
                  type="button"
                  onClick={() => setActivePage(page.title)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                    activePage === page.title
                      ? "text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-blue-50"
                  }`}
                  style={
                    activePage === page.title
                      ? { backgroundColor: brandColor }
                      : undefined
                  }
                >
                  {page.title}
                </button>
              ))}
            </div>

            <div className="mt-7 grid gap-4">
              {[1, 2, 3, 4, 5].map((line) => (
                <div
                  key={line}
                  className={`h-3 rounded-full bg-slate-200 ${
                    line % 2 ? "w-5/6" : "w-3/4"
                  }`}
                />
              ))}
            </div>

            {active.callouts.map(([label, text], index) => (
              <div
                key={label}
                className="absolute max-w-[15rem] rounded-2xl border border-blue-200 bg-blue-50/95 p-3 shadow-card"
                style={{
                  left: index === 1 ? "52%" : "12%",
                  top: `${36 + index * 16}%`,
                }}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">
                  {label}
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-600">{text}</p>
              </div>
            ))}

            <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-slate-950 p-4 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">
                Page purpose
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-200">
                {active.purpose}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-3xl p-6 text-white" style={{ backgroundColor: brandColor }}>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
              Seller question
            </p>
            <h3 className="mt-3 text-3xl font-semibold tracking-tight">
              {active.sellerQuestion}
            </h3>
            <p className="mt-4 text-sm leading-7 text-white/85">
              {active.agentAnswer}
            </p>
          </div>

          {[
            [
              "Why this matters",
              "The seller can understand the appointment before the legal signing step, which builds confidence and reduces friction.",
            ],
            [
              "Agent advantage",
              "The agent can answer common concerns without asking the seller to read dense legal wording during the appraisal.",
            ],
            [
              "Production workflow",
              "Once the seller is comfortable, the final Form 6 should be completed and signed through the agency’s approved compliance process.",
            ],
          ].map(([title, body]) => (
            <div key={title} className="rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
