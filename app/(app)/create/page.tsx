"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
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
              Preparation
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Start with one address.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
              This screen has one job: start the appraisal preparation. ListingWin
              reuses your saved profile and brand details, then the next screen
              keeps the property details simple and easy to review.
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

              <div className="rounded-[1.5rem] bg-slate-50 p-5 ring-1 ring-slate-200">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
                      Reused from Agent Profile
                    </p>
                    <p className="mt-2 text-lg font-semibold text-slate-950">
                      {profile.agencyName || "Agency name not set"}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      {profile.agentName || "Agent name"} ·{" "}
                      {profile.phone || "Phone"} · {profile.email || "Email"}
                    </p>
                  </div>
                  <Link
                    href="/account"
                    className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-blue-900 shadow-sm ring-1 ring-blue-100 transition hover:bg-blue-50"
                  >
                    Edit profile
                  </Link>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-500">
                  ListingWin uses this profile everywhere: appraisal,
                  campaign previews, proposal, calendar, social mockups, and
                  follow-up copy.
                </p>
              </div>
            </div>

            <button
              type="submit"
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-700 px-6 py-4 text-base font-semibold text-white shadow-card transition hover:bg-blue-800 sm:w-auto"
            >
              Continue to Property Details
              <ArrowRight size={18} />
            </button>
          </div>

          <aside className="border-t border-blue-50 bg-blue-50/70 p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-10">
            <p className="text-sm font-semibold text-blue-950">
              The next three clicks
            </p>
            <div className="mt-5 grid gap-4">
              {[
                "Enter the key property details.",
                "Use Smart Paste only for comparable sales.",
                "Add photos, create the appraisal, then generate the proposal.",
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
                The agent should never wonder what to do next: prepare the
                appraisal, show the campaign, then send the proposal.
              </p>
            </div>
          </aside>
        </section>
      </form>
    </>
  );
}
