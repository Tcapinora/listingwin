import type { BuyerLead, FollowUpReminder, ListingState } from "@/lib/types";

function parsePrice(value: string) {
  const digits = value.replace(/[^\d]/g, "");
  return digits ? Number(digits) : 0;
}

function suburbFromAddress(address: string) {
  const parts = address.split(",").map((part) => part.trim()).filter(Boolean);
  return parts[parts.length - 1] || "";
}

function statusScore(status: BuyerLead["status"]) {
  if (status === "Hot") {
    return 30;
  }

  if (status === "Warm") {
    return 18;
  }

  return 8;
}

export function getBuyerMatches(listing: ListingState) {
  const suburb = suburbFromAddress(listing.details.address).toLowerCase();
  const guide =
    parsePrice(listing.details.agentPriceGuide) ||
    parsePrice(listing.details.sellerExpectedPrice);

  return listing.buyerLeads
    .map((buyer) => {
      const min = parsePrice(buyer.budgetMin);
      const max = parsePrice(buyer.budgetMax);
      const budgetMatch = guide && min && max ? guide >= min && guide <= max : false;
      const suburbMatch = suburb
        ? buyer.suburbs.toLowerCase().includes(suburb)
        : false;
      const score =
        statusScore(buyer.status) +
        (budgetMatch ? 42 : 12) +
        (suburbMatch ? 20 : 6) +
        (buyer.beds ? 8 : 0);

      return {
        ...buyer,
        score: Math.min(100, score),
        budgetMatch,
        suburbMatch,
        alert:
          buyer.status === "Hot" && (budgetMatch || suburbMatch)
            ? "Call this buyer NOW"
            : buyer.status === "Warm"
              ? "Send a preview message"
              : "Keep warm for launch",
      };
    })
    .sort((a, b) => b.score - a.score);
}

export function getFollowUpPlan(listing: ListingState) {
  const address = listing.details.address || "this property";
  const topBuyer = getBuyerMatches(listing)[0];
  const reminders = listing.followUpReminders.length
    ? listing.followUpReminders
    : [];

  const generated: FollowUpReminder = {
    id: "generated-buyer-alert",
    title: topBuyer ? `Call ${topBuyer.name}` : "Call strongest buyers",
    dueDate: "Today",
    leadType: topBuyer?.status || "Hot",
    suggestedMessage: topBuyer
      ? `I am appraising ${address}, and it looks close to what you told me you wanted: ${topBuyer.suburbs}, around ${topBuyer.budgetMin}-${topBuyer.budgetMax}. If the seller lists, I want to get you through early.`
      : `I am appraising ${address}. I will let you know if it becomes available because it may suit buyers already in our database.`,
    done: false,
  };

  // Production replacement: generate the message with an approved AI prompt
  // using buyer preferences, listing details, agency tone, and compliance rules.
  return [generated, ...reminders].slice(0, 4);
}
