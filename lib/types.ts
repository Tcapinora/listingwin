export type ListingDetails = {
  address: string;
  headline: string;
  propertyType: string;
  bedrooms: string;
  bathrooms: string;
  carSpaces: string;
  keyFeatures: string;
  agentName: string;
  agencyName: string;
  agencyWebsite: string;
  phone: string;
  email: string;
  notes: string;
  sellerExpectedPrice: string;
  agentPriceGuide: string;
  priceNotes: string;
  brochureStatus: "For sale" | "Auction" | "Price guide TBC" | "Show price";
  brochurePrice: string;
};

export type AssetKey =
  | "propertyPhoto"
  | "agencyLogo"
  | "signboard1"
  | "signboard2"
  | "instagramTemplate"
  | "facebookTemplate"
  | "sitePlanAerial";

export type ListingAssets = Record<AssetKey, string>;

export type OverlayState = {
  x: number;
  y: number;
  width: number;
};

export type SignboardCrop = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export type SignboardKey = "signboard1" | "signboard2";

export type ComparableProperty = {
  address: string;
  suburb?: string;
  state?: string;
  soldPrice?: string;
  saleDate?: string;
  beds: string;
  baths: string;
  cars: string;
  blockSize: string;
  landSize?: string;
  propertyType?: string;
  agency?: string;
  agentName?: string;
  description?: string;
  notes?: string;
  url: string;
  sourceUrl?: string;
};

export type SaleCalendarEvent = {
  id: string;
  date: string;
  title: string;
  type: string;
  time?: string;
  notes?: string;
  supplier?: string;
  contact?: string;
  taskDetails?: string;
};

export type AgentPitchContent = {
  ourDifference: string;
  teamExperience: string;
  communicationProcess: string;
  buyerDemand: string;
  aboutAgent: string;
  ourApproach: string;
};

export type WorkspaceChecklistItem = {
  done: boolean;
  subtasks: Record<string, boolean>;
  notes: string;
};

export type BuyerLeadStatus = "Hot" | "Warm" | "Cold";
export type BuyerContactType = "Buyer" | "Buyer Agent";

export type BuyerLead = {
  id: string;
  name: string;
  phone: string;
  contactType: BuyerContactType;
  status: BuyerLeadStatus;
  tags: string[];
  budgetMin: string;
  budgetMax: string;
  suburbs: string;
  beds: string;
  notes: string;
  lastContact: string;
  nextFollowUp: string;
};

export type FollowUpReminder = {
  id: string;
  title: string;
  dueDate: string;
  leadType: BuyerLeadStatus;
  suggestedMessage: string;
  done: boolean;
};

export type ListingState = {
  details: ListingDetails;
  assets: ListingAssets;
  comparableProperties: ComparableProperty[];
  saleCalendarEvents: SaleCalendarEvent[];
  saleCalendarNotes: string;
  saleCalendarTrades: string;
  buyerLeads: BuyerLead[];
  followUpReminders: FollowUpReminder[];
  agentPitchContent: AgentPitchContent;
  workspaceChecklist: Record<string, WorkspaceChecklistItem>;
  hiddenVendorReportSections: string[];
  appraisalSourceUrls: string[];
  propertyPhotos: string[];
  activeSignboard: SignboardKey;
  signboardCrops: Record<SignboardKey, SignboardCrop>;
  signboardOverlays: Record<SignboardKey, OverlayState>;
  overlay: OverlayState;
};

export type AgentProfile = {
  agentName: string;
  agencyName: string;
  agencyAddress: string;
  officeDetails: string;
  agencyWebsite: string;
  agentInstagramUrl: string;
  agentFacebookUrl: string;
  agencyInstagramUrl: string;
  agencyFacebookUrl: string;
  phone: string;
  email: string;
  agentTeamPhotos: string[];
  agencyLogo: string;
  agencyLogos: string[];
  brandColor: string;
  instagramTemplate: string;
  facebookTemplate: string;
  photographyMorning: string[];
  photographyAfternoon: string[];
  photographyTwilight: string[];
  defaultMarketingText: string;
  defaultPresentationIntro: string;
  defaultAppraisalDisclaimer: string;
  defaultVendorFollowUpMessage: string;
};

export type SavedPresentation = {
  id: string;
  title: string;
  address: string;
  createdAt: string;
  updatedAt: string;
  listing: ListingState;
  profile: AgentProfile;
};

export const emptyAgentProfile: AgentProfile = {
  agentName: "",
  agencyName: "",
  agencyAddress: "",
  officeDetails: "",
  agencyWebsite: "",
  agentInstagramUrl: "",
  agentFacebookUrl: "",
  agencyInstagramUrl: "",
  agencyFacebookUrl: "",
  phone: "",
  email: "",
  agentTeamPhotos: [],
  agencyLogo: "",
  agencyLogos: [],
  brandColor: "#3563E0",
  instagramTemplate: "",
  facebookTemplate: "",
  photographyMorning: [],
  photographyAfternoon: [],
  photographyTwilight: [],
  defaultMarketingText: "",
  defaultPresentationIntro: "",
  defaultAppraisalDisclaimer: "",
  defaultVendorFollowUpMessage: "",
};

