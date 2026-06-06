"use client";

import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import Link from "next/link";
import { resendVerification } from "@/lib/api";

function CheckEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResend = async () => {
    if (!email) return;
    
    setLoading(true);
    setMessage("");
    setError("");
    
    try {
      const response = await resendVerification(email);
      setMessage(response.msg || "Verification email sent.");
    } catch (err: any) {
      setError(err.message || "Failed to resend verification email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center text-blue-500">
          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">Check your email</h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          We created your ThreatLens account. Please verify your email before accessing your dashboard, creating projects, or using AI token features.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-900/70 py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-slate-800">
          <div className="text-center">
            {email && (
              <p className="text-sm font-medium text-white mb-6 bg-slate-800 py-2 px-4 rounded-lg inline-block">
                {email}
              </p>
            )}
            
            <div className="space-y-4">
              <button
                onClick={handleResend}
                disabled={loading || !email}
                className="w-full flex justify-center py-2 px-4 border border-slate-700 rounded-lg shadow-sm text-sm font-medium text-white bg-slate-800 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : "Resend verification email"}
              </button>
              
              <Link
                href="/login"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-slate-900"
              >
                Back to login
              </Link>
            </div>
            
            {message && (
              <div className="mt-4 p-3 rounded bg-green-900/50 border border-green-800">
                <p className="text-sm text-green-400">{message}</p>
              </div>
            )}
            
            {error && (
              <div className="mt-4 p-3 rounded bg-red-900/50 border border-red-800">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}
            
            <div className="mt-8 text-xs text-slate-500">
              For local development, check the FastAPI terminal for the verification link.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12">
        <div className="text-center text-slate-400">Loading...</div>
      </div>
    }>
      <CheckEmailContent />
    </Suspense>
  );
}
