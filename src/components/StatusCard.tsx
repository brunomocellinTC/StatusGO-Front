type Props = {
  name: string;
  url: string;
  status: number;
  time: number;
  message: string;
  loading: boolean;
  onReload: () => void;
};

function getStatusColor(status: number) {
  if (status >= 200 && status < 300) return "bg-emerald-500";
  if (status >= 300 && status < 400) return "bg-amber-500";
  if (status >= 400 && status < 500) return "bg-red-500";
  return "bg-violet-500";
}

function getStatusBgColor(status: number) {
  if (status >= 200 && status < 300) return "bg-emerald-950/40 border-emerald-500/20";
  if (status >= 300 && status < 400) return "bg-amber-950/40 border-amber-500/20";
  if (status >= 400 && status < 500) return "bg-red-950/40 border-red-500/20";
  return "bg-violet-950/40 border-violet-500/20";
}

function typeFromName(name: string) {
  const upper = name.toUpperCase();
  if (upper.includes("(FRONT)")) return "Front";
  return "API";
}

export default function StatusCard({
  name,
  url,
  status,
  message,
  loading,
  onReload
}: Props) {
  const bgClasses = getStatusBgColor(status);
  const typeLabel = typeFromName(name);
  const displayName = name
    .replace(/\s*\(Front\)\s*-\s*(STG|PRD)/, "")
    .replace(/\s*-\s*(STG|PRD)$/, "")
    .trim();

  return (
    <div className={`relative border border-slate-700/70 rounded-3xl p-4 pt-6 shadow-sm transition-colors ${bgClasses}`}>
      <span className="absolute left-3 -top-3 inline-flex h-8 items-center rounded-2xl bg-slate-950/95 px-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-300 border border-slate-700/70">
        {typeLabel}
      </span>
      <div className="sm:absolute sm:right-3 sm:top-3 flex flex-row sm:flex-row items-start sm:items-center gap-2 text-left sm:text-right">
        <span className="text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.15em] text-slate-400">
          {message}
        </span>
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-slate-950 ${getStatusColor(status)}`}>
          {status}
        </span>
        <button
          type="button"
          onClick={onReload}
          className="rounded-full bg-slate-800/90 p-2 text-sm text-slate-100 transition hover:bg-slate-700"
          aria-label="Re-testar sistema"
        >
          ⟳
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold leading-tight">
          {displayName} {loading && "⏳"}
        </h3>
      </div>

      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="mt-3 block text-sm text-sky-400 hover:text-sky-300 break-words"
      >
        {url}
      </a>
    </div>
  );
}