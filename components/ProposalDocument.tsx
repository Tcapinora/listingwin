"use client";

import Image from "next/image";
import { EyeOff, Pencil } from "lucide-react";
import type { AgentProfile, ListingState } from "@/lib/types";
import { generatePropertyWriteup } from "@/lib/copy";
import { getPrimaryPropertyPhoto, getPropertyPhotos } from "@/lib/listingImages";

export type ProposalTextSections = {
  intro: string;
  sellerGoals: string;
  strategy: string;
  nextSteps: string;
};

export const defaultProposalSections = [
  "intro",
  "overview",
  "sellerGoals",
  "strategy",
  "comparables",
  "pricing",
  "calendar",
  "visuals",
  "whyUs",
  "nextSteps",
  "contact",
] as const;

export type ProposalSectionId = (typeof defaultProposalSections)[number];

type ProposalDocumentProps = {
  listing: ListingState;
  profile: AgentProfile;
  editable?: boolean;
  hiddenSections?: string[];
  textSections?: ProposalTextSections;
  onTextChange?: (next: ProposalTextSections) => void;
  onHideSection?: (section: ProposalSectionId) => void;
};

export function createDefaultProposalText(
  listing: ListingState,
  profile: AgentProfile,
): ProposalTextSections {
  const address = listing.details.address || "the property";
  const agentName = profile.agentName || listing.details.agentName || "the agent";

  return {
    intro:
      profile.defaultVendorFollowUpMessage ||
      `Thank you for taking the time to walk through ${address}. This proposal summarises the campaign strategy, pricing evidence, marketing plan, and next steps discussed during the appraisal.`,
    sellerGoals:
      listing.details.notes ||
      "The goal is to create a confident launch, make the market response clear, and help the seller choose the path that gives the property the strongest chance of standing out.",
    strategy:
      profile.defaultMarketingText ||
      "The recommended campaign combines premium presentation, clear price positioning, social and portal visibility, buyer database activation, and a structured launch calendar.",
    nextSteps: `${agentName} will confirm the preferred campaign pathway, finalise launch timing, prepare marketing assets, and keep the seller updated before the property goes live.`,
  };
}

