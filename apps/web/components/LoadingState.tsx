export default function LoadingState({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-slate-900/70 border border-slate-800 rounded-2xl">
      <div className="w-8 h-8 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin mb-4"></div>
      <p className="text-slate-400">{message}</p>
    </div>
  );
}
