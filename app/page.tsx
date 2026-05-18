import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  MonitorPlay,
  Sparkles,
} from "lucide-react";

const workflow = [
  {
    step: "01",
    title: "Prepare the appraisal",
    copy: "Add the property, photos, comparable sales, and key notes once.",
  },
  {
    step: "02",
    title: "Show the campaign",
    copy: "Turn the seller's home into a premium live appraisal experience.",
  },
  {
    step: "03",
    title: "Send the proposal",
    copy: "Generate the follow-up link without rebuilding the document.",
  },
];

const pricing = [
  {
    name: "Solo agent",
    price: "$39/mo",
    note: "14-day free trial",
    copy: "For agents who want sharper appraisals and a cleaner way to win listings.",
    cta: "Start free trial",
    href: "/start",
    featured: true,
  },
  {
    name: "Agency",
    price: "Contact us",
    note: "For teams and offices",
    copy: "For agencies that want consistent branded presentations, shared templates, and team rollout.",
    cta: "Talk to us",
    href: "mailto:hello@listingwin.com.au?subject=ListingWin agency subscription",
    featured: false,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FBFBFD] text-[#1F2A4A]">
      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-6 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between gap-4 border-b border-[#DEE0E5]/80 pb-6">
          <Link href="/" aria-label="ListingWin home">
            <Image
              src="/brand/listingwin-lockup-exact.png"
              alt="ListingWin"
              width={1333}
              height={255}
              priority
              className="h-auto w-44 sm:w-52"
            />
          </Link>
          <Link
            href="/sign-in"
            className="rounded-full border border-[#D0D7E2] bg-white/75 px-5 py-3 text-sm font-semibold text-[#1F2A4A] shadow-sm transition hover:border-[#3563E0] hover:text-[#3563E0]"
          >
            Sign in
          </Link>
        </header>

        <div className="flex flex-1 flex-col justify-center py-16 sm:py-20 lg:py-24">
          <section className="mx-auto max-w-5xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D0D7E2] bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#3563E0] shadow-sm">
              <Sparkles size={15} />
              Built for listing appraisals
            </div>

            <h1 className="mx-auto mt-8 max-w-5xl text-5xl font-extrabold leading-[0.95] tracking-tight text-[#1F2A4A] sm:text-6xl lg:text-7xl">
              Show the campaign before the campaign.
            </h1>

            <p className="mx-auto mt-7 max-w-3xl text-xl font-light leading-8 text-[#40516B] sm:text-2xl sm:leading-9">
              ListingWin helps real estate agents turn appraisal notes, photos,
              and comparable sales into a live appraisal and proposal in minutes.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/start"
                className="inline-flex items-center justify-center gap-3 rounded-full bg-[#3563E0] px-7 py-4 text-base font-semibold text-white shadow-card transition hover:bg-[#2848B8]"
              >
                Start 14-day free trial
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/dashboard?demo=1"
                className="inline-flex items-center justify-center gap-3 rounded-full border border-[#D0D7E2] bg-white px-7 py-4 text-base font-semibold text-[#1F2A4A] shadow-sm transition hover:border-[#3563E0] hover:text-[#3563E0]"
              >
                View demo
                <MonitorPlay size={18} />
              </Link>
            </div>

            <p className="mt-5 text-sm font-medium text-[#64748B]">
              Then $39/month for one agent. Agency subscriptions available on
              request.
            </p>
          </section>

          <section className="mx-auto mt-16 grid w-full max-w-6xl gap-4 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="rounded-[2rem] bg-[#1F2A4A] p-7 text-white shadow-card sm:p-8">
              <Image
                src="/brand/listingwin-mark-light-exact.png"
                alt=""
                width={64}
                height={64}
                className="h-12 w-12 object-contain"
              />
              <p className="mt-8 text-sm font-bold uppercase tracking-[0.22em] text-white/60">
                What it does
              </p>
              <p className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
                Turns an appraisal into a seller-ready campaign preview.
              </p>
            </div>

            <div className="rounded-[2rem] border border-[#DEE0E5] bg-white p-4 shadow-card sm:p-5">
              <div className="grid gap-3 md:grid-cols-3">
                {workflow.map((item) => (
                  <article
                    key={item.step}
                    className="rounded-[1.4rem] bg-[#F2F4F8] p-5 text-left"
                  >
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-bold text-[#3563E0]">
                      {item.step}
                    </span>
                    <h2 className="mt-5 text-xl font-bold tracking-tight text-[#1F2A4A]">
                      {item.title}
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-[#40516B]">
                      {item.copy}
                    </p>
                  </article>
                ))}
              </div>
              <div className="mt-4 grid gap-3 rounded-[1.4rem] border border-[#DEE0E5] bg-white p-5 sm:grid-cols-3">
                {[
                  "Vendor presentation",
                  "Campaign mockups",
                  "Agent workspace",
                ].map((point) => (
                <div
                  key={point}
                    className="flex items-center gap-2 text-sm font-semibold text-[#40516B]"
                >
                  <CheckCircle2 className="text-[#3563E0]" size={17} />
                  {point}
                </div>
              ))}
              </div>
            </div>
          </section>

          <section className="mx-auto mt-6 grid w-full max-w-6xl gap-4 lg:grid-cols-2">
            {pricing.map((plan) => (
              <article
                key={plan.name}
                className={`rounded-[2rem] p-6 shadow-card ${
                  plan.featured
                    ? "bg-[#1F2A4A] text-white"
                    : "border border-[#DEE0E5] bg-white text-[#1F2A4A]"
                }`}
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p
                      className={`text-sm font-bold uppercase tracking-[0.18em] ${
                        plan.featured ? "text-white/60" : "text-[#3563E0]"
                      }`}
                    >
                      {plan.name}
                    </p>
                    <h2 className="mt-3 text-4xl font-extrabold tracking-tight">
                      {plan.price}
                    </h2>
                    <p
                      className={`mt-2 text-sm font-semibold ${
                        plan.featured ? "text-white/70" : "text-[#64748B]"
                      }`}
                    >
                      {plan.note}
                    </p>
                  </div>
                  <Link
                    href={plan.href}
                    className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition ${
                      plan.featured
                        ? "bg-white text-[#1F2A4A] hover:bg-[#F2F4F8]"
                        : "border border-[#D0D7E2] bg-white text-[#1F2A4A] hover:border-[#3563E0] hover:text-[#3563E0]"
                    }`}
                  >
                    {plan.cta}
                    <ArrowRight size={15} />
                  </Link>
                </div>
                <p
                  className={`mt-5 max-w-xl text-sm leading-6 ${
                    plan.featured ? "text-white/72" : "text-[#40516B]"
                  }`}
                >
                  {plan.copy}
                </p>
              </article>
            ))}
          </section>
        </div>
      </section>
    </main>
  );
}
