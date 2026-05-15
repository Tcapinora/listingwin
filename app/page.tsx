import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  ImageUp,
  MonitorPlay,
  Sparkles,
} from "lucide-react";

const proofPoints = [
  "Paste appraisal notes",
  "Upload property photos",
  "Present the campaign live",
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#FBFBFD] text-[#1F2A4A]">
      <section className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-6 sm:px-8 lg:px-10">
        <div className="absolute inset-x-0 top-0 -z-10 h-[42rem] bg-[radial-gradient(circle_at_70%_20%,rgba(53,99,224,0.13),transparent_34%),linear-gradient(180deg,#F2F4F8_0%,#FBFBFD_78%)]" />

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
            className="rounded-full border border-[#D0D7E2] bg-white/75 px-5 py-3 text-sm font-semibold text-[#1F2A4A] shadow-sm transition hover:border-[#3563E0] hover:text-[#3563E0]"
          >
            Sign in
          </Link>
        </header>

        <div className="grid flex-1 items-center gap-14 py-16 lg:grid-cols-[0.95fr_1.05fr] lg:py-10">
          <section className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D0D7E2] bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#3563E0] shadow-sm">
              <Sparkles size={15} />
              Built for listing appraisals
            </div>

            <h1 className="mt-8 max-w-4xl text-5xl font-extrabold leading-[0.95] tracking-tight text-[#1F2A4A] sm:text-6xl lg:text-7xl">
              Show the campaign before the campaign.
            </h1>

            <p className="mt-7 max-w-2xl text-xl font-light leading-8 text-[#40516B] sm:text-2xl sm:leading-9">
              ListingWin helps agents turn property details, photos, and
              comparable sales into a premium vendor presentation in minutes.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
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

            <div className="mt-9 grid gap-3 sm:grid-cols-3">
              {proofPoints.map((point) => (
                <div
                  key={point}
                  className="flex items-center gap-2 rounded-2xl bg-white/80 px-4 py-3 text-sm font-semibold text-[#40516B] shadow-sm ring-1 ring-[#DEE0E5]"
                >
                  <CheckCircle2 className="text-[#3563E0]" size={17} />
                  {point}
                </div>
              ))}
            </div>
          </section>

          <section className="relative">
            <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-[#3563E0]/10 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2.5rem] bg-[#1F2A4A] p-3 shadow-2xl">
              <div className="relative min-h-[620px] overflow-hidden rounded-[2rem] bg-[#F2F4F8]">
                <Image
                  src="/landing/central-avenue-front.jpg"
                  alt="Premium property campaign preview"
                  fill
                  priority
                  sizes="(min-width: 1024px) 48vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1F2A4A]/90 via-[#1F2A4A]/18 to-white/10" />

                <div className="absolute left-5 right-5 top-5 rounded-[1.5rem] bg-white/92 p-5 shadow-card backdrop-blur">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#1F2A4A]">
                        <Image
                          src="/brand/listingwin-mark-light-exact.png"
                          alt=""
                          width={64}
                          height={64}
                          className="h-7 w-7 object-contain"
                        />
                      </span>
                      <div>
                        <p className="text-sm font-bold text-[#1F2A4A]">
                          Vendor presentation
                        </p>
                        <p className="text-xs font-medium text-[#64748B]">
                          Live campaign preview
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full bg-[#3563E0] px-3 py-1.5 text-xs font-bold text-white">
                      Ready
                    </span>
                  </div>
                </div>

                <div className="absolute bottom-5 left-5 right-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[1.4rem] bg-white/95 p-5 shadow-card backdrop-blur">
                    <div className="flex items-center gap-2 text-[#3563E0]">
                      <ImageUp size={18} />
                      <p className="text-xs font-bold uppercase tracking-[0.18em]">
                        Campaign visual
                      </p>
                    </div>
                    <p className="mt-4 text-2xl font-bold leading-tight text-[#1F2A4A]">
                      Put the seller’s home inside your marketing.
                    </p>
                  </div>
                  <div className="rounded-[1.4rem] bg-white/95 p-5 shadow-card backdrop-blur">
                    <div className="flex items-center gap-2 text-[#3563E0]">
                      <CalendarCheck size={18} />
                      <p className="text-xs font-bold uppercase tracking-[0.18em]">
                        Appraisal flow
                      </p>
                    </div>
                    <p className="mt-4 text-2xl font-bold leading-tight text-[#1F2A4A]">
                      Present clearly, then move into the closing workspace.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
