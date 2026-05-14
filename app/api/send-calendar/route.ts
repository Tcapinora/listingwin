import { NextResponse } from "next/server";
import { createCalendarPdf } from "@/lib/calendarPdf";
import { asString, isEmail, sendResendEmail } from "@/lib/resend";
import type { SaleCalendarEvent } from "@/lib/types";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const to = asString(body?.to);
  const address = asString(body?.address) || "Property";
  const agentName = asString(body?.agentName) || "Agent";
  const agencyName = asString(body?.agencyName) || "ListingWin";
  const replyTo = asString(body?.replyTo);
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

  if (!isEmail(to)) {
    return NextResponse.json(
      { error: "Add a valid recipient email address." },
      { status: 400 },
    );
  }

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
  const safeAddress = escapeHtml(address);
  const safeAgentName = escapeHtml(agentName);
  const safeAgencyName = escapeHtml(agencyName);

  try {
    const result = await sendResendEmail({
      to,
      subject: `${address} proposed calendar of sale`,
      text: [
        "Hi,",
        "",
        `Attached is the proposed calendar of sale for ${address}.`,
        "",
        "This gives a clean visual view of the campaign timing, key milestones, and next steps.",
        "",
        `Prepared by ${agentName}${agencyName ? `, ${agencyName}` : ""}.`,
      ].join("\n"),
      html: `
        <div style="font-family:Arial,sans-serif;color:#1F2A4A;line-height:1.6">
          <p>Hi,</p>
          <p>Attached is the proposed calendar of sale for <strong>${safeAddress}</strong>.</p>
          <p>This gives a clean visual view of the campaign timing, key milestones, and next steps.</p>
          <p style="color:#64748b;font-size:14px">Prepared by ${safeAgentName}${agencyName ? `, ${safeAgencyName}` : ""}.</p>
        </div>
      `,
      replyTo,
      attachments: [
        {
          filename: `${filenameBase || "listingwin-calendar"}.pdf`,
          content: pdf.toString("base64"),
        },
      ],
    });

    console.info("ListingWin calendar email sent", {
      id: result.id,
      to,
      address,
      rangeMode: rangeMode || `${monthCount || 1} month`,
    });

    return NextResponse.json({ ok: true, id: result.id });
  } catch (error) {
    console.error("ListingWin calendar email failed", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Calendar PDF email could not be sent.",
      },
      { status: 400 },
    );
  }
}
