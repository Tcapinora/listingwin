"use client";

import Image from "next/image";
import Link from "next/link";
import { Pencil, Smartphone } from "lucide-react";
import { useState } from "react";
import { useAgentProfile } from "@/components/AgentProfileProvider";
import { generatePropertyWriteup } from "@/lib/copy";
import { getPrimaryPropertyPhoto } from "@/lib/listingImages";
import type { ListingState } from "@/lib/types";
import {
  BrochureBookPreview,
  FlyerPreview,
  PhotographyStylePreview,
  PropertyPortalPreview,
  SocialPreview,
} from "@/components/MockupCards";
import {
  BuyerMatchEngineSection,
  CampaignTimelineSection,
  MarketExpertSection,
  PriceConfidenceSection,
  VendorReportSection,
} from "@/components/ValueSections";

function limitWords(value: string, maxWords: number) {
  const words = value.trim().split(/\s+/).filter(Boolean);

  if (words.length <= maxWords) {
    return value;
  }

  return `${words.slice(0, maxWords).join(" ")}...`;
}

function PresentationChapter({
  number,
  eyebrow,
  title,
  description,
  editHref,
  editLabel = "Edit section",
  children,
}: {
  number: string;
  eyebrow: string;
  title: string;
  description?: string;
  editHref?: string;
  editLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="presentation-slide mt-24 border-t border-slate-200/80 pt-20">
      <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.24em] text-blue-700">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-blue-700 text-[11px] text-white shadow-card">
              {number}
            </span>
            {eyebrow}
          </p>
          <h2 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            {title}
          </h2>
          {description ? (
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
              {description}
            </p>
          ) : null}
        </div>
        {editHref ? (
          <Link
            href={editHref}
            className="no-print inline-flex w-fit items-center gap-2 rounded-full border border-blue-100 bg-white/90 px-4 py-2.5 text-sm font-semibold text-blue-900 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-white"
          >
            <Pencil size={15} />
            {editLabel}
          </Link>
        ) : null}
      </div>
      {children}
    </section>
  );
}

export function PresentationFlowNav() {
  const items = [
    "Pricing of property",
    "Comparable sales",
    "Marketing vision",
    "Buyer demand",
    "Future vendor report",
    "Campaign momentum",
  ];

  return (
    <section className="no-print mt-20 border-y border-slate-200/80 py-12">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">
            Vendor room flow
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            The appraisal conversation in order.
          </h2>
        </div>
        <p className="max-w-md text-sm leading-6 text-slate-500">
          This follows the appraisal run sheet: price, competition, marketing,
          campaign method, database, then the agent’s closing conversation.
        </p>
      </div>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <span
            key={item}
            className="rounded-2xl bg-blue-50/70 px-4 py-3 text-xs font-semibold text-blue-900 ring-1 ring-blue-100"
          >
            {index + 1}. {item}
          </span>
        ))}
      </div>
    </section>
  );
}

