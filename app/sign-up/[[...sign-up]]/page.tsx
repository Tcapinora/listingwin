import Image from "next/image";
import Link from "next/link";
import { SignUp } from "@clerk/nextjs";

const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-[#F2F4F8] px-4 py-10 text-[#1F2A4A]">
      <section className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <Link href="/" className="inline-flex">
            <Image
              src="/brand/listingwin-lockup-exact.png"
              alt="ListingWin"
              width={1333}
              height={255}
              priority
              className="h-auto w-full max-w-[360px]"
            />
          </Link>
          <p className="mt-8 max-w-xl text-4xl font-light leading-tight tracking-[-0.02em] sm:text-5xl">
            Start your 14-day ListingWin trial.
          </p>
          <p className="mt-5 max-w-lg text-base leading-7 text-slate-600">
            Build your first appraisal, add your agency branding, and
            see how ListingWin helps you show the campaign before the campaign.
          </p>
          <div className="mt-7 grid max-w-lg gap-3 rounded-[1.75rem] bg-white/80 p-5 text-sm text-slate-600 shadow-card ring-1 ring-white">
            <p className="font-semibold text-[#1F2A4A]">
              Trial includes the full appraisal flow.
            </p>
            <p>
              $39/month for one agent after the trial. Contact us for full
              agency subscriptions.
            </p>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          {clerkEnabled ? (
            <div className="w-full max-w-md">
              <SignUp
                routing="path"
                path="/sign-up"
                signInUrl="/sign-in"
                appearance={{
                  variables: {
                    colorPrimary: "#3563E0",
                    colorText: "#1F2A4A",
                    colorBackground: "#FFFFFF",
                    borderRadius: "1rem",
                  },
                  elements: {
                    cardBox:
                      "rounded-[2rem] shadow-soft ring-1 ring-blue-100 border-0",
                    headerTitle:
                      "text-[#1F2A4A] text-2xl font-semibold tracking-tight",
                    headerSubtitle: "text-slate-500",
                    formButtonPrimary:
                      "bg-[#3563E0] hover:bg-[#2848B8] text-sm font-semibold normal-case",
                    socialButtonsBlockButton:
                      "rounded-2xl border-blue-100 text-[#1F2A4A]",
                    formFieldInput:
                      "rounded-2xl border-blue-100 bg-[#F8FAFC] focus:border-[#3563E0] focus:ring-[#DCE8FF]",
                    footerActionLink: "text-[#3563E0] hover:text-[#2848B8]",
                  },
                }}
              />
            </div>
          ) : (
            <div className="w-full max-w-md rounded-[2rem] bg-white p-7 shadow-soft ring-1 ring-blue-100">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-700">
                Clerk setup required
              </p>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
                Add your Clerk keys to enable accounts.
              </h1>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Once your Clerk application is created, add the keys to
                `.env.local` locally and to Vercel for production.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
