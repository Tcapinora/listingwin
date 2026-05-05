"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Loader2,
  WandSparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { FlowProgress } from "@/components/FlowProgress";
import { clampOverlay, DraggableSignboard } from "@/components/DraggableSignboard";
import {
  clampOpenHomeOverlay,
  DraggableOpenHome,
} from "@/components/DraggableOpenHome";
import { OpenHomePlacementControls } from "@/components/OpenHomePlacementControls";
import { SignboardPlacementControls } from "@/components/SignboardPlacementControls";
import { AutoCutoutPreview } from "@/components/AutoCutoutPreview";
import { UploadCard } from "@/components/UploadCard";
import {
  BrochurePreview,
  BrochureBookPreview,
  FlyerPreview,
  MockupCard,
  OpenHomePreview,
  PropertyPortalPreview,
  SocialPreview,
  WriteupPanel,
} from "@/components/MockupCards";
import { useListing } from "@/components/ListingProvider";
import { useAgentProfile } from "@/components/AgentProfileProvider";
import { ListingWinScoreCard } from "@/components/ValueSections";
import { autoCutoutImage } from "@/lib/imageProcessing";
import { getPrimaryPropertyPhoto } from "@/lib/listingImages";
import { openHomeOptions } from "@/lib/openHome";
import type {
  AssetKey,
  ListingDetails,
  OpenHomeOptionKey,
  OverlayState,
} from "@/lib/types";

const brochureStatusOptions = [
  "For sale",
  "Auction",
  "Price guide TBC",
  "Show price",
] as const;

const builderSteps = [
  { id: "signboards", label: "Signboards" },
  { id: "street", label: "Street mockup" },
  { id: "openHome", label: "Open home" },
  { id: "brochurePortal", label: "Print and portal" },
  { id: "social", label: "Social" },
  { id: "all", label: "Show all" },
] as const;

type BuilderStepId = (typeof builderSteps)[number]["id"];

function StepHeader({
  step,
  title,
  description,
}: {
  step: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">
          {step}
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-gray-950">
          {title}
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">
          {description}
        </p>
      </div>
    </div>
  );
}

