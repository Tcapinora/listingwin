"use client";

import type { AgentProfile, ListingState, SavedPresentation } from "@/lib/types";

const STORAGE_KEY = "listingwin-saved-proposals";
const MAX_PROPOSALS = 24;

export type SavedProposalText = {
  intro: string;
  sellerGoals: string;
  strategy: string;
  nextSteps: string;
};

export type SavedProposal = SavedPresentation & {
  proposalTextSections?: SavedProposalText;
  hiddenProposalSections?: string[];
  persisted?: boolean;
};

export function readSavedProposals(): SavedProposal[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function writeSavedProposals(proposals: SavedProposal[]) {
  if (typeof window === "undefined") {
    return false;
  }

  // MVP persistence is localStorage. In production this should become a
  // database record so proposal links work across devices and browsers.
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(proposals.slice(0, MAX_PROPOSALS)),
    );
    return true;
  } catch {
    // Image-heavy localStorage can fill up. Production should store image URLs.
    return false;
  }
}

export function saveProposalSnapshot(
  listing: ListingState,
  profile: AgentProfile,
  options: {
    proposalTextSections?: SavedProposalText;
    hiddenProposalSections?: string[];
  } = {},
) {
  const now = new Date().toISOString();
  const address = listing.details.address || "Untitled proposal";
  const existing = readSavedProposals();
  const proposal: SavedProposal = {
    id: crypto.randomUUID(),
    title: `${address} proposal`,
    address,
    createdAt: now,
    updatedAt: now,
    listing,
    profile,
    proposalTextSections: options.proposalTextSections,
    hiddenProposalSections: options.hiddenProposalSections,
  };

  const persisted = writeSavedProposals([proposal, ...existing]);
  return { ...proposal, persisted };
}

export function findSavedProposal(id: string) {
  return readSavedProposals().find((proposal) => proposal.id === id);
}

export function getProposalShareUrl(id: string) {
  if (typeof window === "undefined") {
    return `/proposal/share/${id}`;
  }

  return `${window.location.origin}/proposal/share/${id}`;
}
