"use client";

import Image from "next/image";
import { ImagePlus, X } from "lucide-react";
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
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-card">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-950">
            Property photos
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Upload up to 5 images. The first image is used for the signboard and
            social previews.
          </p>
        </div>
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
          {photos.length}/5
        </span>
      </div>

      <label
        htmlFor="property-gallery-upload"
        className="group flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 px-6 py-8 text-center transition hover:border-gray-400"
      >
        <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-gray-700 shadow-sm">
          <ImagePlus size={20} />
        </span>
        <span className="mt-3 text-sm font-semibold text-gray-800">
          {remaining > 0 ? "Add property images" : "Maximum images added"}
        </span>
        <span className="mt-1 text-xs text-gray-500">
          PNG, JPG, or WebP · max 5
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
            files.map((file) => fileToOptimizedDataUrl(file, 1400, 0.82)),
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
              className="relative aspect-square overflow-hidden rounded-xl border border-gray-200 bg-gray-100"
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
    </div>
  );
}
