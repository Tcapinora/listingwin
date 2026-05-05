import type { ListingDetails } from "@/lib/types";

export function generatePropertyWriteup(details: ListingDetails) {
  const address = details.address || "this standout address";
  const headline = details.headline
    ? `${details.headline.trim().replace(/\.$/, "")}. `
    : "";
  const features = details.keyFeatures || details.notes;
  const notes = features
    ? ` Highlights include ${features.trim().replace(/\.$/, "")}.`
    : " A considered layout, inviting street presence, and broad buyer appeal make this a compelling campaign opportunity.";

  // Future AI copy generation can be connected here with a provider request that uses
  // the address, agent notes, suburb context, and approved agency tone of voice.
  return `${headline}${address} is positioned for a campaign that helps sellers feel prepared before they choose an agent.${notes} The goal is to make the first buyer impression clear, create confidence around price, and show the seller that momentum can start the moment they say yes.`;
}
