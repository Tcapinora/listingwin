import { ArrowRight } from "lucide-react";

const stages = [
  {
    id: "builder",
    label: "Preparation",
    description: "Set up before the appraisal",
  },
  {
    id: "presentation",
    label: "Appraisal",
    description: "Present, discuss, capture notes",
  },
  {
    id: "proposal",
    label: "Proposal",
    description: "Send the follow-up link",
  },
] as const;

export type WorkflowStage = (typeof stages)[number]["id"];

export function WorkflowPath({ active }: { active: WorkflowStage }) {
  return (
    <div className="rounded-[1.5rem] bg-white p-3 shadow-sm ring-1 ring-slate-200/70">
      <div className="grid gap-2 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-stretch">
        {stages.map((stage, index) => {
          const isActive = stage.id === active;
          const isComplete =
            stages.findIndex((item) => item.id === active) > index;

          return (
            <div key={stage.id} className="contents">
              <div
                className={`rounded-[1.15rem] px-4 py-3 transition ${
                  isActive
                    ? "bg-blue-700 text-white shadow-card"
                    : isComplete
                      ? "bg-blue-50 text-blue-950"
                      : "bg-slate-50 text-slate-600"
                }`}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-75">
                  Step {index + 1}
                </p>
                <p className="mt-1 text-sm font-semibold">{stage.label}</p>
                <p className="mt-1 text-xs leading-5 opacity-75">
                  {stage.description}
                </p>
              </div>
              {index < stages.length - 1 ? (
                <div className="hidden place-items-center px-1 text-slate-300 lg:grid">
                  <ArrowRight size={16} />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
