import { AppShell } from "@/components/AppShell";

export default function SettingsPage() {
  return (
    <AppShell title="Global Settings" subtitle="Manage users, detection rules, and system configuration.">
      <div className="max-w-3xl space-y-8">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <h2 className="text-lg font-semibold text-white">Profile Information</h2>
          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Name</label>
              <input 
                type="text" 
                defaultValue="Investigator Admin"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-white focus:border-blue-500 focus:outline-none" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
              <input 
                type="email" 
                defaultValue="admin@threatlens.local"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-slate-400 focus:outline-none" 
                readOnly
              />
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-slate-800">
            <button className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500">
              Save Profile
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <h2 className="text-lg font-semibold text-white">Detection Rules</h2>
          <p className="mt-2 text-sm text-slate-400">
            Configure global defaults for rule engines.
          </p>
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-800 bg-slate-950">
              <div>
                <p className="font-medium text-slate-300">YARA Rules Auto-Sync</p>
                <p className="text-sm text-slate-500 mt-1">Automatically download latest defensive rule sets.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
