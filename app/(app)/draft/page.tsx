"use client";

import Link from "next/link";
import {
  ArrowRight,
  Copy,
  FileText,
  Handshake,
  MessageCircleQuestion,
  Share2,
  Target,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { useAgentProfile } from "@/components/AgentProfileProvider";
import { useListing } from "@/components/ListingProvider";
import {
  AgentNotesSection,
  AppraisalScriptSection,
  CommissionDefenceSection,
  Form6PrototypeSection,
} from "@/components/ValueSections";
import { generatePropertyWriteup } from "@/lib/copy";
import { getListingWinInsight } from "@/lib/listingScore";
import {
  getShareUrl,
  savePresentationSnapshot,
} from "@/lib/presentationHistory";

export default function DraftPage() {
  const { listing, setListing } = useListing();
  const { profile, isProfileComplete } = useAgentProfile();
  const [shareStatus, setShareStatus] = useState("");
  const insight = getListingWinInsight(listing, profile);
  const writeup = generatePropertyWriteup(listing.details);
  const keyFeatures =
    listing.details.keyFeatures ||
    listing.details.notes ||
    "Street appeal, buyer-focused presentation, clear campaign plan, and strong launch assets.";
  const socialCaption = `${listing.details.headline || "New listing opportunity"} ${
    listing.details.address ? `at ${listing.details.address}` : ""
  }. A polished campaign launch designed to create attention, urgency, and buyer confidence.`;
  const defaultClientMessage =
    "Hi [Client Name], thanks again for having me through the property today. I really enjoyed seeing the home and discussing your plans. I'll send through the proposal and next steps shortly, but if you have any questions in the meantime, please feel free to reach out.";
  const [clientMessage, setClientMessage] = useState(
    listing.workspaceChecklist["client-message"]?.notes || defaultClientMessage,
  );

  const hasProperty = Boolean(listing.details.address.trim());
  const hasImages = Boolean(
    listing.propertyPhotos.length || listing.assets.propertyPhoto,
  );
  const setupStatus = [
    isProfileComplete ? "Agent profile ready" : "Agent profile needs attention",
    hasProperty ? "Property details ready" : "Property details missing",
    hasImages ? "Marketing visuals ready" : "Marketing visuals missing",
  ];
  const quickActions: Array<[string, string, LucideIcon]> = [
    ["Follow-up checklist", "#workspace-checklist", Target],
    ["Client message", "#client-message", MessageCircleQuestion],
    ["Form 6 notes", "#form-6", FileText],
  ];
  const updateChecklistTopic = (
    topicId: string,
    updater: (current: { done: boolean; subtasks: Record<string, boolean>; notes: string }) => {
      done: boolean;
      subtasks: Record<string, boolean>;
      notes: string;
    },
  ) => {
    setListing((current) => {
      const existing = current.workspaceChecklist[topicId] || {
        done: false,
        subtasks: {},
        notes: "",
      };

      return {
        ...current,
        workspaceChecklist: {
          ...current.workspaceChecklist,
          [topicId]: updater(existing),
        },
      };
    });
  };
  const checklistCompleted = workspaceChecklistTopics.reduce((total, topic) => {
    const saved = listing.workspaceChecklist[topic.id];
    const subtaskCount = topic.subtasks.filter(
      (subtask) => saved?.subtasks?.[subtask],
    ).length;

    return total + (saved?.done ? 1 : 0) + subtaskCount;
  }, 0);
  const checklistTotal = workspaceChecklistTopics.reduce(
    (total, topic) => total + 1 + topic.subtasks.length,
    0,
  );
  const objectionTools = [
    {
      objection: "Another agent said we can get more.",
      meaning: "The seller wants confidence, not just a bigger number.",
      response:
        "That is exactly why I wanted to show you the campaign first. The best price comes from buyer belief, not just an optimistic quote.",
      question: "Would you rather choose the highest promise, or the clearest plan to create competition?",
      close: "Let’s launch with the strategy that gives the market the best chance to prove the price.",
    },
    {
      objection: "Your commission is too high.",
      meaning: "The seller is testing whether the fee is tied to a better result.",
      response:
        "I understand. My role is not just to list the property; it is to create the competition, protect the price, and manage the campaign properly.",
      question: "If the right strategy protects even one extra bid, would that outweigh the fee difference?",
      close: "Let’s focus on the net result, not just the line item.",
    },
    {
      objection: "We want to think about it.",
      meaning: "The seller is not fully comfortable making the decision yet.",
      response:
        "Of course. Before I leave, can I ask what part you feel you still need to be sure about: price, timing, marketing, or choosing the agent?",
      question: "What would need to be clearer for you to feel comfortable moving forward?",
      close: "If we can solve that now, we can leave here with a clear plan.",
    },
    {
      objection: "We want to try a higher price first.",
      meaning: "The seller is emotionally attached to the upside.",
      response:
        "I want the best price too. The risk is not ambition; the risk is sitting above the buyer pool and losing momentum.",
      question: "Would you be open to a strategy that protects your upside but still keeps buyers engaged early?",
      close: "Let’s use the evidence and campaign response to control the price conversation.",
    },
    {
      objection: "We might sell off-market.",
      meaning: "The seller wants less stress, but may not see what they could miss.",
      response:
        "Off-market can suit some situations, but it usually limits the emotional competition that creates a premium result.",
      question: "If we already have buyers, would you still want to test the wider market before accepting a private result?",
      close: "Let’s use the database first, then decide whether the full campaign gives you more leverage.",
    },
    {
      objection: "We already know who we want to use.",
      meaning: "The seller has a relationship, but may still be movable with proof.",
      response:
        "That makes sense. My job today is simply to show you what choosing us would look like and what we would do differently.",
      question: "After seeing the campaign, is there anything here you wish the other agent had shown you?",
      close: "If this feels stronger, let’s talk about what would make switching comfortable.",
    },
  ];

  return (
    <>
      <section className="rounded-[2rem] bg-white p-6 shadow-card ring-1 ring-slate-200/70 sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.6fr] lg:items-end">
          <div>
            <div className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-800">
              Appraisal workspace · private
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Capture the appraisal conversation after the seller sees the campaign.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              This is not another seller deck. It is the private agent screen
              for the appraisal conversation: confirm what landed, handle what
              is still uncertain, then leave with a clear next step.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href="#workspace-checklist"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-blue-800"
              >
                Start appraisal checklist
                <ArrowRight size={17} />
              </a>
              <Link
                href="/details"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-blue-100 bg-white px-5 py-3 text-sm font-semibold text-blue-900 shadow-sm transition hover:bg-blue-50"
              >
                Edit preparation details
              </Link>
            </div>
          </div>
          <div className="rounded-[1.5rem] bg-blue-50 p-5 ring-1 ring-blue-100">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-blue-900">
                  ListingWin score
                </p>
                <p className="mt-2 text-5xl font-semibold tracking-tight text-blue-950">
                  {insight.score}
                </p>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-blue-800">
                {insight.label}
              </span>
            </div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-white">
              <div
                className="h-full rounded-full bg-blue-700"
                style={{ width: `${insight.score}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-200/80 pt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">
            Private agent tools
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            Work through the close without showing another deck.
          </h2>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[1.5rem] bg-slate-50 p-5 ring-1 ring-slate-200/70">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
              Private closing checklist
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
              Tick off what has been covered.
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {checklistCompleted}/{checklistTotal} items complete. This is for
              the agent only, after the seller-facing presentation.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {setupStatus.map((status) => (
                <span
                  key={status}
                  className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-600"
                >
                  {status}
                </span>
              ))}
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white">
              <div
                className="h-full rounded-full bg-blue-700"
                style={{
                  width: `${Math.round((checklistCompleted / checklistTotal) * 100)}%`,
                }}
              />
            </div>
          </div>

          <div className="rounded-[1.5rem] bg-blue-50 p-5 ring-1 ring-blue-100">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
              Next best actions
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {quickActions.map(([label, href, ActionIcon]) => {
                return (
                  <Link
                    key={label}
                    href={href}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-blue-900 shadow-sm transition hover:bg-blue-100"
                  >
                    <ActionIcon size={16} />
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-200/80 pt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">
            Closing checklist
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            Tick off the conversation as it happens.
          </h2>
        </div>

        <div id="workspace-checklist" className="mt-6 grid gap-4 lg:grid-cols-2">
          {workspaceChecklistTopics.map((topic) => {
            const saved = listing.workspaceChecklist[topic.id] || {
              done: false,
              subtasks: {},
              notes: "",
            };

            return (
              <article
                key={topic.id}
                className="rounded-[1.75rem] bg-slate-50 p-5 ring-1 ring-slate-200/70"
              >
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={saved.done}
                    onChange={(event) =>
                      updateChecklistTopic(topic.id, (current) => ({
                        ...current,
                        done: event.target.checked,
                      }))
                    }
                    className="mt-1 h-5 w-5 rounded border-slate-300 text-blue-700 focus:ring-blue-500"
                  />
                  <span>
                    <span className="block text-lg font-semibold tracking-tight text-slate-950">
                      {topic.title}
                    </span>
                    <span className="mt-1 block text-sm leading-6 text-slate-600">
                      {topic.description}
                    </span>
                  </span>
                </label>

                <div className="mt-4 grid gap-2">
                  {topic.subtasks.map((subtask) => (
                    <label
                      key={subtask}
                      className="flex cursor-pointer items-center gap-3 rounded-2xl bg-white px-4 py-3 text-sm font-medium text-slate-700"
                    >
                      <input
                        type="checkbox"
                        checked={Boolean(saved.subtasks[subtask])}
                        onChange={(event) =>
                          updateChecklistTopic(topic.id, (current) => ({
                            ...current,
                            subtasks: {
                              ...current.subtasks,
                              [subtask]: event.target.checked,
                            },
                          }))
                        }
                        className="h-4 w-4 rounded border-slate-300 text-blue-700 focus:ring-blue-500"
                      />
                      {subtask}
                    </label>
                  ))}
                </div>

                <label className="mt-4 block">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Notes
                  </span>
                  <textarea
                    value={saved.notes}
                    onChange={(event) =>
                      updateChecklistTopic(topic.id, (current) => ({
                        ...current,
                        notes: event.target.value,
                      }))
                    }
                    placeholder="Add private notes from the appraisal..."
                    rows={4}
                    className="mt-2 w-full resize-none rounded-2xl border-0 bg-white px-4 py-3 text-sm leading-6 text-slate-950 outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500"
                  />
                </label>
              </article>
            );
          })}
        </div>

        <div className="mt-12 border-t border-slate-200/80 pt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">
            Follow-up and documents
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            Leave the appraisal with a next step ready.
          </h2>
        </div>

        <section
          id="client-message"
          className="mt-6 rounded-[1.75rem] bg-blue-50 p-5 ring-1 ring-blue-100"
        >
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
                Message to send client after appraisal
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
                Keep momentum while the decision is fresh.
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Edit this after the appointment, copy it, then send it by SMS or
                email with the proposal/report.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(clientMessage);
                    setShareStatus("Message copied");
                  } catch {
                    setShareStatus("Copy unavailable");
                  }

                  window.setTimeout(() => setShareStatus(""), 2500);
                }}
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-blue-900 shadow-sm ring-1 ring-blue-100"
              >
                <Copy size={16} />
                {shareStatus === "Message copied" ? "Copied" : "Copy message"}
              </button>
              <button
                type="button"
                onClick={() => {
                  updateChecklistTopic("client-message", (current) => ({
                    ...current,
                    done: true,
                    notes: clientMessage,
                  }));
                  setShareStatus("Message saved");
                  window.setTimeout(() => setShareStatus(""), 2500);
                }}
                className="inline-flex items-center gap-2 rounded-full bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-card"
              >
                Save message
              </button>
            </div>
          </div>
          <textarea
            value={clientMessage}
            onChange={(event) => setClientMessage(event.target.value)}
            rows={5}
            className="mt-5 w-full resize-none rounded-[1.25rem] border-0 bg-white px-5 py-4 text-sm leading-7 text-slate-950 outline-none ring-1 ring-blue-100 focus:ring-2 focus:ring-blue-500"
          />
        </section>

        <details className="mt-6 rounded-[1.5rem] bg-slate-50 p-5">
          <summary className="cursor-pointer text-sm font-semibold text-slate-950">
            View prepared follow-up copy
          </summary>
          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            {[
              ["Vendor follow-up copy", profile.defaultVendorFollowUpMessage || writeup],
              ["Social caption", socialCaption],
              ["Property strengths", keyFeatures],
              [
                "Property weaknesses",
                listing.details.priceNotes ||
                  "Add likely objections here: price sensitivity, presentation work, access, noise, renovation items, or stronger competing properties.",
              ],
            ].map(([title, content]) => (
              <article key={title} className="rounded-[1.5rem] bg-white p-5">
                <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-950">
                  <FileText size={16} />
                  {title}
                </div>
                <p className="text-sm leading-6 text-slate-600">{content}</p>
              </article>
            ))}
          </div>
        </details>

        <div className="mt-6 rounded-[1.5rem] bg-blue-950 p-5 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-200">
            Finish the appointment
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/finish"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-4 text-base font-semibold text-blue-950 shadow-card"
            >
              Finish appraisal
              <ArrowRight size={18} />
            </Link>
            <button
              type="button"
              onClick={async () => {
                const presentation = savePresentationSnapshot(listing, profile);
                const shareUrl = getShareUrl(presentation.id);

                try {
                  await navigator.clipboard.writeText(shareUrl);
                  setShareStatus("Share link copied");
                } catch {
                  setShareStatus(shareUrl);
                }

                window.setTimeout(() => setShareStatus(""), 3000);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white/10 px-6 py-4 text-base font-semibold text-white ring-1 ring-white/15"
            >
              <Share2 size={18} />
              {shareStatus || "Share"}
            </button>
            <button
              type="button"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(
                    `${writeup}\n\n${socialCaption}\n\n${keyFeatures}`,
                  );
                  setShareStatus("Text copied");
                } catch {
                  setShareStatus("Copy unavailable");
                }

                window.setTimeout(() => setShareStatus(""), 2500);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white/10 px-6 py-4 text-base font-semibold text-white ring-1 ring-white/15"
            >
              <Copy size={18} />
              Copy Follow-Up
            </button>
          </div>
        </div>
      </section>

      <section className="mt-10 rounded-[2rem] bg-white p-6 shadow-card ring-1 ring-slate-200/70 sm:p-8">
        <p className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-800">
          <Handshake size={16} />
          Private closing tools
        </p>
        <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950">
          Open only what you need to close the seller.
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          The checklist stays first. These deeper tools sit below it so the
          agent can handle hesitation without turning the workspace into a
          second presentation.
        </p>
      </section>

      <details className="group mt-6 rounded-[2rem] bg-white p-6 shadow-card ring-1 ring-slate-200/70 sm:p-8">
        <summary className="cursor-pointer list-none">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-800">
                <MessageCircleQuestion size={16} />
                Seller objection toolkit
              </p>
              <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950">
                Handle seller objections calmly.
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                Open this only when the seller hesitates. Each prompt gives the
                agent a clean response, a better question, and a simple close.
              </p>
            </div>
            <span className="w-fit rounded-full bg-blue-950 px-4 py-2 text-sm font-semibold text-white group-open:bg-blue-700">
              Open toolkit
            </span>
          </div>
        </summary>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {objectionTools.map((tool) => (
            <details
              key={tool.objection}
              className="group rounded-[1.5rem] bg-slate-50 p-5 ring-1 ring-slate-200 transition open:bg-white open:shadow-card"
            >
              <summary className="cursor-pointer list-none">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                      Seller says
                    </p>
                    <h3 className="mt-2 text-lg font-semibold tracking-tight text-slate-950">
                      {tool.objection}
                    </h3>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-blue-800 ring-1 ring-blue-100 group-open:bg-blue-700 group-open:text-white">
                    Open
                  </span>
                </div>
              </summary>
              <div className="mt-5 grid gap-3 text-sm leading-6">
                <div className="rounded-2xl bg-blue-50 p-4 text-blue-950">
                  <span className="font-semibold">What they mean: </span>
                  {tool.meaning}
                </div>
                <div className="rounded-2xl bg-white p-4 text-slate-700 ring-1 ring-slate-100">
                  <span className="font-semibold text-slate-950">
                    Best response:{" "}
                  </span>
                  {tool.response}
                </div>
                <div className="rounded-2xl bg-white p-4 text-slate-700 ring-1 ring-slate-100">
                  <span className="font-semibold text-slate-950">
                    Ask next:{" "}
                  </span>
                  {tool.question}
                </div>
                <div className="rounded-2xl bg-blue-950 p-4 text-white">
                  <span className="font-semibold">Close: </span>
                  {tool.close}
                </div>
              </div>
            </details>
          ))}
        </div>
      </details>

      <details className="group mt-6 rounded-[2rem] bg-white p-6 shadow-card ring-1 ring-slate-200/70 sm:p-8">
        <summary className="cursor-pointer list-none">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">
                Commission and value
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
                Defend the fee with confidence.
              </h2>
            </div>
            <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-900 group-open:bg-blue-700 group-open:text-white">
              Open
            </span>
          </div>
        </summary>
        <CommissionDefenceSection />
      </details>

      <details className="group mt-6 rounded-[2rem] bg-white p-6 shadow-card ring-1 ring-slate-200/70 sm:p-8">
        <summary className="cursor-pointer list-none">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">
                Conversation guide
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
                Keep the appraisal conversation controlled.
              </h2>
            </div>
            <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-900 group-open:bg-blue-700 group-open:text-white">
              Open
            </span>
          </div>
        </summary>
        <AppraisalScriptSection listing={listing} />
      </details>

      <details className="group mt-6 rounded-[2rem] bg-white p-6 shadow-card ring-1 ring-slate-200/70 sm:p-8">
        <summary className="cursor-pointer list-none">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">
                Private notes
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
                Capture what matters after the meeting.
              </h2>
            </div>
            <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-900 group-open:bg-blue-700 group-open:text-white">
              Open
            </span>
          </div>
        </summary>
        <AgentNotesSection listing={listing} />
      </details>

      <details
        id="form-6"
        className="group mt-6 rounded-[2rem] bg-white p-6 shadow-card ring-1 ring-slate-200/70 sm:p-8"
      >
        <summary className="cursor-pointer list-none">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-800">
                <FileText size={16} />
                Form 6 and agreement notes
              </p>
              <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950">
                Explain the paperwork without making it feel heavy.
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                Use this when the seller asks about the appointment documents.
                Keep notes simple and agency-specific.
              </p>
            </div>
            <span className="w-fit rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-900 group-open:bg-blue-700 group-open:text-white">
              Open
            </span>
          </div>
        </summary>
        <Form6PrototypeSection />
      </details>

      <section className="mt-10 rounded-[2rem] bg-blue-950 p-6 text-white shadow-soft sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-200">
          Proposal
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight">
          Generate the proposal while the appraisal is still fresh.
        </h2>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/proposal"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-4 text-sm font-semibold text-blue-950 shadow-card"
          >
            Generate Proposal
            <ArrowRight size={18} />
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-6 py-4 text-sm font-semibold text-white"
          >
            Return to dashboard
          </Link>
        </div>
      </section>
    </>
  );
}

const workspaceChecklistTopics = [
  {
    id: "buyer-demand-close",
    title: "Buyer Demand Close",
    description:
      "Use the seller-facing buyer proof as a closing point without turning this workspace into the presentation.",
    subtasks: [
      "Buyer demand explained",
      "Active buyers discussed",
      "Similar buyer enquiry discussed",
      "Buyer database used as a closing point",
      "Vendor understands why launching now matters",
    ],
  },
  {
    id: "follow-up-reminders",
    title: "Follow-Up Reminders",
    description:
      "Keep control after the appraisal by locking in the next contact and decision point.",
    subtasks: [
      "Send post-appraisal message",
      "Send updated proposal/report",
      "Call vendor after 24 hours",
      "Confirm next decision date",
      "Follow up objections",
      "Send Form 6 / agency agreement if required",
    ],
  },
  {
    id: "commission-confidence",
    title: "Commission and Confidence Checklist",
    description:
      "Connect the fee, marketing investment, and strategy back to the result the vendor wants.",
    subtasks: [
      "Commission discussed",
      "Commission justified with value",
      "Marketing investment discussed",
      "Agent explained why their strategy gives the vendor confidence",
      "Vendor concerns addressed",
    ],
  },
  {
    id: "emotional-prompts",
    title: "Emotional Conversation Prompts",
    description:
      "Ask better questions so the close speaks to the seller’s real reason for moving.",
    subtasks: [
      "Why are you considering selling?",
      "What would a great result mean for you?",
      "What is most important to you in the process?",
      "Are you more focused on price, timing, or certainty?",
      "What concerns do you have about selling?",
    ],
  },
  {
    id: "general-appraisal",
    title: "General Appraisal Checklist",
    description:
      "A simple tick-and-flick list for the core points that should be covered before leaving.",
    subtasks: [
      "Seller motivation discussed",
      "Timeline confirmed",
      "Price expectations discussed",
      "Marketing campaign explained",
      "Comparable sales explained",
      "Next steps confirmed",
    ],
  },
];
