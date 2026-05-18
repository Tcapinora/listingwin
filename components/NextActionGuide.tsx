"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { useAgentProfile } from "@/components/AgentProfileProvider";
import { useListing } from "@/components/ListingProvider";

const guideByPath: Record<
  string,
  {
    stage: string;
    title: string;
    body: string;
    action: string;
    href: string;
    tone?: "dark" | "light";
  }
> = {
  "/create": {
    stage: "Preparation",
    title: "Start the appraisal file.",
    body: "One decision: enter the property address. Your saved agent profile and brand details are already connected.",
    action: "Continue to property details",
    href: "/details",
  },
  "/details": {
    stage: "Preparation",
    title: "Build the property story once.",
    body: "Add only the information about the home you are appraising. Comparable sales, pricing notes, and property facts will flow into the appraisal and proposal.",
    action: "Continue to media",
    href: "/upload",
  },
  "/upload": {
    stage: "Preparation",
    title: "Add photos once.",
    body: "Upload the property images here or add them live during the appraisal. ListingWin reuses them in every campaign preview.",
    action: "Continue to Campaign Vision",
    href: "/mockups",
  },
  "/mockups": {
    stage: "Preparation",
    title: "Create the Campaign Vision.",
    body: "This is the magic moment: turn the seller's home into portal, social, brochure, signboard, and campaign previews.",
    action: "Create appraisal",
    href: "/finish",
    tone: "dark",
  },
  "/finish": {
    stage: "Appraisal",
    title: "Run the room with confidence.",
    body: "Open the seller-facing appraisal first. After the seller has seen the campaign, move into the private workspace and proposal.",
    action: "Open vendor appraisal",
    href: "/presentation",
  },
  "/draft": {
    stage: "Appraisal Workspace",
    title: "Close the conversation.",
    body: "Private agent space: tick off what was discussed, capture objections, and prepare the next step without rebuilding anything.",
    action: "Generate proposal",
    href: "/proposal",
  },
  "/proposal": {
    stage: "Proposal",
    title: "Send the follow-up while it is fresh.",
    body: "Generate the proposal preview, check it, then copy the seller link. The proposal uses the same appraisal data.",
    action: "Review proposal",
    href: "#proposal-preview",
  },
};

export function NextActionGuide({ pathname }: { pathname: string }) {
  const { listing } = useListing();
  const { isProfileComplete } = useAgentProfile();
  const guide = guideByPath[pathname];

  if (!guide) {
    return null;
  }

  const hasProperty = Boolean(listing.details.address.trim());
  const hasPhotos = Boolean(listing.propertyPhotos.length || listing.assets.propertyPhoto);
  const checks = [
    { label: "Profile saved", done: isProfileComplete },
    { label: "Property started", done: hasProperty },
    { label: "Photos reusable", done: hasPhotos },
  ];

  return (
    <section
      className={`rounded-[2rem] p-5 shadow-card ring-1 sm:p-6 ${
        guide.tone === "dark"
          ? "bg-gradient-to-br from-blue-950 via-slate-950 to-blue-900 text-white ring-white/10"
          : "bg-white/95 text-slate-950 ring-slate-200/70"
      }`}
    >
      <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] ${
              guide.tone === "dark"
                ? "bg-white/10 text-blue-100 ring-1 ring-white/15"
                : "bg-blue-50 text-blue-700 ring-1 ring-blue-100"
            }`}
          >
            <Sparkles size={14} />
            {guide.stage}
          </p>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
            {guide.title}
          </h2>
          <p
            className={`mt-2 max-w-3xl text-sm leading-6 ${
              guide.tone === "dark" ? "text-blue-100/80" : "text-slate-600"
            }`}
          >
            {guide.body}
          </p>
        </div>
        <div className="grid gap-3 sm:min-w-72">
          <Link
            href={guide.href}
            className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold shadow-card transition hover:-translate-y-0.5 ${
              guide.tone === "dark"
                ? "bg-white text-blue-950 hover:bg-blue-50"
                : "bg-blue-700 text-white hover:bg-blue-800"
            }`}
          >
            {guide.action}
            <ArrowRight size={16} />
          </Link>
          <div
            className={`grid gap-2 rounded-[1.25rem] p-3 ${
              guide.tone === "dark"
                ? "bg-white/8 ring-1 ring-white/10"
                : "bg-slate-50 ring-1 ring-slate-200"
            }`}
          >
            {checks.map((check) => (
              <div
                key={check.label}
                className={`flex items-center justify-between gap-3 text-xs font-semibold ${
                  guide.tone === "dark" ? "text-blue-100" : "text-slate-600"
                }`}
              >
                <span>{check.label}</span>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 ${
                    check.done
                      ? guide.tone === "dark"
                        ? "bg-white text-blue-950"
                        : "bg-blue-700 text-white"
                      : guide.tone === "dark"
                        ? "bg-white/10 text-blue-100"
                        : "bg-white text-slate-500"
                  }`}
                >
                  {check.done ? <CheckCircle2 size={12} /> : null}
                  {check.done ? "Ready" : "Optional"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
