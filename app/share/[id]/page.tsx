"use client";

import Link from "next/link";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import { use, useEffect, useState } from "react";
import { AgentProfileProvider } from "@/components/AgentProfileProvider";
import {
  HeroPresentation,
  PresentationGrid,
} from "@/components/PresentationSections";
import { findSavedPresentation } from "@/lib/presentationHistory";
import type { SavedPresentation } from "@/lib/types";

export default function SharedPresentationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [presentation, setPresentation] = useState<SavedPresentation | null>(
    null,
  );
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setPresentation(findSavedPresentation(id) || null);
    setLoaded(true);
  }, [id]);

  if (!loaded) {
    return null;
  }

  if (!presentation) {
    return (
      <main className="min-h-screen bg-gray-50 px-5 py-10">
        <div className="mx-auto max-w-2xl rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-card">
          <LockKeyhole className="mx-auto text-gray-400" size={38} />
          <h1 className="mt-5 text-3xl font-semibold tracking-tight">
            Presentation not available
          </h1>
          <p className="mt-3 text-sm leading-6 text-gray-500">
            This presentation is not available in this browser. Open it from
            the account that created the share link.
          </p>
          <Link
            href="/account"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-gray-950 px-5 py-3 text-sm font-semibold text-white"
          >
            <ArrowLeft size={16} />
            Back to account
          </Link>
        </div>
      </main>
    );
  }

  return (
    <AgentProfileProvider initialProfile={presentation.profile}>
      <main className="min-h-screen bg-gray-50 px-5 py-8 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-gray-200 bg-white p-4 shadow-card lg:p-8">
          <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">
                Shared Vendor Presentation
              </p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight">
                {presentation.address}
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                Presented by {presentation.profile.agentName || "Agent"} ·{" "}
                {presentation.profile.agencyName || "Agency"}
              </p>
            </div>
          </div>

          <HeroPresentation listing={presentation.listing} />
          <PresentationGrid listing={presentation.listing} />
        </div>
      </main>
    </AgentProfileProvider>
  );
}
