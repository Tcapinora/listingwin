import type { ListingState } from "@/lib/types";

function parsePrice(value: string) {
  const digits = value.replace(/[^0-9]/g, "");
  return digits ? Number(digits) : 0;
}

function formatPrice(value: number) {
  if (!value) {
    return "Price not set";
  }

  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function getPriceConfidence(listing: ListingState) {
  const sellerPrice = parsePrice(listing.details.sellerExpectedPrice);
  const guidePrice = parsePrice(listing.details.agentPriceGuide);
  const difference = sellerPrice && guidePrice ? sellerPrice - guidePrice : 0;
  const gapPercent =
    sellerPrice && guidePrice ? Math.round((difference / guidePrice) * 100) : 0;
  const hasPhotos = Boolean(
    listing.propertyPhotos.length || listing.assets.propertyPhoto,
  );
  const hasNotes = Boolean(listing.details.notes || listing.details.priceNotes);
  const reviewedProperties = listing.comparableProperties.filter(
    (property) => property.address || property.url,
  ).length;

  let score = 30;
  if (sellerPrice) score += 12;
  if (guidePrice) score += 18;
  if (reviewedProperties >= 3) score += 22;
  else if (reviewedProperties === 2) score += 16;
  else if (reviewedProperties === 1) score += 9;
  if (sellerPrice && guidePrice && Math.abs(gapPercent) <= 5) score += 10;
  if (sellerPrice && guidePrice && Math.abs(gapPercent) > 10) score -= 8;
  if (hasPhotos) score += 5;
  if (hasNotes) score += 5;

  const confidence = Math.max(15, Math.min(95, score));
  const evidence = [
    {
      label: "Seller expectation",
      value: formatPrice(sellerPrice),
      ready: Boolean(sellerPrice),
    },
    {
      label: "Agent guide",
      value: formatPrice(guidePrice),
      ready: Boolean(guidePrice),
    },
    {
      label: "Market properties reviewed",
      value: `${reviewedProperties}/3`,
      ready: reviewedProperties > 0,
    },
  ];

  return {
    confidence,
    sellerPrice: formatPrice(sellerPrice),
    guidePrice: formatPrice(guidePrice),
    gapPercent,
    reviewedProperties,
    gapLabel:
      !sellerPrice || !guidePrice
        ? "Add seller expectation and agent guide"
        : Math.abs(gapPercent) <= 5
          ? "Seller expectation is close to the current guide"
          : gapPercent > 5
            ? "Seller expectation is above the current guide"
            : "Seller expectation is below the current guide",
    evidence,
  };
}
