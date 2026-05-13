"use client";

import { Mail } from "lucide-react";
import { useState } from "react";
import {
  getShareUrl,
  savePresentationSnapshot,
} from "@/lib/presentationHistory";
import type { AgentProfile, ListingState } from "@/lib/types";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function EmailPresentationButton({
  listing,
  profile,
}: {
  listing: ListingState;
  profile: AgentProfile;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [status, setStatus] = useState("");
  const [isSending, setIsSending] = useState(false);

  const sendPresentation = async () => {
    setStatus("");
    setIsSending(true);

    const presentation = savePresentationSnapshot(listing, profile);
    const shareUrl = getShareUrl(presentation.id);
    const agentName = profile.agentName || listing.details.agentName || "your agent";
    const agencyName =
      profile.agencyName || listing.details.agencyName || "ListingWin";
    const address = listing.details.address || "your property";
    const subject = `${address} vendor presentation`;
    const text = [
      `Hi,`,
      "",
      `${agentName} has shared the vendor presentation for ${address}.`,
      "",
      `Open it here: ${shareUrl}`,
      "",
      `Kind regards,`,
      agencyName,
    ].join("\n");
    const html = `
      <div style="font-family:Arial,sans-serif;color:#1F2A4A;line-height:1.6">
        <p>Hi,</p>
        <p><strong>${escapeHtml(agentName)}</strong> has shared the vendor presentation for <strong>${escapeHtml(address)}</strong>.</p>
        <p>
          <a href="${escapeHtml(shareUrl)}" style="display:inline-block;background:#3563E0;color:#ffffff;text-decoration:none;border-radius:999px;padding:12px 18px;font-weight:700">
            Open Vendor Presentation
          </a>
        </p>
        <p style="color:#64748b;font-size:14px">This presentation shows the campaign before the campaign begins.</p>
        <p>Kind regards,<br />${escapeHtml(agencyName)}</p>
      </div>
    `;

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: recipient,
          subject,
          text,
          html,
          replyTo: profile.email || listing.details.email,
        }),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.error || "Email could not be sent.");
      }

      setStatus("Email sent");
      setRecipient("");
      window.setTimeout(() => {
        setStatus("");
        setIsOpen(false);
      }, 2200);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Email could not be sent.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/92 px-4 py-2.5 text-sm font-semibold text-blue-900 shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
      >
        <Mail size={16} />
        Email
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-12 z-50 w-[min(22rem,calc(100vw-2rem))] rounded-[1.5rem] bg-white p-4 text-slate-950 shadow-soft ring-1 ring-blue-100">
          <p className="text-sm font-semibold">Email presentation link</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Send the saved vendor presentation to the seller using Resend.
          </p>
          <input
            type="email"
            value={recipient}
            onChange={(event) => setRecipient(event.target.value)}
            placeholder="seller@email.com"
            className="mt-4 w-full rounded-2xl border-0 bg-blue-50 px-4 py-3 text-sm outline-none ring-1 ring-blue-100 focus:ring-2 focus:ring-blue-500"
          />
          {status ? (
            <p className="mt-3 rounded-2xl bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-700">
              {status}
            </p>
          ) : null}
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={sendPresentation}
              disabled={isSending}
              className="inline-flex flex-1 items-center justify-center rounded-full bg-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-card disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSending ? "Sending..." : "Send email"}
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
