"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ChevronDown,
  ExternalLink,
  Loader2,
  PlayCircle,
  WandSparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { FlowProgress } from "@/components/FlowProgress";
import { LiveCampaignPhotoButton } from "@/components/LiveCampaignPhotoButton";
import { clampOverlay, DraggableSignboard } from "@/components/DraggableSignboard";
import { AutoCutoutPreview } from "@/components/AutoCutoutPreview";
import { UploadCard } from "@/components/UploadCard";
import {
  BrochurePreview,
  MockupCard,
  PropertyPortalPreview,
  SocialPreview,
  WriteupPanel,
} from "@/components/MockupCards";
import { useListing } from "@/components/ListingProvider";
import { useAgentProfile } from "@/components/AgentProfileProvider";
import { ListingWinScoreCard } from "@/components/ValueSections";
import { autoCutoutImage } from "@/lib/imageProcessing";
import { getPrimaryPropertyPhoto, getPropertyPhotos } from "@/lib/listingImages";
import type {
  AssetKey,
  ListingDetails,
} from "@/lib/types";

const brochureStatusOptions = [
  "For sale",
  "Auction",
  "Price guide TBC",
  "Show price",
] as const;

const builderSteps = [
  { id: "signboards", label: "Signboards" },
  { id: "street", label: "Signboard preview" },
  { id: "brochurePortal", label: "Brochure" },
  { id: "social", label: "Social media" },
  { id: "video", label: "Video" },
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

function getVideoEmbedUrl(rawUrl: string) {
  const value = rawUrl.trim();

  if (!value) {
    return "";
  }

  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const videoId = url.pathname.split("/").filter(Boolean)[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
    }

    if (host.endsWith("youtube.com")) {
      const videoId =
        url.searchParams.get("v") ||
        url.pathname.match(/\/(?:shorts|embed)\/([^/?#]+)/)?.[1];

      return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
    }
  } catch {
    return "";
  }

  return "";
}

const videoSlots = [
  "Property walkthrough",
  "Agent introduction",
  "Social teaser",
  "Campaign update",
];

export default function MockupsPage() {
  const router = useRouter();
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
  const propertyPhotos = getPropertyPhotos(listing);
  const hasAnySignboard = Boolean(
    listing.assets.signboard1 || listing.assets.signboard2,
  );
  const showStep = (step: BuilderStepId) => activeStep === step;
  const detailsReady = Boolean(
    listing.details.address || listing.details.headline || listing.details.keyFeatures,
  );

  useEffect(() => {
    if (selectedSignboard) {
      return;
    }

    if (listing.activeSignboard === "signboard1" && listing.assets.signboard1) {
      setListing((current) => ({
        ...current,
        activeSignboard: "signboard1",
      }));
      return;
    }

    if (listing.activeSignboard === "signboard1" && listing.assets.signboard2) {
      setListing((current) => ({
        ...current,
        activeSignboard: "signboard2",
      }));
    }
  }, [
    listing.assets.signboard1,
    listing.assets.signboard2,
    listing.activeSignboard,
    selectedSignboard,
    setListing,
  ]);

  const updateAsset = async (assetKey: AssetKey, value: string) => {
    let nextValue = value;

    if (value && (assetKey === "signboard1" || assetKey === "signboard2")) {
      try {
        nextValue = await autoCutoutImage(value);
      } catch {
        // If automatic cutout fails on an unusual file, keep the original
        // upload rather than blocking the agent during the appraisal.
        nextValue = value;
      }
    }

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
      signboardOverlays:
        assetKey === "signboard1" || assetKey === "signboard2"
          ? {
              ...current.signboardOverlays,
              [assetKey]:
                current.signboardOverlays[assetKey] ||
                (assetKey === "signboard1"
                  ? { x: 58, y: 58, width: 24 }
                  : { x: 46, y: 58, width: 24 }),
            }
          : current.signboardOverlays,
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

  const updateActiveSignboardOverlay = (overlay: typeof selectedOverlay) => {
    const cleanOverlay = clampOverlay(overlay);

    setListing((current) => ({
      ...current,
      overlay: cleanOverlay,
      signboardOverlays: {
        ...current.signboardOverlays,
        [current.activeSignboard]: cleanOverlay,
      },
    }));
  };

  const updatePropertyPhotos = (photos: string[]) => {
    setListing((current) => ({
      ...current,
      propertyPhotos: photos,
      assets: {
        ...current.assets,
        propertyPhoto: photos[0] || "",
      },
    }));
  };

  const updateCampaignVideoUrl = (index: number, value: string) => {
    setListing((current) => {
      const nextUrls = Array.from({ length: 4 }, (_, urlIndex) =>
        current.campaignVideoUrls?.[urlIndex] || "",
      );
      nextUrls[index] = value;

      return {
        ...current,
        campaignVideoUrls: nextUrls,
      };
    });
  };

  return (
    <>
      <FlowProgress currentStep={4} />

      <section className="mb-8 rounded-[2rem] bg-white p-6 shadow-card ring-1 ring-blue-50 sm:p-8 lg:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-700">
          Campaign Vision Preview
        </p>
        <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_0.55fr] lg:items-end">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Preview the campaign before it exists
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Work through one premium preview at a time. Use quick appraisal
              photos if helpful, or skip them and show the seller the campaign
              direction with polished examples.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                detailsReady ? "Property story ready" : "Property story optional",
                primaryPropertyPhoto ? "Photos ready" : "Photos can be added live",
                hasAnySignboard ? "Signboards ready" : "Signboards optional",
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
          <div className="space-y-4 lg:text-right">
            <div className="flex justify-start lg:justify-end">
              <LiveCampaignPhotoButton
                photos={propertyPhotos}
                onChange={updatePropertyPhotos}
                label="Add vision photos"
              />
            </div>
            <button
              type="button"
              disabled={generationState === "loading"}
              onClick={() => {
                setGenerationState("loading");
                window.setTimeout(() => {
                  setGenerationState("success");
                  router.push("/finish");
                }, 650);
              }}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-700 px-6 py-4 text-base font-semibold text-white shadow-card transition hover:bg-blue-800 disabled:cursor-wait disabled:bg-blue-500 sm:w-auto"
            >
              {generationState === "loading" ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Creating your appraisal...
                </>
              ) : generationState === "success" ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Opening next step...
                </>
              ) : (
                <>
                  <WandSparkles size={18} />
                  Create Appraisal
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      <details
        className="group rounded-[2rem] bg-white p-4 shadow-card ring-1 ring-blue-50 no-print sm:p-5"
        open
      >
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-[1.5rem] bg-blue-50 px-4 py-4">
        <span>
          <span className="block text-sm font-semibold text-blue-950">
              Choose one campaign preview
          </span>
          <span className="mt-1 block text-xs leading-5 text-blue-800/70">
              Move through the previews in order. Keep this screen calm during
              the appraisal and only open the section you need.
          </span>
        </span>
          <ChevronDown
            className="shrink-0 text-blue-800 transition group-open:rotate-180"
            size={19}
          />
        </summary>

        <section className="mt-5 rounded-[2rem] bg-gradient-to-br from-blue-950 via-slate-950 to-blue-900 p-5 text-white shadow-soft">
          <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-200">
                Two campaign modes
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                Live vision now. Professional campaign later.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100/80">
                Live Vision Mode creates conceptual previews from quick
                appraisal photos. Professional Campaign Mode is for polished
                assets once the final photography is ready.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["live", "Live Vision Mode", "Conceptual seller preview"],
                ["professional", "Professional Campaign Mode", "Final campaign assets"],
              ].map(([mode, title, detail]) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() =>
                    setListing((current) => ({
                      ...current,
                      campaignVisionMode: mode as "live" | "professional",
                    }))
                  }
                  className={`rounded-[1.25rem] p-4 text-left transition ${
                    listing.campaignVisionMode === mode
                      ? "bg-white text-blue-950"
                      : "bg-white/10 text-white ring-1 ring-white/10 hover:bg-white/15"
                  }`}
                >
                  <span className="block text-sm font-semibold">{title}</span>
                  <span className="mt-1 block text-xs leading-5 opacity-75">
                    {detail}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div className="mt-5 flex flex-col gap-3 rounded-[1.5rem] bg-white/10 p-4 ring-1 ring-white/10 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold">Use Live Campaign Preview</p>
              <p className="mt-1 text-xs leading-5 text-blue-100/80">
                Optional. Turn this off if the agent wants to use examples only
                until professional photography is uploaded.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setListing((current) => ({
                  ...current,
                  useLiveCampaignPreview: !current.useLiveCampaignPreview,
                }))
              }
              className={`relative h-9 w-16 rounded-full transition ${
                listing.useLiveCampaignPreview ? "bg-blue-500" : "bg-white/20"
              }`}
              aria-pressed={listing.useLiveCampaignPreview}
              aria-label="Toggle live campaign preview"
            >
              <span
                className={`absolute top-1 grid h-7 w-7 place-items-center rounded-full bg-white shadow-sm transition ${
                  listing.useLiveCampaignPreview ? "left-8" : "left-1"
                }`}
              />
            </button>
          </div>
        </section>

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
          title="Upload signboard option 1 and option 2"
          description="Upload option 1 on the left and option 2 on the right. Each board keeps its own size and position when you move it on the property photo."
        />
        <div className="mb-5 rounded-3xl bg-blue-50 p-5 ring-1 ring-blue-100">
          <p className="text-sm font-semibold text-blue-950">
            Need a second signboard?
          </p>
          <p className="mt-2 text-sm leading-6 text-blue-900/75">
            Use the upload box labelled <strong>Signboard option 2</strong>
            below. After uploading, open <strong>Signboard preview</strong>, select
            option 2, and drag it into its own position.
          </p>
        </div>
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
            hint="Upload the second board here. It has separate drag and resize placement."
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
                Signboard preview
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                Add the signboard to the property photo
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Drag the selected board anywhere on the image and use the
                corner handle to make it larger or smaller. Option 1 and
                option 2 are positioned separately.
              </p>
            </div>
          </div>

          {!listing.assets.signboard2 ? (
            <button
              type="button"
              onClick={() => setActiveStep("signboards")}
              className="mb-5 w-full rounded-2xl bg-blue-50 px-4 py-3 text-left text-sm font-semibold text-blue-900 ring-1 ring-blue-100 transition hover:bg-blue-100"
            >
              Want option 2? Go back to Signboards and upload it in the second
              upload box.
            </button>
          ) : null}

          <div className="mb-5 grid gap-3 rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200 lg:grid-cols-[1fr_260px] lg:items-center">
            <div>
              <p className="text-sm font-semibold text-slate-950">
                Currently editing{" "}
                {listing.activeSignboard === "signboard1"
                  ? "signboard option 1"
                  : "signboard option 2"}
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Click anywhere on the property photo to drop this board there,
                then drag it to refine. Use the large blue corner handle or the
                size slider to resize it.
              </p>
            </div>
            <div className="grid gap-3">
              <label>
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Board size
                </span>
                <input
                  type="range"
                  min={8}
                  max={80}
                  value={Math.round(selectedOverlay.width)}
                  onChange={(event) =>
                    updateActiveSignboardOverlay({
                      ...selectedOverlay,
                      width: Number(event.target.value),
                    })
                  }
                  className="mt-3 w-full accent-blue-700"
                />
                <span className="mt-1 block text-xs font-semibold text-blue-800">
                  {Math.round(selectedOverlay.width)}%
                </span>
              </label>
              <button
                type="button"
                onClick={() =>
                  updateActiveSignboardOverlay({
                    x: listing.activeSignboard === "signboard1" ? 58 : 46,
                    y: 58,
                    width: 24,
                  })
                }
                className="rounded-full border border-blue-100 bg-white px-4 py-2.5 text-sm font-semibold text-blue-900 shadow-sm transition hover:bg-blue-50"
              >
                Reset this board
              </button>
            </div>
          </div>

          <DraggableSignboard
            propertyPhoto={primaryPropertyPhoto}
            signboard={selectedSignboard}
            crop={selectedCrop}
            overlay={selectedOverlay}
            onChange={updateActiveSignboardOverlay}
          />
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-gray-950">
              Select signboard to move
            </h3>
            <p className="mt-1 text-sm leading-6 text-gray-500">
              Choose option 1 or 2, then drag it on the image or resize it with
              the corner handle. Each option keeps its own placement, so option
              1 and option 2 can sit in different spots.
            </p>
            <div className="mt-4 grid gap-3">
              {(["signboard1", "signboard2"] as const).map((option, index) => {
                const signboard = listing.assets[option];
                const active = listing.activeSignboard === option;

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() =>
                      setListing((current) => ({
                        ...current,
                        activeSignboard: option,
                      }))
                    }
                    className={`flex items-center gap-4 rounded-2xl border p-3 text-left transition ${
                      active
                        ? "border-blue-700 bg-blue-50"
                        : "border-gray-200 hover:border-blue-200"
                    }`}
                  >
                    <span className="checkerboard relative grid h-20 w-24 shrink-0 place-items-center overflow-hidden rounded-xl bg-white">
                      {signboard ? (
                        <Image
                          src={signboard}
                          alt={`Signboard option ${index + 1}`}
                          fill
                          className="object-contain p-2"
                          unoptimized
                        />
                      ) : (
                        <span className="px-2 text-center text-xs font-semibold text-gray-500">
                          Upload first
                        </span>
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-gray-950">
                        Option {index + 1}
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-gray-500">
                        {signboard
                          ? active
                            ? "Selected for placement"
                            : "Tap to move this option"
                          : "Add artwork in the upload section"}
                      </span>
                      {signboard ? (
                        <span className="mt-2 block text-xs font-semibold text-blue-800">
                          Size {Math.round(listing.signboardOverlays[option].width)}%
                        </span>
                      ) : null}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
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
          showStep("brochurePortal") ? "" : "hidden"
        }`}
      >
        <StepHeader
          step="Brochures"
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
          step="Social media"
          title="Add social media marketing style references"
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
          step="Social media preview"
          title="Instagram and Facebook phone previews"
          description="Review only the social media screens here. Brochure and portal previews stay in their own campaign sections."
        />
        <div className="grid gap-6 lg:grid-cols-2">
          <MockupCard title="Instagram post">
            <SocialPreview listing={listing} type="Instagram" />
          </MockupCard>
          <MockupCard title="Facebook ad">
            <SocialPreview listing={listing} type="Facebook" />
          </MockupCard>
        </div>
      </section>

      <section
        className={`mt-6 rounded-3xl border border-blue-100 bg-white p-6 shadow-card lg:p-8 ${
          showStep("video") ? "" : "hidden"
        }`}
      >
        <StepHeader
          step="Video marketing"
          title="Add video campaign examples"
          description="Paste up to four YouTube or video links. These appear in the Appraisal so the seller can see how video can support the campaign."
        />
        <div className="grid gap-5 md:grid-cols-2">
          {videoSlots.map((label, index) => {
            const url = listing.campaignVideoUrls?.[index] || "";
            const embedUrl = getVideoEmbedUrl(url);

            return (
              <article
                key={label}
                className="overflow-hidden rounded-[1.75rem] bg-slate-50 ring-1 ring-slate-200"
              >
                <div className="relative aspect-video bg-blue-950">
                  {embedUrl ? (
                    <iframe
                      src={embedUrl}
                      title={label}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="h-full w-full"
                    />
                  ) : (
                    <div className="grid h-full place-items-center p-6 text-center text-white">
                      <div>
                        <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-white/10">
                          <PlayCircle size={22} />
                        </span>
                        <p className="mt-4 text-lg font-semibold">{label}</p>
                        <p className="mt-2 text-sm text-blue-100">
                          Paste a video URL below
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-base font-semibold tracking-tight text-slate-950">
                      {label}
                    </h3>
                    {url ? (
                      <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-blue-900 ring-1 ring-blue-100"
                      >
                        Open
                        <ExternalLink size={13} />
                      </a>
                    ) : null}
                  </div>
                  <input
                    value={url}
                    onChange={(event) =>
                      updateCampaignVideoUrl(index, event.target.value)
                    }
                    placeholder="Paste YouTube or video URL"
                    className="mt-4 w-full rounded-2xl border-0 bg-white px-4 py-3 text-sm text-slate-950 outline-none ring-1 ring-slate-200 transition focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </article>
            );
          })}
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
          href="/finish"
          className="inline-flex items-center gap-2 rounded-full bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-card"
        >
          Create Appraisal
          <ArrowRight size={16} />
        </Link>
      </div>
    </>
  );
}
