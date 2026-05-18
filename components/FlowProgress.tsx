import Link from "next/link";

const flowSteps = [
  {
    href: "/create",
    label: "Start Preparation",
    decision: "Enter the address",
  },
  {
    href: "/details",
    label: "Property Details",
    decision: "Add the property facts",
  },
  {
    href: "/upload",
    label: "Property Media",
    decision: "Upload once, reuse everywhere",
  },
  {
    href: "/mockups",
    label: "Campaign Preview",
    decision: "Create the appraisal",
  },
];

export function FlowProgress({ currentStep }: { currentStep: number }) {
  const safeStep = Math.min(Math.max(currentStep, 1), flowSteps.length);

  return (
    <div className="mb-7 rounded-[1.75rem] bg-white p-4 shadow-card ring-1 ring-blue-50 sm:mb-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">
            Step {safeStep} of {flowSteps.length}
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-950">
            {flowSteps[safeStep - 1]?.label}
          </p>
          <p className="mt-1 text-xs font-medium text-slate-500">
            {flowSteps[safeStep - 1]?.decision}
          </p>
        </div>
        <div className="hidden min-w-0 flex-1 items-center gap-2 md:flex">
          {flowSteps.map((step, index) => {
            const stepNumber = index + 1;
            const active = stepNumber === safeStep;
            const complete = stepNumber < safeStep;

            return (
              <Link
                key={step.href}
                href={step.href}
                className={`h-2 flex-1 rounded-full transition ${
                  active
                    ? "bg-blue-700"
                    : complete
                      ? "bg-blue-300"
                      : "bg-slate-100"
                }`}
                aria-label={step.label}
                title={step.label}
              />
            );
          })}
        </div>
      </div>
      <div className="mt-4 flex gap-2 md:hidden">
        {flowSteps.map((step, index) => {
          const stepNumber = index + 1;
          const active = stepNumber === safeStep;
          const complete = stepNumber < safeStep;

          return (
            <Link
              key={step.href}
              href={step.href}
              className={`h-1.5 flex-1 rounded-full transition ${
                active
                  ? "bg-blue-700"
                  : complete
                    ? "bg-blue-300"
                    : "bg-slate-100"
              }`}
              aria-label={step.label}
              title={step.label}
            />
          );
        })}
      </div>
    </div>
  );
}
