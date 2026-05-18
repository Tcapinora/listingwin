import { NextResponse, type NextRequest } from "next/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { sendResendEmail } from "@/lib/resend";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getPrimaryEmail(data: {
  primary_email_address_id: string | null;
  email_addresses: Array<{ id?: string; email_address: string }>;
}) {
  return (
    data.email_addresses.find(
      (email) => email.id === data.primary_email_address_id,
    )?.email_address ||
    data.email_addresses[0]?.email_address ||
    ""
  );
}

export async function POST(request: NextRequest) {
  let event;

  try {
    event = await verifyWebhook(request);
  } catch {
    return NextResponse.json(
      { error: "Webhook verification failed" },
      { status: 400 },
    );
  }

  if (event.type !== "user.created") {
    return NextResponse.json({ ok: true, ignored: event.type });
  }

  const email = getPrimaryEmail(event.data);
  const firstName = event.data.first_name || "";
  const greeting = firstName ? `Hi ${firstName}` : "Hi";

  if (!email) {
    return NextResponse.json({ ok: true, skipped: "No email address" });
  }

  try {
    const result = await sendResendEmail({
      to: email,
      subject: "Welcome to ListingWin",
      text: [
        `${greeting},`,
        "",
        "Welcome to ListingWin.",
        "",
        "ListingWin helps you show the seller the campaign before the campaign begins. Prepare the appraisal, show their property inside your marketing, then generate the proposal without rebuilding the follow-up.",
        "",
        "Start by setting up your agent profile, agency branding, and first appraisal.",
        "",
        "Open ListingWin: https://www.listingwin.com.au/dashboard",
        "",
        "Welcome aboard,",
        "ListingWin",
      ].join("\n"),
      html: `
        <div style="font-family:Arial,sans-serif;color:#1F2A4A;line-height:1.6">
          <p>${escapeHtml(greeting)},</p>
          <h1 style="font-size:28px;line-height:1.2;margin:0 0 16px">Welcome to ListingWin.</h1>
          <p>ListingWin helps you show the seller the campaign before the campaign begins.</p>
          <p>Prepare the appraisal, show their property inside your marketing, then generate the proposal without rebuilding the follow-up.</p>
          <p>
            <a href="https://www.listingwin.com.au/dashboard" style="display:inline-block;background:#3563E0;color:#ffffff;text-decoration:none;border-radius:999px;padding:12px 18px;font-weight:700">
              Open ListingWin
            </a>
          </p>
          <p style="color:#64748b;font-size:14px">Start by setting up your agent profile, agency branding, and first appraisal.</p>
          <p>Welcome aboard,<br />ListingWin</p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true, id: result.id });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Welcome email could not be sent.",
      },
      { status: 500 },
    );
  }
}
