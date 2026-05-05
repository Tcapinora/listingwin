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
          Media for the vendor presentation
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          Add the property images
        </h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
          Upload the images the vendor will see in the marketing previews.
        </p>
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
          Keep moving if you need to.
        </p>
        <p className="mt-2 text-sm leading-6 text-blue-900/70">
          You can continue without media, then add photos later before you
          preview the vendor presentation.
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
