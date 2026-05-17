"use client";

import Link from "next/link";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import { use, useEffect, useState } from "react";
import { AgentProfileProvider } from "@/components/AgentProfileProvider";
import { ProposalDocument } from "@/components/ProposalDocument";
import { findSavedProposal, type SavedProposal } from "@/lib/proposalHistory";

export default function SharedProposalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [proposal, setProposal] = useState<SavedProposal | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setProposal(findSavedProposal(id) || null);
    setLoaded(true);
  }, [id]);

  if (!loaded) {
    return null;
  }

  if (!proposal) {
    return (
      <main className="min-h-screen bg-[#F2F4F8] px-5 py-10">
        <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-card">
          <LockKeyhole className="mx-auto text-slate-400" size={38} />
          <h1 className="mt-5 text-3xl font-semibold tracking-tight">
            Proposal not available
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            This MVP proposal link is saved in the browser that created it. In
            production, proposals should be stored in the ListingWin database so
            sellers can open them on any device.
          </p>
          <Link
            href="/dashboard"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-blue-700 px-5 py-3 text-sm font-semibold text-white"
          >
            <ArrowLeft size={16} />
            Back to ListingWin
          </Link>
        </div>
      </main>
    );
  }

  return (
    <AgentProfileProvider initialProfile={proposal.profile}>
      <main className="min-h-screen bg-[#F2F4F8] px-5 py-10 lg:px-8">
        <ProposalDocument listing={proposal.listing} profile={proposal.profile} />
      </main>
    </AgentProfileProvider>
  );
}
