"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, ChevronDown, Sparkles } from "lucide-react";
import { FlowProgress } from "@/components/FlowProgress";
import { useListing } from "@/components/ListingProvider";
import type { ComparableProperty, ListingDetails } from "@/lib/types";

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
              }
            : property,
      ),
    }));
  };

  return (
    <>
      <FlowProgress currentStep={2} />

      <form
        className="mx-auto max-w-4xl"
        onSubmit={(event) => {
          event.preventDefault();
          router.push("/upload");
        }}
      >
        <section className="rounded-[2rem] bg-white p-6 shadow-card ring-1 ring-blue-50 sm:p-8 lg:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-700">
            Property Details
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Tell us about the property
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            Add the essentials we need to create a polished listing pack.
          </p>
          <div className="mt-6 grid gap-3 rounded-[1.5rem] bg-blue-50/70 p-4 ring-1 ring-blue-100 sm:grid-cols-3">
            {["Headline", "Property type", "Key features"].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 text-sm font-semibold text-blue-950"
              >
                <Sparkles size={15} className="text-blue-700" />
                {item}
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-5">
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

            <div className="grid gap-5 sm:grid-cols-2">
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

          <details className="group mt-6 rounded-[1.5rem] bg-blue-50/70 p-5 ring-1 ring-blue-100">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-blue-900">
              <span>
                Advanced: pricing context and market links
                <span className="mt-1 block text-xs font-medium leading-5 text-blue-800/70">
                  Optional, but useful before a real appraisal.
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

              <div className="grid gap-4">
                {listing.comparableProperties.map((property, index) => (
                  <div key={index} className="rounded-2xl bg-white p-4">
                    <p className="text-sm font-semibold text-slate-950">
                      Market option {index + 1}
                    </p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-4">
                      <input
                        value={property.address}
                        onChange={(event) =>
                          updateComparable(index, "address", event.target.value)
                        }
                        placeholder="Comparable address"
                        className="rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:col-span-4"
                      />
                      {[
                        ["beds", "Beds"],
                        ["baths", "Baths"],
                        ["cars", "Cars"],
                        ["blockSize", "Block size"],
                      ].map(([fieldId, label]) => (
                        <input
                          key={fieldId}
                          value={property[fieldId as keyof ComparableProperty]}
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
                        value={property.url}
                        onChange={(event) =>
                          updateComparable(index, "url", event.target.value)
                        }
                        placeholder="Property URL"
                        className="rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:col-span-4"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </details>

          <button
            type="submit"
            className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-700 px-6 py-4 text-base font-semibold text-white shadow-card transition hover:bg-blue-800 sm:w-auto"
          >
            Save & Continue
            <ArrowRight size={18} />
          </button>
        </section>
      </form>
    </>
  );
}
