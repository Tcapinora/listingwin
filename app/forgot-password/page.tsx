"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSignIn } from "@clerk/nextjs";
import { ArrowLeft, ArrowRight, Mail, ShieldCheck } from "lucide-react";
import { type FormEvent, useState } from "react";

const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

function getErrorMessage(error: unknown) {
  if (typeof error === "object" && error && "errors" in error) {
    const clerkError = error as {
      errors?: Array<{ longMessage?: string; message?: string }>;
      longMessage?: string;
      message?: string;
    };
    return (
      clerkError.errors?.[0]?.longMessage ||
      clerkError.errors?.[0]?.message ||
      clerkError.longMessage ||
      clerkError.message ||
      "Something went wrong. Please try again."
    );
  }

  return error instanceof Error
    ? error.message
    : "Something went wrong. Please try again.";
}

function ResetPasswordPanel() {
  const router = useRouter();
  const { signIn } = useSignIn();
  const [step, setStep] = useState<"email" | "code" | "done">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sendCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!signIn) return;

    setError("");
    setStatus("");
    setIsSubmitting(true);

    try {
      const createResult = await signIn.create({ identifier: email });
      if (createResult.error) throw createResult.error;

      const sendResult = await signIn.resetPasswordEmailCode.sendCode();
      if (sendResult.error) throw sendResult.error;

      setStep("code");
      setStatus("Reset code sent. Check your email.");
    } catch (resetError) {
      setError(getErrorMessage(resetError));
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!signIn) return;

    setError("");
    setStatus("");
    setIsSubmitting(true);

    try {
      const verifyResult = await signIn.resetPasswordEmailCode.verifyCode({
        code,
      });
      if (verifyResult.error) throw verifyResult.error;

      const submitResult = await signIn.resetPasswordEmailCode.submitPassword({
        password,
      });
      if (submitResult.error) throw submitResult.error;

      const finalizeResult = await signIn.finalize();
      if (finalizeResult.error) throw finalizeResult.error;

      if (signIn.createdSessionId) {
        router.push("/dashboard");
        return;
      }

      setStep("done");
      setStatus("Password reset. You can now sign in.");
    } catch (resetError) {
      setError(getErrorMessage(resetError));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === "email") {
    return (
      <form onSubmit={sendCode} className="mt-8 space-y-5">
        <div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#3563E0]">
            <Mail className="h-5 w-5" />
          </div>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950">
            Forgot password?
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            We&apos;ll send a reset code to your email address.
          </p>
        </div>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700">
            Email address
          </span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            autoComplete="email"
            className="mt-2 w-full rounded-2xl border border-blue-100 bg-[#F8FAFC] px-4 py-3 text-base text-slate-950 outline-none transition focus:border-[#3563E0] focus:bg-white focus:ring-4 focus:ring-blue-100"
            placeholder="agent@email.com"
          />
        </label>

        {error ? (
          <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#3563E0] px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#2848B8] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Sending code..." : "Send reset code"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>
    );
  }

  if (step === "code") {
    return (
      <form onSubmit={resetPassword} className="mt-8 space-y-5">
        <div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#3563E0]">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950">
            Enter reset code
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Add the code sent to {email}, then choose a new password.
          </p>
        </div>

        {status ? (
          <p className="rounded-2xl bg-blue-50 px-4 py-3 text-sm font-medium text-[#2848B8]">
            {status}
          </p>
        ) : null}

        <label className="block">
          <span className="text-sm font-semibold text-slate-700">
            Reset code
          </span>
          <input
            type="text"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            required
            inputMode="numeric"
            autoComplete="one-time-code"
            className="mt-2 w-full rounded-2xl border border-blue-100 bg-[#F8FAFC] px-4 py-3 text-base text-slate-950 outline-none transition focus:border-[#3563E0] focus:bg-white focus:ring-4 focus:ring-blue-100"
            placeholder="Enter code"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700">
            New password
          </span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            autoComplete="new-password"
            className="mt-2 w-full rounded-2xl border border-blue-100 bg-[#F8FAFC] px-4 py-3 text-base text-slate-950 outline-none transition focus:border-[#3563E0] focus:bg-white focus:ring-4 focus:ring-blue-100"
            placeholder="Create a new password"
          />
        </label>

        {error ? (
          <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#3563E0] px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#2848B8] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Resetting password..." : "Reset password"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>
    );
  }

  return (
    <div className="mt-8">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#3563E0]">
        <ShieldCheck className="h-5 w-5" />
      </div>
      <h1 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950">
        Password reset.
      </h1>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        You can now sign in with your new password.
      </p>
      <Link
        href="/sign-in"
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#3563E0] px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#2848B8]"
      >
        Return to sign in
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

export default function ForgotPasswordPage() {
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
            Reset access without slowing the appraisal workflow.
          </p>
          <p className="mt-5 max-w-lg text-base leading-7 text-slate-600">
            Enter your email, confirm the reset code, and get straight back to
            building appraisals.
          </p>
        </div>

        <div className="flex justify-center lg:justify-end">
          <div className="w-full max-w-md rounded-[2rem] bg-white p-7 shadow-soft ring-1 ring-blue-100">
            <Link
              href="/sign-in"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-[#3563E0]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to sign in
            </Link>

            {!clerkEnabled ? (
              <div className="mt-8">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-700">
                  Clerk setup required
                </p>
                <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
                  Add your Clerk keys to enable password reset.
                </h1>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Once Clerk keys are available, this page will send password
                  reset codes through your Clerk account.
                </p>
              </div>
            ) : (
              <ResetPasswordPanel />
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
