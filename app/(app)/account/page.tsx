"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Calendar,
  Link2,
  Mail,
  Phone,
  Presentation,
  Trash2,
  UserCog,
  UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { AgentProfileModal } from "@/components/AgentProfileModal";
import { useAgentProfile } from "@/components/AgentProfileProvider";
import { useListing } from "@/components/ListingProvider";
import {
  deleteSavedPresentation,
  getShareUrl,
  readSavedPresentations,
} from "@/lib/presentationHistory";
import type { SavedPresentation } from "@/lib/types";
import { getPrimaryPropertyPhoto } from "@/lib/listingImages";
import { socialHandle } from "@/lib/social";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default function AccountPage() {
  const { profile, isProfileComplete } = useAgentProfile();
  const { setListing } = useListing();
  const [presentations, setPresentations] = useState<SavedPresentation[]>([]);
  const [copiedId, setCopiedId] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    setPresentations(readSavedPresentations());
  }, []);

  const agencyName = profile.agencyName || "Harbour & Co Estate Agents";

  return (
    <>
      <PageHeader
        eyebrow="Agent Profile"
        title="Create the reusable agent brand kit."
        description="Save the agent details, agency brand, logos, socials, and marketing colour once. Every future seller presentation starts with this profile already filled."
        action={
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setProfileOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-blue-800"
            >
              {isProfileComplete ? "Edit account" : "Create account"}
              <UserCog size={16} />
            </button>
            <Link
              href="/create"
              className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-5 py-3 text-sm font-semibold text-blue-900 shadow-sm"
            >
              Next: Property info
              <ArrowRight size={16} />
            </Link>
          </div>
        }
      />

      <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <aside className="rounded-3xl border border-blue-100 bg-white p-6 shadow-card">
          {!isProfileComplete ? (
            <div className="mb-6 rounded-3xl bg-blue-700 p-5 text-white">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-100">
                First step
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                Create the agent profile first
              </h2>
              <p className="mt-3 text-sm leading-6 text-blue-50">
                Add the essentials once: agent name, contact details, agency
                logo, colour, website, and social handles.
              </p>
              <button
                type="button"
                onClick={() => setProfileOpen(true)}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-blue-800"
              >
                Start account setup
                <ArrowRight size={15} />
              </button>
            </div>
          ) : null}
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center overflow-hidden rounded-2xl bg-blue-700 text-white">
              {profile.agencyLogo ? (
                <Image
                  src={profile.agencyLogo}
                  alt={`${agencyName} logo`}
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                  unoptimized
                />
              ) : (
                <UserRound size={24} />
              )}
            </div>
            <div>
              <p className="text-xl font-semibold tracking-tight">
                {profile.agentName || "Agent name"}
              </p>
              <p className="text-sm text-gray-500">{agencyName}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 text-sm">
            <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-4">
              <Building2 size={17} />
              <span className="break-words">
                {profile.agencyWebsite || "Agency website"}
              </span>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-4">
              <Phone size={17} />
              <span>{profile.phone || "Phone number"}</span>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-4">
              <Mail size={17} />
              <span className="break-words">{profile.email || "Email"}</span>
            </div>
            {[
              profile.agentInstagramUrl,
              profile.agentFacebookUrl,
              profile.agencyInstagramUrl,
              profile.agencyFacebookUrl,
            ].filter(Boolean).length ? (
              <div className="rounded-2xl bg-blue-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                  Social handles
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {[
                    profile.agentInstagramUrl,
                    profile.agentFacebookUrl,
                    profile.agencyInstagramUrl,
                    profile.agencyFacebookUrl,
                  ]
                    .filter(Boolean)
                    .map((url) => (
                      <span
                        key={url}
                        className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-blue-900"
                      >
                        {socialHandle(url)}
                      </span>
                    ))}
                </div>
              </div>
            ) : null}
          </div>

          <div className="mt-6 rounded-2xl bg-blue-950 p-5 text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-400">
              Account structure
            </p>
            <p className="mt-3 text-sm leading-6 text-gray-300">
              Your agent profile, brand assets, and saved presentations live
              here so each new appraisal starts with the essentials
              already in place.
            </p>
          </div>
        </aside>

        <section className="rounded-3xl border border-blue-100 bg-blue-50/60 p-6 shadow-card lg:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">
            Guided flow
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            This is what makes every presentation feel ready.
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            The agent should only need to do this once. Update it when they
            change office, brand colour, logo, phone number, or social template.
          </p>
          <button
            type="button"
            onClick={() => setProfileOpen(true)}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-card"
          >
            Edit profile details
            <UserCog size={16} />
          </button>
          <Link
            href="/create"
            className="ml-3 mt-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-5 py-3 text-sm font-semibold text-blue-900"
          >
            Continue
            <ArrowRight size={16} />
          </Link>
        </section>

        <section className="rounded-3xl border border-blue-100 bg-white p-6 shadow-card lg:col-span-2">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">
                Past Presentations
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                Listing pitch library
              </h2>
            </div>
            <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-800">
              {presentations.length} saved
            </span>
          </div>

          {presentations.length ? (
            <div className="grid gap-4">
              {presentations.map((presentation) => {
                const image = getPrimaryPropertyPhoto(presentation.listing);

                return (
                  <article
                    key={presentation.id}
                    className="grid gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-4 md:grid-cols-[160px_1fr]"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gray-200">
                      {image ? (
                        <Image
                          src={image}
                          alt={presentation.address}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="grid h-full place-items-center text-gray-400">
                          <Presentation size={24} />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-semibold tracking-tight">
                          {presentation.address}
                        </h3>
                        <p className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                          <Calendar size={15} />
                          Saved {formatDate(presentation.createdAt)}
                        </p>
                        <p className="mt-3 text-sm text-gray-500">
                          {presentation.profile.agentName || "Agent"} ·{" "}
                          {presentation.profile.agencyName || "Agency"}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href="/presentation"
                          onClick={() => setListing(presentation.listing)}
                          className="inline-flex items-center gap-2 rounded-full bg-blue-700 px-4 py-2 text-sm font-semibold text-white"
                        >
                          Restore
                          <ArrowRight size={15} />
                        </Link>
                        <button
                          type="button"
                          onClick={async () => {
                            const shareUrl = getShareUrl(presentation.id);

                            try {
                              await navigator.clipboard.writeText(shareUrl);
                              setCopiedId(presentation.id);
                              window.setTimeout(() => setCopiedId(""), 2200);
                            } catch {
                              window.prompt("Copy share link", shareUrl);
                            }
                          }}
                          className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700"
                        >
                          <Link2 size={15} />
                          {copiedId === presentation.id ? "Copied" : "Share"}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setPresentations(
                              deleteSavedPresentation(presentation.id),
                            )
                          }
                          className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700"
                        >
                          <Trash2 size={15} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl bg-gray-50 p-8 text-center">
              <Presentation className="mx-auto text-gray-400" size={36} />
              <h3 className="mt-4 text-xl font-semibold">
                No saved presentations yet
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                Open Presentation Mode and click Save to Account to add a vendor
                pitch to this library.
              </p>
            </div>
          )}
        </section>
      </section>
      <AgentProfileModal
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
      />
    </>
  );
}
