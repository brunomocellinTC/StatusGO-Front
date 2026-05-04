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

export default function StatusCard({
  name,
  url,
  status,
  time,
  message,
  loading,
  onReload
}: Props) {
  return (
    <div className="border border-slate-700/70 bg-slate-900/95 rounded-3xl p-4 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <h3 className="text-lg font-semibold leading-tight">
          {name} {loading && "⏳"}
        </h3>
        <button
          onClick={onReload}
          className="rounded-full bg-sky-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-400"
        >
          🔄 Re-test
        </button>

        <div className="flex flex-row items-start sm:items-end gap-2 text-right">
          <span className="text-xs text-slate-400 leading-snug">{message}</span>
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-slate-950 ${getStatusColor(status)}`}>
            {status}
          </span>
        </div>
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