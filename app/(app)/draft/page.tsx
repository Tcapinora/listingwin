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
  Users,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { useAgentProfile } from "@/components/AgentProfileProvider";
import { useListing } from "@/components/ListingProvider";
import {
  AgentNotesSection,
  AppraisalScriptSection,
  BuyerDemandSection,
  BuyerMatchEngineSection,
  CommissionDefenceSection,
  FollowUpAutomationSection,
  Form6PrototypeSection,
  SellerFollowUpSection,
  VendorReportSection,
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
    ["Call matched buyers", "#buyer-database", Users],
    ["Plan follow-up", "#follow-up", Target],
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
              Agent Workspace
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Close the listing with calm proof.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              The seller has seen what their campaign could look like. Now use
              this workspace to guide the decision: buyer proof, pricing
              confidence, objections, follow-up, Form 6 notes, and the next
              step.
            </p>
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

        <div className="mt-8 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
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

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
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

      <section
        id="buyer-database"
        className="mt-8 rounded-[2rem] bg-white p-6 shadow-card ring-1 ring-blue-50 sm:p-8"
      >
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-700">
            Buyer and follow-up tools
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            Prove there is already demand, then keep the seller close.
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            This is where the agent turns the marketing presentation into a
            real next step: who to call, what to say, and how to keep momentum
            after the appraisal.
          </p>
        </div>
      </section>

      <section id="follow-up" className="mt-10 rounded-[2rem] bg-slate-950 p-6 text-white shadow-soft sm:p-8">
        <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-blue-100">
          <Target size={16} />
          Follow-up plan
        </p>
        <h2 className="mt-5 text-3xl font-semibold tracking-tight">
          Decide who gets called first.
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
          Use the buyer matches and reminders below to leave the appointment
          with a call list, a message, and a reason for the seller to stay
          emotionally engaged.
        </p>
      </section>

      <BuyerMatchEngineSection listing={listing} onUpdate={setListing} />
      <FollowUpAutomationSection listing={listing} onUpdate={setListing} />

      <section className="mt-10 rounded-[2rem] bg-white p-6 shadow-card ring-1 ring-slate-200/70 sm:p-8">
        <p className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-800">
          <Handshake size={16} />
          Vendor confidence tools
        </p>
        <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950">
          Go deeper into the seller’s emotional decision.
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          Use these tools after the marketing presentation to talk through
          trust, fear, price, campaign confidence, fee value, and what the owner
          needs to feel before saying yes.
        </p>
      </section>

      <section className="mt-8 rounded-[2rem] bg-white p-6 shadow-card ring-1 ring-slate-200/70 sm:p-8">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-800">
              <MessageCircleQuestion size={16} />
              Closing tool
            </p>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950">
              Handle seller objections calmly.
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              Use this only inside the Agent Workspace. It gives the agent a
              clean response, a better question, and a simple close when the
              seller hesitates after the presentation.
            </p>
          </div>
        </div>

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
      </section>

      <VendorReportSection listing={listing} />
      <SellerFollowUpSection listing={listing} />
      <BuyerDemandSection listing={listing} />
      <CommissionDefenceSection />
      <AppraisalScriptSection listing={listing} />
      <AgentNotesSection listing={listing} />

      <section className="mt-10 rounded-[2rem] bg-white p-6 shadow-card ring-1 ring-slate-200/70 sm:p-8">
        <p className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-800">
          <FileText size={16} />
          Form 6 and agreement explanation
        </p>
        <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950">
          Explain the paperwork without making it feel heavy.
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          Walk through the appointment documents in plain language so the
          vendor feels informed before they proceed through the agency’s normal
          signing process.
        </p>
      </section>

      <div id="form-6">
        <Form6PrototypeSection />
      </div>

      <section className="mt-10 rounded-[2rem] bg-blue-950 p-6 text-white shadow-soft sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-200">
          Finish
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight">
          Finish the appraisal and return to the dashboard.
        </h2>
        <Link
          href="/dashboard"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-4 text-sm font-semibold text-blue-950 shadow-card"
        >
          Finish appraisal
          <ArrowRight size={18} />
        </Link>
      </section>
    </>
  );
}

const workspaceChecklistTopics = [
  {
    id: "seller-motivation",
    title: "Seller motivation",
    description:
      "Understand the reason behind the move so the close matches the seller’s real driver.",
    subtasks: [
      "Reason for selling",
      "Ideal timeline",
      "Price expectations",
      "Preferred settlement terms",
    ],
  },
  {
    id: "pricing-strategy",
    title: "Pricing strategy",
    description:
      "Use evidence and feedback to make the price conversation feel controlled.",
    subtasks: [
      "Comparable sales discussed",
      "Market conditions explained",
      "Recommended price guide",
      "Vendor feedback captured",
    ],
  },
  {
    id: "marketing-campaign",
    title: "Marketing campaign",
    description:
      "Confirm the campaign pieces the seller has seen in the vendor presentation.",
    subtasks: [
      "Signboard",
      "Photography",
      "Floor plan",
      "Social media",
      "Realestate.com.au / Domain campaign",
    ],
  },
  {
    id: "presentation-follow-up",
    title: "Presentation follow-up",
    description:
      "Turn the appointment into a clear next step without making the seller feel rushed.",
    subtasks: [
      "Questions answered",
      "Objections handled",
      "Next steps agreed",
      "Form 6 / agency agreement discussed",
    ],
  },
];
