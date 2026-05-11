"use client";

import Link from "next/link";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";

const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

export function AuthControls() {
  if (!clerkEnabled) {
    return (
      <Link
        href="/sign-in"
        className="hidden min-h-11 items-center justify-center rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-semibold text-blue-900 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 sm:inline-flex"
      >
        Sign in
      </Link>
    );
  }

  return <ClerkAuthControls />;
}

function ClerkAuthControls() {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return (
      <div className="h-11 w-11 animate-pulse rounded-full bg-blue-50 ring-1 ring-blue-100" />
    );
  }

  if (isSignedIn) {
    return (
      <div className="grid h-11 w-11 place-items-center rounded-full border border-blue-100 bg-white shadow-sm">
        <UserButton
          appearance={{
            elements: {
              avatarBox: "h-8 w-8",
            },
          }}
        />
      </div>
    );
  }

  return (
    <SignInButton mode="modal">
      <button
        type="button"
        className="hidden min-h-11 items-center justify-center rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-semibold text-blue-900 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 sm:inline-flex"
      >
        Sign in
      </button>
    </SignInButton>
  );
}
