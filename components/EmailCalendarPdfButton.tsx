"use client";

import { Download, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { useAgentProfile } from "@/components/AgentProfileProvider";
import type { ListingState } from "@/lib/types";

type CalendarRangeMode = "1" | "2" | "3" | "custom";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

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
  const [statusType, setStatusType] = useState<"idle" | "success" | "error">(
    "idle",
  );
  const [isSending, setIsSending] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [rangeMode, setRangeMode] = useState<CalendarRangeMode>("1");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  useEffect(() => {
    if (!isOpen || recipient) {
      return;
    }

    setRecipient(profile.email || listing.details.email || "");
  }, [isOpen, listing.details.email, profile.email, recipient]);

  const sendCalendar = async () => {
    setStatus("");
    setStatusType("idle");

    if (!isValidEmail(recipient)) {
      setStatus("Add a valid recipient email address.");
      setStatusType("error");
      return;
    }

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
          notes: listing.saleCalendarNotes,
          trades: listing.saleCalendarTrades,
          rangeMode,
          monthCount: rangeMode === "custom" ? undefined : Number(rangeMode),
          customStartDate,
          customEndDate,
        }),
      });
      const result = await response.json().catch(() => ({}));
      console.info("ListingWin calendar email result", result);

      if (!response.ok || !result?.id) {
        throw new Error(result.error || "Calendar email could not be sent.");
      }

      setStatus("Calendar PDF sent");
      setStatusType("success");
      setRecipient("");
      window.setTimeout(() => {
        setStatus("");
        setStatusType("idle");
        setIsOpen(false);
      }, 2200);
    } catch (error) {
      console.error("ListingWin calendar email error", error);
      setStatus(
        error instanceof Error ? error.message : "Calendar email could not be sent.",
      );
      setStatusType("error");
    } finally {
      setIsSending(false);
    }
  };

  const downloadCalendar = async () => {
    setStatus("");
    setStatusType("idle");
    setIsDownloading(true);

    try {
      const response = await fetch("/api/calendar-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: listing.details.address,
          agentName: profile.agentName || listing.details.agentName,
          agencyName: profile.agencyName || listing.details.agencyName,
          month,
          year,
          events: listing.saleCalendarEvents,
          notes: listing.saleCalendarNotes,
          trades: listing.saleCalendarTrades,
          rangeMode,
          monthCount: rangeMode === "custom" ? undefined : Number(rangeMode),
          customStartDate,
          customEndDate,
        }),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.error || "Calendar PDF could not be created.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${(listing.details.address || "listingwin-calendar")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      setStatus("Calendar PDF downloaded");
      setStatusType("success");
    } catch (error) {
      console.error("ListingWin calendar PDF download error", error);
      setStatus(
        error instanceof Error ? error.message : "Calendar PDF could not be created.",
      );
      setStatusType("error");
    } finally {
      setIsDownloading(false);
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
            Sends or downloads the polished A4 landscape calendar as a PDF.
          </p>
          <label className="mt-4 block">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              Calendar Range
            </span>
            <select
              value={rangeMode}
              onChange={(event) =>
                setRangeMode(event.target.value as CalendarRangeMode)
              }
              className="mt-2 w-full rounded-2xl border-0 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-950 outline-none ring-1 ring-blue-100 focus:ring-2 focus:ring-blue-500"
            >
              <option value="1">1 month</option>
              <option value="2">2 months</option>
              <option value="3">3 months</option>
              <option value="custom">Custom date range</option>
            </select>
          </label>
          {rangeMode === "custom" ? (
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <label>
                <span className="text-xs font-semibold text-slate-500">
                  Start
                </span>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(event) => setCustomStartDate(event.target.value)}
                  className="mt-1 w-full rounded-2xl border-0 bg-blue-50 px-4 py-3 text-sm outline-none ring-1 ring-blue-100 focus:ring-2 focus:ring-blue-500"
                />
              </label>
              <label>
                <span className="text-xs font-semibold text-slate-500">
                  End
                </span>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(event) => setCustomEndDate(event.target.value)}
                  className="mt-1 w-full rounded-2xl border-0 bg-blue-50 px-4 py-3 text-sm outline-none ring-1 ring-blue-100 focus:ring-2 focus:ring-blue-500"
                />
              </label>
            </div>
          ) : null}
          <input
            type="email"
            value={recipient}
            onChange={(event) => setRecipient(event.target.value)}
            placeholder="seller@email.com or your email"
            className="mt-4 w-full rounded-2xl border-0 bg-blue-50 px-4 py-3 text-sm outline-none ring-1 ring-blue-100 focus:ring-2 focus:ring-blue-500"
          />
          {status ? (
            <p
              className={`mt-3 rounded-2xl px-4 py-3 text-xs font-semibold ${
                statusType === "success"
                  ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-100"
                  : statusType === "error"
                    ? "bg-red-50 text-red-800 ring-1 ring-red-100"
                    : "bg-slate-50 text-slate-700"
              }`}
            >
              {status}
            </p>
          ) : null}
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
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
              onClick={downloadCalendar}
              disabled={isDownloading}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-3 text-sm font-semibold text-blue-900 shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Download size={15} />
              {isDownloading ? "Preparing..." : "Download"}
            </button>
          </div>
          <div className="mt-2 flex">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="inline-flex w-full items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
