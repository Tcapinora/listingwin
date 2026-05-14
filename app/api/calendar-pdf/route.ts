import { NextResponse } from "next/server";
import { createCalendarPdf } from "@/lib/calendarPdf";
import { asString } from "@/lib/resend";
import type { SaleCalendarEvent } from "@/lib/types";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const address = asString(body?.address) || "Property";
  const agentName = asString(body?.agentName) || "Agent";
  const agencyName = asString(body?.agencyName) || "ListingWin";
  const month = Number(body?.month);
  const year = Number(body?.year);
  const rangeMode = asString(body?.rangeMode);
  const monthCount = Number(body?.monthCount);
  const customStartDate = asString(body?.customStartDate);
  const customEndDate = asString(body?.customEndDate);
  const notes = asString(body?.notes);
  const trades = asString(body?.trades);
  const events = Array.isArray(body?.events)
    ? (body.events as SaleCalendarEvent[])
    : [];

  if (!Number.isInteger(month) || month < 0 || month > 11) {
    return NextResponse.json({ error: "Calendar month is invalid." }, { status: 400 });
  }

  if (!Number.isInteger(year) || year < 1900 || year > 2200) {
    return NextResponse.json({ error: "Calendar year is invalid." }, { status: 400 });
  }

  if (rangeMode === "custom") {
    const customStart = customStartDate
      ? new Date(`${customStartDate}T00:00:00`)
      : null;
    const customEnd = customEndDate ? new Date(`${customEndDate}T00:00:00`) : null;

    if (
      !customStart ||
      !customEnd ||
      !Number.isFinite(customStart.getTime()) ||
      !Number.isFinite(customEnd.getTime()) ||
      customStart > customEnd
    ) {
      return NextResponse.json(
        { error: "Choose a valid calendar date range." },
        { status: 400 },
      );
    }
  }

  const pdf = createCalendarPdf({
    address,
    agentName,
    agencyName,
    month,
    year,
    events,
    notes,
    trades,
    monthCount: Number.isFinite(monthCount) ? monthCount : 1,
    customStartDate,
    customEndDate,
  });
  const filenameBase = `${address || "listingwin"}-calendar`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return new NextResponse(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filenameBase || "listingwin-calendar"}.pdf"`,
    },
  });
}
