"use client";

import Link from "next/link";
import {
  Check,
  Copy,
  ExternalLink,
  FileText,
  Printer,
  RotateCcw,
  Save,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useAgentProfile } from "@/components/AgentProfileProvider";
import { useListing } from "@/components/ListingProvider";
import {
  createDefaultProposalText,
  ProposalDocument,
  type ProposalSectionId,
} from "@/components/ProposalDocument";
import {
  getProposalShareUrl,
  saveProposalSnapshot,
} from "@/lib/proposalHistory";

export default function ProposalPage() {
  const { listing } = useListing();
  const { profile } = useAgentProfile();
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [hiddenSections, setHiddenSections] = useState<string[]>([]);
  const [textSections, setTextSections] = useState(() =>
    createDefaultProposalText(listing, profile),
  );
  const proposalReady = Boolean(shareUrl);
  const address = listing.details.address || "this property";

  const createOrRefreshProposal = () => {
    const proposal = saveProposalSnapshot(listing, profile);
    const url = getProposalShareUrl(proposal.id);
    setShareUrl(url);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
    return url;
  };

  const copyProposalLink = async () => {
    const url = shareUrl || createOrRefreshProposal();

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setShareUrl(url);
    }
  };

  const hiddenSummary = useMemo(
    () =>
      hiddenSections.length
        ? `${hiddenSections.length} section${hiddenSections.length === 1 ? "" : "s"} hidden`
        : "All proposal sections included",
    [hiddenSections.length],
  );

  return (
    <>
      <section className="rounded-[2.25rem] bg-blue-950 p-6 text-white shadow-soft sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.85fr] lg:items-center">
          <div>
            <p className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-blue-100 ring-1 ring-white/15">
              Step 3 - Proposal
            </p>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
              Turn the appraisal into a seller-ready proposal.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-blue-100">
              ListingWin reuses the preparation, appraisal notes, property
              details, campaign visuals, pricing, calendar, and agent profile
              to create a polished seller-facing proposal for {address}.
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {[
                ["1", "Review", "Check the proposal."],
                ["2", "Generate", "Create the seller link."],
                ["3", "Send", "Paste it into your email."],
              ].map(([step, title, text]) => (
                <div
                  key={step}
                  className="rounded-2xl bg-white/8 p-4 ring-1 ring-white/10"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">
                    {step}
                  </p>
                  <p className="mt-2 font-semibold">{title}</p>
                  <p className="mt-1 text-sm text-blue-100">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] bg-white p-5 text-slate-950 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">
              Share Proposal
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              Copy the seller link.
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Generate one clean proposal link, copy it, and paste it into your
              own email to the seller.
            </p>
            <div className="mt-5 rounded-2xl bg-slate-50 p-3 text-sm text-slate-500 ring-1 ring-slate-200">
              <p className="truncate">
                {shareUrl || "Generate a proposal link first"}
              </p>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={createOrRefreshProposal}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-blue-800"
              >
                <Save size={16} />
                {proposalReady ? "Update link" : "Generate link"}
              </button>
              <button
                type="button"
                onClick={copyProposalLink}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-blue-100 bg-white px-5 py-3 text-sm font-semibold text-blue-900 shadow-sm transition hover:bg-blue-50"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? "Copied" : "Copy link"}
              </button>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500">
              <span>{saved ? "Proposal saved" : hiddenSummary}</span>
              {shareUrl ? (
                <Link
                  href={shareUrl}
                  target="_blank"
                  className="inline-flex items-center gap-1 text-blue-700"
                >
                  <ExternalLink size={14} />
                  Preview
                </Link>
              ) : null}
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1 text-blue-700"
              >
                <Printer size={14} />
                Print
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="no-print mt-6 flex flex-col justify-between gap-3 rounded-[1.75rem] bg-white p-5 shadow-card ring-1 ring-slate-200/70 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold text-slate-950">
            Review before sending
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Edit text directly below, hide sections you do not need, then
            generate the proposal link.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {hiddenSections.length ? (
            <button
              type="button"
              onClick={() => setHiddenSections([])}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700"
            >
              <RotateCcw size={16} />
              Restore sections
            </button>
          ) : null}
          <Link
            href="/draft"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-5 py-3 text-sm font-semibold text-blue-900"
          >
            <FileText size={16} />
            Edit Appraisal Notes
          </Link>
        </div>
      </section>

      <div className="mt-10">
        <ProposalDocument
          listing={listing}
          profile={profile}
          editable
          hiddenSections={hiddenSections}
          textSections={textSections}
          onTextChange={setTextSections}
          onHideSection={(section: ProposalSectionId) =>
            setHiddenSections((current) =>
              current.includes(section) ? current : [...current, section],
            )
          }
        />
      </div>
    </>
  );
}
