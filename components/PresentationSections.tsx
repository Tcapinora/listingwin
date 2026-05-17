"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Pencil, PlayCircle } from "lucide-react";
import { useState } from "react";
import { useAgentProfile } from "@/components/AgentProfileProvider";
import { generatePropertyWriteup } from "@/lib/copy";
import { getPrimaryPropertyPhoto } from "@/lib/listingImages";
import type { ListingState } from "@/lib/types";
import {
  BrochureBookPreview,
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

function getVideoEmbedUrl(rawUrl: string) {
  const value = rawUrl.trim();

  if (!value) {
    return "";
  }

  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const videoId = url.pathname.split("/").filter(Boolean)[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
    }

    if (host.endsWith("youtube.com")) {
      const videoId =
        url.searchParams.get("v") ||
        url.pathname.match(/\/(?:shorts|embed)\/([^/?#]+)/)?.[1];

      return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
    }
  } catch {
    return "";
  }

  return "";
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
    <section className="presentation-slide mt-28 border-t border-slate-200/80 pt-24">
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
    "Price story",
    "Market evidence",
    "Campaign visuals",
    "Calendar",
    "Buyer demand",
    "Vendor report",
  ];

  return (
    <section className="no-print mt-24 rounded-[2.25rem] bg-[#F8FAFC] p-7 ring-1 ring-slate-200/70 sm:p-8">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">
            Seller presentation flow
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            A calm path through the decision.
          </h2>
        </div>
        <p className="max-w-md text-sm leading-6 text-slate-500">
          The vendor sees the price story first, then the proof, then what their
          campaign will look like if they choose you.
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
  const heroWriteup = limitWords(generatePropertyWriteup(details), 54);
  const agentName = profile.agentName || details.agentName || "Agent name";
  const agencyName = profile.agencyName || details.agencyName || "Agency";

  return (
    <section className="presentation-slide overflow-hidden bg-white">
      <div className="mx-auto max-w-5xl px-6 py-24 text-center sm:py-28 lg:py-32">
        <p className="mx-auto mb-8 w-fit rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-blue-700 ring-1 ring-blue-100">
          Show the campaign before the campaign
        </p>
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
        <p className="mx-auto mt-8 max-w-2xl text-sm leading-6 text-slate-500">
          Prepared to make the first buyer impression clear, confident, and
          emotionally memorable.
        </p>
      </div>
    </section>
  );
}

function CampaignVideoPreview({
  listing,
  editable,
  onUpdate,
}: {
  listing: ListingState;
  editable?: boolean;
  onUpdate?: (updater: (current: ListingState) => ListingState) => void;
}) {
  const videoSlots = [
    "Property walkthrough",
    "Agent introduction",
    "Social teaser",
    "Campaign update",
  ];
  const urls = Array.from({ length: 4 }, (_, index) =>
    listing.campaignVideoUrls?.[index] || "",
  );

  const updateUrl = (index: number, value: string) => {
    if (!onUpdate) {
      return;
    }

    onUpdate((current) => {
      const nextUrls = Array.from({ length: 4 }, (_, urlIndex) =>
        current.campaignVideoUrls?.[urlIndex] || "",
      );
      nextUrls[index] = value;

      return {
        ...current,
        campaignVideoUrls: nextUrls,
      };
    });
  };

  return (
    <div className="rounded-[2.25rem] border border-blue-100 bg-white p-7 shadow-card">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">
            Video campaign
          </p>
          <h3 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            Add four video examples or campaign links.
          </h3>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Paste YouTube or streaming URLs here. These blocks give the seller a
            clear feel for how video can support the launch.
          </p>
        </div>
      </div>

      <div className="mt-7 grid gap-5 md:grid-cols-2">
        {videoSlots.map((label, index) => {
          const url = urls[index];
          const embedUrl = getVideoEmbedUrl(url);

          return (
            <article
              key={label}
              className="overflow-hidden rounded-[1.5rem] bg-slate-50 ring-1 ring-slate-200/80"
            >
              <div className="relative aspect-video bg-blue-950">
                {embedUrl ? (
                  <iframe
                    src={embedUrl}
                    title={label}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="h-full w-full"
                  />
                ) : (
                  <div className="grid h-full place-items-center p-6 text-center text-white">
                    <div>
                      <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-white/10">
                        <PlayCircle size={22} />
                      </span>
                      <p className="mt-4 text-lg font-semibold">{label}</p>
                      <p className="mt-2 text-sm text-blue-100">
                        {url ? "Video link saved" : "Paste a video URL below"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="text-base font-semibold tracking-tight text-slate-950">
                    {label}
                  </h4>
                  {url ? (
                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-blue-900 ring-1 ring-blue-100"
                    >
                      Open
                      <ExternalLink size={13} />
                    </a>
                  ) : null}
                </div>
                {editable && onUpdate ? (
                  <input
                    value={url}
                    onChange={(event) => updateUrl(index, event.target.value)}
                    placeholder="Paste YouTube or video URL"
                    className="mt-4 w-full rounded-2xl border-0 bg-white px-4 py-3 text-sm text-slate-950 outline-none ring-1 ring-slate-200 transition focus:ring-2 focus:ring-blue-500"
                  />
                ) : url ? (
                  <p className="mt-3 truncate text-xs text-slate-500">{url}</p>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </div>
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
      title: "Brochure",
      component: <BrochureBookPreview listing={listing} />,
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
    {
      id: "video",
      label: "Video",
      title: "Video campaign",
      component: (
        <CampaignVideoPreview
          listing={listing}
          editable={editable}
          onUpdate={onUpdate}
        />
      ),
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
        title="Let the seller see their home as the campaign."
        description="This is the emotional shift: the seller is no longer imagining your marketing. They are seeing their property inside it."
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
      </PresentationChapter>

      <PresentationChapter
        number="04"
        eyebrow="Campaign method"
        title="Show the seller there is a plan from day one."
        description="The calendar turns the campaign into something real: photography, launch, inspections, buyer follow-up, vendor reporting, and auction momentum."
        editHref={editable ? "/calendar" : undefined}
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
