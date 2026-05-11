"use client";

import Image from "next/image";
import { ImagePlus, Loader2, Replace, X } from "lucide-react";
import { useState } from "react";
import { fileToOptimizedDataUrl } from "@/lib/imageFiles";
import type { AssetKey } from "@/lib/types";

export function UploadCard({
  label,
  hint,
  value,
  assetKey,
  onChange,
}: {
  label: string;
  hint: string;
  value: string;
  assetKey: AssetKey;
  onChange: (assetKey: AssetKey, value: string) => void;
}) {
  const inputId = `upload-${assetKey}`;
  const [uploading, setUploading] = useState(false);
  const shouldContain =
    assetKey === "agencyLogo" ||
    assetKey === "signboard1" ||
    assetKey === "signboard2";

  return (
    <div className="rounded-[1.75rem] border border-gray-200 bg-white p-4 shadow-card sm:p-5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-950">{label}</h3>
          <p className="mt-1 text-sm text-gray-500">{hint}</p>
        </div>
        {value ? (
          <button
            type="button"
            onClick={() => onChange(assetKey, "")}
            className="grid h-11 w-11 place-items-center rounded-full border border-gray-200 text-gray-500 transition hover:border-gray-300 hover:text-gray-950"
            aria-label={`Remove ${label}`}
            title={`Remove ${label}`}
          >
            <X size={16} />
          </button>
        ) : null}
      </div>

      <label
        htmlFor={inputId}
        className={`group relative flex aspect-[4/3] min-h-44 cursor-pointer items-center justify-center overflow-hidden rounded-[1.35rem] border border-dashed border-gray-300 transition hover:-translate-y-0.5 hover:border-gray-400 ${
          shouldContain ? "checkerboard bg-white" : "bg-gray-50"
        }`}
      >
        {uploading ? (
          <span className="flex flex-col items-center gap-3 px-6 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-blue-800 shadow-sm">
              <Loader2 className="animate-spin" size={20} />
            </span>
            <span className="text-sm font-semibold text-gray-800">
              Optimising image...
            </span>
          </span>
        ) : value ? (
          <>
            <Image
              src={value}
              alt={`${label} preview`}
              fill
              className={shouldContain ? "object-contain p-4" : "object-cover"}
              unoptimized
            />
            <span className="absolute inset-x-4 bottom-4 inline-flex items-center justify-center gap-2 rounded-full bg-white/92 px-4 py-2 text-sm font-semibold text-gray-900 shadow-card backdrop-blur">
              <Replace size={15} />
              Replace image
            </span>
          </>
        ) : (
          <span className="flex flex-col items-center gap-3 px-6 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-gray-700 shadow-sm">
              <ImagePlus size={20} />
            </span>
            <span className="text-sm font-semibold text-gray-800">
              Click to upload
            </span>
            <span className="text-xs text-gray-500">
              Tap from phone camera or gallery
            </span>
          </span>
        )}
        <input
          id={inputId}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0];

            if (!file) {
              return;
            }

            setUploading(true);
            void fileToOptimizedDataUrl(
              file,
              assetKey === "agencyLogo" ? 720 : 1000,
              0.8,
            )
              .then((value) => onChange(assetKey, value))
              .finally(() => setUploading(false));
            event.currentTarget.value = "";
          }}
        />
      </label>
    </div>
  );
}
