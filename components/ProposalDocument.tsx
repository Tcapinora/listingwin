"use client";

import Image from "next/image";
import { EyeOff, Pencil, Plus, Trash2 } from "lucide-react";
import type { AgentProfile, ListingState } from "@/lib/types";
import { generatePropertyWriteup } from "@/lib/copy";
import { getPrimaryPropertyPhoto, getPropertyPhotos } from "@/lib/listingImages";

export type ProposalTextSections = {
  intro: string;
  sellerGoals: string;
  strategy: string;
  costs: string;
  nextSteps: string;
};

export const defaultProposalSections = [
  "intro",
  "overview",
  "sellerGoals",
  "strategy",
  "comparables",
  "pricing",
  "costs",
  "calendar",
  "visuals",
  "whyUs",
  "recentSales",
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
  onListingChange?: (updater: (current: ListingState) => ListingState) => void;
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
    costs:
      "Commission and marketing investment are proposed as part of a complete campaign strategy. The focus is to create stronger buyer competition, better presentation, and clear seller confidence from launch to negotiation.",
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
  onListingChange,
  onHideSection,
}: ProposalDocumentProps) {
  const copy = {
    ...createDefaultProposalText(listing, profile),
    ...(textSections || {}),
  };
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
  const isProfessionalMode = listing.campaignVisionMode === "professional";
  const proposalDate = new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
  const updateText = (key: keyof ProposalTextSections, value: string) => {
    onTextChange?.({ ...copy, [key]: value });
  };
  const profileRecentSales = profile.recentSoldProperties || [];
  const recentSales = listing.recentSoldProperties?.length
    ? listing.recentSoldProperties
    : profileRecentSales;
  const hasComparables = listing.comparableProperties.some(
    (property) => property.address || property.soldPrice,
  );
  const hasPhotos = photos.length > 0;
  const hasCalendar = listing.saleCalendarEvents.length > 0;
  const hasRecentSales = recentSales.some(
    (sale) => sale.address || sale.result || sale.image || sale.notes,
  );
  const visible = (section: ProposalSectionId) => {
    if (hiddenSections.includes(section)) return false;
    if (!editable) {
      if (section === "comparables" && !hasComparables) return false;
      if (section === "visuals" && !hasPhotos) return false;
      if (section === "calendar" && !hasCalendar) return false;
      if (section === "recentSales" && !hasRecentSales) return false;
    }

    return true;
  };
  const updateRecentSale = (
    index: number,
    field: keyof (typeof recentSales)[number],
    value: string,
  ) => {
    onListingChange?.((current) => {
      const sales = current.recentSoldProperties?.length
        ? current.recentSoldProperties
        : profileRecentSales;

      return {
        ...current,
        recentSoldProperties: sales.map((sale, saleIndex) =>
          saleIndex === index ? { ...sale, [field]: value } : sale,
        ),
      };
    });
  };
  const addRecentSale = () => {
    onListingChange?.((current) => ({
      ...current,
      recentSoldProperties: [
        ...(current.recentSoldProperties?.length
          ? current.recentSoldProperties
          : profileRecentSales),
        {
          id: `sold-${Date.now()}`,
          image: "",
          address: "",
          result: "",
          details: "",
          notes: "",
        },
      ],
    }));
  };
  const removeRecentSale = (index: number) => {
    onListingChange?.((current) => ({
      ...current,
      recentSoldProperties: (current.recentSoldProperties?.length
        ? current.recentSoldProperties
        : profileRecentSales
      ).filter((_sale, saleIndex) => saleIndex !== index),
    }));
  };
  const uploadRecentSaleImage = (index: number, file: File | null) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      updateRecentSale(index, "image", String(reader.result || ""));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="mx-auto max-w-5xl">
      <section className="overflow-hidden rounded-[2.5rem] bg-white shadow-soft ring-1 ring-slate-200/70">
        <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="p-8 sm:p-12">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-700">
              {isProfessionalMode
                ? "Professional campaign proposal"
                : "Campaign Vision proposal"}
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
                {isProfessionalMode ? "Ready to launch" : "Vision preview"}
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-950">
                {isProfessionalMode
                  ? "This proposal turns the appraisal conversation into the campaign plan."
                  : "Conceptual campaign visuals help the seller picture the launch before final photography."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {!isProfessionalMode ? (
        <section className="mt-6 rounded-[2rem] bg-slate-50 p-5 text-sm leading-7 text-slate-600 ring-1 ring-slate-200">
          <span className="font-semibold text-slate-950">
            Campaign Vision Preview:
          </span>{" "}
          visuals are conceptual only. Final proposal assets should be updated
          with professional photography before print-ready export or launch.
        </section>
      ) : null}

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

        {visible("costs") ? (
          <ProposalCard
            title="Commission and marketing investment"
            eyebrow="Investment"
            editable={editable}
            onHide={() => onHideSection?.("costs")}
          >
            <EditableParagraph
              editable={editable}
              value={copy.costs}
              onChange={(value) => updateText("costs", value)}
            />
            <ProposalCostTable />
          </ProposalCard>
        ) : null}

        {visible("calendar") ? (
          <ProposalCard
            title="Calendar of sale"
            eyebrow="Launch timing"
            editable={editable}
            onHide={() => onHideSection?.("calendar")}
          >
            <ProposalSaleCalendar listing={listing} />
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

        {visible("recentSales") ? (
          <ProposalCard
            title="Recent results"
            eyebrow="Proof of execution"
            editable={editable}
            onHide={() => onHideSection?.("recentSales")}
          >
            <p className="mb-6 max-w-3xl text-base leading-8 text-slate-600">
              Show the seller what the agent has recently sold and make the
              proposal feel backed by real market execution.
            </p>
            {editable ? (
              <div className="mb-6 flex justify-end">
                <button
                  type="button"
                  onClick={addRecentSale}
                  className="inline-flex items-center gap-2 rounded-full bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800"
                >
                  <Plus size={15} />
                  Add sold property
                </button>
              </div>
            ) : null}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {(recentSales.length
                ? recentSales
                : [
                    {
                      id: "example-sale",
                      image: "",
                      address: "Recent sale address",
                      result: "Sold result",
                      details: "Beds / baths / land",
                      notes: "Add a short result note.",
                    },
                  ]
              ).map((sale, index) => (
                <article
                  key={sale.id || index}
                  className="overflow-hidden rounded-[1.5rem] bg-slate-50 ring-1 ring-slate-200/80"
                >
                  <div className="relative aspect-[3/4] bg-slate-100">
                    {sale.image ? (
                      <Image
                        src={sale.image}
                        alt={sale.address || "Recently sold property"}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="grid h-full place-items-center px-5 text-center text-sm font-semibold text-slate-400">
                        Recently sold property
                      </div>
                    )}
                  </div>
                  <div className="grid gap-3 p-4">
                    {editable ? (
                      <>
                        <label className="cursor-pointer rounded-xl bg-white px-3 py-2 text-center text-xs font-semibold text-blue-800 ring-1 ring-blue-100">
                          Upload photo
                          <input
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={(event) =>
                              uploadRecentSaleImage(
                                index,
                                event.target.files?.[0] || null,
                              )
                            }
                          />
                        </label>
                        <input
                          value={sale.address}
                          onChange={(event) =>
                            updateRecentSale(index, "address", event.target.value)
                          }
                          placeholder="Address"
                          className="rounded-xl border-0 bg-white px-3 py-2 text-sm font-semibold text-slate-950 outline-none ring-1 ring-slate-200"
                        />
                        <input
                          value={sale.result}
                          onChange={(event) =>
                            updateRecentSale(index, "result", event.target.value)
                          }
                          placeholder="Sold result"
                          className="rounded-xl border-0 bg-white px-3 py-2 text-sm text-slate-700 outline-none ring-1 ring-slate-200"
                        />
                        <input
                          value={sale.details}
                          onChange={(event) =>
                            updateRecentSale(index, "details", event.target.value)
                          }
                          placeholder="Beds / baths / land"
                          className="rounded-xl border-0 bg-white px-3 py-2 text-sm text-slate-700 outline-none ring-1 ring-slate-200"
                        />
                        <textarea
                          value={sale.notes}
                          onChange={(event) =>
                            updateRecentSale(index, "notes", event.target.value)
                          }
                          placeholder="Short result note"
                          rows={3}
                          className="resize-none rounded-xl border-0 bg-white px-3 py-2 text-sm text-slate-700 outline-none ring-1 ring-slate-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeRecentSale(index)}
                          className="inline-flex items-center justify-center gap-2 rounded-full bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100"
                        >
                          <Trash2 size={13} />
                          Delete
                        </button>
                      </>
                    ) : (
                      <>
                        <h3 className="text-base font-semibold tracking-tight text-slate-950">
                          {sale.address}
                        </h3>
                        <p className="text-sm font-semibold text-blue-800">
                          {sale.result}
                        </p>
                        <p className="text-sm text-slate-500">{sale.details}</p>
                        <p className="text-sm leading-6 text-slate-600">
                          {sale.notes}
                        </p>
                      </>
                    )}
                  </div>
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
            Remove
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
          Personalise text
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

function ProposalCostTable() {
  const rows = [
    [
      "Commission",
      "Confirmed by agent",
      "Success fee for strategy, negotiation, campaign management, and seller communication.",
    ],
    [
      "Professional marketing",
      "Quoted before launch",
      "Photography, copy, floor plan, brochure, social content, and launch assets.",
    ],
    [
      "Portal and social campaign",
      "Selected campaign level",
      "Recommended exposure across major portals, database, social channels, and buyer retargeting.",
    ],
    [
      "Launch preparation",
      "As required",
      "Styling, trades, cleaning, gardening, or pre-market preparation where it improves buyer response.",
    ],
  ];

  return (
    <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-blue-100 bg-white">
      <div className="grid grid-cols-[1fr_0.75fr_1.4fr] gap-4 bg-blue-950 px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-blue-100">
        <span>Item</span>
        <span>Amount</span>
        <span>Why it matters</span>
      </div>
      {rows.map(([item, amount, note]) => (
        <div
          key={item}
          className="grid grid-cols-1 gap-3 border-t border-blue-100 px-5 py-4 text-sm sm:grid-cols-[1fr_0.75fr_1.4fr]"
        >
          <p className="font-semibold text-slate-950">{item}</p>
          <p className="font-semibold text-blue-800">{amount}</p>
          <p className="leading-6 text-slate-600">{note}</p>
        </div>
      ))}
    </div>
  );
}

const proposalEventStyles: Record<string, string> = {
  Photography: "bg-violet-50 text-violet-800 ring-violet-100",
  Styling: "bg-blue-50 text-blue-800 ring-blue-100",
  Trades: "bg-slate-100 text-slate-700 ring-slate-200",
  Marketing: "bg-cyan-50 text-cyan-800 ring-cyan-100",
  Documents: "bg-indigo-50 text-indigo-800 ring-indigo-100",
  "Open home": "bg-emerald-50 text-emerald-800 ring-emerald-100",
  Launch: "bg-blue-50 text-blue-800 ring-blue-100",
  Auction: "bg-rose-50 text-rose-800 ring-rose-100",
  "Buyer call backs": "bg-amber-50 text-amber-800 ring-amber-100",
  Communication: "bg-teal-50 text-teal-800 ring-teal-100",
  "Follow-up": "bg-orange-50 text-orange-800 ring-orange-100",
  Other: "bg-slate-100 text-slate-700 ring-slate-200",
};

function ProposalSaleCalendar({ listing }: { listing: ListingState }) {
  const events = [...listing.saleCalendarEvents].sort((a, b) =>
    a.date.localeCompare(b.date),
  );
  const firstEventDate = events[0]?.date
    ? new Date(`${events[0].date}T00:00:00`)
    : new Date();
  const year = firstEventDate.getFullYear();
  const month = firstEventDate.getMonth();
  const monthLabel = new Intl.DateTimeFormat("en-AU", {
    month: "long",
    year: "numeric",
  }).format(firstEventDate);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingEmptyDays = new Date(year, month, 1).getDay();
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const cells = [
    ...Array.from({ length: leadingEmptyDays }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];
  const eventMap = events.reduce<Record<string, typeof events>>((map, event) => {
    map[event.date] = [...(map[event.date] || []), event];
    return map;
  }, {});

  if (!events.length) {
    return (
      <p className="text-base leading-8 text-slate-600">
        Campaign dates can be added in the calendar and reused here as the
        proposed calendar of sale.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-blue-100 bg-white">
      <div className="flex flex-col justify-between gap-3 border-b border-slate-200 bg-slate-50 p-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">
            Proposed calendar of sale
          </p>
          <h3 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            {monthLabel}
          </h3>
        </div>
        <p className="text-sm font-semibold text-slate-500">
          {events.length} planned milestone{events.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="overflow-x-auto p-4">
        <div className="min-w-[720px]">
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day) => (
              <div
                key={day}
                className="px-3 py-2 text-center text-xs font-semibold uppercase tracking-[0.14em] text-slate-500"
              >
                {day}
              </div>
            ))}
            {cells.map((day, index) => {
              if (!day) {
                return (
                  <div
                    key={`empty-${index}`}
                    className="min-h-24 rounded-2xl bg-slate-50"
                  />
                );
              }

              const dateKey = `${year}-${String(month + 1).padStart(
                2,
                "0",
              )}-${String(day).padStart(2, "0")}`;
              const dayEvents = eventMap[dateKey] || [];

              return (
                <div
                  key={dateKey}
                  className="min-h-24 rounded-2xl border border-blue-100 bg-blue-50/40 p-2"
                >
                  <p className="text-sm font-semibold text-slate-900">{day}</p>
                  <div className="mt-2 space-y-1">
                    {dayEvents.slice(0, 3).map((event) => (
                      <div
                        key={event.id}
                        className={`truncate rounded-full px-2 py-1 text-[11px] font-semibold ring-1 ${
                          proposalEventStyles[event.type] ||
                          proposalEventStyles.Other
                        }`}
                        title={`${event.type}: ${event.title}`}
                      >
                        {event.time ? `${event.time} ` : ""}
                        {event.type}
                      </div>
                    ))}
                    {dayEvents.length > 3 ? (
                      <p className="text-[11px] font-semibold text-slate-500">
                        +{dayEvents.length - 3} more
                      </p>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {(listing.saleCalendarNotes || listing.saleCalendarTrades) ? (
        <div className="grid gap-4 border-t border-slate-200 bg-slate-50 p-5 md:grid-cols-2">
          {listing.saleCalendarNotes ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                Agent notes
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {listing.saleCalendarNotes}
              </p>
            </div>
          ) : null}
          {listing.saleCalendarTrades ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                Trades and contacts
              </p>
              <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">
                {listing.saleCalendarTrades}
              </p>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
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
