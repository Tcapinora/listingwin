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
  const nudge = (change: Partial<OverlayState>) =>
    onChange(
      clampOverlay({
        ...overlay,
        ...change,
      }),
    );

  return (
    <div className="mt-5 rounded-2xl border border-gray-200 bg-gray-50 p-4">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-950">
            Board placement
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Drag the board on the photo, or fine tune its position and size here.
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
          className="grid h-9 w-9 place-items-center rounded-full border border-gray-200 bg-white text-gray-500 transition hover:border-gray-300 hover:text-gray-950"
          aria-label="Reset board placement"
          title="Reset board placement"
        >
          <RotateCcw size={15} />
        </button>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {[
          ["Left", { x: overlay.x - 2 }],
          ["Right", { x: overlay.x + 2 }],
          ["Up", { y: overlay.y - 2 }],
          ["Down", { y: overlay.y + 2 }],
          ["Smaller", { width: overlay.width - 3 }],
          ["Larger", { width: overlay.width + 3 }],
        ].map(([label, change]) => (
          <button
            key={label as string}
            type="button"
            onClick={() => nudge(change as Partial<OverlayState>)}
            className="rounded-full border border-blue-100 bg-white px-3 py-2 text-xs font-semibold text-blue-900 transition hover:border-blue-200 hover:bg-blue-50"
          >
            {label as string}
          </button>
        ))}
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
              className="w-full accent-gray-950"
            />
          </label>
        ))}
      </div>
    </div>
  );
}
