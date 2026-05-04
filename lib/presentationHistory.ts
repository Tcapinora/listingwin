"use client";

import type { AgentProfile, ListingState, SavedPresentation } from "@/lib/types";

const STORAGE_KEY = "listingwin-saved-presentations";
const LEGACY_STORAGE_KEY = "listingmockup-saved-presentations";
const MAX_PRESENTATIONS = 24;

export function readSavedPresentations(): SavedPresentation[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored =
      window.localStorage.getItem(STORAGE_KEY) ||
      window.localStorage.getItem(LEGACY_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function writeSavedPresentations(presentations: SavedPresentation[]) {
  if (typeof window === "undefined") {
    return;
  }

  // MVP persistence is localStorage. In production this becomes a database
  // table keyed to the authenticated agent account and agency workspace.
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(presentations.slice(0, MAX_PRESENTATIONS)),
    );
    window.localStorage.removeItem(LEGACY_STORAGE_KEY);
  } catch {
    // Production share links should save to a database with image URLs instead
    // of storing full image data in localStorage.
  }
}

export function savePresentationSnapshot(
  listing: ListingState,
  profile: AgentProfile,
) {
  const now = new Date().toISOString();
  const address = listing.details.address || "Untitled listing";
  const existing = readSavedPresentations();
  const presentation: SavedPresentation = {
    id: crypto.randomUUID(),
    title: address,
    address,
    createdAt: now,
    updatedAt: now,
    listing,
    profile,
  };

  writeSavedPresentations([presentation, ...existing]);
  return presentation;
}

export function findSavedPresentation(id: string) {
  return readSavedPresentations().find(
    (presentation) => presentation.id === id,
  );
}

export function getShareUrl(id: string) {
  if (typeof window === "undefined") {
    return `/share/${id}`;
  }

  return `${window.location.origin}/share/${id}`;
}

export function deleteSavedPresentation(id: string) {
  const nextPresentations = readSavedPresentations().filter(
    (presentation) => presentation.id !== id,
  );
  writeSavedPresentations(nextPresentations);
  return nextPresentations;
}
