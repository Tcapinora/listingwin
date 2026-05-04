import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Building2,
  Eye,
  Link2,
  MonitorPlay,
  Sparkles,
  Trophy,
} from "lucide-react";

const outcomes = [
  "Seller-ready pitch in minutes",
  "Shareable presentation preview",
  "ListingWin Score out of 100",
];

const painPoints = [
  "The seller asks why your marketing is different.",
  "Price expectations need evidence, not guesswork.",
  "Generic proposals look the same as every other agent.",
  "Follow-up loses momentum after the appraisal.",
];

const workflow = [
  {
    title: "Create your agent account",
    description:
      "Save brand, contact details, socials, agency colours, and logos once.",
    icon: Building2,
  },
  {
    title: "Build the listing mockup",
    description:
      "Upload photos, place signboards, stage open-home energy, and prepare pricing proof.",
    icon: Sparkles,
  },
  {
    title: "Win the appraisal conversation",
    description:
      "Show the seller what buyers will see, then leave them with a link after the meeting.",
    icon: Trophy,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#eef6ff] text-slate-950">
      <header className="border-b border-blue-100 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-700 text-white shadow-card">
              <Trophy size={20} />
            </span>
            <span>
              <span className="block text-lg font-semibold tracking-tight">
                ListingWin
              </span>
              <span className="text-xs font-medium text-blue-700">
                Agent presentation studio
              </span>
            </span>
          </Link>
          <nav className="hidden items-center gap-2 sm:flex">
            <Link
              href="/dashboard"
              className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-blue-50 hover:text-blue-800"
            >
              Log in
            </Link>
            <Link
              href="/account"
              className="inline-flex items-center gap-2 rounded-full bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-blue-800"
            >
              Create
              <ArrowRight size={16} />
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-12 lg:grid-cols-[0.92fr_1.08fr] lg:px-8 lg:py-16">
        <div className="flex flex-col justify-center">
          <p className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-blue-800 shadow-sm">
            <Sparkles size={16} />
            Built by real estate agents for real estate agents
          </p>
          <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-tight tracking-tight text-slate-950 lg:text-7xl">
            Walk into every appraisal with the seller’s campaign already built.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            ListingWin helps agents turn property photos, signboards, agency
            branding, and social previews into a polished seller-facing
            presentation. It is designed around the real appraisal conversations
            agents have every week.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/account"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-700 px-6 py-4 text-sm font-semibold text-white shadow-card transition hover:bg-blue-800"
            >
              Create
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-blue-200 bg-white px-6 py-4 text-sm font-semibold text-blue-900 shadow-sm transition hover:border-blue-300"
            >
              View demo workspace
              <MonitorPlay size={16} />
            </Link>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {outcomes.map((outcome) => (
              <div
                key={outcome}
                className="flex items-center gap-2 rounded-2xl bg-white/80 p-4 text-sm font-semibold text-slate-700 shadow-sm"
              >
                <BadgeCheck className="text-blue-700" size={17} />
                {outcome}
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-3xl border border-blue-100 bg-white/80 p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">
              Built for the hard part of listing
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {painPoints.map((point) => (
                <p
                  key={point}
                  className="rounded-2xl bg-blue-50/70 p-4 text-sm font-semibold leading-6 text-slate-700"
                >
                  {point}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-8 rounded-[3rem] bg-blue-300/25 blur-3xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-blue-100 bg-white shadow-soft">
            <div className="flex items-center justify-between border-b border-blue-50 px-5 py-4">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-blue-200" />
                <span className="h-3 w-3 rounded-full bg-sky-300" />
                <span className="h-3 w-3 rounded-full bg-indigo-300" />
              </div>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800">
                Seller presentation
              </span>
            </div>

            <div className="grid gap-5 p-5 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="overflow-hidden rounded-3xl bg-slate-950 text-white">
                <div className="relative min-h-[420px] bg-[linear-gradient(145deg,#0f172a_0%,#1d4ed8_58%,#38bdf8_100%)]">
                  <div className="absolute left-6 top-6 rounded-full bg-white/15 px-4 py-2 text-xs font-semibold">
                    Vendor presentation
                  </div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-100">
                      42 Seaview Avenue
                    </p>
                    <h2 className="mt-3 text-4xl font-semibold tracking-tight">
                      Premium launch plan for a stronger listing conversation.
                    </h2>
                  </div>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="rounded-3xl border border-blue-100 bg-blue-50 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                        ListingWin Score
                      </p>
                      <p className="mt-2 text-5xl font-semibold tracking-tight">
                        86
                      </p>
                    </div>
                    <BarChart3 className="text-blue-700" size={34} />
                  </div>
                  <div className="mt-5 h-2 rounded-full bg-white">
                    <div className="h-full w-[86%] rounded-full bg-blue-700" />
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-5">
                  <p className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <Eye className="text-blue-700" size={17} />
                    Seller recommendation
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Lead with the strongest front elevation, then use the next
                    images to sell lifestyle and outdoor appeal.
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-5">
                  <p className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <Link2 className="text-blue-700" size={17} />
                    Share after appraisal
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Save the presentation, copy the link, and keep the seller
                    engaged after the meeting.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-3">
          {workflow.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-3xl border border-blue-100 bg-white p-6 shadow-card"
              >
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-700 text-white">
                  <Icon size={20} />
                </div>
                <h2 className="mt-5 text-xl font-semibold tracking-tight">
                  {item.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
