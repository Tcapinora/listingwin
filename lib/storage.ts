"use client";

import {
  emptyListingState,
  type BuyerLead,
  type ComparableProperty,
  type FollowUpReminder,
  type ListingState,
  type SaleCalendarEvent,
  type SignboardKey,
} from "@/lib/types";

const STORAGE_KEY = "listingwin-state";
const LEGACY_STORAGE_KEY = "listingmockup-state";

export function readListingState(): ListingState {
  if (typeof window === "undefined") {
    return emptyListingState;
  }

  try {
    const stored =
      window.localStorage.getItem(STORAGE_KEY) ||
      window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!stored) {
      return emptyListingState;
    }

    const parsed = JSON.parse(stored) as Partial<ListingState>;
    const normalizedComparableProperties = emptyListingState.comparableProperties.map(
      (property, index) =>
        normalizeComparableProperty(parsed.comparableProperties?.[index], property),
    );
    const normalizedPropertyPhotos =
      parsed.propertyPhotos && parsed.propertyPhotos.length
        ? parsed.propertyPhotos.filter(Boolean).slice(0, 5)
        : parsed.assets?.propertyPhoto
          ? [parsed.assets.propertyPhoto]
          : emptyListingState.propertyPhotos;
    const activeSignboard: SignboardKey =
      parsed.activeSignboard === "signboard2" ? "signboard2" : "signboard1";
    const fallbackOverlay = normalizeOverlay(parsed.overlay);

    return {
      ...emptyListingState,
      ...parsed,
      details: {
        ...emptyListingState.details,
        ...parsed.details,
      },
      assets: {
        ...emptyListingState.assets,
        ...parsed.assets,
      },
      comparableProperties: normalizedComparableProperties,
      saleCalendarEvents: Array.isArray(parsed.saleCalendarEvents)
        ? parsed.saleCalendarEvents.map(normalizeSaleCalendarEvent)
        : emptyListingState.saleCalendarEvents,
      agentPitchContent: {
        ...emptyListingState.agentPitchContent,
        ...parsed.agentPitchContent,
      },
      workspaceChecklist:
        parsed.workspaceChecklist && typeof parsed.workspaceChecklist === "object"
          ? parsed.workspaceChecklist
          : emptyListingState.workspaceChecklist,
      buyerLeads: Array.isArray(parsed.buyerLeads)
        ? parsed.buyerLeads.map(normalizeBuyerLead)
        : emptyListingState.buyerLeads,
      followUpReminders: Array.isArray(parsed.followUpReminders)
        ? parsed.followUpReminders.map(normalizeFollowUpReminder)
        : emptyListingState.followUpReminders,
      propertyPhotos: normalizedPropertyPhotos,
      activeSignboard,
      signboardCrops: {
        ...emptyListingState.signboardCrops,
        ...parsed.signboardCrops,
      },
      signboardOverlays: {
        signboard1: normalizeOverlay(
          parsed.signboardOverlays?.signboard1 || fallbackOverlay,
        ),
        signboard2: normalizeOverlay(
          parsed.signboardOverlays?.signboard2 || fallbackOverlay,
        ),
      },
      overlay: fallbackOverlay,
    };
  } catch {
    return emptyListingState;
  }
}

export function writeListingState(state: ListingState) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem(LEGACY_STORAGE_KEY);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // LocalStorage can fill up quickly with image prototypes. Production should
    // upload originals to cloud storage and save URLs in the listing record.
    // Keep the in-memory state usable and avoid clearing unrelated auth/profile
    // data such as Clerk sessions or the saved Agent Profile.
  }
}

export function clearListingState() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
  window.localStorage.removeItem(LEGACY_STORAGE_KEY);
}

function normalizeString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function normalizeOverlay(value: unknown) {
  const overlay =
    value && typeof value === "object"
      ? (value as Partial<ListingState["overlay"]>)
      : {};

  return {
    x:
      typeof overlay.x === "number" && Number.isFinite(overlay.x)
        ? overlay.x
        : emptyListingState.overlay.x,
    y:
      typeof overlay.y === "number" && Number.isFinite(overlay.y)
        ? overlay.y
        : emptyListingState.overlay.y,
    width:
      typeof overlay.width === "number" && Number.isFinite(overlay.width)
        ? overlay.width
        : emptyListingState.overlay.width,
  };
}

function normalizeComparableProperty(
  value: Partial<ComparableProperty> | undefined,
  fallback: ComparableProperty,
): ComparableProperty {
  return {
    ...fallback,
    ...value,
    address: normalizeString(value?.address),
    suburb: normalizeString(value?.suburb),
    state: normalizeString(value?.state),
    soldPrice: normalizeString(value?.soldPrice),
    saleDate: normalizeString(value?.saleDate),
    beds: normalizeString(value?.beds),
    baths: normalizeString(value?.baths),
    cars: normalizeString(value?.cars),
    blockSize: normalizeString(value?.blockSize),
    landSize: normalizeString(value?.landSize || value?.blockSize),
    propertyType: normalizeString(value?.propertyType),
    agency: normalizeString(value?.agency),
    agentName: normalizeString(value?.agentName),
    description: normalizeString(value?.description),
    notes: normalizeString(value?.notes),
    url: normalizeString(value?.url),
    sourceUrl: normalizeString(value?.sourceUrl || value?.url),
  };
}

function normalizeBuyerLead(value: Partial<BuyerLead>): BuyerLead {
  return {
    id: normalizeString(value.id) || `buyer-${Date.now()}-${Math.random()}`,
    name: normalizeString(value.name),
    phone: normalizeString(value.phone),
    contactType: value.contactType === "Buyer Agent" ? "Buyer Agent" : "Buyer",
    status:
      value.status === "Hot" || value.status === "Cold" ? value.status : "Warm",
    tags: Array.isArray(value.tags)
      ? value.tags.filter((tag): tag is string => typeof tag === "string")
      : [],
    budgetMin: normalizeString(value.budgetMin),
    budgetMax: normalizeString(value.budgetMax),
    suburbs: normalizeString(value.suburbs),
    beds: normalizeString(value.beds),
    notes: normalizeString(value.notes),
    lastContact: normalizeString(value.lastContact),
    nextFollowUp: normalizeString(value.nextFollowUp),
  };
}

function normalizeSaleCalendarEvent(
  value: Partial<SaleCalendarEvent>,
): SaleCalendarEvent {
  return {
    id: normalizeString(value.id) || `event-${Date.now()}-${Math.random()}`,
    date: normalizeString(value.date),
    title: normalizeString(value.title) || "Campaign task",
    type: normalizeString(value.type) || "Other",
    time: normalizeString(value.time),
    notes: normalizeString(value.notes),
    supplier: normalizeString(value.supplier),
    contact: normalizeString(value.contact),
    taskDetails: normalizeString(value.taskDetails),
  };
}

function normalizeFollowUpReminder(
  value: Partial<FollowUpReminder>,
): FollowUpReminder {
  return {
    id: normalizeString(value.id) || `follow-up-${Date.now()}-${Math.random()}`,
    title: normalizeString(value.title) || "Follow up with seller",
    dueDate: normalizeString(value.dueDate) || "Today",
    leadType:
      value.leadType === "Warm" || value.leadType === "Cold"
        ? value.leadType
        : "Hot",
    suggestedMessage: normalizeString(value.suggestedMessage),
    done: Boolean(value.done),
  };
}
