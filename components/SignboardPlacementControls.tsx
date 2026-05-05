"use client";

import { Maximize2, Move, RotateCcw } from "lucide-react";
import { clampOverlay } from "@/components/DraggableSignboard";
import type { OverlayState } from "@/lib/types";

const controls: Array<{
  key: keyof OverlayState;
  label: string;
  icon: "move" | "size";
  min: number;
  max: number;
}> = [
  { key: "x", label: "Left / right", icon: "move", min: 0, max: 96 },
  { key: "y", label: "Up / down", icon: "move", min: 0, max: 96 },
  { key: "width", label: "Size", icon: "size", min: 4, max: 95 },
];

export function SignboardPlacementControls({
  overlay,
  onChange,
}: {
  overlay: OverlayState;
  onChange: (overlay: OverlayState) => void;
}) {
  return (
    <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-blue-950">
            Signboard placement
          </h3>
          <p className="mt-1 text-sm text-blue-900/70">
            Drag the board on the photo, or fine tune position and size here.
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            onChange({
              x: 58,
              y: 58,
              width: 24,
            })
          }
          className="grid h-9 w-9 place-items-center rounded-full border border-blue-100 bg-white text-blue-700 transition hover:border-blue-300"
          aria-label="Reset board placement"
          title="Reset board placement"
        >
          <RotateCcw size={15} />
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {controls.map((control) => (
          <label key={control.key} className="block rounded-xl bg-white p-4">
            <span className="mb-3 flex items-center justify-between gap-3 text-sm">
              <span className="inline-flex items-center gap-2 font-medium text-gray-800">
                {control.icon === "size" ? (
                  <Maximize2 size={15} />
                ) : (
                  <Move size={15} />
                )}
                {control.label}
              </span>
              <span className="tabular-nums text-gray-500">
                {Math.round(overlay[control.key])}%
              </span>
            </span>
            <input
              type="range"
              min={control.min}
              max={control.max}
              value={overlay[control.key]}
              onChange={(event) =>
                onChange(
                  clampOverlay({
                    ...overlay,
                    [control.key]: Number(event.target.value),
                  }),
                )
              }
              className="w-full accent-blue-700"
            />
          </label>
        ))}
      </div>
    </div>
  );
}