export function SellerMobilePreview({ listing }: { listing: ListingState }) {
  const { profile } = useAgentProfile();
  const propertyPhoto = getPrimaryPropertyPhoto(listing);
  const agentName = profile.agentName || listing.details.agentName || "Agent name";
  const agencyName =
    profile.agencyName || listing.details.agencyName || "Harbour & Co Estate Agents";

  return (
    <section className="presentation-slide mt-16 grid gap-10 rounded-[2.5rem] bg-gray-950 p-7 text-white shadow-soft lg:grid-cols-[0.9fr_1.1fr] lg:p-12">
      <div className="flex flex-col justify-center">
        <p className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-gray-200">
          <Smartphone size={16} />
          Mobile vendor view
        </p>
        <h2 className="mt-5 text-4xl font-semibold tracking-tight">
          Show the vendor the campaign in the format buyers will actually see.
        </h2>
        <p className="mt-5 max-w-xl text-base leading-8 text-gray-300">
          Use this phone preview during the appraisal to make the campaign feel
          tangible: property creative, agent brand, social context, and direct
          contact details in one clean view.
        </p>
      </div>

      <div className="mx-auto w-full max-w-[360px] rounded-[2.5rem] border border-white/15 bg-black p-3 shadow-2xl">
        <div className="overflow-hidden rounded-[2rem] bg-white text-gray-950">
          <div className="flex items-center justify-between bg-gray-950 px-5 py-3 text-xs font-semibold text-white">
            <span>9:41</span>
            <span>ListingWin</span>
            <span>5G</span>
          </div>
          <div className="p-4">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gray-100">
              {propertyPhoto ? (
                <Image
                  src={propertyPhoto}
                  alt="Seller mobile campaign preview"
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.18em]">
                  Just Listed
                </p>
                <h3 className="mt-2 text-2xl font-semibold leading-tight">
                  {listing.details.address || "Property address"}
                </h3>
              </div>
            </div>
            <div className="mt-4 rounded-2xl bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                Presented by
              </p>
              <p className="mt-2 text-lg font-semibold">{agentName}</p>
              <p className="text-sm text-gray-600">{agencyName}</p>
              <p className="mt-3 text-sm text-gray-500">
                {profile.phone || listing.details.phone || "Phone"} ·{" "}
                {profile.email || listing.details.email || "Email"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HeroPresentation({
  listing,
  editable = true,
}: {
  listing: ListingState;
  editable?: boolean;
}) {
  const { details } = listing;
  const { profile } = useAgentProfile();
  const propertyPhoto = getPrimaryPropertyPhoto(listing);
  const heroWriteup = limitWords(generatePropertyWriteup(details), 72);
  const agentName = profile.agentName || details.agentName || "Agent name";
  const agencyName = profile.agencyName || details.agencyName || "Agency";

  return (
    <section className="presentation-slide overflow-hidden bg-white">
      <div className="mx-auto max-w-5xl px-6 py-24 text-center sm:py-28 lg:py-32">
        <h1 className="mx-auto max-w-4xl text-5xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
          {details.address || "Property address"}
        </h1>
        <p className="mt-8 text-3xl font-light tracking-tight text-slate-900 sm:text-4xl">
          Vendor Marketing Presentation
        </p>
        <p className="mt-5 text-base font-medium text-slate-500">
          By {agentName}
          {agencyName ? `, ${agencyName}` : ""}
        </p>
      </div>

      <div className="relative min-h-[380px] overflow-hidden bg-slate-100 sm:min-h-[460px] lg:min-h-[520px]">
        {propertyPhoto ? (
          <Image
            src={propertyPhoto}
            alt="Presentation hero property"
            fill
            className="object-cover"
            priority
            unoptimized
          />
        ) : null}
        {editable ? (
          <Link
            href="/details"
            className="no-print absolute right-5 top-5 inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-card backdrop-blur transition hover:-translate-y-0.5 hover:bg-white"
          >
            <Pencil size={15} />
            Edit intro
          </Link>
        ) : null}
      </div>

      <div className="mx-auto max-w-4xl px-6 py-16 text-center sm:py-20">
        <p className="text-xl font-light leading-9 text-slate-700 sm:text-2xl sm:leading-10">
          {heroWriteup}
        </p>
      </div>
    </section>
  );
}

export function PresentationGrid({
  listing,
  editable = true,
  onUpdate,
}: {
  listing: ListingState;
  editable?: boolean;
  onUpdate?: (updater: (current: ListingState) => ListingState) => void;
}) {
  const visualScenes = [
    {
      id: "portal",
      label: "Portal",
      title: "Property portal",
      component: <PropertyPortalPreview listing={listing} />,
    },
    {
      id: "brochure",
      label: "Brochure",
      title: "4-page brochure",
      component: <BrochureBookPreview listing={listing} />,
    },
    {
      id: "flyer",
      label: "Flyer",
      title: "Campaign flyer",
      component: <FlyerPreview listing={listing} />,
    },
    {
      id: "social",
      label: "Social",
      title: "Instagram and Facebook",
      component: (
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <SocialPreview listing={listing} type="Instagram" />
            <SocialPreview listing={listing} type="Facebook" />
          </div>
          <div className="rounded-[2rem] border border-blue-100 bg-white p-7 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">
              Ad sponsorship example
            </p>
            <h3 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              Small spend, stronger reach.
            </h3>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              Example case study: a $100 sponsored listing video reached 8,400
              local viewers, drove 312 link clicks, and added 19 qualified buyer
              conversations before the first open home.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "photography",
      label: "Photography",
      title: "Photography direction",
      component: <PhotographyStylePreview />,
    },
  ];
  const [activeVisualId, setActiveVisualId] = useState(visualScenes[0].id);
  const activeVisual =
    visualScenes.find((scene) => scene.id === activeVisualId) || visualScenes[0];

  return (
    <>
      <PresentationFlowNav />

      <PresentationChapter
        number="01"
        eyebrow="Pricing of property"
        title="Make price feel calm, clear, and evidence-led."
        description="The seller sees the expectation gap, understands the proof, and feels the price conversation is being handled by a prepared agent."
        editHref={editable ? "/details" : undefined}
        editLabel="Edit pricing"
      >
        <PriceConfidenceSection listing={listing} />
      </PresentationChapter>

      <PresentationChapter
        number="02"
        eyebrow="Comparable sales / area history"
        title="Show the seller the market you are protecting them from."
        description="When the seller sees the competing homes clearly, they stop guessing and start trusting the strategy."
        editHref={editable ? "/details" : undefined}
        editLabel="Edit comparables"
      >
        <MarketExpertSection listing={listing} />
      </PresentationChapter>

      <PresentationChapter
        number="03"
        eyebrow="Marketing"
        title="Let the seller watch their campaign come to life."
        description="This is the emotional shift: the seller can see their actual home inside your marketing while the appraisal is still happening."
        editHref={editable ? "/mockups" : undefined}
        editLabel="Edit marketing"
      >
        <section className="bg-white py-2">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">
                Campaign preview selector
              </p>
              <h3 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
                {activeVisual.title}
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {visualScenes.map((scene) => (
                <button
                  key={scene.id}
                  type="button"
                  onClick={() => setActiveVisualId(scene.id)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                    activeVisualId === scene.id
                      ? "bg-blue-700 text-white shadow-card"
                      : "bg-blue-50 text-blue-900 hover:-translate-y-0.5 hover:bg-blue-100"
                  }`}
                >
                  {scene.label}
                </button>
              ))}
            </div>
          </div>
          <div key={activeVisual.id} className="page-enter mt-12">
            {activeVisual.component}
          </div>
        </section>
        <SellerMobilePreview listing={listing} />
      </PresentationChapter>

      <PresentationChapter
        number="04"
        eyebrow="Campaign method"
        title="Show the seller there is a plan from day one."
        description="The calendar turns the campaign into something real: photography, launch, inspections, buyer follow-up, vendor reporting, and auction momentum."
        editHref={editable ? "/details" : undefined}
        editLabel="Edit calendar"
      >
        <CampaignTimelineSection listing={listing} />
      </PresentationChapter>

      <PresentationChapter
        number="05"
        eyebrow="Database / buyer demand"
        title="Show the seller that you are not starting from zero."
        description={
          listing.agentPitchContent.buyerDemand ||
          "When the seller sees real buyers, names, budgets, and next calls, their behaviour changes instantly. The campaign feels active before it even launches."
        }
        editHref={editable ? "/details" : undefined}
        editLabel="Edit buyers"
      >
        <BuyerMatchEngineSection listing={listing} />
      </PresentationChapter>

      <PresentationChapter
        number="06"
        eyebrow="Future vendor report"
        title="Show the seller how informed they will feel after launch."
        description="This is the promise after the campaign starts: buyer numbers, inspection feedback, price feedback, and the next move, all reported clearly."
        editHref={editable ? "/presentation" : undefined}
        editLabel="Review report"
      >
        <VendorReportSection listing={listing} onUpdate={onUpdate} />
      </PresentationChapter>
    </>
  );
}