export function ProposalDocument({
  listing,
  profile,
  editable = false,
  hiddenSections = [],
  textSections,
  onTextChange,
  onHideSection,
}: ProposalDocumentProps) {
  const copy = textSections || createDefaultProposalText(listing, profile);
  const address = listing.details.address || "Property address";
  const agentName = profile.agentName || listing.details.agentName || "Agent name";
  const agencyName =
    profile.agencyName || listing.details.agencyName || "Agency name";
  const phone = profile.phone || listing.details.phone || "Phone number";
  const email = profile.email || listing.details.email || "Email address";
  const logo = profile.agencyLogo || listing.assets.agencyLogo;
  const hero = getPrimaryPropertyPhoto(listing);
  const photos = getPropertyPhotos(listing);
  const writeup = generatePropertyWriteup(listing.details);
  const proposalDate = new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
  const visible = (section: ProposalSectionId) =>
    !hiddenSections.includes(section);
  const updateText = (key: keyof ProposalTextSections, value: string) => {
    onTextChange?.({ ...copy, [key]: value });
  };

  return (
    <div className="mx-auto max-w-5xl">
      <section className="overflow-hidden rounded-[2.5rem] bg-white shadow-soft ring-1 ring-slate-200/70">
        <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="p-8 sm:p-12">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-700">
              Listing proposal
            </p>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
              {address}
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Prepared by {agentName} for the next step after the appraisal.
            </p>
            <div className="mt-8 flex items-center gap-4">
              {logo ? (
                <div className="grid h-16 w-16 place-items-center rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200">
                  <Image
                    src={logo}
                    alt={`${agencyName} logo`}
                    width={120}
                    height={80}
                    className="max-h-10 w-auto object-contain"
                    unoptimized
                  />
                </div>
              ) : null}
              <div>
                <p className="font-semibold text-slate-950">{agentName}</p>
                <p className="text-sm text-slate-500">{agencyName}</p>
              </div>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <InfoBlock label="Proposal date" value={proposalDate} />
              <InfoBlock
                label="Price guide"
                value={listing.details.agentPriceGuide || "To be confirmed"}
              />
            </div>
          </div>
          <div className="relative min-h-[24rem] bg-slate-100">
            {hero ? (
              <Image
                src={hero}
                alt={address}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="grid h-full place-items-center text-sm font-semibold text-slate-400">
                Add a hero property image
              </div>
            )}
            <div className="absolute inset-x-6 bottom-6 rounded-2xl bg-white/90 p-4 shadow-card backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                Ready to launch
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-950">
                This proposal turns the appraisal conversation into the campaign
                plan.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-4 rounded-[2rem] bg-white p-5 shadow-card ring-1 ring-slate-200/70 sm:grid-cols-4 sm:p-6">
        <InfoBlock
          label="Property"
          value={listing.details.propertyType || "Residential property"}
        />
        <InfoBlock
          label="Campaign"
          value={listing.details.brochureStatus || "Campaign strategy"}
        />
        <InfoBlock
          label="Evidence"
          value={`${listing.comparableProperties.filter((item) => item.address || item.soldPrice).length} comparables`}
        />
        <InfoBlock label="Contact" value={phone} />
      </section>

      <div className="mt-12 grid gap-12">
        {visible("intro") ? (
          <ProposalCard
            title="Thank you"
            eyebrow="Introduction"
            editable={editable}
            onHide={() => onHideSection?.("intro")}
          >
            <EditableParagraph
              editable={editable}
              value={copy.intro}
              onChange={(value) => updateText("intro", value)}
            />
          </ProposalCard>
        ) : null}

        {visible("overview") ? (
          <ProposalCard
            title="Property overview"
            eyebrow="The property"
            editable={editable}
            onHide={() => onHideSection?.("overview")}
          >
            <p className="text-base leading-8 text-slate-600">{writeup}</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-4">
              {[
                ["Beds", listing.details.bedrooms || "-"],
                ["Baths", listing.details.bathrooms || "-"],
                ["Cars", listing.details.carSpaces || "-"],
                ["Type", listing.details.propertyType || "-"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-blue-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                    {label}
                  </p>
                  <p className="mt-2 text-xl font-semibold text-blue-950">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </ProposalCard>
        ) : null}

        {visible("sellerGoals") ? (
          <ProposalCard
            title="Seller goals and key notes"
            eyebrow="What matters"
            editable={editable}
            onHide={() => onHideSection?.("sellerGoals")}
          >
            <EditableParagraph
              editable={editable}
              value={copy.sellerGoals}
              onChange={(value) => updateText("sellerGoals", value)}
            />
          </ProposalCard>
        ) : null}

        {visible("strategy") ? (
          <ProposalCard
            title="Recommended campaign strategy"
            eyebrow="Campaign plan"
            editable={editable}
            onHide={() => onHideSection?.("strategy")}
          >
            <EditableParagraph
              editable={editable}
              value={copy.strategy}
              onChange={(value) => updateText("strategy", value)}
            />
          </ProposalCard>
        ) : null}

        {visible("comparables") ? (
          <ProposalCard
            title="Comparable sales summary"
            eyebrow="Market evidence"
            editable={editable}
            onHide={() => onHideSection?.("comparables")}
          >
            <div className="grid gap-4 md:grid-cols-3">
              {listing.comparableProperties
                .filter((property) => property.address || property.soldPrice)
                .slice(0, 3)
                .map((property, index) => (
                  <article
                    key={`${property.address}-${index}`}
                    className="rounded-[1.5rem] bg-slate-50 p-5 ring-1 ring-slate-200/70"
                  >
                    <p className="text-sm font-semibold text-slate-950">
                      {property.address || "Comparable sale"}
                    </p>
                    <p className="mt-3 text-2xl font-semibold tracking-tight text-blue-800">
                      {property.soldPrice || "Price TBC"}
                    </p>
                    <p className="mt-2 text-sm text-slate-500">
                      {property.beds || "-"} bed / {property.baths || "-"} bath /{" "}
                      {property.cars || "-"} car
                    </p>
                    {property.sourceUrl ? (
                      <a
                        href={property.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-flex text-sm font-semibold text-blue-700"
                      >
                        View original listing
                      </a>
                    ) : null}
                  </article>
                ))}
            </div>
          </ProposalCard>
        ) : null}

        {visible("pricing") ? (
          <ProposalCard
            title="Pricing and market position"
            eyebrow="Price story"
            editable={editable}
            onHide={() => onHideSection?.("pricing")}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <InfoBlock
                label="Seller expectation"
                value={listing.details.sellerExpectedPrice || "Not recorded"}
              />
              <InfoBlock
                label="Agent guide"
                value={listing.details.agentPriceGuide || "Not recorded"}
              />
            </div>
            {listing.details.priceNotes ? (
              <p className="mt-5 text-base leading-8 text-slate-600">
                {listing.details.priceNotes}
              </p>
            ) : null}
          </ProposalCard>
        ) : null}

        {visible("calendar") ? (
          <ProposalCard
            title="Marketing calendar"
            eyebrow="Launch timing"
            editable={editable}
            onHide={() => onHideSection?.("calendar")}
          >
            <div className="grid gap-3 md:grid-cols-2">
              {listing.saleCalendarEvents.slice(0, 6).map((event) => (
                <div
                  key={event.id}
                  className="rounded-2xl bg-blue-50 p-4 text-sm ring-1 ring-blue-100"
                >
                  <p className="font-semibold text-blue-950">{event.title}</p>
                  <p className="mt-1 text-blue-800">
                    {event.date}
                    {event.time ? ` at ${event.time}` : ""}
                  </p>
                </div>
              ))}
              {!listing.saleCalendarEvents.length ? (
                <p className="text-base leading-8 text-slate-600">
                  Campaign dates can be added in the calendar and reused here.
                </p>
              ) : null}
            </div>
          </ProposalCard>
        ) : null}

        {visible("visuals") ? (
          <ProposalCard
            title="Campaign visuals"
            eyebrow="What the seller saw"
            editable={editable}
            onHide={() => onHideSection?.("visuals")}
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {photos.slice(0, 5).map((photo, index) => (
                <div
                  key={`${photo.slice(0, 24)}-${index}`}
                  className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-slate-100"
                >
                  <Image
                    src={photo}
                    alt={`Campaign visual ${index + 1}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          </ProposalCard>
        ) : null}

        {visible("whyUs") ? (
          <ProposalCard
            title="Why choose this agent"
            eyebrow="Agency advantage"
            editable={editable}
            onHide={() => onHideSection?.("whyUs")}
          >
            <div className="grid gap-4 md:grid-cols-3">
              {[
                [
                  "Our difference",
                  listing.agentPitchContent.ourDifference ||
                    "A clear campaign preview before launch.",
                ],
                [
                  "Team experience",
                  listing.agentPitchContent.teamExperience ||
                    "A structured agency process built around buyer demand.",
                ],
                [
                  "Communication",
                  listing.agentPitchContent.communicationProcess ||
                    "Simple seller updates from appraisal to launch.",
                ],
              ].map(([title, text]) => (
                <article key={title} className="rounded-2xl bg-slate-50 p-5">
                  <h3 className="font-semibold text-slate-950">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {text}
                  </p>
                </article>
              ))}
            </div>
          </ProposalCard>
        ) : null}

        {visible("nextSteps") ? (
          <ProposalCard
            title="Next steps"
            eyebrow="From appraisal to launch"
            editable={editable}
            onHide={() => onHideSection?.("nextSteps")}
          >
            <EditableParagraph
              editable={editable}
              value={copy.nextSteps}
              onChange={(value) => updateText("nextSteps", value)}
            />
          </ProposalCard>
        ) : null}

        {visible("contact") ? (
          <ProposalCard
            title="Contact details"
            eyebrow="Presented by"
            editable={editable}
            onHide={() => onHideSection?.("contact")}
          >
            <div className="grid gap-4 sm:grid-cols-3">
              <InfoBlock label="Agent" value={agentName} />
              <InfoBlock label="Phone" value={phone} />
              <InfoBlock label="Email" value={email} />
            </div>
          </ProposalCard>
        ) : null}
      </div>
    </div>
  );
}

function ProposalCard({
  eyebrow,
  title,
  children,
  editable,
  onHide,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  editable?: boolean;
  onHide?: () => void;
}) {
  return (
    <section className="rounded-[2rem] bg-white p-7 shadow-card ring-1 ring-slate-200/70 sm:p-9">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-700">
            {eyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            {title}
          </h2>
        </div>
        {editable ? (
          <button
            type="button"
            onClick={onHide}
            className="no-print inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-800"
          >
            <EyeOff size={15} />
            Hide
          </button>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function EditableParagraph({
  editable,
  value,
  onChange,
}: {
  editable?: boolean;
  value: string;
  onChange: (value: string) => void;
}) {
  if (editable) {
    return (
      <label className="block">
        <span className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-blue-800">
          <Pencil size={15} />
          Edit text
        </span>
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={5}
          className="w-full resize-none rounded-[1.5rem] border border-blue-100 bg-blue-50/40 p-4 text-base leading-8 text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white"
        />
      </label>
    );
  }

  return <p className="text-base leading-8 text-slate-600">{value}</p>;
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200/70">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
        {label}
      </p>
      <p className="mt-2 break-words text-xl font-semibold text-slate-950">
        {value}
      </p>
    </div>
  );
}
