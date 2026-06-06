"use client";

import { useAuth } from "@/hooks/useAuth";
import { useOnboarding } from "@/components/onboarding/OnboardingProvider";

export function UserMenu() {
  const { user, loading, logout } = useAuth();
  const { restartTour } = useOnboarding();

  if (loading) {
    return <div className="text-sm text-slate-500 animate-pulse mt-8 border-t border-slate-800 pt-6">Loading session...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div data-tour="user-menu" className="mt-8 border-t border-slate-800 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center min-w-0">
          <div className="flex-shrink-0">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-800">
              <span className="text-sm font-medium leading-none text-white">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </span>
          </div>
          <div className="ml-3 min-w-0">
            <p className="truncate text-sm font-medium text-white">{user.name}</p>
            <p className="truncate text-xs text-slate-400">{user.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="ml-2 flex-shrink-0 rounded-full bg-slate-900 p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition"
          title="Logout"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
        </button>
      </div>

      <button
        onClick={restartTour}
        className="mt-3 w-full flex items-center justify-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white transition"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
        Restart Guided Tour
      </button>
    </div>
  );
}
