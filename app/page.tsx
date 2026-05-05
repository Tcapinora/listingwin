import Link from "next/link";
import Image from "next/image";
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
  "Seller confidence in minutes",
  "Campaign proof they can see",
  "A clearer path to yes",
];

const painPoints = [
  "The seller is comparing agents on fee instead of confidence.",
  "Price expectations are emotional before they become logical.",
  "Generic proposals make every agent sound the same.",
  "Momentum fades when the seller cannot picture the campaign.",
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
      "Show the seller how buyers will see the home before the campaign exists.",
    icon: Sparkles,
  },
  {
    title: "Win the appraisal conversation",
    description:
      "Move the seller from uncertainty to confidence, then leave them with a link after the meeting.",
    icon: Trophy,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f6f9fc] text-slate-950">
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

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-10 sm:py-12 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-16">
        <div className="flex flex-col justify-center">
          <p className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-blue-800 shadow-sm">
            <Sparkles size={16} />
            Built by real estate agents for real estate agents
          </p>
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Walk into every appraisal with the seller already believing.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            ListingWin helps agents change the seller’s mindset before the
            listing is won. Turn property photos, market proof, buyer demand,
            and campaign visuals into a presentation that makes the seller feel
            understood, prepared, and ready to move.
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
                className="flex items-center gap-3 rounded-2xl bg-white/85 p-4 text-sm font-semibold leading-5 text-slate-700 shadow-sm"
              >
                <BadgeCheck className="shrink-0 text-blue-700" size={17} />
                <span>{outcome}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-3xl border border-blue-100 bg-white/80 p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">
              Built for the emotional part of listing
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
          <div className="absolute inset-8 rounded-[2rem] bg-slate-200/70 blur-3xl" />
          <div className="relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-soft">
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
              <div className="overflow-hidden rounded-[1.5rem] bg-slate-950 text-white shadow-card">
                <div className="relative min-h-[460px]">
                  <Image
                    src="/landing/vendor-presentation-home.jpg"
                    alt="Premium property prepared for a ListingWin vendor presentation"
                    fill
                    priority
                    sizes="(min-width: 1024px) 46vw, 100vw"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/92 via-slate-950/38 to-slate-950/18" />
                  <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-slate-950 via-slate-950/72 to-transparent" />
                  <div className="absolute left-6 top-6 rounded-full border border-white/25 bg-slate-950/55 px-4 py-2 text-xs font-semibold text-white shadow-card backdrop-blur-md">
                    Vendor presentation
                  </div>
                  <div className="absolute right-6 top-6 rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-950 shadow-card">
                    ListingWin
                  </div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="max-w-lg rounded-[1.5rem] border border-white/15 bg-slate-950/70 p-5 shadow-soft backdrop-blur-md">
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-100">
                        42 Seaview Avenue
                      </p>
                      <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
                        A launch plan that makes the seller feel ready to say yes.
                      </h2>
                      <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold text-white">
                        <span className="rounded-full bg-white/15 px-3 py-2 backdrop-blur-md">
                          Campaign preview
                        </span>
                        <span className="rounded-full bg-white/15 px-3 py-2 backdrop-blur-md">
                          Pricing confidence
                        </span>
                        <span className="rounded-full bg-white/15 px-3 py-2 backdrop-blur-md">
                          Seller follow-up
                        </span>
                      </div>
                    </div>
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
                    Start by recognising what matters about the home, then show
                    how the campaign turns that into buyer belief.
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
