"use client";

import { Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { useAgentProfile } from "@/components/AgentProfileProvider";
import type { ListingState } from "@/lib/types";

export function EmailCalendarPdfButton({
  listing,
  month,
  year,
  className = "",
}: {
  listing: ListingState;
  month: number;
  year: number;
  className?: string;
}) {
  const { profile } = useAgentProfile();
  const [isOpen, setIsOpen] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [status, setStatus] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (!isOpen || recipient) {
      return;
    }

    setRecipient(profile.email || listing.details.email || "");
  }, [isOpen, listing.details.email, profile.email, recipient]);

  const sendCalendar = async () => {
    setStatus("");
    setIsSending(true);

    try {
      const response = await fetch("/api/send-calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: recipient,
          address: listing.details.address,
          agentName: profile.agentName || listing.details.agentName,
          agencyName: profile.agencyName || listing.details.agencyName,
          replyTo: profile.email || listing.details.email,
          month,
          year,
          events: listing.saleCalendarEvents,
        }),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.error || "Calendar email could not be sent.");
      }

      setStatus("Calendar PDF sent");
      setRecipient("");
      window.setTimeout(() => {
        setStatus("");
        setIsOpen(false);
      }, 2200);
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : "Calendar email could not be sent.",
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className={
          className ||
          "inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-sm"
        }
      >
        <Mail size={16} />
        Email calendar
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-14 z-50 w-[min(23rem,calc(100vw-2rem))] rounded-[1.5rem] bg-white p-4 text-slate-950 shadow-soft ring-1 ring-blue-100">
          <p className="text-sm font-semibold">Email calendar PDF</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Sends the polished A4 landscape calendar as a PDF attachment.
          </p>
          <input
            type="email"
            value={recipient}
            onChange={(event) => setRecipient(event.target.value)}
            placeholder="seller@email.com or your email"
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
              onClick={sendCalendar}
              disabled={isSending}
              className="inline-flex flex-1 items-center justify-center rounded-full bg-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-card disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSending ? "Sending..." : "Send PDF"}
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
