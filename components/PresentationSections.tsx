"use client";

import Image from "next/image";
import { Smartphone } from "lucide-react";
import { useState } from "react";
import { useAgentProfile } from "@/components/AgentProfileProvider";
import { generatePropertyWriteup } from "@/lib/copy";
import { getPrimaryPropertyPhoto } from "@/lib/listingImages";
import type { ListingState } from "@/lib/types";
import {
  BrochurePreview,
  BrochureBookPreview,
  FlyerPreview,
  OpenHomePreview,
  PhotographyStylePreview,
  PropertyPortalPreview,
  SocialPreview,
} from "@/components/MockupCards";
import {
  BuyerMatchEngineSection,
  CampaignTimelineSection,
  MarketExpertSection,
  PriceConfidenceSection,
} from "@/components/ValueSections";

function PresentationChapter({
  number,
  eyebrow,
  title,
  description,
  children,
}: {
  number: string;
  eyebrow: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <div className="mb-6 flex flex-col justify-between gap-4 border-t border-slate-200 pt-8 lg:flex-row lg:items-end">
        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-blue-700 text-[11px] text-white">
              {number}
            </span>
            {eyebrow}
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            {title}
          </h2>
          {description ? (
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              {description}
            </p>
          ) : null}
        </div>
      </div>
      {children}
    </section>
  );
}

export function PresentationFlowNav() {
  const items = [
    "Price story",
    "Current competition",
    "Visual previews",
    "Sale calendar",
    "Buyer database",
  ];

  return (
    <section className="no-print mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-card">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">
            Vendor room flow
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
            One calm presentation path.
          </h2>
        </div>
        <p className="max-w-md text-sm leading-6 text-slate-500">
          This is the view the vendor sees. Agent prompts and working notes
          stay in the Agent Workspace.
        </p>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {items.map((item, index) => (
          <span
            key={item}
            className="rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-900"
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
    profile.agencyName || listing.details.agencyName || "Plum Property";

  return (
    <section className="mt-10 grid gap-8 rounded-3xl bg-gray-950 p-6 text-white shadow-soft lg:grid-cols-[0.9fr_1.1fr] lg:p-10">
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

export function HeroPresentation({ listing }: { listing: ListingState }) {
  const { details } = listing;
  const propertyPhoto = getPrimaryPropertyPhoto(listing);

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gray-950 text-white shadow-soft">
      <div className="relative aspect-[16/8] min-h-[420px]">
        {propertyPhoto ? (
          <Image
            src={propertyPhoto}
            alt="Presentation hero property"
            fill
            className="object-cover opacity-80"
            priority
            unoptimized
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-8 left-6 w-[calc(100%-3rem)] max-w-full sm:bottom-10 sm:left-8 sm:w-[calc(100%-4rem)] lg:left-12 lg:w-auto lg:max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-gray-200">
            Vendor presentation
          </p>
          <h1 className="mt-4 max-w-[32rem] break-words text-4xl font-semibold leading-tight tracking-tight sm:max-w-[40rem] sm:text-5xl lg:max-w-2xl">
            {details.address || "Property address"}
          </h1>
          <p className="mt-5 max-w-[34rem] text-base leading-7 text-gray-100 sm:max-w-[38rem] sm:text-lg sm:leading-8 lg:max-w-2xl">
            {generatePropertyWriteup(details)}
          </p>
        </div>
      </div>
    </section>
  );
}

export function PresentationGrid({ listing }: { listing: ListingState }) {
  const visualScenes = [
    {
      id: "portal",
      label: "Portal",
      title: "Property portal",
      component: <PropertyPortalPreview listing={listing} />,
    },
    {
      id: "book",
      label: "Book",
      title: "4-page brochure book",
      component: <BrochureBookPreview listing={listing} />,
    },
    {
      id: "brochure-flyer",
      label: "Brochure",
      title: "Brochure and flyer",
      component: (
        <div className="grid gap-6 lg:grid-cols-2">
          <BrochurePreview listing={listing} />
          <FlyerPreview listing={listing} />
        </div>
      ),
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
          <div className="rounded-3xl border border-blue-100 bg-white p-6 shadow-card">
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
      id: "open-home",
      label: "Open home",
      title: "Open-home energy",
      component: <OpenHomePreview listing={listing} />,
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
        eyebrow="Price story"
        title="Separate the mathematical price from the emotional price."
        description="Give the vendor a clear distinction between evidence-based pricing and the emotional upside a strong campaign can create."
      >
        <PriceConfidenceSection listing={listing} />
      </PresentationChapter>

      <PresentationChapter
        number="02"
        eyebrow="Current competition"
        title="Show the current competition."
        description="Market proof helps the vendor feel the agent has done the thinking before asking for the listing."
      >
        <MarketExpertSection listing={listing} />
      </PresentationChapter>

      <PresentationChapter
        number="03"
        eyebrow="Visual previews"
        title="Show the first impression buyers will remember."
        description="The vendor can now see their home through the buyer’s eyes before the campaign exists."
      >
        <section className="rounded-3xl border border-blue-100 bg-white p-5 shadow-card lg:p-7">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">
                Campaign preview selector
              </p>
              <h3 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
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
                      : "bg-blue-50 text-blue-900 hover:bg-blue-100"
                  }`}
                >
                  {scene.label}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-6">{activeVisual.component}</div>
        </section>
        <SellerMobilePreview listing={listing} />
      </PresentationChapter>

      <PresentationChapter
        number="04"
        eyebrow="Sale calendar"
        title="Show the campaign calendar."
        description="A visible calendar helps the vendor understand exactly what happens after they appoint the agent."
      >
        <CampaignTimelineSection listing={listing} />
      </PresentationChapter>

      <PresentationChapter
        number="05"
        eyebrow="Buyer database"
        title="Show who the agent can call for this property."
        description="This gives the owner confidence that the agent is not waiting for the market to respond from zero."
      >
        <BuyerMatchEngineSection listing={listing} />
      </PresentationChapter>
    </>
  );
}
