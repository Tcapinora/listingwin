import { NextResponse } from "next/server";

const resendApiKey = process.env.RESEND_API_KEY;
const resendFromEmail =
  process.env.RESEND_FROM_EMAIL || "ListingWin <onboarding@resend.dev>";
const resendReplyTo = process.env.RESEND_REPLY_TO;

function isEmail(value: unknown) {
  return (
    typeof value === "string" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
  );
}

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  if (!resendApiKey) {
    return NextResponse.json(
      {
        error:
          "Resend is not configured yet. Add RESEND_API_KEY and RESEND_FROM_EMAIL.",
      },
      { status: 503 },
    );
  }

  const body = await request.json().catch(() => null);
  const to = asString(body?.to);
  const subject = asString(body?.subject);
  const text = asString(body?.text);
  const html = asString(body?.html);
  const replyTo = asString(body?.replyTo) || resendReplyTo;

  if (!isEmail(to)) {
    return NextResponse.json(
      { error: "Add a valid recipient email address." },
      { status: 400 },
    );
  }

  if (!subject || (!text && !html)) {
    return NextResponse.json(
      { error: "Email subject and message are required." },
      { status: 400 },
    );
  }

  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
      "User-Agent": "ListingWin/1.0",
    },
    body: JSON.stringify({
      from: resendFromEmail,
      to: [to],
      subject,
      text,
      html,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  });

  const result = await resendResponse.json().catch(() => null);

  if (!resendResponse.ok) {
    return NextResponse.json(
      {
        error:
          result?.message ||
          result?.error ||
          "Resend could not send the email. Check your domain and API key.",
      },
      { status: resendResponse.status },
    );
  }

  return NextResponse.json({ ok: true, id: result?.id });
}
