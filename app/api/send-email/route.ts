import { NextResponse } from "next/server";
import { asString, sendResendEmail } from "@/lib/resend";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const to = asString(body?.to);
  const subject = asString(body?.subject);
  const text = asString(body?.text);
  const html = asString(body?.html);
  const replyTo = asString(body?.replyTo);

  try {
    const result = await sendResendEmail({
      to,
      subject,
      text,
      html,
      replyTo,
    });

    return NextResponse.json({ ok: true, id: result?.id });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Email could not be sent.",
      },
      { status: 400 },
    );
  }
}
