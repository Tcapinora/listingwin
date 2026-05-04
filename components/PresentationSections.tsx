"use client";

import Image from "next/image";
import Link from "next/link";
import { FileText, MessageSquareText, ShieldCheck, Smartphone } from "lucide-react";
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
  PropertyPortalPreview,
  SocialPreview,
} from "@/components/MockupCards";
import {
  BuyerDemandSection,
  BuyerMatchEngineSection,
  CampaignPlanSection,
  CampaignTimelineSection,
  FollowUpAutomationSection,
  ListingWinScoreCard,
  MarketExpertSection,
  PriceConfidenceSection,
  SellerFollowUpSection,
  SellerValueSection,
  SellerDecisionRoomSection,
  VendorReportSection,
  Form6PrototypeSection,
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
    <section className="mt-12">
      <div className="mb-6 flex flex-col justify-between gap-4 border-t border-blue-100 pt-8 lg:flex-row lg:items-end">
        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-blue-700 text-[11px] text-white">
              {number}
            </span>
            {eyebrow}
          </p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
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
    "Market proof",
    "Buyer match",
    "Marketing vision",
    "Visual previews",
    "Sale calendar",
    "Why this agent",
    "Next steps",
    "Vendor report",
    "Form 6",
  ];

  return (
    <section className="no-print mt-8 rounded-3xl border border-blue-100 bg-white p-5 shadow-card">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">
            Seller room flow
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
            One clean path from price to appointment.
          </h2>
        </div>
        <p className="max-w-md text-sm leading-6 text-slate-500">
          Use this as the running order in the appraisal, then hide any private
          agent prompts before continuing with the seller.
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
          Mobile seller view
        </p>
        <h2 className="mt-5 text-4xl font-semibold tracking-tight">
          Show the vendor the campaign in the format buyers will actually see.
        </h2>
        <p className="mt-5 max-w-xl text-base leading-8 text-gray-300">
          Use this phone preview during the appraisal to make the campaign feel
          tangible: property creative, agent brand, social context, and direct
          contact details in one seller-friendly view.
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
      <div className="relative aspect-[16/8] min-h-[460px]">
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
          <div className="no-print mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/create"
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-950 shadow-card"
            >
              Edit opening write-up
            </Link>
            <p className="text-sm text-gray-200">
              This text uses the property address and short campaign notes.
            </p>
          </div>
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
      id: "print",
      label: "Print",
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
        <div className="grid gap-6 lg:grid-cols-2">
          <SocialPreview listing={listing} type="Instagram" />
          <SocialPreview listing={listing} type="Facebook" />
        </div>
      ),
    },
    {
      id: "open-home",
      label: "Open home",
      title: "Open-home energy",
      component: <OpenHomePreview listing={listing} />,
    },
  ];
  const [activeVisualId, setActiveVisualId] = useState(visualScenes[0].id);
  const activeVisual =
    visualScenes.find((scene) => scene.id === activeVisualId) || visualScenes[0];

  return (
    <>
      <PresentationFlowNav />
      <AgentOnlyTools listing={listing} />

      <PresentationChapter
        number="01"
        eyebrow="Price story"
        title="Start with the price conversation."
        description="Give the seller a clear distinction between the evidence-based price and the emotional upside a strong campaign can create."
      >
        <PriceConfidenceSection listing={listing} />
      </PresentationChapter>

      <PresentationChapter
        number="02"
        eyebrow="Market proof"
        title="Show the seller you know the current competition."
        description="Use saved competing property links as visual proof that this presentation was prepared before the appraisal."
      >
        <MarketExpertSection listing={listing} />
      </PresentationChapter>

      <PresentationChapter
        number="03"
        eyebrow="Buyer database"
        title="Prove there are buyers to call now."
        description="This gives the seller confidence that the agent is not starting from zero on launch day."
      >
        <BuyerMatchEngineSection listing={listing} />
      </PresentationChapter>

      <PresentationChapter
        number="04"
        eyebrow="Marketing vision"
        title="Explain how the campaign creates buyer demand."
        description="This is where the agent moves from price to process: who the buyer is, how they will see the property, and what happens after launch."
      >
        <BuyerDemandSection listing={listing} />
        <CampaignPlanSection listing={listing} />
      </PresentationChapter>

      <PresentationChapter
        number="05"
        eyebrow="Visual previews"
        title="Let the seller see the campaign before it exists."
        description="Keep this part focused. Click through each format instead of showing every mockup at once."
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
        number="06"
        eyebrow="Sale calendar"
        title="Make the next steps concrete."
        description="A visible timeline helps the seller understand what will happen after they appoint the agent."
      >
        <CampaignTimelineSection listing={listing} />
      </PresentationChapter>

      <PresentationChapter
        number="07"
        eyebrow="Why this agent"
        title="Finish with confidence and a clear decision path."
        description="Bring the presentation back to the seller outcome: prepared campaign, clear process, and a simple next step."
      >
        <ListingWinScoreCard listing={listing} />
        <SellerDecisionRoomSection listing={listing} />
        <SellerValueSection listing={listing} />
      </PresentationChapter>

      <PresentationChapter
        number="08"
        eyebrow="Next steps"
        title="Make the follow-up feel immediate."
        description="The seller should leave with a clear decision path, not a vague promise that the agent will send something later."
      >
        <FollowUpAutomationSection listing={listing} />
        <SellerFollowUpSection listing={listing} />
      </PresentationChapter>

      <PresentationChapter
        number="09"
        eyebrow="Vendor report"
        title="Show how the seller will be updated after launch."
        description="This example report demonstrates inspection numbers, buyer feedback, price feedback, and the agent’s recommendation in the agency’s marketing colour."
      >
        <VendorReportSection listing={listing} />
      </PresentationChapter>

      <PresentationChapter
        number="10"
        eyebrow="Appointment"
        title="Explain the Form 6 before the legal signing step."
        description="This turns the agency appointment form into a clear seller conversation: what each page means, why it matters, and what questions the agent should answer."
      >
        <Form6PrototypeSection />
      </PresentationChapter>
    </>
  );
}

function AgentOnlyTools({ listing }: { listing: ListingState }) {
  const [open, setOpen] = useState(false);
  const notes = listing.details.notes.trim();
  const priceNotes = listing.details.priceNotes.trim();

  return (
    <section className="no-print mt-8 rounded-3xl border border-dashed border-blue-200 bg-blue-50/60 p-5">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex items-center gap-2 rounded-full bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-card"
      >
        <FileText size={16} />
        {open ? "Hide agent-only notes" : "Show agent-only notes"}
      </button>
      <p className="mt-3 text-sm leading-6 text-blue-900/70">
        Private prompts for the agent. Use quickly if needed, then hide before
        continuing with the seller.
      </p>

      {open ? (
        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl bg-white p-5">
            <MessageSquareText className="text-blue-700" size={18} />
            <h3 className="mt-3 font-semibold">Opening prompt</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              I prepared this specifically for this property so you can see the
              campaign before deciding who to list with.
            </p>
          </div>
          <div className="rounded-2xl bg-white p-5">
            <ShieldCheck className="text-blue-700" size={18} />
            <h3 className="mt-3 font-semibold">Fee/commission prompt</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              The fee is connected to buyer competition, negotiation, and the
              quality of the campaign, not just putting the home online.
            </p>
          </div>
          <div className="rounded-2xl bg-white p-5">
            <FileText className="text-blue-700" size={18} />
            <h3 className="mt-3 font-semibold">Notes</h3>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
              {[notes, priceNotes].filter(Boolean).join("\n\n") ||
                "No private notes added yet."}
            </p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
