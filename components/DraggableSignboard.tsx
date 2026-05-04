"use client";

import Image from "next/image";
import { ImagePlus, MoveDiagonal2 } from "lucide-react";
import { PointerEvent, useRef, useState } from "react";
import { cropToClipPath } from "@/lib/signboard";
import type { OverlayState, SignboardCrop } from "@/lib/types";

type DragMode = "move" | "resize";

const MIN_BOARD_WIDTH = 4;
const MAX_BOARD_WIDTH = 95;
const STAGE_ASPECT = 16 / 10;
const BOARD_ASPECT = 3 / 2;

export function clampOverlay(overlay: OverlayState): OverlayState {
  const width = Math.max(
    MIN_BOARD_WIDTH,
    Math.min(MAX_BOARD_WIDTH, overlay.width),
  );
  const heightAsStagePercent = (width / BOARD_ASPECT) * STAGE_ASPECT;

  return {
    width,
    x: Math.max(0, Math.min(100 - width, overlay.x)),
    y: Math.max(0, Math.min(100 - heightAsStagePercent, overlay.y)),
  };
}

export function DraggableSignboard({
  propertyPhoto,
  signboard,
  crop,
  overlay,
  onChange,
}: {
  propertyPhoto: string;
  signboard: string;
  crop: SignboardCrop;
  overlay: OverlayState;
  onChange: (overlay: OverlayState) => void;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<DragMode | null>(null);
  const [start, setStart] = useState({
    x: 0,
    y: 0,
    overlay,
  });

  const updateFromPointer = (event: PointerEvent<HTMLDivElement>) => {
    if (!mode || !stageRef.current) {
      return;
    }

    const rect = stageRef.current.getBoundingClientRect();
    const dx = ((event.clientX - start.x) / rect.width) * 100;
    const dy = ((event.clientY - start.y) / rect.height) * 100;

    if (mode === "move") {
      onChange(clampOverlay({
        ...overlay,
        x: start.overlay.x + dx,
        y: start.overlay.y + dy,
      }));
      return;
    }

    onChange(clampOverlay({
      ...overlay,
      width: start.overlay.width + dx + dy,
    }));
  };

  const beginDrag = (
    event: PointerEvent<HTMLDivElement | HTMLButtonElement>,
    nextMode: DragMode,
  ) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    setMode(nextMode);
    setStart({
      x: event.clientX,
      y: event.clientY,
      overlay,
    });
  };

  return (
    <div
      ref={stageRef}
      className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-gray-100 shadow-soft"
      onPointerMove={updateFromPointer}
      onPointerUp={() => setMode(null)}
      onPointerCancel={() => setMode(null)}
    >
      {propertyPhoto ? (
        <Image
          src={propertyPhoto}
          alt="Property front with signboard mockup"
          fill
          className="object-cover"
          priority
          unoptimized
        />
      ) : (
        <div className="checkerboard grid h-full place-items-center text-center text-sm text-gray-500">
          Upload a property photo to build the street mockup.
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />

      {signboard ? (
        <div
          role="button"
          tabIndex={0}
          title="Drag to position signboard"
          onPointerDown={(event) => beginDrag(event, "move")}
          className="absolute cursor-move touch-none select-none shadow-2xl"
          style={{
            left: `${overlay.x}%`,
            top: `${overlay.y}%`,
            width: `${overlay.width}%`,
            aspectRatio: "3 / 2",
          }}
        >
          <Image
            src={signboard}
            alt="Selected signboard"
            fill
            className="object-contain drop-shadow-[0_10px_18px_rgba(0,0,0,0.35)]"
            style={{ clipPath: cropToClipPath(crop) }}
            unoptimized
          />
          <button
            type="button"
            onPointerDown={(event) => beginDrag(event, "resize")}
            className="absolute -bottom-3 -right-3 grid h-8 w-8 touch-none place-items-center rounded-full bg-gray-950 text-white shadow-card"
            aria-label="Resize signboard"
            title="Resize signboard"
          >
            <MoveDiagonal2 size={14} />
          </button>
        </div>
      ) : propertyPhoto ? (
        <div className="absolute inset-x-6 bottom-6 rounded-2xl bg-white/92 p-5 text-center shadow-card backdrop-blur">
          <ImagePlus className="mx-auto text-gray-500" size={24} />
          <p className="mt-3 text-sm font-semibold text-gray-950">
            Add a signboard option to place it on the property photo.
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Once uploaded, drag it anywhere on the image and resize it below.
          </p>
        </div>
      ) : null}
    </div>
  );
}
