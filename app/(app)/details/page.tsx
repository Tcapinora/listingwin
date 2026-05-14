"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ChevronDown,
  ExternalLink,
  Link as LinkIcon,
  Plus,
  Sparkles,
  Trash2,
  Wand2,
} from "lucide-react";
import { FlowProgress } from "@/components/FlowProgress";
import { useListing } from "@/components/ListingProvider";
import type {
  ComparableProperty,
  ListingDetails,
} from "@/lib/types";

const propertyTypes = [
  "House",
  "Apartment",
  "Townhouse",
  "Unit",
  "Acreage",
  "Land",
];

export default function PropertyDetailsPage() {
  const router = useRouter();
  const { listing, setListing } = useListing();
  const [appraisalPasteText, setAppraisalPasteText] = useState("");
  const [appraisalReview, setAppraisalReview] =
    useState<AppraisalGeneration | null>(null);
  const [appraisalNotice, setAppraisalNotice] = useState("");
  const [showComparableOptions, setShowComparableOptions] = useState(false);
  const [comparableMode, setComparableMode] = useState<"smart" | "manual" | null>(
    null,
  );
  const [smartPasteText, setSmartPasteText] = useState("");
  const [smartPasteNotice, setSmartPasteNotice] = useState("");
  const [manualComparable, setManualComparable] = useState<ComparableProperty>(
    createBlankComparable(),
  );

  const updateDetail = (fieldId: keyof ListingDetails, value: string) => {
    setListing((current) => ({
      ...current,
      details: {
        ...current.details,
        [fieldId]: value,
      },
    }));
  };

  const updateComparable = (
    index: number,
    fieldId: keyof ComparableProperty,
    value: string,
  ) => {
    setListing((current) => ({
      ...current,
      comparableProperties: current.comparableProperties.map(
        (property, propertyIndex) =>
          propertyIndex === index
            ? {
                ...property,
                [fieldId]: value,
                ...(fieldId === "landSize" ? { blockSize: value } : {}),
                ...(fieldId === "blockSize" ? { landSize: value } : {}),
              }
            : property,
      ),
    }));
  };

  const removeComparable = (indexToRemove: number) => {
    setListing((current) => {
      const remainingComparables = current.comparableProperties.filter(
        (_, index) => index !== indexToRemove,
      );

      return {
        ...current,
        comparableProperties: remainingComparables.length
          ? remainingComparables
          : [createBlankComparable()],
      };
    });
  };

  const generateAppraisal = () => {
    if (!appraisalPasteText.trim()) {
      setAppraisalNotice(
        "Paste property information, comparable sales text, URLs, or appraisal notes first.",
      );
      return;
    }

    const generation = parseAppraisalText(appraisalPasteText, listing.details);

    if (
      !generation.summary.length &&
      !generation.comparableProperties.length &&
      !generation.sourceUrls.length
    ) {
      setAppraisalNotice(
        "We could not detect enough property details. Keep the pasted text in place and add the missing fields manually below.",
      );
      return;
    }

    setListing((current) => {
      const existingComparables = current.comparableProperties.filter(
        hasComparableContent,
      );
      const nextComparables = [
        ...existingComparables,
        ...generation.comparableProperties,
      ];

      return {
        ...current,
        details: {
          ...current.details,
          ...removeEmptyDetailValues(generation.details),
        },
        comparableProperties: nextComparables.length
          ? nextComparables
          : current.comparableProperties,
        appraisalSourceUrls: uniqueValues([
          ...current.appraisalSourceUrls,
          ...generation.sourceUrls,
        ]),
      };
    });

    setAppraisalReview(generation);
    setAppraisalNotice("");
  };

  const saveSmartComparable = (property: ComparableProperty) => {
    setListing((current) => {
      const emptyIndex = current.comparableProperties.findIndex(
        (item) => !item.address && !item.url && !item.sourceUrl,
      );

      if (emptyIndex >= 0) {
        return {
          ...current,
          comparableProperties: current.comparableProperties.map((item, index) =>
            index === emptyIndex ? property : item,
          ),
        };
      }

      return {
        ...current,
        comparableProperties: [...current.comparableProperties, property],
      };
    });
    setComparableMode(null);
    setShowComparableOptions(false);
  };

  const saveSmartPasteText = () => {
    if (!smartPasteText.trim()) return;

    const parsedComparable = parseComparableText(smartPasteText);

    if (!hasEnoughComparableEvidence(parsedComparable)) {
      setSmartPasteNotice(
        "We couldn't detect enough property details. Please add the missing information manually.",
      );
      setManualComparable(parsedComparable);
      setComparableMode("manual");
      return;
    }

    saveSmartComparable(parsedComparable);
    setSmartPasteText("");
    setSmartPasteNotice("");
  };

  const saveManualComparable = () => {
    saveSmartComparable(manualComparable);
    setManualComparable(createBlankComparable());
  };

  return (
    <>
      <FlowProgress currentStep={2} />

      <form
        className="mx-auto max-w-6xl"
        onSubmit={(event) => {
          event.preventDefault();
          router.push("/upload");
        }}
      >
        <section className="rounded-[2rem] bg-white p-6 shadow-card ring-1 ring-slate-200/70 sm:p-8 lg:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-700">
            Auto appraisal builder
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Paste messy appraisal info. Generate the property profile.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            Keep this section focused on the property being appraised: address,
            facts, key selling points, pricing evidence, comparable sales, and
            appraisal notes.
          </p>
          <div className="mt-6 grid gap-3 rounded-[1.5rem] bg-slate-50 p-4 ring-1 ring-slate-200 sm:grid-cols-3">
            {["Smart Paste", "Review details", "Comparable evidence"].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 text-sm font-semibold text-blue-950"
              >
                <Sparkles size={15} className="text-blue-700" />
                {item}
              </div>
            ))}
          </div>

          <section className="mt-8 rounded-[1.75rem] bg-blue-50/70 p-5 ring-1 ring-blue-100 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="flex items-center gap-2 text-sm font-semibold text-blue-950">
                  <Wand2 size={16} />
                  Smart Paste Appraisal
                </p>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-900/75">
                  Paste Realestate.com.au or Domain links, property text,
                  comparable sale notes, RP Data snippets, or messy appraisal
                  notes. ListingWin will organise what it can, then you review
                  everything before continuing.
                </p>
              </div>
              <button
                type="button"
                onClick={generateAppraisal}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-blue-800"
              >
                <Wand2 size={16} />
                Generate Appraisal
              </button>
            </div>
            <textarea
              value={appraisalPasteText}
              onChange={(event) => {
                setAppraisalPasteText(event.target.value);
                setAppraisalNotice("");
              }}
              placeholder={`Paste anything useful here...\n\nExamples:\n41 Highland Terrace, St Lucia, QLD 4067\n5 bed | 1 bath | 2 car | 653m² | House\nOffer over $1,750,000\nComparable sales notes, RP Data snippets, agency notes, buyer feedback, property description, and source URLs.`}
              rows={10}
              className="mt-5 w-full resize-none rounded-[1.5rem] border-0 bg-white px-5 py-4 text-sm leading-6 text-slate-950 shadow-inner outline-none ring-1 ring-blue-100 transition focus:ring-2 focus:ring-blue-500"
            />
            {appraisalNotice ? (
              <p className="mt-4 rounded-2xl bg-white px-4 py-3 text-sm leading-6 text-amber-900 ring-1 ring-amber-200">
                {appraisalNotice}
              </p>
            ) : null}
            {appraisalReview ? (
              <div className="mt-5 rounded-[1.5rem] bg-white p-5 shadow-sm ring-1 ring-blue-100">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
                      Review before continuing
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                      Appraisal profile generated.
                    </h3>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                      Please review the fields and comparable cards below before
                      creating the Vendor Presentation.
                    </p>
                  </div>
                  <div className="grid gap-2 text-sm font-semibold text-blue-950 sm:grid-cols-3 lg:min-w-[24rem]">
                    <span className="rounded-2xl bg-blue-50 px-4 py-3 text-center">
                      {Object.keys(removeEmptyDetailValues(appraisalReview.details)).length} fields
                    </span>
                    <span className="rounded-2xl bg-blue-50 px-4 py-3 text-center">
                      {appraisalReview.comparableProperties.length} comps
                    </span>
                    <span className="rounded-2xl bg-blue-50 px-4 py-3 text-center">
                      {appraisalReview.sourceUrls.length} links
                    </span>
                  </div>
                </div>
                {appraisalReview.summary.length ? (
                  <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {appraisalReview.summary.map((item) => (
                      <div
                        key={item}
                        className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 ring-1 ring-slate-100"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}
            {listing.appraisalSourceUrls.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {listing.appraisalSourceUrls.map((url) => (
                  <a
                    key={url}
                    href={normalizeUrl(url)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-blue-800 ring-1 ring-blue-100 transition hover:bg-blue-100"
                  >
                    <LinkIcon size={12} />
                    Saved source
                  </a>
                ))}
              </div>
            ) : null}
          </section>

          <div className="mt-8 grid gap-6">
            <label>
              <span className="text-sm font-semibold text-slate-800">
                Listing headline
              </span>
              <input
                value={listing.details.headline}
                onChange={(event) =>
                  updateDetail("headline", event.target.value)
                }
                placeholder="Modern family home in St Lucia with river views"
                className="mt-2 w-full rounded-2xl border-0 bg-slate-50 px-5 py-4 text-base text-slate-950 shadow-inner outline-none ring-1 ring-slate-200 transition focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
              <span className="mt-2 block text-sm text-slate-500">
                Write a headline buyers will love.
              </span>
            </label>

            <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
              <label>
                <span className="text-sm font-semibold text-slate-800">
                  Property Type
                </span>
                <select
                  value={listing.details.propertyType}
                  onChange={(event) =>
                    updateDetail("propertyType", event.target.value)
                  }
                  className="mt-2 w-full rounded-2xl border-0 bg-slate-50 px-5 py-4 text-base text-slate-950 shadow-inner outline-none ring-1 ring-slate-200 transition focus:bg-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select property type</option>
                  {propertyTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </label>

              <div className="grid grid-cols-3 gap-3">
                {[
                  ["bedrooms", "Beds"],
                  ["bathrooms", "Baths"],
                  ["carSpaces", "Car"],
                ].map(([fieldId, label]) => (
                  <label key={fieldId}>
                    <span className="text-sm font-semibold text-slate-800">
                      {label}
                    </span>
                    <input
                      value={listing.details[fieldId as keyof ListingDetails]}
                      onChange={(event) =>
                        updateDetail(
                          fieldId as keyof ListingDetails,
                          event.target.value,
                        )
                      }
                      placeholder="0"
                      inputMode="numeric"
                      className="mt-2 w-full rounded-2xl border-0 bg-slate-50 px-4 py-4 text-base text-slate-950 shadow-inner outline-none ring-1 ring-slate-200 transition focus:bg-white focus:ring-2 focus:ring-blue-500"
                    />
                  </label>
                ))}
              </div>
            </div>

            <label>
              <span className="text-sm font-semibold text-slate-800">
                Key features
              </span>
              <textarea
                value={listing.details.keyFeatures}
                onChange={(event) =>
                  updateDetail("keyFeatures", event.target.value)
                }
                placeholder="Pool, renovated kitchen, large backyard, quiet street..."
                rows={4}
                className="mt-2 w-full resize-none rounded-2xl border-0 bg-slate-50 px-5 py-4 text-base text-slate-950 shadow-inner outline-none ring-1 ring-slate-200 transition focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
              <span className="mt-2 block text-sm text-slate-500">
                What makes this property stand out?
              </span>
            </label>
          </div>

          <details
            open
            className="group mt-8 rounded-[1.5rem] bg-slate-50 p-5 ring-1 ring-slate-200"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-blue-900">
              <span>
                Comparable sales and pricing strategy
                <span className="mt-1 block text-xs font-medium leading-5 text-blue-800/70">
                  Paste, generate, review, and save comparable sales evidence.
                </span>
              </span>
              <ChevronDown
                className="shrink-0 transition group-open:rotate-180"
                size={18}
              />
            </summary>
            <div className="mt-5 grid gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <label>
                  <span className="text-sm font-semibold text-slate-800">
                    Seller expected price
                  </span>
                  <input
                    value={listing.details.sellerExpectedPrice}
                    onChange={(event) =>
                      updateDetail("sellerExpectedPrice", event.target.value)
                    }
                    placeholder="$1,250,000"
                    className="mt-2 w-full rounded-2xl border-0 bg-white px-5 py-4 text-base text-slate-950 shadow-inner outline-none ring-1 ring-blue-100 transition focus:ring-2 focus:ring-blue-500"
                  />
                </label>
                <label>
                  <span className="text-sm font-semibold text-slate-800">
                    Agent price guide
                  </span>
                  <input
                    value={listing.details.agentPriceGuide}
                    onChange={(event) =>
                      updateDetail("agentPriceGuide", event.target.value)
                    }
                    placeholder="$1,150,000"
                    className="mt-2 w-full rounded-2xl border-0 bg-white px-5 py-4 text-base text-slate-950 shadow-inner outline-none ring-1 ring-blue-100 transition focus:ring-2 focus:ring-blue-500"
                  />
                </label>
              </div>

              <label>
                <span className="text-sm font-semibold text-slate-800">
                  Agent notes
                </span>
                <textarea
                  value={listing.details.notes}
                  onChange={(event) => updateDetail("notes", event.target.value)}
                  placeholder="Elevated street presence, renovated kitchen, leafy outlook, ideal family buyer profile..."
                  rows={4}
                  className="mt-2 w-full resize-none rounded-2xl border-0 bg-white px-5 py-4 text-base text-slate-950 shadow-inner outline-none ring-1 ring-blue-100 transition focus:ring-2 focus:ring-blue-500"
                />
              </label>

              <div className="rounded-[1.5rem] bg-white p-5 ring-1 ring-blue-100">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
                      Comparable sales
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                      Add market evidence without heavy typing.
                    </h3>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                      Use Smart Paste to organise copied listing or sale notes
                      into a comparable sale. ListingWin never visits or scrapes
                      external property websites.
                    </p>
                  </div>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() =>
                        setShowComparableOptions((isOpen) => !isOpen)
                      }
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-blue-800 lg:w-auto"
                    >
                      <Plus size={16} />
                      Add Comparable Sale
                    </button>
                    {showComparableOptions ? (
                      <div className="absolute right-0 z-20 mt-3 w-72 rounded-3xl bg-white p-3 shadow-soft ring-1 ring-blue-100">
                        <button
                          type="button"
                          onClick={() => {
                            setComparableMode("smart");
                            setShowComparableOptions(false);
                          }}
                          className="w-full rounded-2xl bg-blue-50 px-4 py-3 text-left transition hover:bg-blue-100"
                        >
                          <span className="flex items-center gap-2 text-sm font-semibold text-blue-950">
                            <Wand2 size={15} />
                            Smart Paste
                          </span>
                          <span className="mt-1 block text-xs leading-5 text-blue-900/70">
                            Paste copied sales text and save it into a card.
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setComparableMode("manual");
                            setShowComparableOptions(false);
                          }}
                          className="w-full rounded-2xl px-4 py-3 text-left transition hover:bg-slate-50"
                        >
                          <span className="block text-sm font-semibold text-slate-950">
                            Manual Entry
                          </span>
                          <span className="mt-1 block text-xs leading-5 text-slate-500">
                            Add a blank comparable sale card and fill only what
                            you need.
                          </span>
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              {comparableMode ? (
                <div className="rounded-[1.5rem] bg-white p-5 ring-1 ring-blue-100">
                  {comparableMode === "smart" ? (
                    <div className="grid gap-4">
                      <div>
                        <p className="flex items-center gap-2 text-sm font-semibold text-blue-950">
                          <Wand2 size={16} />
                          Smart Paste
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          Paste the comparable sale information copied from
                          realestate.com.au, Domain, CRM notes, or a sales
                          report. Best result: include the address, property
                          details row, price or status, agency, and any RP Data
                          property notes. ListingWin will format it into the
                          card below.
                        </p>
                      </div>
                      <textarea
                        value={smartPasteText}
                        onChange={(event) => {
                          setSmartPasteText(event.target.value);
                          setSmartPasteNotice("");
                        }}
                        placeholder="Paste comparable sale information here..."
                        rows={9}
                        className="w-full resize-none rounded-[1.5rem] border-0 bg-slate-50 px-5 py-4 text-sm leading-6 text-slate-950 shadow-inner outline-none ring-1 ring-slate-200 transition focus:bg-white focus:ring-2 focus:ring-blue-500"
                      />
                      {smartPasteNotice ? (
                        <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900 ring-1 ring-amber-200">
                          {smartPasteNotice}
                        </p>
                      ) : null}
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <button
                          type="button"
                          onClick={saveSmartPasteText}
                          disabled={!smartPasteText.trim()}
                          className="inline-flex items-center justify-center rounded-full bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                        >
                          Save Comparable Sale
                        </button>
                        <button
                          type="button"
                          onClick={() => setComparableMode("manual")}
                          className="text-sm font-semibold text-blue-700 transition hover:text-blue-900"
                        >
                          Manual entry
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      <div>
                        <p className="text-sm font-semibold text-slate-950">
                          Manual Entry
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          Fill only the fields you need. This stays separate
                          from Smart Paste so the workflow feels clearer.
                        </p>
                      </div>
                      <ManualComparableForm
                        property={manualComparable}
                        onChange={(fieldId, value) =>
                          setManualComparable((current) => ({
                            ...current,
                            [fieldId]: value,
                            ...(fieldId === "landSize"
                              ? { blockSize: value }
                              : {}),
                            ...(fieldId === "blockSize"
                              ? { landSize: value }
                              : {}),
                          }))
                        }
                      />
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <button
                          type="button"
                          onClick={saveManualComparable}
                          className="inline-flex items-center justify-center rounded-full bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-blue-800"
                        >
                          Save Comparable Sale
                        </button>
                        <button
                          type="button"
                          onClick={() => setComparableMode("smart")}
                          className="text-sm font-semibold text-blue-700 transition hover:text-blue-900"
                        >
                          Back to Smart Paste
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : null}

              <div className="grid gap-4 xl:grid-cols-3">
                {listing.comparableProperties
                  .map((property, index) => ({ property, index }))
                  .filter(
                    ({ property }) =>
                      property.address ||
                      property.soldPrice ||
                      property.sourceUrl ||
                      property.url ||
                      property.notes,
                  )
                  .map(({ property, index }) => (
                  <details
                    key={index}
                    className="group rounded-[1.5rem] bg-white p-5 shadow-sm ring-1 ring-slate-100 transition open:shadow-card"
                  >
                    <summary className="cursor-pointer list-none">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                            Comparable sale {index + 1}
                          </p>
                          <h4 className="mt-2 line-clamp-2 text-lg font-semibold tracking-tight text-slate-950">
                            {property.address || "Address to review"}
                          </h4>
                          <p className="mt-2 text-sm font-semibold text-blue-900">
                            {property.soldPrice || "Price to confirm"}
                          </p>
                        </div>
                        <span className="shrink-0 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-800 group-open:bg-blue-700 group-open:text-white">
                          Review
                        </span>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
                        {[
                          property.beds ? `${property.beds} bed` : "",
                          property.baths ? `${property.baths} bath` : "",
                          property.cars ? `${property.cars} car` : "",
                          property.landSize || property.blockSize,
                          property.propertyType,
                        ]
                          .filter(Boolean)
                          .map((detail) => (
                            <span
                              key={detail}
                              className="rounded-full bg-slate-50 px-3 py-1.5 ring-1 ring-slate-200"
                            >
                              {detail}
                            </span>
                          ))}
                      </div>
                      <p className="mt-4 text-xs leading-5 text-slate-500">
                        Please review all generated details before saving them
                        into the vendor presentation.
                      </p>
                    </summary>

                    <button
                      type="button"
                      onClick={() => removeComparable(index)}
                      className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 size={12} />
                      Remove comparable
                    </button>

                    {property.sourceUrl || property.url ? (
                      <div className="mt-4">
                        <a
                          href={normalizeUrl(property.sourceUrl || property.url)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex shrink-0 items-center gap-1 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-800 transition hover:bg-blue-100"
                        >
                          View Original Listing
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    ) : null}

                    <div className="mt-5 grid gap-3 sm:grid-cols-4 xl:grid-cols-2">
                      <input
                        value={property.address}
                        onChange={(event) =>
                          updateComparable(index, "address", event.target.value)
                        }
                        placeholder="Comparable address"
                        className="rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:col-span-4 xl:col-span-2"
                      />
                      {[
                        ["soldPrice", "Sold price"],
                        ["saleDate", "Sale date"],
                        ["beds", "Beds"],
                        ["baths", "Baths"],
                        ["cars", "Cars"],
                        ["landSize", "Land size"],
                        ["propertyType", "Type"],
                      ].map(([fieldId, label]) => (
                        <input
                          key={fieldId}
                          value={
                            property[fieldId as keyof ComparableProperty] || ""
                          }
                          onChange={(event) =>
                            updateComparable(
                              index,
                              fieldId as keyof ComparableProperty,
                              event.target.value,
                            )
                          }
                          placeholder={label}
                          className="rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ))}
                      <input
                        value={property.agency || ""}
                        onChange={(event) =>
                          updateComparable(index, "agency", event.target.value)
                        }
                        placeholder="Agency"
                        className="rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        value={property.agentName || ""}
                        onChange={(event) =>
                          updateComparable(index, "agentName", event.target.value)
                        }
                        placeholder="Agent"
                        className="rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        value={property.sourceUrl || property.url}
                        onChange={(event) =>
                          updateComparable(index, "sourceUrl", event.target.value)
                        }
                        placeholder="Source Listing URL"
                        className="rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:col-span-4 xl:col-span-2"
                      />
                      <textarea
                        value={property.notes || ""}
                        onChange={(event) =>
                          updateComparable(index, "notes", event.target.value)
                        }
                        placeholder="Notes / why this is comparable"
                        rows={3}
                        className="resize-none rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:col-span-4 xl:col-span-2"
                      />
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </details>

        </section>

        <button
          type="submit"
          className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-700 px-6 py-4 text-base font-semibold text-white shadow-card transition hover:bg-blue-800 sm:w-auto"
        >
          Save & Continue
          <ArrowRight size={18} />
        </button>
      </form>

    </>
  );
}

function createBlankComparable(): ComparableProperty {
  return {
    address: "",
    suburb: "",
    state: "",
    soldPrice: "",
    saleDate: "",
    beds: "",
    baths: "",
    cars: "",
    blockSize: "",
    landSize: "",
    propertyType: "",
    agency: "",
    agentName: "",
    description: "",
    notes: "",
    url: "",
    sourceUrl: "",
  };
}

function ManualComparableForm({
  property,
  onChange,
}: {
  property: ComparableProperty;
  onChange: (fieldId: keyof ComparableProperty, value: string) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {manualComparableFields.map((field) => (
        <label
          key={field.id}
          className={field.large ? "sm:col-span-2 lg:col-span-4" : ""}
        >
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            {field.label}
          </span>
          {field.large ? (
            <textarea
              value={property[field.id] || ""}
              onChange={(event) => onChange(field.id, event.target.value)}
              rows={3}
              className="mt-2 w-full resize-none rounded-2xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <input
              value={property[field.id] || ""}
              onChange={(event) => onChange(field.id, event.target.value)}
              className="mt-2 w-full rounded-2xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500"
            />
          )}
        </label>
      ))}
    </div>
  );
}

type AppraisalGeneration = {
  details: Partial<ListingDetails>;
  comparableProperties: ComparableProperty[];
  sourceUrls: string[];
  summary: string[];
};

function parseAppraisalText(
  text: string,
  currentDetails: ListingDetails,
): AppraisalGeneration {
  const lines = normaliseComparableLines(text);
  const joined = lines.join(" ");
  const sourceUrls = extractAllSourceUrls(joined);
  const addressCandidates = extractAddressCandidates(lines, joined);
  const primaryAddress =
    currentDetails.address.trim() ||
    addressCandidates[0] ||
    extractAddress(lines, joined);
  const addressParts = parseAddressParts(primaryAddress);
  const compactFeatures = extractCompactFeatureRow(lines);
  const bedrooms =
    extractLabelledNumber(joined, ["bed(?:room)?s?", "beds?"]) ||
    compactFeatures.beds;
  const bathrooms =
    extractLabelledNumber(joined, ["bath(?:room)?s?", "baths?"]) ||
    compactFeatures.baths;
  const carSpaces =
    extractLabelledNumber(joined, [
      "car(?:space)?s?",
      "parking",
      "garage(?:s)?",
    ]) ||
    (compactFeatures.cars === "-" ? "" : compactFeatures.cars);
  const landSize =
    extractLabelledArea(joined, ["land(?: size)?", "block(?: size)?"]) ||
    compactFeatures.landSize ||
    extractFirstArea(lines);
  const propertyType =
    extractPropertyType(joined) ||
    compactFeatures.propertyType ||
    currentDetails.propertyType;
  const description = extractDescription(lines) || extractAppraisalDescription(lines);
  const keyFeatures = extractKeySellingPoints(lines, joined, description);
  const extractedPrice = extractPrice(joined);
  const comparableProperties = extractComparableBlocks(
    text,
    primaryAddress,
    currentDetails.address,
  );

  const details: Partial<ListingDetails> = {
    address: primaryAddress,
    propertyType,
    bedrooms,
    bathrooms,
    carSpaces,
    keyFeatures,
    notes: description || keyFeatures,
    headline:
      currentDetails.headline || createListingHeadline(primaryAddress, propertyType),
    agentPriceGuide: currentDetails.agentPriceGuide || extractedPrice,
    brochurePrice: currentDetails.brochurePrice || extractedPrice,
  };

  return {
    details,
    comparableProperties,
    sourceUrls,
    summary: createAppraisalSummary({
      address: primaryAddress,
      suburb: addressParts.suburb,
      propertyType,
      bedrooms,
      bathrooms,
      carSpaces,
      landSize,
      keyFeatures,
      comparableCount: comparableProperties.length,
      sourceCount: sourceUrls.length,
    }),
  };
}

function removeEmptyDetailValues(details: Partial<ListingDetails>) {
  return Object.fromEntries(
    Object.entries(details).filter(([, value]) => Boolean(value)),
  ) as Partial<ListingDetails>;
}

function hasComparableContent(property: ComparableProperty) {
  return Boolean(
    property.address ||
      property.soldPrice ||
      property.saleDate ||
      property.sourceUrl ||
      property.url ||
      property.notes,
  );
}

function uniqueValues(values: string[]) {
  return Array.from(
    new Set(values.map((value) => value.trim()).filter(Boolean)),
  );
}

function extractAllSourceUrls(text: string) {
  return uniqueValues(
    text.match(/https?:\/\/[^\s)]+/gi)?.map((url) => url.replace(/[.,]+$/, "")) ||
      [],
  );
}

function extractAddressCandidates(lines: string[], joined: string) {
  const addressRegex = new RegExp(
    `\\b\\d{1,5}[A-Za-z]?\\s+[A-Za-z0-9'&./\\-\\s]+?\\b(?:${streetTypePattern})\\b(?:,?\\s+[A-Za-z][A-Za-z'\\-\\s]+){0,3}(?:,?\\s+(?:${statePattern})\\s*\\d{4})?\\b`,
    "gi",
  );
  const candidates = [...lines.join("\n").matchAll(addressRegex), ...joined.matchAll(addressRegex)]
    .map((match) => cleanAddress(match[0]))
    .filter((address) => address.length >= 8 && /\d/.test(address));
  const seen = new Set<string>();

  return candidates.filter((address) => {
    const key = normaliseAddressKey(address);

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function extractComparableBlocks(
  text: string,
  primaryAddress: string,
  currentAddress: string,
) {
  const lines = normaliseComparableLines(text);
  const addressLineRegex = new RegExp(
    `\\b\\d{1,5}[A-Za-z]?\\s+[A-Za-z0-9'&./\\-\\s]+?\\b(?:${streetTypePattern})\\b`,
    "i",
  );
  const blocks: string[][] = [];
  let currentBlock: string[] = [];

  lines.forEach((line) => {
    if (addressLineRegex.test(line) && currentBlock.length) {
      blocks.push(currentBlock);
      currentBlock = [line];
      return;
    }

    currentBlock.push(line);
  });

  if (currentBlock.length) {
    blocks.push(currentBlock);
  }

  return blocks
    .map((block) => parseComparableText(block.join("\n")))
    .filter(hasEnoughComparableEvidence)
    .filter((property) => {
      if (!property.address) {
        return false;
      }

      const propertyKey = normaliseAddressKey(property.address);
      const primaryKey = normaliseAddressKey(primaryAddress);
      const currentKey = normaliseAddressKey(currentAddress);

      if (primaryKey && propertyKey === primaryKey) {
        return false;
      }

      if (currentKey && propertyKey === currentKey) {
        return false;
      }

      return true;
    });
}

function normaliseAddressKey(value: string) {
  return value
    .toLowerCase()
    .replace(/\b(qld|nsw|vic|sa|wa|tas|act|nt)\b/g, "")
    .replace(/\b\d{4}\b/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function extractAppraisalDescription(lines: string[]) {
  const noteLines = lines.filter(
    (line) =>
      line.length > 45 &&
      !/realestate\.com\.au|domain\.com\.au|rpp\.corelogic|rp data|menu|sign in|join|copy|update data|view all|property history|keyboard shortcuts/i.test(
        line,
      ),
  );

  return noteLines.slice(0, 3).join(" ").slice(0, 520);
}

function extractKeySellingPoints(
  lines: string[],
  joined: string,
  description: string,
) {
  const featureWords = [
    "pool",
    "renovated kitchen",
    "large backyard",
    "quiet street",
    "corner block",
    "river views",
    "city views",
    "deck",
    "garage",
    "character home",
    "development potential",
    "walk to cafes",
    "school catchment",
    "north facing",
    "flat backyard",
    "open plan",
    "high ceilings",
    "timber floors",
    "storage",
  ];
  const detectedFeatures = featureWords.filter((feature) =>
    joined.toLowerCase().includes(feature),
  );
  const bulletFeatures = lines
    .filter((line) => /^[-•*]\s+/.test(line) || line.split(",").length >= 3)
    .flatMap((line) =>
      line
        .replace(/^[-•*]\s+/, "")
        .split(",")
        .map((item) => item.trim()),
    )
    .filter((item) => item.length >= 4 && item.length <= 48);

  return uniqueValues([...detectedFeatures, ...bulletFeatures])
    .slice(0, 8)
    .join(", ") || description.split(".")[0] || "";
}

function createListingHeadline(address: string, propertyType: string) {
  const suburb = parseAddressParts(address).suburb;

  if (propertyType && suburb) {
    return `${propertyType} opportunity in ${suburb}`;
  }

  if (suburb) {
    return `A strong appraisal opportunity in ${suburb}`;
  }

  return "";
}

function createAppraisalSummary({
  address,
  suburb,
  propertyType,
  bedrooms,
  bathrooms,
  carSpaces,
  landSize,
  keyFeatures,
  comparableCount,
  sourceCount,
}: {
  address: string;
  suburb: string;
  propertyType: string;
  bedrooms: string;
  bathrooms: string;
  carSpaces: string;
  landSize: string;
  keyFeatures: string;
  comparableCount: number;
  sourceCount: number;
}) {
  return [
    address ? `Address: ${address}` : "",
    suburb ? `Suburb: ${suburb}` : "",
    propertyType ? `Type: ${propertyType}` : "",
    bedrooms || bathrooms || carSpaces
      ? `${bedrooms || "-"} bed / ${bathrooms || "-"} bath / ${carSpaces || "-"} car`
      : "",
    landSize ? `Land: ${landSize}` : "",
    keyFeatures ? `Highlights: ${keyFeatures}` : "",
    comparableCount ? `${comparableCount} comparable sale cards created` : "",
    sourceCount ? `${sourceCount} source link${sourceCount === 1 ? "" : "s"} saved` : "",
  ].filter(Boolean);
}

const manualComparableFields: Array<{
  id: keyof ComparableProperty;
  label: string;
  large?: boolean;
}> = [
  { id: "address", label: "Property address" },
  { id: "suburb", label: "Suburb" },
  { id: "state", label: "State" },
  { id: "soldPrice", label: "Sold price" },
  { id: "saleDate", label: "Sale date" },
  { id: "beds", label: "Beds" },
  { id: "baths", label: "Baths" },
  { id: "cars", label: "Cars" },
  { id: "landSize", label: "Land size" },
  { id: "propertyType", label: "Property type" },
  { id: "agency", label: "Agency" },
  { id: "agentName", label: "Agent name" },
  { id: "sourceUrl", label: "Source Listing URL", large: true },
  { id: "description", label: "Property description", large: true },
  { id: "notes", label: "Notes / reason comparable", large: true },
];

function parseComparableText(text: string): ComparableProperty {
  const lines = normaliseComparableLines(text);
  const joined = lines.join(" ");
  const sourceUrl = extractSourceUrl(joined);
  const addressCandidate = extractAddress(lines, joined);
  const addressParts = parseAddressParts(addressCandidate);
  const compactFeatures = extractCompactFeatureRow(lines);
  const beds =
    extractLabelledNumber(joined, ["bed(?:room)?s?", "beds?"]) ||
    compactFeatures.beds;
  const baths =
    extractLabelledNumber(joined, ["bath(?:room)?s?", "baths?"]) ||
    compactFeatures.baths;
  const cars =
    extractLabelledNumber(joined, [
      "car(?:space)?s?",
      "parking",
      "garage(?:s)?",
    ]) || compactFeatures.cars;
  const landSize =
    extractLabelledArea(joined, ["land(?: size)?", "block(?: size)?"]) ||
    compactFeatures.landSize ||
    extractFirstArea(lines);
  const buildingSize =
    extractLabelledArea(joined, [
      "building(?: size)?",
      "floor(?: area)?",
      "internal(?: area)?",
    ]) || compactFeatures.buildingSize;
  const propertyType =
    extractPropertyType(joined) || compactFeatures.propertyType;
  const soldPrice = extractPrice(joined) || extractStatus(joined);
  const saleDate = extractDate(joined);
  const agency = extractAgency(lines, joined);
  const agentName = extractAgentName(joined);
  const description = extractDescription(lines);
  const notes = buildComparableNotes({
    sourceLabel: getSourceLabel(sourceUrl, joined),
    status: extractStatus(joined),
    beds,
    baths,
    cars,
    landSize,
    buildingSize,
    propertyType,
    soldPrice,
    saleDate,
    yearBuilt: extractYearBuilt(joined),
    developmentZone: extractDevelopmentZone(joined),
    daysOnMarket: joined.match(/\b\d+\s+days?\s+on\s+market\b/i)?.[0] || "",
    inspection: extractInspection(joined),
  });

  return {
    address: addressParts.formattedAddress || addressCandidate,
    suburb: addressParts.suburb,
    state: addressParts.state,
    soldPrice,
    saleDate,
    beds,
    baths,
    cars: cars === "-" ? "" : cars,
    blockSize: landSize,
    landSize,
    propertyType,
    agency,
    agentName,
    description,
    notes,
    url: sourceUrl,
    sourceUrl,
  };
}

function hasEnoughComparableEvidence(property: ComparableProperty) {
  const detectedFields = [
    property.address,
    property.soldPrice,
    property.beds,
    property.baths,
    property.landSize,
    property.propertyType,
    property.agency,
    property.saleDate,
  ].filter(Boolean);

  return Boolean(property.address) || detectedFields.length >= 3;
}

function normaliseComparableLines(text: string) {
  return text
    .replace(/\r/g, "\n")
    .replace(/\u00a0/g, " ")
    .split("\n")
    .map((line) =>
      line
        .replace(/[🛏🛌🛁🚿🚗🏠]/g, " ")
        .replace(/\bCopy\b|\bUpdate data\b/gi, " ")
        .replace(/\s+/g, " ")
        .trim(),
    )
    .filter(Boolean);
}

function extractSourceUrl(text: string) {
  return text.match(/https?:\/\/[^\s)]+/i)?.[0].replace(/[.,]+$/, "") || "";
}

const streetTypePattern =
  "Street|St|Road|Rd|Avenue|Ave|Drive|Dr|Place|Pl|Court|Ct|Crescent|Cres|Terrace|Tce|Lane|Ln|Way|Parade|Pde|Close|Circuit|Cct|Boulevard|Blvd|Highway|Hwy|Esplanade|Grove|Rise|Row|Square|Sq|Track|Trail|View|Mews|Quay|Promenade|Prom";
const statePattern =
  "QLD|Queensland|NSW|New South Wales|VIC|Victoria|SA|South Australia|WA|Western Australia|TAS|Tasmania|ACT|NT|Northern Territory";

function extractAddress(lines: string[], joined: string) {
  const fullAddressRegex = new RegExp(
    `\\b\\d{1,5}[A-Za-z]?\\s+[A-Za-z0-9'&./\\-\\s]+?\\b(?:${streetTypePattern})\\b(?:,?\\s+[A-Za-z][A-Za-z'\\-\\s]+){0,3},?\\s+(?:${statePattern})\\s*\\d{4}\\b`,
    "i",
  );
  const streetOnlyRegex = new RegExp(
    `\\b\\d{1,5}[A-Za-z]?\\s+[A-Za-z0-9'&./\\-\\s]+?\\b(?:${streetTypePattern})\\b(?:,?\\s+[A-Za-z][A-Za-z'\\-\\s]+){0,2}\\b`,
    "i",
  );
  const fromLine = lines
    .map((line) => line.match(fullAddressRegex)?.[0] || "")
    .find(Boolean);

  if (fromLine) {
    return cleanAddress(fromLine);
  }

  const fromJoined = joined.match(fullAddressRegex)?.[0];

  if (fromJoined) {
    return cleanAddress(fromJoined);
  }

  return cleanAddress(
    lines
      .map((line) => line.match(streetOnlyRegex)?.[0] || "")
      .find(Boolean) || "",
  );
}

function cleanAddress(value: string) {
  return value
    .replace(/\bCopy\b/gi, "")
    .replace(/\s+,/g, ",")
    .replace(/\s+/g, " ")
    .replace(/,\s*,/g, ",")
    .trim();
}

function parseAddressParts(address: string) {
  const stateMatch = address.match(
    new RegExp(`\\b(${statePattern})\\s*(\\d{4})\\b`, "i"),
  );
  const state = stateMatch ? normaliseState(stateMatch[1]) : "";
  const postcode = stateMatch?.[2] || "";
  const beforeState = stateMatch
    ? address.slice(0, stateMatch.index).replace(/[,\s]+$/, "")
    : address;
  const commaParts = beforeState
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  let street = beforeState;
  let suburb = "";

  if (commaParts.length >= 2) {
    suburb = commaParts[commaParts.length - 1];
    street = commaParts.slice(0, -1).join(", ");
  } else {
    const streetSuburb = beforeState.match(
      new RegExp(`^(.*?\\b(?:${streetTypePattern})\\b)\\s+(.+)$`, "i"),
    );

    if (streetSuburb) {
      street = streetSuburb[1].trim();
      suburb = streetSuburb[2].trim();
    }
  }

  const formattedSuburb = smartTitleCase(suburb);

  return {
    suburb: formattedSuburb,
    state,
    formattedAddress:
      street && formattedSuburb && state && postcode
        ? `${street}, ${formattedSuburb} ${state} ${postcode}`
        : address,
  };
}

function normaliseState(value: string) {
  const upperValue = value.toUpperCase();
  const stateMap: Record<string, string> = {
    QUEENSLAND: "QLD",
    "NEW SOUTH WALES": "NSW",
    VICTORIA: "VIC",
    "SOUTH AUSTRALIA": "SA",
    "WESTERN AUSTRALIA": "WA",
    TASMANIA: "TAS",
    "NORTHERN TERRITORY": "NT",
  };

  return stateMap[upperValue] || upperValue;
}

function smartTitleCase(value: string) {
  if (!value || value !== value.toUpperCase()) {
    return value;
  }

  return value
    .toLowerCase()
    .replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
}

function extractCompactFeatureRow(lines: string[]) {
  const propertyTypePattern =
    "House|Apartment|Townhouse|Unit|Acreage|Land|Villa|Duplex";
  const featureLine = lines
    .map((line) => line.replace(/m\s*²/gi, "m²").replace(/\s+/g, " "))
    .find(
      (line) =>
        /\d/.test(line) &&
        /(?:m²|sqm|m2|House|Apartment|Townhouse|Unit|Acreage|Land|Villa|Duplex)/i.test(
          line,
        ) &&
        (line.match(/\b\d[\d,]*\b/g) || []).length >= 3,
    );

  const match = featureLine?.match(
    new RegExp(
      `(?:^|\\s)(\\d+)\\s+(\\d+)\\s+(\\d+|-)\\s+(\\d[\\d,]*)\\s*(?:m²|sqm|m2)(?:\\s+(\\d[\\d,]*)\\s*(?:m²|sqm|m2))?(?:\\s+(${propertyTypePattern}))?\\b`,
      "i",
    ),
  );

  return {
    beds: match?.[1] || "",
    baths: match?.[2] || "",
    cars: match?.[3] || "",
    landSize: match?.[4] ? `${match[4]}m²` : "",
    buildingSize: match?.[5] ? `${match[5]}m²` : "",
    propertyType: match?.[6] || "",
  };
}

function extractLabelledNumber(text: string, labels: string[]) {
  for (const label of labels) {
    const beforeLabel = text.match(new RegExp(`\\b(\\d+)\\s*${label}\\b`, "i"));
    const afterLabel = text.match(new RegExp(`\\b${label}\\s*:?\\s*(\\d+)\\b`, "i"));

    if (beforeLabel?.[1]) return beforeLabel[1];
    if (afterLabel?.[1]) return afterLabel[1];
  }

  return "";
}

function extractLabelledArea(text: string, labels: string[]) {
  for (const label of labels) {
    const match = text.match(
      new RegExp(
        `\\b${label}\\s*:?\\s*(\\d[\\d,]*(?:\\.\\d+)?)\\s*(m²|sqm|m2|ha|acres?)\\b`,
        "i",
      ),
    );

    if (match?.[1] && match[2]) {
      return `${match[1]}${normaliseAreaUnit(match[2])}`;
    }
  }

  return "";
}

function extractFirstArea(lines: string[]) {
  const match = lines
    .join(" ")
    .match(/\b(\d[\d,]*(?:\.\d+)?)\s*(m²|sqm|m2|ha|acres?)\b/i);

  return match?.[1] && match[2]
    ? `${match[1]}${normaliseAreaUnit(match[2])}`
    : "";
}

function normaliseAreaUnit(value: string) {
  if (/sqm|m2|m²/i.test(value)) return "m²";
  return value.toLowerCase();
}

function extractPropertyType(text: string) {
  return (
    text.match(
      /\bProperty Type\s*:?\s*(House|Apartment|Townhouse|Unit|Acreage|Land|Villa|Duplex)\b/i,
    )?.[1] ||
    text.match(/\b(House|Apartment|Townhouse|Unit|Acreage|Land|Villa|Duplex)\b/i)
      ?.[1] ||
    ""
  );
}

function extractPrice(text: string) {
  const priceWithLabel = text.match(
    /\b(offers?\s+over|offer\s+over|offers?\s+above|price\s+guide|guide|asking\s+price|listed\s+for|sold(?:\s+for)?|sale\s+price|last\s+sold(?:\s+for)?)\s*:?\s*(\$[\d,]+(?:\.\d+)?\s*(?:m|million|k|\+)?)/i,
  );

  if (priceWithLabel?.[1] && priceWithLabel[2]) {
    return `${sentenceCase(priceWithLabel[1])} ${priceWithLabel[2].replace(/\s+/g, "")}`;
  }

  return text.match(/\$[\d,]+(?:\.\d+)?\s*(?:m|million|k|\+)?/i)?.[0] || "";
}

function sentenceCase(value: string) {
  const lowerValue = value.toLowerCase();
  return lowerValue.charAt(0).toUpperCase() + lowerValue.slice(1);
}

function extractStatus(text: string) {
  if (/\bfor sale now\b/i.test(text)) return "For sale now";
  if (/\bfor sale\b/i.test(text)) return "For sale";
  if (/\bauction\b/i.test(text)) return "Auction";
  if (/\bunder offer\b/i.test(text)) return "Under offer";
  if (/\bsold\b/i.test(text)) return "Sold";
  return "";
}

function extractDate(text: string) {
  const datePattern =
    "(?:\\d{1,2}\\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\\s+\\d{4}|\\d{1,2}[/-]\\d{1,2}[/-]\\d{2,4})";
  const labelledDate = text.match(
    new RegExp(
      `\\b(?:sold|sale date|settled|contract date|last listed|listed)\\s*(?:on|:)?\\s*(${datePattern})\\b`,
      "i",
    ),
  );

  if (labelledDate?.[1]) {
    return labelledDate[1];
  }

  return (
    text.match(new RegExp(`\\bOn\\s+(${datePattern})\\b`, "i"))?.[1] || ""
  );
}

function extractAgency(lines: string[], joined: string) {
  const labelledAgency = joined.match(
    /\b(?:agency|office|listed by|sold by)\s*:?\s*([A-Z][A-Za-z&.'\-\s]{2,55})\b/,
  )?.[1];

  if (labelledAgency) {
    return labelledAgency.trim();
  }

  const agencyBrands =
    /(McGrath|Ray White|Place|Belle Property|Harcourts|LJ Hooker|RE\/MAX|Coronis|Barry Plant|Nelson Alexander|Jellis Craig|Marshall White|Buxton|Fletchers|Professionals|First National|PRD|Raine & Horne|Sotheby's|Kollosche|The Agency|BresicWhitney|Stone Real Estate|Richardson & Wrench|Elders)(?:\s+[A-Za-z][A-Za-z&.'-]+){0,3}/i;
  const candidates = lines
    .map((line) => line.match(agencyBrands)?.[0] || "")
    .filter((line) => line.length >= 4 && line.length <= 55);

  return candidates.sort((a, b) => b.length - a.length)[0] || "";
}

function extractAgentName(text: string) {
  return (
    text.match(
      /\b(?:agent|sales agent|contact|selling agent)\s*:?\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2})\b/,
    )?.[1] || ""
  );
}

function extractDescription(lines: string[]) {
  const ignoredLine =
    /(realestate\.com\.au|rpp\.corelogic|rp data|menu|sign in|join|share|save|back to results|can you afford|understand your repayments|keyboard shortcuts|map data|report a map error|property notes|click edit|help|update data|view all)/i;

  return lines
    .filter((line) => line.length > 80 && !ignoredLine.test(line))
    .slice(0, 2)
    .join(" ");
}

function extractYearBuilt(text: string) {
  return text.match(/\bYear Built\s*:?\s*(\d{4})\b/i)?.[1] || "";
}

function extractDevelopmentZone(text: string) {
  return (
    text.match(
      /\bDevelopment Zone\s*:?\s*([A-Za-z0-9 /&.'-]+?)(?=\s+(?:Year Built|Property History|Last Listed|For Sale|Sale|Listing|Rental|DA|$))/i,
    )?.[1]?.trim() || ""
  );
}

function extractInspection(text: string) {
  return (
    text.match(/\bInspection\s+([A-Za-z]{3}\s+\d{1,2}\s+[A-Za-z]{3}\s+\d{1,2}:\d{2}\s*(?:am|pm))/i)?.[1] ||
    ""
  );
}

function getSourceLabel(sourceUrl: string, text: string) {
  if (/realestate\.com\.au/i.test(sourceUrl) || /realestate\.com\.au/i.test(text)) {
    return "realestate.com.au";
  }

  if (/rpp\.corelogic|RP Data/i.test(sourceUrl) || /RP Data/i.test(text)) {
    return "RP Data";
  }

  if (/domain\.com\.au/i.test(sourceUrl) || /Domain/i.test(text)) {
    return "Domain";
  }

  return "Smart Paste";
}

function buildComparableNotes({
  sourceLabel,
  status,
  beds,
  baths,
  cars,
  landSize,
  buildingSize,
  propertyType,
  soldPrice,
  saleDate,
  yearBuilt,
  developmentZone,
  daysOnMarket,
  inspection,
}: {
  sourceLabel: string;
  status: string;
  beds: string;
  baths: string;
  cars: string;
  landSize: string;
  buildingSize: string;
  propertyType: string;
  soldPrice: string;
  saleDate: string;
  yearBuilt: string;
  developmentZone: string;
  daysOnMarket: string;
  inspection: string;
}) {
  const evidence = [
    beds || baths || cars
      ? `${beds || "-"} bed / ${baths || "-"} bath / ${cars || "-"} car`
      : "",
    landSize ? `${landSize} land` : "",
    buildingSize ? `${buildingSize} building` : "",
    propertyType,
    soldPrice,
    saleDate ? `date: ${saleDate}` : "",
  ].filter(Boolean);
  const extraDetails = [
    status ? `Status: ${status}` : "",
    yearBuilt ? `Year built: ${yearBuilt}` : "",
    developmentZone ? `Development zone: ${developmentZone}` : "",
    daysOnMarket,
    inspection ? `Inspection: ${inspection}` : "",
  ].filter(Boolean);

  return [
    `${sourceLabel} smart paste${evidence.length ? `: ${evidence.join(", ")}` : ""}.`,
    extraDetails.join(". "),
    "Please review all generated details before saving.",
  ]
    .filter(Boolean)
    .join(" ");
}

function normalizeUrl(value: string) {
  if (!value) {
    return "";
  }

  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}
