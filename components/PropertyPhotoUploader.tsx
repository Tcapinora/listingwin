"use client";

import Image from "next/image";
import { Camera, X } from "lucide-react";
import { fileToOptimizedDataUrl } from "@/lib/imageFiles";

const MAX_IMAGES = 5;

export function PropertyPhotoUploader({
  photos,
  onChange,
}: {
  photos: string[];
  onChange: (photos: string[]) => void;
}) {
  const remaining = Math.max(0, MAX_IMAGES - photos.length);

  return (
    <div className="rounded-[2rem] border border-blue-100 bg-white p-5 shadow-card">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-950">
            Live campaign photos
          </h3>
          <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">
            Upload up to 5 photos before the appraisal, or add them live in
            front of the seller. The first image becomes the hero image across
            signboards, portals, social previews, brochures, and the presentation.
          </p>
        </div>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800 ring-1 ring-blue-100">
          {photos.length}/5
        </span>
      </div>

      <label
        htmlFor="property-gallery-upload"
        className="group flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-blue-200 bg-blue-50/60 px-6 py-9 text-center transition hover:-translate-y-0.5 hover:border-blue-400 hover:bg-blue-50 sm:min-h-52"
      >
        <span className="grid h-14 w-14 place-items-center rounded-full bg-white text-blue-800 shadow-sm">
          <Camera size={22} />
        </span>
        <span className="mt-3 text-sm font-semibold text-gray-800">
          {remaining > 0
            ? "Take photos or click to upload"
            : "Maximum images added"}
        </span>
        <span className="mt-1 text-xs text-gray-500">
          Fast enough to use during the appraisal · max 5
        </span>
      </label>
      <input
        id="property-gallery-upload"
        type="file"
        accept="image/*"
        multiple
        disabled={remaining === 0}
        className="sr-only"
        onChange={async (event) => {
          const files = Array.from(event.target.files || []).slice(0, remaining);

          if (!files.length) {
            return;
          }

          const nextPhotos = await Promise.all(
            files.map((file) => fileToOptimizedDataUrl(file, 1200, 0.78)),
          );

          onChange([...photos, ...nextPhotos].slice(0, MAX_IMAGES));
          event.currentTarget.value = "";
        }}
      />

      {photos.length ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-5">
          {photos.map((photo, index) => (
            <div
              key={`${photo.slice(0, 24)}-${index}`}
              className="relative aspect-square overflow-hidden rounded-2xl border border-gray-200 bg-gray-100"
            >
              <Image
                src={photo}
                alt={`Property photo ${index + 1}`}
                fill
                className="object-cover"
                unoptimized
              />
              {index === 0 ? (
                <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-1 text-[10px] font-semibold text-gray-950 shadow-sm">
                  Main
                </span>
              ) : null}
              <button
                type="button"
                onClick={() =>
                  onChange(photos.filter((_, photoIndex) => photoIndex !== index))
                }
                className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-white/90 text-gray-700 shadow-sm"
                aria-label={`Remove property photo ${index + 1}`}
                title={`Remove property photo ${index + 1}`}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      ) : null}

      {photos.length ? (
        <p className="mt-4 rounded-2xl bg-blue-50 px-4 py-3 text-sm leading-6 text-blue-900">
          These images now flow through the live campaign previews. Open the
          Vendor Presentation and the seller will see their property inside the
          campaign instantly.
        </p>
      ) : (
        <p className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
          You can prepare the campaign first, then add real photos live when you
          arrive at the property.
        </p>
      )}
    </div>
  );
}
