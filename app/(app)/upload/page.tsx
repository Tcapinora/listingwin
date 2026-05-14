"use client";

import { ArrowRight } from "lucide-react";
import { SecondaryLink, PrimaryLink } from "@/components/Buttons";
import { PropertyPhotoUploader } from "@/components/PropertyPhotoUploader";
import { useListing } from "@/components/ListingProvider";
import { getPropertyPhotos } from "@/lib/listingImages";
import { FlowProgress } from "@/components/FlowProgress";

export default function UploadPage() {
  const { listing, setListing } = useListing();
  const propertyPhotos = getPropertyPhotos(listing);

  return (
    <>
      <FlowProgress currentStep={3} />

      <section className="mx-auto max-w-3xl rounded-[2rem] bg-white p-6 shadow-card ring-1 ring-slate-200/70 sm:p-8 lg:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-700">
          Property media
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          Upload once. Use everywhere.
        </h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
          Add up to five property photos. ListingWin uses them across the
          Vendor Presentation, social previews, brochure, flyer, signboard
          mockups, and Agent Workspace.
        </p>
        <div className="mt-6 grid gap-3 rounded-[1.5rem] bg-slate-50 p-4 ring-1 ring-slate-200 sm:grid-cols-3">
          {[
            `${propertyPhotos.length}/5 photos added`,
            "Live upload ready",
            "Mockups update instantly",
          ].map((item) => (
            <div
              key={item}
              className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-700 ring-1 ring-slate-100"
            >
              {item}
            </div>
          ))}
        </div>
        <div className="mt-8">
          <PropertyPhotoUploader
            photos={propertyPhotos}
            onChange={(photos) =>
              setListing((current) => ({
                ...current,
                propertyPhotos: photos,
                assets: {
                  ...current.assets,
                  propertyPhoto: photos[0] || "",
                },
              }))
            }
          />
        </div>
      </section>

      <section className="mx-auto mt-6 max-w-3xl rounded-3xl bg-blue-50/70 p-5 ring-1 ring-blue-100">
        <p className="text-sm font-semibold text-blue-950">
          This is the live campaign moment.
        </p>
        <p className="mt-2 text-sm leading-6 text-blue-900/70">
          If the agent is in front of the seller, this still needs to feel calm:
          upload the photos, keep talking, and the mockups update without
          rebuilding the presentation.
        </p>
      </section>

      <div className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-between gap-3">
        <SecondaryLink href="/details">Edit Details</SecondaryLink>
        <PrimaryLink href="/mockups">
          <span className="inline-flex items-center gap-2">
            Save & Continue
            <ArrowRight size={16} />
          </span>
        </PrimaryLink>
      </div>
    </>
  );
}
