"use client";

import Image from "next/image";
import { ImagePlus, MoveDiagonal2 } from "lucide-react";
import { PointerEvent, useRef, useState } from "react";
import type { OpenHomeOptionKey, OverlayState } from "@/lib/types";

type DragMode = "move" | "resize";

const MIN_WIDTH = 7;
const MAX_WIDTH = 80;

export function clampOpenHomeOverlay(overlay: OverlayState): OverlayState {
  const width = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, overlay.width));

  return {
    width,
    x: Math.max(0, Math.min(100 - width, overlay.x)),
    y: Math.max(0, Math.min(88, overlay.y)),
  };
}

export function DraggableOpenHome({
  propertyPhoto,
  buyers,
  activeBuyer,
  onSelectBuyer,
  onChange,
}: {
  propertyPhoto: string;
  buyers: Array<{
    key: OpenHomeOptionKey;
    label: string;
    src: string;
    overlay: OverlayState;
  }>;
  activeBuyer: OpenHomeOptionKey;
  onSelectBuyer: (key: OpenHomeOptionKey) => void;
  onChange: (key: OpenHomeOptionKey, overlay: OverlayState) => void;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<DragMode | null>(null);
  const [start, setStart] = useState({
    x: 0,
    y: 0,
    overlay: buyers.find((buyer) => buyer.key === activeBuyer)?.overlay || {
      x: 56,
      y: 50,
      width: 24,
    },
    key: activeBuyer,
  });

  const updateFromPointer = (event: PointerEvent<HTMLDivElement>) => {
    if (!mode || !stageRef.current) {
      return;
    }

    const rect = stageRef.current.getBoundingClientRect();
    const dx = ((event.clientX - start.x) / rect.width) * 100;
    const dy = ((event.clientY - start.y) / rect.height) * 100;

    if (mode === "move") {
      onChange(
        start.key,
        clampOpenHomeOverlay({
          ...start.overlay,
          x: start.overlay.x + dx,
          y: start.overlay.y + dy,
        }),
      );
      return;
    }

    onChange(
      start.key,
      clampOpenHomeOverlay({
        ...start.overlay,
        width: start.overlay.width + dx + dy,
      }),
    );
  };

  const beginDrag = (
    event: PointerEvent<HTMLDivElement | HTMLButtonElement>,
    nextMode: DragMode,
    key: OpenHomeOptionKey,
    overlay: OverlayState,
  ) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    onSelectBuyer(key);
    setMode(nextMode);
    setStart({
      x: event.clientX,
      y: event.clientY,
      overlay,
      key,
    });
  };

  return (
    <div
      ref={stageRef}
      className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-blue-50 shadow-soft"
      onPointerMove={updateFromPointer}
      onPointerUp={() => setMode(null)}
      onPointerCancel={() => setMode(null)}
    >
      {propertyPhoto ? (
        <Image
          src={propertyPhoto}
          alt="Property with open home buyer mockup"
          fill
          className="object-cover"
          priority
          unoptimized
        />
      ) : (
        <div className="checkerboard grid h-full place-items-center text-center text-sm text-gray-500">
          Upload property photos first to create open home previews.
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

      {propertyPhoto ? (
        buyers.map((buyer) => (
          <div
            key={buyer.key}
            role="button"
            tabIndex={0}
            title={`Drag to position ${buyer.label}`}
            onPointerDown={(event) =>
              beginDrag(event, "move", buyer.key, buyer.overlay)
            }
            className={`absolute cursor-move touch-none select-none transition ${
              activeBuyer === buyer.key
                ? "ring-2 ring-blue-300 ring-offset-2 ring-offset-transparent"
                : ""
            }`}
            style={{
              left: `${buyer.overlay.x}%`,
              top: `${buyer.overlay.y}%`,
              width: `${buyer.overlay.width}%`,
            }}
          >
            <Image
              src={buyer.src}
              alt={buyer.label}
              width={520}
              height={520}
              className="h-auto w-full drop-shadow-[0_14px_18px_rgba(0,0,0,0.32)]"
              draggable={false}
              unoptimized
            />
            {activeBuyer === buyer.key ? (
              <button
                type="button"
                onPointerDown={(event) =>
                  beginDrag(event, "resize", buyer.key, buyer.overlay)
                }
                className="absolute -bottom-3 -right-3 grid h-8 w-8 touch-none place-items-center rounded-full bg-blue-700 text-white shadow-card"
                aria-label={`Resize ${buyer.label}`}
                title={`Resize ${buyer.label}`}
              >
                <MoveDiagonal2 size={14} />
              </button>
            ) : null}
          </div>
        ))
      ) : (
        <div className="absolute inset-x-6 bottom-6 rounded-2xl bg-white/92 p-5 text-center shadow-card backdrop-blur">
          <ImagePlus className="mx-auto text-gray-500" size={24} />
          <p className="mt-3 text-sm font-semibold text-gray-950">
            Add property photos to stage an open home scene.
          </p>
        </div>
      )}
    </div>
  );
}
