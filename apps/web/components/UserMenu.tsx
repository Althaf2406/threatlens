"use client";

import { useAuth } from "@/hooks/useAuth";

export function UserMenu() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return <div className="text-sm text-slate-500 animate-pulse mt-8 border-t border-slate-800 pt-6">Loading session...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="mt-8 border-t border-slate-800 pt-6">
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
    </div>
  );
}
