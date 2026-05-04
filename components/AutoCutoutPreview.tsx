"use client";

import Image from "next/image";
import { Check, Scissors } from "lucide-react";

export function AutoCutoutPreview({
  title,
  image,
}: {
  title: string;
  image: string;
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
            Background removed automatically. This transparent version is used
            when the board is placed in front of the home.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-gray-950 px-3 py-1.5 text-xs font-semibold text-white">
          <Check size={13} />
          Auto cutout
        </span>
      </div>

      <div className="checkerboard relative aspect-[3/2] overflow-hidden rounded-xl border border-gray-200">
        <Image
          src={image}
          alt={`${title} transparent preview`}
          fill
          className="object-contain"
          unoptimized
        />
      </div>
    </section>
  );
}
