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
  findSavedProposal,
  markProposalSent,
  saveProposalSnapshot,
  type ProposalStatus,
  type SellerProposalAction,
} from "@/lib/proposalHistory";

export default function ProposalPage() {
  const { listing, setListing } = useListing();
  const { profile } = useAgentProfile();
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);
  const [shareError, setShareError] = useState("");
  const [proposalGenerated, setProposalGenerated] = useState(false);
  const [currentProposalId, setCurrentProposalId] = useState("");
  const [proposalStatus, setProposalStatus] =
    useState<ProposalStatus>("Draft");
  const [viewedAt, setViewedAt] = useState("");
  const [sellerAction, setSellerAction] = useState<SellerProposalAction | "">(
    "",
  );
  const [sellerActionAt, setSellerActionAt] = useState("");
  const [hiddenSections, setHiddenSections] = useState<string[]>([]);
  const [textSections, setTextSections] = useState(() =>
    createDefaultProposalText(listing, profile),
  );
  const proposalReady = Boolean(shareUrl);
  const address = listing.details.address || "this property";
  const emailDraft = `Hi there,\n\nThanks again for your time at the appraisal. I have put together the proposal we discussed for ${address}.\n\nYou can view it here:\n${shareUrl || "[generate proposal link first]"}\n\nPlease let me know if you have any questions.\n\n${profile.agentName || listing.details.agentName || "ListingWin"}`;

  const generateProposal = () => {
    setProposalGenerated(true);
    setProposalStatus("Generated");
    setShareUrl("");
    setShareError("");
    setViewedAt("");
    setSellerAction("");
    setSellerActionAt("");
    window.requestAnimationFrame(() => {
      document
        .getElementById("proposal-preview")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const createOrRefreshProposal = () => {
    if (!proposalGenerated) {
      setProposalGenerated(true);
    }

    const proposal = saveProposalSnapshot(listing, profile, {
      proposalTextSections: textSections,
      hiddenProposalSections: hiddenSections,
    });
    if (!proposal.persisted) {
      setShareError(
        "This proposal is too image-heavy to save in the browser. Remove a few large images or print the proposal for now.",
      );
      setShareUrl("");
      return "";
    }

    const url = getProposalShareUrl(proposal.id);
    setCurrentProposalId(proposal.id);
    setProposalStatus(proposal.proposalStatus || "Generated");
    setViewedAt(proposal.viewedAt || "");
    setSellerAction(proposal.sellerAction || "");
    setSellerActionAt(proposal.sellerActionAt || "");
    setShareError("");
    setShareUrl(url);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
    return url;
  };

  const copyProposalLink = async () => {
    const url = shareUrl || createOrRefreshProposal();
    if (!url) return;

    try {
      await navigator.clipboard.writeText(url);
      const proposalId = currentProposalId || url.split("/").pop() || "";
      if (proposalId) {
        markProposalSent(proposalId);
        setCurrentProposalId(proposalId);
        setProposalStatus("Sent");
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setShareUrl(url);
    }
  };

  const copyEmailDraft = async () => {
    const url = shareUrl || createOrRefreshProposal();
    if (!url) return;
    const draft = emailDraft.replace(
      "[generate proposal link first]",
      url,
    );

    try {
      await navigator.clipboard.writeText(draft);
      const proposalId = currentProposalId || url.split("/").pop() || "";
      if (proposalId) {
        markProposalSent(proposalId);
        setCurrentProposalId(proposalId);
        setProposalStatus("Sent");
      }
      setEmailCopied(true);
      window.setTimeout(() => setEmailCopied(false), 2200);
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

  const updateTextSections = (next: typeof textSections) => {
    setTextSections(next);
    setShareUrl("");
    setShareError("");
    setProposalGenerated(false);
    setProposalStatus("Draft");
    setCurrentProposalId("");
    setViewedAt("");
    setSellerAction("");
    setSellerActionAt("");
  };

  const hideProposalSection = (section: ProposalSectionId) => {
    setHiddenSections((current) =>
      current.includes(section) ? current : [...current, section],
    );
    setShareUrl("");
    setShareError("");
    setProposalGenerated(false);
    setProposalStatus("Draft");
    setCurrentProposalId("");
    setViewedAt("");
    setSellerAction("");
    setSellerActionAt("");
  };

  const refreshProposalStatus = () => {
    if (!currentProposalId) return;
    const proposal = findSavedProposal(currentProposalId);
    if (!proposal) return;
    setProposalStatus(proposal.proposalStatus || "Generated");
    setViewedAt(proposal.viewedAt || "");
    setSellerAction(proposal.sellerAction || "");
    setSellerActionAt(proposal.sellerActionAt || "");
  };

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
                ["1", "Review", "Check the selling plan."],
                ["2", "Generate", "Create the proposal preview."],
                ["3", "Send", "Copy the seller link."],
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
              Generate Proposal
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              Preview it before sending.
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Generate the proposal preview first. Once it looks right, create
              the seller link and paste it into your own email.
            </p>
            <button
              type="button"
              onClick={generateProposal}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-blue-800"
            >
              <FileText size={16} />
              {proposalGenerated ? "Proposal preview generated" : "Generate Proposal"}
            </button>
            <div className="mt-5 rounded-2xl bg-slate-50 p-3 text-sm text-slate-500 ring-1 ring-slate-200">
              <p className="truncate">
                {shareUrl ||
                  (proposalGenerated
                    ? "Create a proposal link when ready"
                    : "Generate the proposal preview first")}
              </p>
            </div>
            {shareError ? (
              <p className="mt-3 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-medium leading-6 text-amber-800 ring-1 ring-amber-100">
                {shareError}
              </p>
            ) : null}
            <div className="mt-4 rounded-2xl bg-blue-50 p-4 ring-1 ring-blue-100">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
                Test before sending
              </p>
              <div className="mt-3 grid gap-2 text-xs leading-5 text-blue-950">
                {[
                  proposalGenerated
                    ? "Proposal preview has been generated."
                    : "Generate the proposal preview first.",
                  shareUrl
                    ? "Open the preview link and check the seller-facing page."
                    : "Create the proposal link after reviewing the preview.",
                  "Copy the email draft and send it to yourself before sending to a seller.",
                ].map((item, index) => (
                  <div key={item} className="flex gap-2">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-white text-[10px] font-semibold text-blue-800">
                      {index + 1}
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs leading-5 text-blue-900/70">
                Beta note: this prototype stores proposal links in the browser.
                For full cross-device seller links, the next production step is
                database-backed proposal sharing.
              </p>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={createOrRefreshProposal}
                disabled={!proposalGenerated}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-blue-800"
              >
                <Save size={16} />
                {proposalReady ? "Update link" : "Create link"}
              </button>
              <button
                type="button"
                onClick={copyProposalLink}
                disabled={!proposalGenerated}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-blue-100 bg-white px-5 py-3 text-sm font-semibold text-blue-900 shadow-sm transition hover:bg-blue-50"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? "Copied" : "Copy link"}
              </button>
            </div>
            <button
              type="button"
              onClick={copyEmailDraft}
              disabled={!proposalGenerated}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-50 px-5 py-3 text-sm font-semibold text-blue-900 transition hover:bg-blue-100"
            >
              {emailCopied ? <Check size={16} /> : <Copy size={16} />}
              {emailCopied ? "Email copied" : "Copy email with link"}
            </button>
            <div className="mt-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
                    Proposal status
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-950">
                    {proposalStatus}
                    {viewedAt
                      ? ` by seller on ${new Intl.DateTimeFormat("en-AU", {
                          day: "numeric",
                          month: "short",
                          hour: "numeric",
                          minute: "2-digit",
                        }).format(new Date(viewedAt))}`
                      : ""}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={refreshProposalStatus}
                  disabled={!currentProposalId}
                  className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-xs font-semibold text-blue-800 ring-1 ring-blue-100 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Refresh
                </button>
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-4">
                {["Generated", "Sent", "Viewed", "Response"].map((item) => {
                  const active =
                    (item === "Generated" && proposalGenerated) ||
                    (item === "Sent" &&
                      ["Sent", "Viewed"].includes(proposalStatus)) ||
                    (item === "Viewed" && Boolean(viewedAt)) ||
                    (item === "Response" && Boolean(sellerAction));

                  return (
                    <div
                      key={item}
                      className={`rounded-xl px-3 py-2 text-xs font-semibold ${
                        active
                          ? "bg-blue-700 text-white"
                          : "bg-white text-slate-500 ring-1 ring-slate-200"
                      }`}
                    >
                      {item}
                    </div>
                  );
                })}
              </div>
              <p className="mt-3 text-xs leading-5 text-slate-500">
                {sellerAction
                  ? `Seller selected "${sellerAction}"${sellerActionAt ? ` on ${new Intl.DateTimeFormat("en-AU", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }).format(new Date(sellerActionAt))}` : ""}.`
                  : viewedAt
                    ? "The proposal has been opened. Follow up while the conversation is warm."
                    : "Once the seller opens the proposal link, the viewed alert appears here in this MVP browser session."}
              </p>
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
              onClick={() => {
                setHiddenSections([]);
                setShareUrl("");
                setShareError("");
                setProposalGenerated(false);
                setProposalStatus("Draft");
                setCurrentProposalId("");
                setViewedAt("");
                setSellerAction("");
                setSellerActionAt("");
              }}
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

      <div id="proposal-preview" className="mt-10 scroll-mt-24">
        <ProposalDocument
          listing={listing}
          profile={profile}
          editable
          hiddenSections={hiddenSections}
          textSections={textSections}
          onTextChange={updateTextSections}
          onListingChange={setListing}
          onHideSection={hideProposalSection}
        />
      </div>
    </>
  );
}