export const emptyListingState: ListingState = {
  details: {
    address: "",
    headline: "",
    propertyType: "",
    bedrooms: "",
    bathrooms: "",
    carSpaces: "",
    keyFeatures: "",
    agentName: "",
    agencyName: "",
    agencyWebsite: "",
    phone: "",
    email: "",
    notes: "",
    sellerExpectedPrice: "",
    agentPriceGuide: "",
    priceNotes: "",
    brochureStatus: "For sale",
    brochurePrice: "",
  },
  assets: {
    propertyPhoto: "",
    agencyLogo: "",
    signboard1: "",
    signboard2: "",
    instagramTemplate: "",
    facebookTemplate: "",
    sitePlanAerial: "",
  },
  comparableProperties: [
    {
      address: "",
      suburb: "",
      state: "",
      soldPrice: "",
      saleDate: "",
      beds: "",
      baths: "",
      cars: "",
      blockSize: "",
      landSize: "",
      propertyType: "",
      agency: "",
      agentName: "",
      description: "",
      notes: "",
      url: "",
      sourceUrl: "",
    },
    {
      address: "",
      suburb: "",
      state: "",
      soldPrice: "",
      saleDate: "",
      beds: "",
      baths: "",
      cars: "",
      blockSize: "",
      landSize: "",
      propertyType: "",
      agency: "",
      agentName: "",
      description: "",
      notes: "",
      url: "",
      sourceUrl: "",
    },
    {
      address: "",
      suburb: "",
      state: "",
      soldPrice: "",
      saleDate: "",
      beds: "",
      baths: "",
      cars: "",
      blockSize: "",
      landSize: "",
      propertyType: "",
      agency: "",
      agentName: "",
      description: "",
      notes: "",
      url: "",
      sourceUrl: "",
    },
  ],
  saleCalendarEvents: [],
  saleCalendarNotes: "",
  saleCalendarTrades: "",
  agentPitchContent: {
    ourDifference: "",
    teamExperience: "",
    communicationProcess: "",
    buyerDemand: "",
    aboutAgent: "",
    ourApproach: "",
  },
  workspaceChecklist: {},
  hiddenVendorReportSections: [],
  appraisalSourceUrls: [],
  buyerLeads: [
    {
      id: "buyer-1",
      name: "Sarah and Tom",
      phone: "0412 880 214",
      contactType: "Buyer",
      status: "Hot",
      tags: ["Family buyer", "Upsizer", "Finance approved"],
      budgetMin: "$1,150,000",
      budgetMax: "$1,400,000",
      suburbs: "Paddington, Bardon, Red Hill",
      beds: "4",
      notes: "Family buyer. Wants renovated character home, yard, and school access.",
      lastContact: "2026-05-01",
      nextFollowUp: "2026-05-04",
    },
    {
      id: "buyer-2",
      name: "Mia Chen",
      phone: "0431 440 908",
      contactType: "Buyer",
      status: "Warm",
      tags: ["Investor", "Local buyer"],
      budgetMin: "$1,000,000",
      budgetMax: "$1,250,000",
      suburbs: "Paddington, Auchenflower, Toowong",
      beds: "3",
      notes: "Investor-owner hybrid. Strong on location, more cautious on renovation spend.",
      lastContact: "2026-04-29",
      nextFollowUp: "2026-05-06",
    },
    {
      id: "buyer-3",
      name: "Daniel Brooks",
      phone: "0409 118 732",
      contactType: "Buyer Agent",
      status: "Cold",
      tags: ["Active brief", "Inner-west specialist", "Multiple clients"],
      budgetMin: "$900,000",
      budgetMax: "$1,100,000",
      suburbs: "Red Hill, Kelvin Grove, Ashgrove",
      beds: "3",
      notes: "Price sensitive. May inspect if guide is realistic or competition is low.",
      lastContact: "2026-04-20",
      nextFollowUp: "2026-05-10",
    },
  ],
  followUpReminders: [
    {
      id: "follow-1",
      title: "Call matched hot buyers",
      dueDate: "2026-05-04",
      leadType: "Hot",
      suggestedMessage:
        "I am appraising a property that fits what you have been waiting for. If the seller lists, I want you near the front of the inspection list.",
      done: false,
    },
    {
      id: "follow-2",
      title: "Send seller appraisal follow-up",
      dueDate: "2026-05-05",
      leadType: "Warm",
      suggestedMessage:
        "Thanks again for walking me through the home. I have prepared the campaign preview, buyer match list, and next-step plan so you can review everything while it is fresh.",
      done: false,
    },
  ],
  propertyPhotos: [],
  activeSignboard: "signboard1",
  signboardCrops: {
    signboard1: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    signboard2: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
  },
  signboardOverlays: {
    signboard1: {
      x: 58,
      y: 58,
      width: 24,
    },
    signboard2: {
      x: 50,
      y: 58,
      width: 24,
    },
  },
  overlay: {
    x: 58,
    y: 58,
    width: 24,
  },
};
