"use client";

import Image from "next/image";
import { RotateCcw, Scissors } from "lucide-react";
import { cropToClipPath } from "@/lib/signboard";
import type { SignboardCrop, SignboardKey } from "@/lib/types";

const controls: Array<{
  key: keyof SignboardCrop;
  label: string;
}> = [
  { key: "top", label: "Top" },
  { key: "right", label: "Right" },
  { key: "bottom", label: "Bottom" },
  { key: "left", label: "Left" },
];

const emptyCrop: SignboardCrop = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};

export function SignboardCutoutCard({
  title,
  image,
  crop,
  signboardKey,
  onChange,
}: {
  title: string;
  image: string;
  crop: SignboardCrop;
  signboardKey: SignboardKey;
  onChange: (key: SignboardKey, crop: SignboardCrop) => void;
}) {
  if (!image) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-card">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Scissors size={16} />
            <h3 className="text-sm font-semibold text-gray-950">{title}</h3>
          </div>
          <p className="mt-1 text-sm leading-6 text-gray-500">
            Move each edge inward until only the board remains. This gives the
            overlay a cleaner cutout in front of the house.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onChange(signboardKey, emptyCrop)}
          className="grid h-9 w-9 place-items-center rounded-full border border-gray-200 text-gray-500 transition hover:border-gray-300 hover:text-gray-950"
          aria-label={`Reset ${title} cutout`}
          title={`Reset ${title} cutout`}
        >
          <RotateCcw size={15} />
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[0.95fr_1fr]">
        <div className="checkerboard relative aspect-[3/2] overflow-hidden rounded-xl border border-gray-200">
          <Image
            src={image}
            alt={`${title} cutout preview`}
            fill
            className="object-contain"
            style={{ clipPath: cropToClipPath(crop) }}
            unoptimized
          />
        </div>

        <div className="space-y-4">
          {controls.map((control) => (
            <label key={control.key} className="block">
              <span className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium text-gray-800">
                  Erase {control.label}
                </span>
                <span className="tabular-nums text-gray-500">
                  {crop[control.key]}%
                </span>
              </span>
              <input
                type="range"
                min={0}
                max={45}
                value={crop[control.key]}
                onChange={(event) =>
                  onChange(signboardKey, {
                    ...crop,
                    [control.key]: Number(event.target.value),
                  })
                }
                className="w-full accent-gray-950"
              />
            </label>
          ))}
        </div>
      </div>
    </section>
  );
}
