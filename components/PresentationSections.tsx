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
    "Market proof",
    "Campaign vision",
    "Next move",
  ];

  return (
    <section className="no-print mt-24 rounded-[2.25rem] bg-[#F8FAFC] p-7 ring-1 ring-slate-200/70 sm:p-8">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">
            Seller presentation flow
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            The seller sees what choosing you looks like.
          </h2>
        </div>
        <p className="max-w-md text-sm leading-6 text-slate-500">
          Start with price, prove the market, then show the campaign. The goal
          is simple: reduce uncertainty and build confidence in the agent.
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
  const isLiveVision = listing.campaignVisionMode !== "professional";

  return (
    <section className="presentation-slide overflow-hidden bg-white">
      <div className="mx-auto max-w-5xl px-6 py-24 text-center sm:py-28 lg:py-32">
        <p className="mx-auto mb-8 w-fit rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-blue-700 ring-1 ring-blue-100">
          {isLiveVision ? "During appraisal preview" : "After professional photos"}
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

      <div
        className={`relative overflow-hidden ${
          isLiveVision
            ? "mx-auto max-w-6xl rounded-[3rem] bg-blue-950 p-6 shadow-soft sm:p-8"
            : "min-h-[380px] bg-slate-100 sm:min-h-[460px] lg:min-h-[520px]"
        }`}
      >
        {propertyPhoto && isLiveVision ? (
          <>
            <Image
              src={propertyPhoto}
              alt="Blurred campaign vision background"
              fill
              className="scale-110 object-cover opacity-35 blur-xl"
              priority
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-950/80 via-slate-950/65 to-blue-900/70" />
            <div className="relative grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
              <div className="p-3 text-white sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-200">
                  During appraisal
                </p>
                <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                  See the future campaign, before launch day.
                </h2>
                <p className="mt-5 max-w-xl text-base leading-8 text-blue-100/80">
                  Quick photos become a polished preview so the seller can
                  picture the campaign. Use this in the room, then replace it
                  with professional photography later.
                </p>
              </div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-[2.25rem] bg-white/10 shadow-soft ring-1 ring-white/15">
                <Image
                  src={propertyPhoto}
                  alt="Campaign vision property preview"
                  fill
                  className="object-cover"
                  priority
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 via-transparent to-transparent" />
              </div>
            </div>
          </>
        ) : propertyPhoto ? (
          <Image
            src={propertyPhoto}
            alt="Presentation hero property"
            fill
            className="object-cover"
            priority
            unoptimized
          />
        ) : (
          <div className="grid min-h-[360px] place-items-center bg-gradient-to-br from-slate-100 to-blue-50 p-10 text-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">
                Campaign Vision Preview
              </p>
              <p className="mt-4 text-2xl font-semibold text-slate-950">
                Add Campaign Vision photos, use campaign examples, or continue
                without images.
              </p>
            </div>
          </div>
        )}
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
        {isLiveVision ? (
          <p className="mx-auto mb-8 max-w-2xl rounded-full bg-slate-50 px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 ring-1 ring-slate-200">
            Campaign visuals shown are conceptual previews only. Final
            marketing will use professional photography.
          </p>
        ) : null}
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
  const titles = Array.from({ length: 4 }, (_, index) =>
    listing.campaignVideoTitles?.[index] || videoSlots[index],
  );
  const visibleVideoIndexes = editable
    ? [0, 1, 2, 3]
    : urls
        .map((url, index) => (url ? index : -1))
        .filter((index) => index >= 0);

  if (!editable && !visibleVideoIndexes.length) {
    return null;
  }

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

  const updateTitle = (index: number, value: string) => {
    if (!onUpdate) {
      return;
    }

    onUpdate((current) => {
      const nextTitles = Array.from({ length: 4 }, (_, titleIndex) =>
        current.campaignVideoTitles?.[titleIndex] || videoSlots[titleIndex],
      );
      nextTitles[index] = value;

      return {
        ...current,
        campaignVideoTitles: nextTitles,
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
            Add up to four video examples.
          </h3>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Paste only the videos you want to show. If there are two videos,
            only two appear in the seller view.
          </p>
        </div>
      </div>

      <div className="mt-7 grid gap-5 md:grid-cols-2">
        {visibleVideoIndexes.map((index) => {
          const label = titles[index];
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
                  <div className="mt-4 grid gap-3">
                    <input
                      value={label}
                      onChange={(event) =>
                        updateTitle(index, event.target.value)
                      }
                      placeholder="Video title"
                      className="w-full rounded-2xl border-0 bg-white px-4 py-3 text-sm font-semibold text-slate-950 outline-none ring-1 ring-slate-200 transition focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      value={url}
                      onChange={(event) => updateUrl(index, event.target.value)}
                      placeholder="Paste YouTube or video URL"
                      className="w-full rounded-2xl border-0 bg-white px-4 py-3 text-sm text-slate-950 outline-none ring-1 ring-slate-200 transition focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
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
  const hasVideoLinks = listing.campaignVideoUrls?.some((url) => url.trim());
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
      hidden: !hasVideoLinks,
    },
  ].filter((scene) => !scene.hidden);
  const [activeVisualId, setActiveVisualId] = useState(visualScenes[0].id);
  const activeVisual =
    visualScenes.find((scene) => scene.id === activeVisualId) || visualScenes[0];
  const isLiveVision = listing.campaignVisionMode !== "professional";
  const hasComparables = listing.comparableProperties.some(
    (property) => property.address || property.soldPrice,
  );
  const hasCalendarEvents = listing.saleCalendarEvents.length > 0;
  const hasBuyerDemand = listing.buyerLeads.length > 0;

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

      {hasComparables ? (
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
      ) : null}

      <PresentationChapter
        number="03"
        eyebrow="Marketing"
        title={
          isLiveVision
            ? "Let the seller see the campaign vision."
            : "Let the seller see the professional campaign."
        }
        description={
          isLiveVision
            ? "This is the emotional shift: quick appraisal photos become premium conceptual previews so the seller can picture what their campaign could look like."
            : "Professional photography is ready, so the campaign can look sharper and proposal-ready."
        }
        editHref={editable ? "/mockups" : undefined}
        editLabel="Edit marketing"
      >
        {isLiveVision ? (
          <div className="mb-10 rounded-[2rem] bg-slate-50 p-5 text-sm leading-7 text-slate-600 ring-1 ring-slate-200">
            <span className="font-semibold text-slate-950">
              Conceptual preview:
            </span>{" "}
            Campaign visuals shown are conceptual previews only. Final marketing
            will use professional photography.
          </div>
        ) : null}
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

      {hasCalendarEvents ? (
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
      ) : null}

      {hasBuyerDemand ? (
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
      ) : null}

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
