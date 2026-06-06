"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef, Suspense } from "react";
import Link from "next/link";
import { verifyEmail } from "@/lib/api";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const verifyingRef = useRef(false);

  useEffect(() => {
    if (!token) {
      setError("No verification token provided.");
      setLoading(false);
      return;
    }

    if (verifyingRef.current) return;
    verifyingRef.current = true;

    async function doVerify() {
      try {
        await verifyEmail(token as string);
        setSuccess(true);
      } catch (err: any) {
        setError(err.message || "Verification failed. The link might be invalid or expired.");
      } finally {
        setLoading(false);
      }
    }

    doVerify();
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          {loading && (
            <div className="text-blue-500 animate-spin">
              <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          )}
          {success && (
            <div className="text-green-500">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          )}
          {error && (
            <div className="text-red-500">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          )}
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          {loading && "Verifying your email..."}
          {success && "Email verified!"}
          {error && "Verification failed"}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-900/70 py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-slate-800 text-center">
          {loading && (
            <p className="text-sm text-slate-400">Please wait while we verify your email address.</p>
          )}
          
          {success && (
            <div className="space-y-6">
              <p className="text-sm text-slate-300">
                Email verified successfully. You can now log in to ThreatLens.
              </p>
              <Link
                href="/login"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-slate-900"
              >
                Continue to Login
              </Link>
            </div>
          )}
          
          {error && (
            <div className="space-y-6">
              <p className="text-sm text-red-400 bg-red-900/30 p-4 rounded-lg border border-red-800/50">
                Verification link is invalid or expired. Please request a new verification email.
              </p>
              <div className="space-y-3">
                <Link
                  href="/check-email"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-slate-800 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:ring-offset-slate-900"
                >
                  Resend verification email
                </Link>
                <Link
                  href="/login"
                  className="w-full flex justify-center py-2 px-4 border border-slate-700 rounded-lg shadow-sm text-sm font-medium text-slate-300 bg-transparent hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:ring-offset-slate-900"
                >
                  Back to login
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12">
        <div className="text-center text-slate-400">Loading...</div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
