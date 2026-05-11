import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MonitorPlay, UserPlus } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F2F4F8] text-[#1F2A4A]">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center px-6 py-12 text-center">
        <div className="mb-10 flex items-center justify-center">
          <Image
            src="/brand/listingwin-mark-exact.png"
            alt="ListingWin trophy icon"
            width={647}
            height={569}
            priority
            className="h-auto w-24 sm:w-28"
          />
        </div>

        <Image
          src="/brand/listingwin-lockup-exact.png"
          alt="ListingWin"
          width={1333}
          height={255}
          priority
          className="h-auto w-full max-w-[520px] sm:max-w-[620px]"
        />

        <h1 className="sr-only">ListingWin</h1>
        <p className="mx-auto mt-8 max-w-3xl text-3xl font-light leading-tight tracking-[-0.02em] text-[#1F2A4A] sm:text-5xl">
          Show the seller the campaign before the campaign begins.
        </p>

        <div className="mt-12 grid w-full max-w-3xl gap-3 sm:grid-cols-3">
          <Link
            href="/account"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1F2A4A] px-6 py-4 text-sm font-semibold text-white shadow-card transition hover:bg-[#18223d]"
          >
            <UserPlus size={17} />
            Create account
          </Link>
          <Link
            href="/create"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#3563E0] px-6 py-4 text-sm font-semibold text-white shadow-card transition hover:bg-[#2848B8]"
          >
            Vendor presentation
            <ArrowRight size={17} />
          </Link>
          <Link
            href="/draft"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[#D0D7E2] bg-white/70 px-6 py-4 text-sm font-semibold text-[#1F2A4A] shadow-sm transition hover:border-[#3563E0] hover:bg-white"
          >
            <MonitorPlay size={17} />
            Agent workspace
          </Link>
        </div>
      </section>
    </main>
  );
}