export default function MockupsPage() {
  const { listing, setListing } = useListing();
  const { profile, updateProfile } = useAgentProfile();
  const [activeStep, setActiveStep] = useState<BuilderStepId>("signboards");
  const [generationState, setGenerationState] = useState<
    "idle" | "loading" | "success"
  >("idle");
  const selectedSignboard = listing.assets[listing.activeSignboard];
  const selectedCrop = listing.signboardCrops[listing.activeSignboard];
  const selectedOverlay =
    listing.signboardOverlays[listing.activeSignboard] || listing.overlay;
  const primaryPropertyPhoto = getPrimaryPropertyPhoto(listing);
  const openHomeOverlay =
    listing.openHomeOverlays[listing.activeOpenHomeOption]?.[0] || {
      x: 56,
      y: 50,
      width: 24,
    };
  const openHomeBuyers = openHomeOptions.map((option) => ({
    ...option,
    overlay: listing.openHomeOverlays[option.key]?.[0] || {
      x: 56,
      y: 50,
      width: 24,
    },
  })).filter((option) => listing.openHomeVisible[option.key] !== false);
  const hasAnySignboard = Boolean(
    listing.assets.signboard1 || listing.assets.signboard2,
  );
  const showStep = (step: BuilderStepId) =>
    activeStep === "all" || activeStep === step;
  const detailsReady = Boolean(
    listing.details.address || listing.details.headline || listing.details.keyFeatures,
  );

  useEffect(() => {
    if (selectedSignboard) {
      return;
    }

    if (listing.assets.signboard1) {
      setListing((current) => ({
        ...current,
        activeSignboard: "signboard1",
      }));
      return;
    }

    if (listing.assets.signboard2) {
      setListing((current) => ({
        ...current,
        activeSignboard: "signboard2",
      }));
    }
  }, [
    listing.assets.signboard1,
    listing.assets.signboard2,
    selectedSignboard,
    setListing,
  ]);

  useEffect(() => {
    if (hasAnySignboard && activeStep === "signboards") {
      setActiveStep("street");
    }
  }, [activeStep, hasAnySignboard]);

  const updateAsset = async (assetKey: AssetKey, value: string) => {
    const nextValue =
      value && (assetKey === "signboard1" || assetKey === "signboard2")
        ? await autoCutoutImage(value)
        : value;

    setListing((current) => ({
      ...current,
      activeSignboard:
        assetKey === "signboard1" || assetKey === "signboard2"
          ? assetKey
          : current.activeSignboard,
      assets: {
        ...current.assets,
        [assetKey]: nextValue,
      },
    }));
  };

  const updateDetail = (field: keyof ListingDetails, value: string) => {
    setListing((current) => ({
      ...current,
      details: {
        ...current.details,
        [field]: value,
      },
    }));
  };

  const updateOpenHomeOverlay = (
    key: OpenHomeOptionKey,
    overlay: OverlayState,
  ) => {
    setListing((current) => {
      const nextOverlays = [...current.openHomeOverlays[key]];

      nextOverlays[0] = clampOpenHomeOverlay(overlay);

      return {
        ...current,
        activeOpenHomeOption: key,
        activeOpenHomePhotoIndex: 0,
        openHomeOverlays: {
          ...current.openHomeOverlays,
          [key]: nextOverlays,
        },
      };
    });
  };

  return (
    <>
      <FlowProgress currentStep={4} />

      <section className="mb-8 rounded-[2rem] bg-white p-6 shadow-card ring-1 ring-blue-50 sm:p-8 lg:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-700">
          Preview vendor presentation
        </p>
        <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_0.55fr] lg:items-end">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Create the vendor presentation pack
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Generate the seller-facing previews, then fine-tune the visual
              mockups before the appointment.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                detailsReady ? "Property story ready" : "Property story missing",
                primaryPropertyPhoto ? "Media ready" : "Media optional",
                "Visual tools included",
              ].map((item, index) => (
                <div
                  key={item}
                  className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 ring-1 ring-slate-100"
                >
                  <span className="mr-2 text-blue-700">{index + 1}</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="lg:text-right">
            <button
              type="button"
              disabled={generationState === "loading"}
              onClick={() => {
                setGenerationState("loading");
                window.setTimeout(() => setGenerationState("success"), 900);
              }}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-700 px-6 py-4 text-base font-semibold text-white shadow-card transition hover:bg-blue-800 disabled:cursor-wait disabled:bg-blue-500 sm:w-auto"
            >
              {generationState === "loading" ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Creating your vendor presentation...
                </>
              ) : generationState === "success" ? (
                <>
                  <CheckCircle2 size={18} />
                  Vendor presentation ready.
                </>
              ) : (
                <>
                  <WandSparkles size={18} />
                  Generate Vendor Presentation
                </>
              )}
            </button>
            {generationState === "success" ? (
              <Link
                href="/draft"
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-blue-200 bg-white px-6 py-3 text-sm font-semibold text-blue-900 shadow-sm sm:w-auto"
              >
                Preview Vendor Presentation
                <ArrowRight size={16} />
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      <details
        className="group rounded-[2rem] bg-white p-4 shadow-card ring-1 ring-blue-50 no-print sm:p-5"
        open={generationState === "success" || hasAnySignboard}
      >
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-[1.5rem] bg-blue-50 px-4 py-4">
          <span>
            <span className="block text-sm font-semibold text-blue-950">
              Fine-tune the presentation visuals
            </span>
            <span className="mt-1 block text-xs leading-5 text-blue-800/70">
              Adjust signboards, open-home scenes, print, portal, and social
              previews before showing the vendor.
            </span>
          </span>
          <ChevronDown
            className="shrink-0 text-blue-800 transition group-open:rotate-180"
            size={19}
          />
        </summary>

        <section className="sticky top-[73px] z-20 my-5 rounded-3xl border border-blue-100 bg-blue-50/90 p-4 shadow-sm backdrop-blur">
          <div className="flex flex-wrap gap-2">
            {builderSteps.map((step) => (
              <button
                key={step.id}
                type="button"
                onClick={() => setActiveStep(step.id)}
                className={`rounded-full px-4 py-2 text-xs font-semibold shadow-sm transition ${
                  activeStep === step.id
                    ? "bg-blue-700 text-white"
                    : "bg-white text-blue-900 hover:bg-blue-100"
                }`}
              >
                {step.label}
              </button>
            ))}
          </div>
        </section>

      <section
        className={`rounded-3xl border border-gray-200 bg-white p-6 shadow-card lg:p-8 ${
          showStep("signboards") ? "" : "hidden"
        }`}
      >
        <StepHeader
          step="Visual setup"
          title="Upload signboard options"
          description="Add one or two board designs. ListingWin removes the background and keeps each option’s position and size separate on the property photo."
        />
        <div className="grid gap-5 lg:grid-cols-2">
          <UploadCard
            label="Signboard option 1"
            hint="Upload or replace the board you want to move around"
            value={listing.assets.signboard1}
            assetKey="signboard1"
            onChange={updateAsset}
          />
          <UploadCard
            label="Signboard option 2"
            hint="Optional alternate board artwork"
            value={listing.assets.signboard2}
            assetKey="signboard2"
            onChange={updateAsset}
          />
        </div>

        {hasAnySignboard ? (
          <div className="mt-6 grid gap-5 xl:grid-cols-2">
            <AutoCutoutPreview
              title="Signboard option 1"
              image={listing.assets.signboard1}
            />
            <AutoCutoutPreview
              title="Signboard option 2"
              image={listing.assets.signboard2}
            />
          </div>
        ) : null}
      </section>

      <section
        className={`mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr] ${
          showStep("street") ? "" : "hidden"
        }`}
      >
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-card lg:p-8">
          <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">
                Street mockup
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                Add the signboard to the property photo
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Drag the selected board anywhere on the image and use the
                controls below to make it larger or smaller. Option 1 and
                Option 2 are positioned separately.
              </p>
            </div>
            <div className="inline-flex rounded-full border border-blue-100 bg-blue-50 p-1">
              {(["signboard1", "signboard2"] as const).map((option, index) => (
                <button
                  key={option}
                  type="button"
                  onClick={() =>
                    setListing((current) => ({
                      ...current,
                      activeSignboard: option,
                    }))
                  }
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    listing.activeSignboard === option
                      ? "bg-blue-700 text-white"
                      : "text-blue-900 hover:bg-white"
                  }`}
                >
                  Option {index + 1}
                </button>
              ))}
            </div>
          </div>

          <DraggableSignboard
            propertyPhoto={primaryPropertyPhoto}
            signboard={selectedSignboard}
            crop={selectedCrop}
            overlay={selectedOverlay}
            onChange={(overlay) =>
              setListing((current) => ({
                ...current,
                overlay: clampOverlay(overlay),
                signboardOverlays: {
                  ...current.signboardOverlays,
                  [current.activeSignboard]: clampOverlay(overlay),
                },
              }))
            }
          />
          <SignboardPlacementControls
            overlay={selectedOverlay}
            onChange={(overlay) =>
              setListing((current) => ({
                ...current,
                overlay: clampOverlay(overlay),
                signboardOverlays: {
                  ...current.signboardOverlays,
                  [current.activeSignboard]: clampOverlay(overlay),
                },
              }))
            }
          />
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl bg-gray-950 p-7 text-white shadow-soft">
            <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-white text-gray-950">
              <WandSparkles size={20} />
            </div>
            <h2 className="text-3xl font-semibold tracking-tight">
              Demo-ready creative in one pass.
            </h2>
            <p className="mt-4 leading-7 text-gray-300">
              Keep the creative fast and controllable. Adjust the board, then
              show the vendor a clear preview of how the campaign will look.
            </p>
          </div>
          <WriteupPanel listing={listing} />
          <ListingWinScoreCard listing={listing} compact />
        </div>
      </section>

      <section
        className={`mt-6 rounded-3xl border border-blue-100 bg-white p-6 shadow-card lg:p-8 ${
          showStep("openHome") ? "" : "hidden"
        }`}
      >
        <StepHeader
          step="Open-home preview"
          title="Open Home buyer preview"
          description="Use the main property photo and stage buyer groups together. The agent can move, resize, show, or remove each group so the scene still feels natural."
        />

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div>
            <DraggableOpenHome
              propertyPhoto={primaryPropertyPhoto}
              buyers={openHomeBuyers}
              activeBuyer={listing.activeOpenHomeOption}
              onSelectBuyer={(key) =>
                setListing((current) => ({
                  ...current,
                  activeOpenHomeOption: key,
                  activeOpenHomePhotoIndex: 0,
                }))
              }
              onChange={updateOpenHomeOverlay}
            />
            <OpenHomePlacementControls
              overlay={openHomeOverlay}
              onChange={(overlay) =>
                updateOpenHomeOverlay(listing.activeOpenHomeOption, overlay)
              }
            />
          </div>

          <div className="space-y-5">
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <h3 className="text-sm font-semibold text-gray-950">
                Select buyer group to move
              </h3>
              <p className="mt-1 text-sm leading-6 text-gray-500">
                All three groups appear together. Select one, then drag it on
                the image or use the placement controls.
              </p>
              <div className="mt-4 grid gap-3">
                {openHomeOptions.map((option) => (
                  <div
                    key={option.key}
                    className={`flex items-center gap-4 rounded-2xl border p-3 text-left transition ${
                      listing.activeOpenHomeOption === option.key
                        ? "border-blue-700 bg-blue-50"
                        : "border-gray-200 hover:border-blue-200"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setListing((current) => ({
                          ...current,
                          activeOpenHomeOption: option.key,
                          openHomeVisible: {
                            ...current.openHomeVisible,
                            [option.key]: true,
                          },
                        }))
                      }
                      className="grid h-20 w-24 place-items-end overflow-hidden rounded-xl bg-gradient-to-b from-blue-50 to-white"
                    >
                      <Image
                        src={option.src}
                        alt={option.label}
                        width={96}
                        height={80}
                        className="max-h-full max-w-full object-contain"
                        unoptimized
                      />
                    </button>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-gray-950">
                        {option.label}
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-gray-500">
                        {listing.openHomeVisible[option.key] === false
                          ? "Hidden from preview"
                          : "Visible in preview"}
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setListing((current) => ({
                          ...current,
                          openHomeVisible: {
                            ...current.openHomeVisible,
                            [option.key]:
                              current.openHomeVisible[option.key] === false,
                          },
                        }))
                      }
                      className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700"
                    >
                      {listing.openHomeVisible[option.key] === false
                        ? "Show"
                        : "Delete"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className={`mt-6 rounded-3xl border border-blue-100 bg-white p-6 shadow-card lg:p-8 ${
          showStep("brochurePortal") ? "" : "hidden"
        }`}
      >
        <StepHeader
          step="Print assets"
          title="Brochure front cover options"
          description="Choose the wording that appears on the brochure cover: For sale, Auction, Price guide TBC, or a specific price."
        />
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
            <h3 className="text-sm font-semibold text-gray-950">
              Sale wording
            </h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {brochureStatusOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => updateDetail("brochureStatus", option)}
                  className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
                    listing.details.brochureStatus === option
                      ? "border-blue-700 bg-blue-700 text-white"
                      : "border-gray-200 bg-white text-gray-700 hover:border-blue-200"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            <label className="mt-5 block">
              <span className="text-sm font-semibold text-gray-800">
                Price to show
              </span>
              <input
                value={listing.details.brochurePrice}
                onChange={(event) =>
                  updateDetail("brochurePrice", event.target.value)
                }
                placeholder="$1,250,000 or Offers over $1.2m"
                className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-950 outline-none transition focus:border-blue-400"
              />
            </label>
          </div>
          <MockupCard title="Brochure front page">
            <BrochurePreview listing={listing} />
          </MockupCard>
        </div>
      </section>

      <section
        className={`mt-6 rounded-3xl border border-blue-100 bg-white p-6 shadow-card lg:p-8 ${
          showStep("brochurePortal") ? "" : "hidden"
        }`}
      >
        <StepHeader
          step="Portal preview"
          title="Property portal preview"
          description="Show the seller how their property could look on a major property portal, with one large hero image, three supporting images, and the agent’s brand colour."
        />
        <PropertyPortalPreview listing={listing} />
      </section>

      <section
        className={`mt-6 rounded-3xl border border-blue-100 bg-white p-6 shadow-card lg:p-8 ${
          showStep("social") ? "" : "hidden"
        }`}
      >
        <StepHeader
          step="Social style"
          title="Add social marketing style references"
          description="Upload example Instagram and Facebook listing screenshots from the agent or agency. ListingWin uses them as style references and inserts the property photo into a seller preview."
        />
        <div className="grid gap-5 lg:grid-cols-2">
          <UploadCard
            label="Instagram listing template"
            hint="Saved to the Agent Profile and reused for future listings"
            value={profile.instagramTemplate || listing.assets.instagramTemplate}
            assetKey="instagramTemplate"
            onChange={(_, value) => {
              updateProfile({ instagramTemplate: value });
              void updateAsset("instagramTemplate", value);
            }}
          />
          <UploadCard
            label="Facebook listing template"
            hint="Saved to the Agent Profile and reused for future listings"
            value={profile.facebookTemplate || listing.assets.facebookTemplate}
            assetKey="facebookTemplate"
            onChange={(_, value) => {
              updateProfile({ facebookTemplate: value });
              void updateAsset("facebookTemplate", value);
            }}
          />
        </div>
        <p className="mt-5 rounded-2xl bg-blue-50 p-4 text-sm leading-6 text-blue-900">
          Uploading style references keeps the social previews closer to the
          agent’s real marketing without slowing down the preparation flow.
        </p>
      </section>

      <section
        className={`mt-8 rounded-3xl border border-blue-100 bg-white p-6 shadow-card lg:p-8 ${
          showStep("social") ? "" : "hidden"
        }`}
      >
        <StepHeader
          step="Presentation preview set"
          title="Final vendor-facing previews"
          description="Review the remaining vendor-facing marketing pieces before opening presentation mode."
        />
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <MockupCard title="Brochure book preview">
          <BrochureBookPreview listing={listing} />
        </MockupCard>
        <MockupCard title="Flyer preview">
          <FlyerPreview listing={listing} />
        </MockupCard>
        <MockupCard title="Instagram post">
          <SocialPreview listing={listing} type="Instagram" />
        </MockupCard>
        <MockupCard title="Facebook ad">
          <SocialPreview listing={listing} type="Facebook" />
        </MockupCard>
        </div>
      </section>
      </details>

      <div className="mt-8 flex flex-wrap justify-between gap-3">
        <Link
          href="/upload"
          className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-5 py-3 text-sm font-semibold text-blue-900 shadow-sm"
        >
          Edit Media
        </Link>
        <Link
          href="/draft"
          className="inline-flex items-center gap-2 rounded-full bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-card"
        >
          Preview Vendor Presentation
          <ArrowRight size={16} />
        </Link>
      </div>
    </>
  );
}
