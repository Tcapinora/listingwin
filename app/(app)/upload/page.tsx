"use client";

import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { SecondaryLink, PrimaryLink } from "@/components/Buttons";
import { PropertyPhotoUploader } from "@/components/PropertyPhotoUploader";
import { useListing } from "@/components/ListingProvider";
import { getPropertyPhotos } from "@/lib/listingImages";

export default function UploadPage() {
  const { listing, setListing } = useListing();
  const propertyPhotos = getPropertyPhotos(listing);

  return (
    <>
      <PageHeader
        eyebrow="Step 3"
        title="Upload the property photos."
        description="Add up to 5 photos. The first photo becomes the main image used across the presentation."
        action={
          <PrimaryLink href="/mockups">
            <span className="inline-flex items-center gap-2">
              Next: Edit images
              <ArrowRight size={16} />
            </span>
          </PrimaryLink>
        }
      />

      <section className="max-w-3xl rounded-3xl border border-gray-200 bg-white p-6 shadow-card">
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
      </section>

      <section className="mt-6 max-w-3xl rounded-3xl border border-blue-100 bg-blue-50/70 p-5">
        <p className="text-sm font-semibold text-blue-950">
          Next screen: signboards, open-home buyers, brochure, portal, and
          social previews.
        </p>
        <p className="mt-2 text-sm leading-6 text-blue-900/70">
          Keeping this page to property photos makes the setup faster and avoids
          duplicate upload decisions.
        </p>
      </section>

      <div className="mt-8 flex flex-wrap justify-between gap-3">
        <SecondaryLink href="/create">Back to listing details</SecondaryLink>
        <PrimaryLink href="/mockups">
          <span className="inline-flex items-center gap-2">
            Next: Edit images
            <ArrowRight size={16} />
          </span>
        </PrimaryLink>
      </div>
    </>
  );
}
