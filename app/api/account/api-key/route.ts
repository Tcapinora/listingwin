import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  createAccountApiKey,
  isAccountApiKeyConfigured,
} from "@/lib/accountApiKey";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "You need to sign in to retrieve an API key." },
      { status: 401 },
    );
  }

  if (!isAccountApiKeyConfigured()) {
    return NextResponse.json(
      { error: "API key access is not configured yet." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    apiKey: createAccountApiKey(userId),
    headerName: "Authorization",
    headerValuePrefix: "Bearer",
  });
}
