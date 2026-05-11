"use client";

import { Camera, CheckCircle2, ImagePlus, Loader2 } from "lucide-react";
import { useId, useState } from "react";
import { fileToOptimizedDataUrl } from "@/lib/imageFiles";

const MAX_IMAGES = 5;

export function LiveCampaignPhotoButton({
  photos,
  onChange,
  tone = "dark",
  label = "Add live photos",
}: {
  photos: string[];
  onChange: (photos: string[]) => void;
  tone?: "dark" | "light";
  label?: string;
}) {
  const inputId = useId();
  const remaining = Math.max(0, MAX_IMAGES - photos.length);
  const [status, setStatus] = useState<"idle" | "loading" | "saved">("idle");

  return (
    <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
      <label
        htmlFor={inputId}
        className={`inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold shadow-card transition hover:-translate-y-0.5 ${
          tone === "dark"
            ? "bg-blue-700 text-white hover:bg-blue-800"
            : "bg-white text-blue-950 hover:bg-blue-50"
        } ${remaining ? "" : "pointer-events-none opacity-55"}`}
      >
        {status === "loading" ? (
          <Loader2 className="animate-spin" size={17} />
        ) : status === "saved" ? (
          <CheckCircle2 size={17} />
        ) : (
          <Camera size={17} />
        )}
        {status === "loading"
          ? "Adding photos..."
          : status === "saved"
            ? "Photos added"
            : remaining
              ? label
              : "5 photos added"}
      </label>
      <input
        id={inputId}
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        disabled={!remaining || status === "loading"}
        className="sr-only"
        onChange={async (event) => {
          const files = Array.from(event.target.files || []).slice(0, remaining);

          if (!files.length) {
            return;
          }

          setStatus("loading");
          const nextPhotos = await Promise.all(
            files.map((file) => fileToOptimizedDataUrl(file, 1200, 0.78)),
          );

          onChange([...photos, ...nextPhotos].slice(0, MAX_IMAGES));
          event.currentTarget.value = "";
          setStatus("saved");
          window.setTimeout(() => setStatus("idle"), 2200);
        }}
      />
      <span
        className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-full px-3 py-2 text-xs font-semibold ${
          tone === "dark"
            ? "bg-white/10 text-blue-100 ring-1 ring-white/10"
            : "bg-blue-50 text-blue-900 ring-1 ring-blue-100"
        }`}
      >
        <ImagePlus size={14} />
        {photos.length}/5 live campaign images
      </span>
    </div>
  );
}
