"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, UserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { useListing } from "@/components/ListingProvider";
import { useAgentProfile } from "@/components/AgentProfileProvider";
import type { ComparableProperty, ListingDetails } from "@/lib/types";

export default function CreatePage() {
  const router = useRouter();
  const { listing, setListing } = useListing();
  const { profile, hasProfile, isProfileComplete, hydrated } = useAgentProfile();
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const setupVisibilitySet = useRef(false);
  const profileAutoFilled = useRef(false);

  useEffect(() => {
    if (!hydrated || setupVisibilitySet.current) {
      return;
    }

    setShowProfileSetup(!hasProfile || !isProfileComplete);
    setupVisibilitySet.current = true;
  }, [hasProfile, hydrated, isProfileComplete]);

  useEffect(() => {
    if (!hydrated || !hasProfile || profileAutoFilled.current) {
      return;
    }

    setListing((current) => ({
      ...current,
      details: {
        ...current.details,
        agentName: current.details.agentName || profile.agentName,
        agencyName: current.details.agencyName || profile.agencyName,
        agencyWebsite: current.details.agencyWebsite || profile.agencyWebsite,
        phone: current.details.phone || profile.phone,
        email: current.details.email || profile.email,
      },
      assets: {
        ...current.assets,
        agencyLogo: current.assets.agencyLogo || profile.agencyLogo,
      },
    }));
    profileAutoFilled.current = true;
  }, [hasProfile, hydrated, profile, setListing]);

  const updateDetail = (
    fieldId: keyof ListingDetails,
    value: string,
  ) => {
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
      comparableProperties: current.comparableProperties.map((property, propertyIndex) =>
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
      <PageHeader
        eyebrow="Step 2"
        title="Add the property information."
        description="Capture the details that change for this seller presentation: address, pricing conversation, market proof, and the notes that shape the opening write-up."
      />

      {hydrated && showProfileSetup ? (
        <section className="mb-6 rounded-3xl border border-blue-100 bg-blue-50/70 p-6 shadow-card">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-blue-700 text-white">
                <UserRound size={20} />
              </div>
              <div>
                <h2 className="text-xl font-semibold tracking-tight">
                  Finish your agent profile first
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">
                  Agent details, logo, brand colour, and socials are saved once
                  and reused on every presentation.
                </p>
              </div>
            </div>
            <Link
              href="/account"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-card"
            >
              Go to Account
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      ) : null}

      <form
        className="grid gap-6 lg:grid-cols-[0.9fr_0.6fr]"
        onSubmit={(event) => {
          event.preventDefault();
          router.push("/upload");
        }}
      >
        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-card lg:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="sm:col-span-2">
              <span className="text-sm font-semibold text-gray-800">
                Property address
              </span>
              <input
                value={listing.details.address}
                onChange={(event) => updateDetail("address", event.target.value)}
                placeholder="42 Outlook Street, Paddington"
                className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-950 outline-none transition focus:border-gray-400 focus:bg-white"
              />
            </label>

            <label>
              <span className="text-sm font-semibold text-gray-800">
                Seller expected price
              </span>
              <input
                value={listing.details.sellerExpectedPrice}
                onChange={(event) =>
                  updateDetail("sellerExpectedPrice", event.target.value)
                }
                placeholder="$1,250,000"
                className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-950 outline-none transition focus:border-gray-400 focus:bg-white"
              />
            </label>

            <label>
              <span className="text-sm font-semibold text-gray-800">
                Agent price guide
              </span>
              <input
                value={listing.details.agentPriceGuide}
                onChange={(event) =>
                  updateDetail("agentPriceGuide", event.target.value)
                }
                placeholder="$1,150,000"
                className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-950 outline-none transition focus:border-gray-400 focus:bg-white"
              />
            </label>

            <label className="sm:col-span-2">
              <span className="text-sm font-semibold text-gray-800">
                Price conversation notes
              </span>
              <textarea
                value={listing.details.priceNotes}
                onChange={(event) =>
                  updateDetail("priceNotes", event.target.value)
                }
                placeholder="Seller is hoping for a premium result. Mention similar renovated homes, buyer demand, and where this property may sit compared with stronger or weaker competing stock."
                rows={4}
                className="mt-2 w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-950 outline-none transition focus:border-gray-400 focus:bg-white"
              />
            </label>

            <details className="sm:col-span-2 rounded-3xl border border-blue-100 bg-blue-50/60 p-5">
              <summary className="cursor-pointer list-none">
                <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-end">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
                      Optional market proof
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                      Add competing property links
                    </h2>
                  </div>
                  <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-blue-900">
                    Open
                  </span>
                </div>
              </summary>
              <div className="mt-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
                    Market research links
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                    Add up to 3 competing properties
                  </h2>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                    These are saved with the presentation. They show the seller
                    the agent reviewed the current market before the listing
                    conversation.
                  </p>
                </div>

              <div className="mt-5 grid gap-4">
                {listing.comparableProperties.map((property, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-blue-100 bg-white p-4"
                  >
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <h3 className="text-sm font-semibold text-slate-950">
                        Market option {index + 1}
                      </h3>
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800">
                        Visual proof
                      </span>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-4">
                      <label className="sm:col-span-4">
                        <span className="text-sm font-semibold text-gray-800">
                          Comparable property address
                        </span>
                        <input
                          value={property.address}
                          onChange={(event) =>
                            updateComparable(index, "address", event.target.value)
                          }
                          placeholder="12 Market Street, Paddington"
                          className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-950 outline-none transition focus:border-blue-400 focus:bg-white"
                        />
                      </label>

                      {[
                        ["beds", "Beds", "4"],
                        ["baths", "Baths", "2"],
                        ["cars", "Cars", "2"],
                        ["blockSize", "Block size", "607m2"],
                      ].map(([fieldId, label, placeholder]) => (
                        <label key={fieldId}>
                          <span className="text-sm font-semibold text-gray-800">
                            {label}
                          </span>
                          <input
                            value={property[fieldId as keyof ComparableProperty]}
                            onChange={(event) =>
                              updateComparable(
                                index,
                                fieldId as keyof ComparableProperty,
                                event.target.value,
                              )
                            }
                            placeholder={placeholder}
                            className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-950 outline-none transition focus:border-blue-400 focus:bg-white"
                          />
                        </label>
                      ))}

                      <label className="sm:col-span-4">
                        <span className="text-sm font-semibold text-gray-800">
                          Property URL
                        </span>
                        <input
                          value={property.url}
                          onChange={(event) =>
                            updateComparable(index, "url", event.target.value)
                          }
                          placeholder="https://www.realestate.com.au/property..."
                          className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-950 outline-none transition focus:border-blue-400 focus:bg-white"
                        />
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </details>

            <label className="sm:col-span-2">
              <span className="text-sm font-semibold text-gray-800">
                Short notes for the campaign
              </span>
              <textarea
                value={listing.details.notes}
                onChange={(event) => updateDetail("notes", event.target.value)}
                placeholder="Elevated street presence, renovated kitchen, leafy outlook, ideal family buyer profile..."
                rows={6}
                className="mt-2 w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-950 outline-none transition focus:border-gray-400 focus:bg-white"
              />
            </label>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full bg-gray-950 px-5 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-black"
            >
              Next: Property images
              <ArrowRight size={16} />
            </button>
          </div>
        </section>

        <aside className="rounded-3xl bg-gray-950 p-7 text-white shadow-soft">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gray-400">
            Listing step
          </p>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight">
            Property info starts after New.
          </h2>
          <p className="mt-5 leading-7 text-gray-300">
            Agent Profile is reusable. This screen captures only the details
            that change for each vendor pitch, then uses them to generate the
            placeholder property write-up.
          </p>
        </aside>
      </form>
    </>
  );
}
