"use client";

import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  FileCheck2,
  Images,
  MonitorPlay,
  Sparkles,
  UserRound,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { useAgentProfile } from "@/components/AgentProfileProvider";
import { useListing } from "@/components/ListingProvider";
import {
  BrochureBookPreview,
  FlyerPreview,
  MockupCard,
  PropertyPortalPreview,
  SocialPreview,
} from "@/components/MockupCards";
import { getListingWinInsight } from "@/lib/listingScore";

export default function DraftPage() {
  const { listing } = useListing();
  const { profile, isProfileComplete } = useAgentProfile();
  const insight = getListingWinInsight(listing, profile);
  const hasProperty = Boolean(listing.details.address.trim());
  const hasImages = Boolean(
    listing.propertyPhotos.length || listing.assets.propertyPhoto,
  );
  const hasMockups = Boolean(
    listing.assets.signboard1 ||
      listing.assets.signboard2 ||
      profile.instagramTemplate ||
      profile.facebookTemplate,
  );

  const checks = [
    {
      title: "Agent profile",
      detail: "Brand, contact details, socials, logos, and colour.",
      done: isProfileComplete,
      href: "/account",
      icon: UserRound,
    },
    {
      title: "Property information",
      detail: "Address, notes, price guide, and market proof.",
      done: hasProperty,
      href: "/create",
      icon: Building2,
    },
    {
      title: "Property images",
      detail: "Up to 5 property photos uploaded.",
      done: hasImages,
      href: "/upload",
      icon: Images,
    },
    {
      title: "Campaign mockups",
      detail: "Signboard, open home, brochure, social, and portal previews.",
      done: hasMockups,
      href: "/mockups",
      icon: Sparkles,
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Step 5"
        title="Final check before the seller sees it."
        description="Use this as the agent’s pre-appraisal quality check. Confirm the brand, property story, images, price evidence, and mockups are ready before opening the clean seller presentation."
        action={
          <Link
            href="/presentation"
            className="inline-flex items-center gap-2 rounded-full bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-blue-800"
          >
            Create Presentation
            <MonitorPlay size={16} />
          </Link>
        }
      />

      <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <aside className="rounded-3xl border border-blue-100 bg-white p-6 shadow-card">
          <p className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-800">
            <FileCheck2 size={16} />
            Draft readiness
          </p>
          <h2 className="mt-5 text-5xl font-semibold tracking-tight">
            {insight.score}/100
          </h2>
          <p className="mt-2 text-sm font-semibold text-gray-500">
            {insight.label}
          </p>

          <div className="mt-6 h-3 overflow-hidden rounded-full bg-blue-50">
            <div
              className="h-full rounded-full bg-blue-700"
              style={{ width: `${insight.score}%` }}
            />
          </div>

          <div className="mt-6 grid gap-3">
            {checks.map((check) => {
              const Icon = check.icon;

              return (
                <Link
                  key={check.title}
                  href={check.href}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-4 transition hover:border-blue-200 hover:bg-blue-50"
                >
                  <span className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-blue-700">
                      <Icon size={18} />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-gray-950">
                        {check.title}
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-gray-500">
                        {check.detail}
                      </span>
                    </span>
                  </span>
                  <span
                    className={`inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                      check.done
                        ? "bg-blue-700 text-white"
                        : "bg-white text-gray-500"
                    }`}
                  >
                    {check.done ? <BadgeCheck size={13} /> : null}
                    {check.done ? "Ready" : "Edit"}
                  </span>
                </Link>
              );
            })}
          </div>

          <p className="mt-5 rounded-2xl bg-blue-50 p-4 text-sm leading-6 text-blue-900">
            Seller mode should feel calm and confident. Anything marked Edit is
            still usable for a demo, but improving it makes the appraisal feel
            more prepared.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/mockups"
              className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-5 py-3 text-sm font-semibold text-blue-900"
            >
              Back to edit
            </Link>
            <Link
              href="/presentation"
              className="inline-flex items-center gap-2 rounded-full bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-card"
            >
              Create Presentation
              <ArrowRight size={16} />
            </Link>
          </div>
        </aside>

        <section className="rounded-3xl border border-blue-100 bg-white p-6 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">
            Draft preview
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            What the seller is about to see.
          </h2>
          <p className="mt-2 text-sm leading-6 text-gray-500">
            This is a short quality check, not the full presentation. The next
            screen is the clean seller-facing view.
          </p>

          <div className="mt-6 grid gap-5 xl:grid-cols-2">
            <MockupCard title="Property portal">
              <PropertyPortalPreview listing={listing} />
            </MockupCard>
            <MockupCard title="Brochure book">
              <BrochureBookPreview listing={listing} />
            </MockupCard>
            <MockupCard title="Campaign flyer">
              <FlyerPreview listing={listing} />
            </MockupCard>
            <MockupCard title="Instagram post">
              <SocialPreview listing={listing} type="Instagram" />
            </MockupCard>
          </div>
        </section>
      </section>
    </>
  );
}
