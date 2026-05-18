"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle2, LockKeyhole, PhoneCall } from "lucide-react";
import { use, useEffect, useState } from "react";
import { AgentProfileProvider } from "@/components/AgentProfileProvider";
import { ProposalDocument } from "@/components/ProposalDocument";
import {
  findSavedProposal,
  markProposalViewed,
  recordSellerProposalAction,
  type SavedProposal,
  type SellerProposalAction,
} from "@/lib/proposalHistory";

export default function SharedProposalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [proposal, setProposal] = useState<SavedProposal | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [actionSaved, setActionSaved] = useState<SellerProposalAction | "">("");

  useEffect(() => {
    const viewedProposal = markProposalViewed(id) || findSavedProposal(id);
    setProposal(viewedProposal || null);
    setActionSaved(viewedProposal?.sellerAction || "");
    setLoaded(true);
  }, [id]);

  const saveSellerAction = (action: SellerProposalAction) => {
    const updated = recordSellerProposalAction(id, action);
    if (updated) {
      setProposal(updated);
      setActionSaved(action);
    }
  };

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
            This proposal link is not available from this browser. For live
            seller use, proposal links should be saved in the ListingWin
            database so they can open reliably on any device.
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
        <ProposalDocument
          listing={proposal.listing}
          profile={proposal.profile}
          hiddenSections={proposal.hiddenProposalSections}
          textSections={proposal.proposalTextSections}
        />
        <section className="mx-auto mt-10 max-w-5xl rounded-[2rem] bg-blue-950 p-7 text-white shadow-soft sm:p-9">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-200">
                Next step
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Ready to talk through the campaign?
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100">
                Let the agent know whether you are ready to move forward or
                would like a quick call. This is not a signature or agency
                agreement.
              </p>
              {actionSaved ? (
                <p className="mt-4 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/15">
                  Response saved: {actionSaved}
                </p>
              ) : null}
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[26rem]">
              <button
                type="button"
                onClick={() => saveSellerAction("Happy to proceed")}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-blue-950 shadow-card transition hover:bg-blue-50"
              >
                <CheckCircle2 size={17} />
                Happy to proceed
              </button>
              <button
                type="button"
                onClick={() => saveSellerAction("Request a call")}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white/10 px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/15"
              >
                <PhoneCall size={17} />
                Request a call
              </button>
            </div>
          </div>
        </section>
      </main>
    </AgentProfileProvider>
  );
}
