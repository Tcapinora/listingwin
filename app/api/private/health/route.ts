import { NextResponse, type NextRequest } from "next/server";
import { requireListingWinApiKey } from "@/lib/apiKey";

export function GET(request: NextRequest) {
  const unauthorized = requireListingWinApiKey(request);

  if (unauthorized) {
    return unauthorized;
  }

  return NextResponse.json({
    ok: true,
    service: "ListingWin private API",
  });
}
