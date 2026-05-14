const resendApiKey = process.env.RESEND_API_KEY;
const resendFromEmail = process.env.RESEND_FROM_EMAIL;
const resendReplyTo = process.env.RESEND_REPLY_TO;

export function isEmail(value: unknown) {
  return (
    typeof value === "string" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
  );
}

export function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function sendResendEmail({
  to,
  subject,
  text,
  html,
  replyTo,
  attachments,
}: {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  replyTo?: string;
  attachments?: Array<{
    filename: string;
    content: string;
  }>;
}) {
  if (!resendApiKey || !resendFromEmail) {
    throw new Error("Email sending is not configured yet.");
  }

  if (!isEmail(to)) {
    throw new Error("Add a valid recipient email address.");
  }

  if (!subject || (!text && !html)) {
    throw new Error("Email subject and message are required.");
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
      ...(replyTo || resendReplyTo
        ? { reply_to: replyTo || resendReplyTo }
        : {}),
      ...(attachments?.length ? { attachments } : {}),
    }),
  });

  const result = await resendResponse.json().catch(() => null);

  if (!resendResponse.ok) {
    throw new Error(
      result?.message ||
        result?.error ||
        "Resend could not send the email. Check your domain and API key.",
    );
  }

  if (!result?.id) {
    throw new Error("Email provider did not confirm the message was sent.");
  }

  return result as { id?: string };
}
