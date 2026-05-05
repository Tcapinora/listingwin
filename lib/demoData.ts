import type { AgentProfile, ListingState } from "@/lib/types";
import { emptyListingState } from "@/lib/types";

const housePhoto = "/demo/property-front.svg";
const interiorPhoto = "/demo/property-interior.svg";
const signboard = "/demo/signboard.svg";

export const demoAgentProfile: AgentProfile = {
  agentName: "Alex Morgan",
  agencyName: "ListingWin Realty",
  agencyWebsite: "https://listingwin.example",
  agentInstagramUrl: "https://instagram.com/alexmorganproperty",
  agentFacebookUrl: "https://facebook.com/alexmorganproperty",
  agencyInstagramUrl: "https://instagram.com/listingwinrealty",
  agencyFacebookUrl: "https://facebook.com/listingwinrealty",
  phone: "0412 345 678",
  email: "alex@listingwin.example",
  agencyLogo: "",
  agencyLogos: [],
  brandColor: "#1d4ed8",
  instagramTemplate: "",
  facebookTemplate: "",
};

export const demoListingState: ListingState = {
  ...emptyListingState,
  details: {
    ...emptyListingState.details,
    address: "42 Seaview Avenue, Paddington",
    headline: "Elevated character home with a premium family lifestyle",
    propertyType: "House",
    bedrooms: "4",
    bathrooms: "2",
    carSpaces: "2",
    keyFeatures:
      "renovated kitchen, leafy outlook, covered entertaining, strong street appeal, and family-friendly layout",
    agentName: demoAgentProfile.agentName,
    agencyName: demoAgentProfile.agencyName,
    agencyWebsite: demoAgentProfile.agencyWebsite,
    phone: demoAgentProfile.phone,
    email: demoAgentProfile.email,
    notes:
      "elevated street presence, renovated interiors, strong family appeal, leafy outlook, and a premium first impression from the street",
    sellerExpectedPrice: "$1,350,000",
    agentPriceGuide: "$1,280,000",
    priceNotes:
      "Seller expectation is above the guide. Use comparable homes, first-week enquiry quality, and buyer feedback to frame the pricing conversation.",
    brochureStatus: "Auction",
    brochurePrice: "Auction",
  },
  comparableProperties: [
    {
      address: "18 Market Street, Paddington",
      beds: "4",
      baths: "2",
      cars: "2",
      blockSize: "506m2",
      url: "https://www.realestate.com.au/",
    },
    {
      address: "9 Outlook Road, Bardon",
      beds: "4",
      baths: "3",
      cars: "2",
      blockSize: "607m2",
      url: "https://www.domain.com.au/",
    },
    {
      address: "61 Ridge Lane, Red Hill",
      beds: "3",
      baths: "2",
      cars: "1",
      blockSize: "405m2",
      url: "https://www.realestate.com.au/",
    },
  ],
  saleCalendarEvents: [
    {
      id: "demo-photo",
      date: "2026-05-08",
      title: "Photography and floorplan",
      type: "Photography",
    },
    {
      id: "demo-launch",
      date: "2026-05-15",
      title: "Campaign launch",
      type: "Launch",
    },
    {
      id: "demo-open",
      date: "2026-05-17",
      title: "First open home",
      type: "Open home",
    },
  ],
  propertyPhotos: [housePhoto, interiorPhoto],
  assets: {
    ...emptyListingState.assets,
    propertyPhoto: housePhoto,
    signboard1: signboard,
  },
};
