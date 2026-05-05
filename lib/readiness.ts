import type { AgentProfile, ListingState } from "@/lib/types";

export function presentationReadiness(
  listing: ListingState,
  profile: AgentProfile,
) {
  const checks = [
    {
      label: "Agent profile",
      ready: Boolean(
        (profile.agentName || listing.details.agentName).trim() &&
          (profile.agencyName || listing.details.agencyName).trim() &&
          (profile.phone || listing.details.phone).trim() &&
          (profile.email || listing.details.email).trim(),
      ),
      href: "/account",
    },
    {
      label: "Property story",
      ready: Boolean(
        listing.details.address.trim() &&
          (listing.details.headline.trim() ||
            listing.details.keyFeatures.trim() ||
            listing.details.notes.trim()),
      ),
      href: "/details",
    },
    {
      label: "Price evidence",
      ready: Boolean(
        listing.details.sellerExpectedPrice.trim() &&
          listing.details.agentPriceGuide.trim(),
      ),
      href: "/details",
    },
    {
      label: "Property photos",
      ready: Boolean(listing.propertyPhotos.length || listing.assets.propertyPhoto),
      href: "/upload",
    },
    {
      label: "Campaign visual",
      ready: Boolean(listing.assets.signboard1 || listing.assets.signboard2),
      href: "/mockups",
    },
  ];

  return {
    checks,
    readyCount: checks.filter((check) => check.ready).length,
    isReady: checks.every((check) => check.ready),
  };
}
