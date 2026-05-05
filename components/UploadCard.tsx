"use client";

import Image from "next/image";
import { ImagePlus, Replace, X } from "lucide-react";
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
  const shouldContain =
    assetKey === "agencyLogo" ||
    assetKey === "signboard1" ||
    assetKey === "signboard2";

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-card">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-950">{label}</h3>
          <p className="mt-1 text-sm text-gray-500">{hint}</p>
        </div>
        {value ? (
          <button
            type="button"
            onClick={() => onChange(assetKey, "")}
            className="grid h-9 w-9 place-items-center rounded-full border border-gray-200 text-gray-500 transition hover:border-gray-300 hover:text-gray-950"
            aria-label={`Remove ${label}`}
            title={`Remove ${label}`}
          >
            <X size={16} />
          </button>
        ) : null}
      </div>

      <label
        htmlFor={inputId}
        className={`group relative flex aspect-[4/3] cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed border-gray-300 transition hover:border-gray-400 ${
          shouldContain ? "checkerboard bg-white" : "bg-gray-50"
        }`}
      >
        {value ? (
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
            <span className="text-xs text-gray-500">PNG, JPG, or WebP</span>
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

            void fileToOptimizedDataUrl(
              file,
              assetKey === "agencyLogo" ? 800 : 1200,
              0.86,
            ).then((value) => onChange(assetKey, value));
            event.currentTarget.value = "";
          }}
        />
      </label>
    </div>
  );
}
