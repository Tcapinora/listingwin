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
  return `${headline}${address} is positioned for a polished, high-impact market launch.${notes} With refined presentation, confident campaign visuals, and a clear lifestyle message, the property can be introduced to buyers with the premium first impression it deserves.`;
}
