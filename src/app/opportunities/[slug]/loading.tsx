export default function Loading() {
  return (
    <div className="container-page py-16">
      <div className="animate-pulse space-y-6">
        <div className="h-3 w-24 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-8 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-72 rounded-2xl bg-slate-200 dark:bg-slate-800" />
      </div>
    </div>
  );
}
