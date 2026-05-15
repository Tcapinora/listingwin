import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, MonitorPlay, UserPlus } from "lucide-react";

const trialSteps = [
  "Create your account",
  "Set your agent profile once",
  "Build your first vendor presentation",
];

export default function StartPage() {
  return (
    <main className="min-h-screen bg-[#F2F4F8] px-6 py-8 text-[#1F2A4A] sm:px-8 lg:px-10">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl flex-col">
        <header className="flex items-center justify-between gap-4">
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
            className="rounded-full border border-[#D0D7E2] bg-white/80 px-5 py-3 text-sm font-semibold text-[#1F2A4A] shadow-sm transition hover:border-[#3563E0] hover:text-[#3563E0]"
          >
            Sign in
          </Link>
        </header>

        <div className="grid flex-1 items-center gap-8 py-14 lg:grid-cols-[1.05fr_0.95fr]">
          <section>
            <p className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-bold text-[#3563E0] shadow-sm ring-1 ring-[#DEE0E5]">
              14-day free trial
            </p>
            <h1 className="mt-7 max-w-3xl text-5xl font-extrabold leading-[0.95] tracking-tight text-[#1F2A4A] sm:text-6xl">
              Build your first winning presentation.
            </h1>
            <p className="mt-6 max-w-2xl text-xl font-light leading-8 text-[#40516B]">
              Start with one listing. Add the property, show the seller the
              campaign, then move into the workspace to close with confidence.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/sign-up"
                className="inline-flex items-center justify-center gap-3 rounded-full bg-[#3563E0] px-7 py-4 text-base font-semibold text-white shadow-card transition hover:bg-[#2848B8]"
              >
                <UserPlus size={18} />
                Create account
              </Link>
              <Link
                href="/dashboard?demo=1"
                className="inline-flex items-center justify-center gap-3 rounded-full border border-[#D0D7E2] bg-white px-7 py-4 text-base font-semibold text-[#1F2A4A] shadow-sm transition hover:border-[#3563E0] hover:text-[#3563E0]"
              >
                <MonitorPlay size={18} />
                View demo
              </Link>
            </div>

            <p className="mt-5 text-sm font-medium text-[#64748B]">
              $39/month after trial for one user. Agency plans are available by
              enquiry.
            </p>
          </section>

          <section className="rounded-[2.5rem] bg-white p-6 shadow-soft ring-1 ring-white/80 sm:p-8">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#3563E0]">
              Trial path
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#1F2A4A]">
              Get value on day one.
            </h2>
            <div className="mt-7 grid gap-3">
              {trialSteps.map((step, index) => (
                <div
                  key={step}
                  className="flex items-center gap-4 rounded-[1.4rem] bg-[#F2F4F8] p-4"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-sm font-bold text-[#3563E0] shadow-sm">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-[#1F2A4A]">{step}</p>
                    <p className="mt-1 text-sm text-[#64748B]">
                      {index === 0
                        ? "Set up a secure ListingWin workspace."
                        : index === 1
                          ? "Reuse your branding on every presentation."
                          : "Show the campaign before the campaign starts."}
                    </p>
                  </div>
                  <CheckCircle2
                    className="ml-auto hidden text-[#3563E0] sm:block"
                    size={20}
                  />
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-[1.5rem] bg-[#1F2A4A] p-5 text-white">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-white/55">
                What to test
              </p>
              <p className="mt-3 text-xl font-bold leading-snug">
                Use ListingWin on one real appraisal and see whether the seller
                engages faster.
              </p>
            </div>

            <Link
              href="/sign-up"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#3563E0] px-6 py-4 text-sm font-semibold text-white shadow-card transition hover:bg-[#2848B8]"
            >
              Start free trial
              <ArrowRight size={17} />
            </Link>
          </section>
        </div>
      </section>
    </main>
  );
}
