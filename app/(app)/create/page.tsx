"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { FlowProgress } from "@/components/FlowProgress";
import { useListing } from "@/components/ListingProvider";
import { useAgentProfile } from "@/components/AgentProfileProvider";
import type { ListingDetails } from "@/lib/types";

export default function CreatePage() {
  const router = useRouter();
  const { listing, setListing } = useListing();
  const { profile, hasProfile, hydrated } = useAgentProfile();
  const addressRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    addressRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!hydrated || !hasProfile) {
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
  }, [hasProfile, hydrated, profile, setListing]);

  const updateDetail = (fieldId: keyof ListingDetails, value: string) => {
    setListing((current) => ({
      ...current,
      details: {
        ...current.details,
        [fieldId]: value,
      },
    }));
  };

  return (
    <>
      <FlowProgress currentStep={1} />

      <form
        className="mx-auto max-w-3xl"
        onSubmit={(event) => {
          event.preventDefault();
          router.push("/details");
        }}
      >
        <section className="rounded-[2rem] bg-white p-6 shadow-card ring-1 ring-slate-200/70 sm:p-8 lg:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-700">
            Office preparation
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Create the vendor presentation
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
            Start with the property and agency details. The rest of the flow
            will guide you step by step before the listing appointment.
          </p>

          <div className="mt-8 grid gap-5">
            <label>
              <span className="text-sm font-semibold text-slate-800">
                Property address
              </span>
              <input
                ref={addressRef}
                value={listing.details.address}
                onChange={(event) => updateDetail("address", event.target.value)}
                placeholder="42 Outlook Street, Paddington"
                className="mt-2 w-full rounded-2xl border-0 bg-slate-50 px-5 py-4 text-base text-slate-950 shadow-inner outline-none ring-1 ring-slate-200 transition focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
            </label>

            <label>
              <span className="text-sm font-semibold text-slate-800">
                Agency name
              </span>
              <input
                value={listing.details.agencyName || profile.agencyName}
                onChange={(event) =>
                  updateDetail("agencyName", event.target.value)
                }
                placeholder="Plum Property"
                className="mt-2 w-full rounded-2xl border-0 bg-slate-50 px-5 py-4 text-base text-slate-950 shadow-inner outline-none ring-1 ring-slate-200 transition focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
            </label>
          </div>

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
