"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";
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
        className="mx-auto max-w-5xl"
        onSubmit={(event) => {
          event.preventDefault();
          router.push("/details");
        }}
      >
        <section className="grid overflow-hidden rounded-[2rem] bg-white shadow-card ring-1 ring-slate-200/70 lg:grid-cols-[1fr_0.82fr]">
          <div className="p-6 sm:p-8 lg:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-700">
              Office preparation
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Start with the property.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
              Keep this light. ListingWin reuses your saved profile, agency
              brand, logos, and default presentation text so each listing starts
              from review instead of retyping.
            </p>

            <div className="mt-6 rounded-[1.5rem] bg-blue-50 p-4 ring-1 ring-blue-100">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-blue-700 shadow-sm">
                  <CheckCircle2 size={16} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-blue-950">
                    Profile details are reused automatically
                  </p>
                  <p className="mt-1 text-sm leading-6 text-blue-900/70">
                    Agent name, agency, phone, email, logo, brand colour, and
                    default copy come from your Agent Profile unless you change
                    them.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-5">
              <label>
                <span className="text-sm font-semibold text-slate-800">
                  Property address
                </span>
                <input
                  ref={addressRef}
                  value={listing.details.address}
                  onChange={(event) =>
                    updateDetail("address", event.target.value)
                  }
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
                  placeholder="Harbour & Co Estate Agents"
                  className="mt-2 w-full rounded-2xl border-0 bg-slate-50 px-5 py-4 text-base text-slate-950 shadow-inner outline-none ring-1 ring-slate-200 transition focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
                <span className="mt-2 block text-sm text-slate-500">
                  Auto-filled from your Agent Profile. Edit only if this listing
                  needs a different agency name.
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-700 px-6 py-4 text-base font-semibold text-white shadow-card transition hover:bg-blue-800 sm:w-auto"
            >
              Continue
              <ArrowRight size={18} />
            </button>
          </div>

          <aside className="border-t border-blue-50 bg-blue-50/70 p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-10">
            <p className="text-sm font-semibold text-blue-950">
              What happens next
            </p>
            <div className="mt-5 grid gap-4">
              {[
                "Add the property story and price evidence.",
                "Upload or add photos live during the appraisal.",
                "Create the Vendor Presentation, then move into Agent Workspace.",
              ].map((item) => (
                <div key={item} className="flex gap-3">
                  <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white text-blue-700 shadow-sm">
                    <CheckCircle2 size={16} />
                  </span>
                  <p className="text-sm leading-6 text-blue-950/75">{item}</p>
                </div>
              ))}
            </div>
            <div className="mt-7 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-blue-100">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                Simple flow
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Prepare it in the office, present it in the lounge room, then
                move into the workspace when the seller is ready to talk about
                price, trust, and next steps.
              </p>
            </div>
          </aside>
        </section>
      </form>
    </>
  );
}
