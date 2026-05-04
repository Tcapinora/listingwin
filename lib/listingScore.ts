import type { AgentProfile, ListingState } from "@/lib/types";

export type ListingWinInsight = {
  score: number;
  label: string;
  suggestions: string[];
  completedItems: string[];
  missingItems: string[];
};

function clampScore(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

export function getListingWinInsight(
  listing: ListingState,
  profile: AgentProfile,
): ListingWinInsight {
  const photoCount = Math.max(
    listing.propertyPhotos.length,
    listing.assets.propertyPhoto ? 1 : 0,
  );
  const hasSignboard = Boolean(
    listing.assets.signboard1 || listing.assets.signboard2,
  );
  const hasSecondSignboard = Boolean(
    listing.assets.signboard1 && listing.assets.signboard2,
  );
  const hasAddress = Boolean(listing.details.address.trim());
  const hasNotes = Boolean(listing.details.notes.trim());
  const hasProfile = Boolean(
    (profile.agentName || listing.details.agentName).trim() &&
      (profile.agencyName || listing.details.agencyName).trim() &&
      (profile.phone || listing.details.phone).trim() &&
      (profile.email || listing.details.email).trim(),
  );
  const hasBrand = Boolean(profile.agencyLogo || listing.assets.agencyLogo);
  const hasSocials = Boolean(
    profile.agentInstagramUrl ||
      profile.agentFacebookUrl ||
      profile.agencyInstagramUrl ||
      profile.agencyFacebookUrl,
  );

  const completedItems: string[] = [];
  const missingItems: string[] = [];
  let score = 20;

  if (hasAddress) {
    score += 10;
    completedItems.push("Property address is ready");
  } else {
    missingItems.push("Add the property address");
  }

  if (photoCount >= 5) {
    score += 25;
    completedItems.push("Full 5-photo property set uploaded");
  } else if (photoCount >= 3) {
    score += 20;
    completedItems.push("Strong property photo set uploaded");
  } else if (photoCount >= 1) {
    score += 12;
    completedItems.push("Hero property photo uploaded");
  } else {
    missingItems.push("Upload at least one strong front photo");
  }

  if (hasSignboard) {
    score += hasSecondSignboard ? 15 : 12;
    completedItems.push(
      hasSecondSignboard
        ? "Two signboard options are ready"
        : "Signboard option is ready",
    );
  } else {
    missingItems.push("Upload a signboard option");
  }

  if (hasProfile) {
    score += 15;
    completedItems.push("Agent contact details are complete");
  } else {
    missingItems.push("Complete agent contact details");
  }

  if (hasBrand) {
    score += 8;
    completedItems.push("Agency branding is included");
  } else {
    missingItems.push("Add the agency logo");
  }

  if (hasSocials) {
    score += 5;
    completedItems.push("Social profile links are saved");
  } else {
    missingItems.push("Add agent and agency social links");
  }

  if (hasNotes) {
    score += 2;
  }

  const suggestions: string[] = [];

  suggestions.push(
    "Declutter surfaces, remove personal items, hide bins and hoses, and make the entry feel open so buyers focus on the home rather than the owner’s belongings.",
  );
  suggestions.push(
    "Freshen the front presentation before photography: trim garden edges, sweep paths, clean windows, and add simple greenery or a clean doormat near the entry.",
  );
  suggestions.push(
    "Style the main living area with light, space, and warmth: open curtains, reduce bulky furniture, add neutral cushions or flowers, and make the room feel easy to inspect.",
  );

  if (suggestions.length > 3) {
    suggestions.length = 3;
  }

  return {
    score: clampScore(score),
    label:
      score >= 85
        ? "Market-ready"
        : score >= 70
          ? "Strong pitch"
          : score >= 50
            ? "Needs polish"
            : "Early draft",
    suggestions,
    completedItems,
    missingItems,
  };
}
