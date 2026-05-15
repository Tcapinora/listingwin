import { NextResponse, type NextRequest } from "next/server";

const listingWinApiKey = process.env.LISTINGWIN_API_KEY;

export function isListingWinApiConfigured() {
  return Boolean(listingWinApiKey);
}

export function getListingWinApiKey(request: NextRequest) {
  const bearer = request.headers.get("authorization")?.trim();

  if (bearer?.toLowerCase().startsWith("bearer ")) {
    return bearer.slice(7).trim();
  }

  return request.headers.get("x-listingwin-api-key")?.trim() || "";
}

export function requireListingWinApiKey(request: NextRequest) {
  if (!listingWinApiKey) {
    return NextResponse.json(
      { error: "ListingWin API key is not configured." },
      { status: 500 },
    );
  }

  const providedKey = getListingWinApiKey(request);

  if (!providedKey || providedKey !== listingWinApiKey) {
    return NextResponse.json(
      { error: "Invalid or missing ListingWin API key." },
      { status: 401 },
    );
  }

  return null;
}
