"use client";

import { emptyListingState, ListingState } from "@/lib/types";

const STORAGE_KEY = "listingwin-state";
const LEGACY_STORAGE_KEY = "listingmockup-state";

export function readListingState(): ListingState {
  if (typeof window === "undefined") {
    return emptyListingState;
  }

  try {
    const stored =
      window.localStorage.getItem(STORAGE_KEY) ||
      window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!stored) {
      return emptyListingState;
    }

    const parsed = JSON.parse(stored);

    return {
      ...emptyListingState,
      ...parsed,
      details: {
        ...emptyListingState.details,
        ...parsed.details,
      },
      assets: {
        ...emptyListingState.assets,
        ...parsed.assets,
      },
      comparableProperties:
        parsed.comparableProperties && parsed.comparableProperties.length
          ? emptyListingState.comparableProperties.map((property, index) => ({
              ...property,
              ...parsed.comparableProperties[index],
            }))
          : emptyListingState.comparableProperties,
      saleCalendarEvents: Array.isArray(parsed.saleCalendarEvents)
        ? parsed.saleCalendarEvents
        : emptyListingState.saleCalendarEvents,
      buyerLeads: Array.isArray(parsed.buyerLeads)
        ? parsed.buyerLeads.map((buyer: Partial<ListingState["buyerLeads"][number]>) => ({
            phone: "",
            ...buyer,
          }))
        : emptyListingState.buyerLeads,
      followUpReminders: Array.isArray(parsed.followUpReminders)
        ? parsed.followUpReminders
        : emptyListingState.followUpReminders,
      propertyPhotos:
        parsed.propertyPhotos && parsed.propertyPhotos.length
          ? parsed.propertyPhotos.slice(0, 5)
          : parsed.assets?.propertyPhoto
            ? [parsed.assets.propertyPhoto]
            : emptyListingState.propertyPhotos,
      signboardCrops: {
        ...emptyListingState.signboardCrops,
        ...parsed.signboardCrops,
      },
      signboardOverlays: {
        ...emptyListingState.signboardOverlays,
        ...(parsed.signboardOverlays || {
          signboard1: parsed.overlay,
          signboard2: parsed.overlay,
        }),
      },
      activeOpenHomeOption:
        parsed.activeOpenHomeOption || emptyListingState.activeOpenHomeOption,
      activeOpenHomePhotoIndex:
        typeof parsed.activeOpenHomePhotoIndex === "number"
          ? Math.max(0, Math.min(4, parsed.activeOpenHomePhotoIndex))
          : emptyListingState.activeOpenHomePhotoIndex,
      openHomeOverlays: {
        buyers1: mergeOpenHomeOverlays(parsed.openHomeOverlays?.buyers1, "buyers1"),
        buyers2: mergeOpenHomeOverlays(parsed.openHomeOverlays?.buyers2, "buyers2"),
        buyers3: mergeOpenHomeOverlays(parsed.openHomeOverlays?.buyers3, "buyers3"),
      },
      openHomeVisible: {
        ...emptyListingState.openHomeVisible,
        ...parsed.openHomeVisible,
      },
      overlay: {
        ...emptyListingState.overlay,
        ...parsed.overlay,
      },
    };
  } catch {
    return emptyListingState;
  }
}

function mergeOpenHomeOverlays(
  overlays: ListingState["openHomeOverlays"]["buyers1"] | undefined,
  option: keyof ListingState["openHomeOverlays"],
) {
  return emptyListingState.openHomeOverlays[option].map((overlay, index) => ({
    ...overlay,
    ...(Array.isArray(overlays) ? overlays[index] : undefined),
  }));
}

export function writeListingState(state: ListingState) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem(LEGACY_STORAGE_KEY);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // LocalStorage can fill up quickly with image prototypes. Production should
    // upload originals to cloud storage and save URLs in the listing record.
    try {
      window.localStorage.clear();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // If storage is still unavailable, the in-memory state remains usable.
    }
  }
}

export function clearListingState() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
  window.localStorage.removeItem(LEGACY_STORAGE_KEY);
}
