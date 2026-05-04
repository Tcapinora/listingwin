import type { SignboardCrop } from "@/lib/types";

export function cropToClipPath(crop: SignboardCrop) {
  return `inset(${crop.top}% ${crop.right}% ${crop.bottom}% ${crop.left}%)`;
}
