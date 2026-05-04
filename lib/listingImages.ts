import type { ListingState } from "@/lib/types";

export function getPropertyPhotos(listing: ListingState) {
  return listing.propertyPhotos.length
    ? listing.propertyPhotos
    : listing.assets.propertyPhoto
      ? [listing.assets.propertyPhoto]
      : [];
}

export function getPrimaryPropertyPhoto(listing: ListingState) {
  return getPropertyPhotos(listing)[0] || "";
}
