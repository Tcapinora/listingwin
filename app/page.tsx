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
    title: "Build the appraisal",
    copy: "Add the property, photos, comparable sales, and key notes once.",
  },
  {
    step: "02",
    title: "Show the campaign",
    copy: "Turn the seller's home into a premium vendor presentation live.",
  },
  {
    step: "03",
    title: "Close with confidence",
    copy: "Move from presentation into the private agent workspace.",
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
              Built for listing presentations
            </div>

            <h1 className="mx-auto mt-8 max-w-5xl text-5xl font-extrabold leading-[0.95] tracking-tight text-[#1F2A4A] sm:text-6xl lg:text-7xl">
              Show the campaign before the campaign.
            </h1>

            <p className="mx-auto mt-7 max-w-3xl text-xl font-light leading-8 text-[#40516B] sm:text-2xl sm:leading-9">
              ListingWin helps real estate agents turn appraisal notes, photos,
              and comparable sales into a live vendor presentation in minutes.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/start"
                className="inline-flex items-center justify-center gap-3 rounded-full bg-[#3563E0] px-7 py-4 text-base font-semibold text-white shadow-card transition hover:bg-[#2848B8]"
              >
                Create account
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
              One flow: prepare the appraisal, present the campaign, then close
              in the agent workspace.
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
        </div>
      </section>
    </main>
  );
}
