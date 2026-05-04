import { useEffect, useState } from "react";
import StatusCard from "./StatusCard";
import { fetchStatus } from "../services/api";

type System = {
  name: string;
  url: string;
  status: number;
  time: number;
  message: string;
};

function envFromName(name: string) {
  const upper = name.toUpperCase();
  if (upper.includes("STG")) return "Staging";
  if (upper.includes("PRD")) return "Produção";
  return "Outros";
}

function typeFromName(name: string) {
  const upper = name.toUpperCase();
  if (upper.includes("API")) return "API";
  return "Front";
}

export default function StatusContainer() {
  const [data, setData] = useState<System[]>([]);
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

  async function load() {
    const result = await fetchStatus();
    setData(result);
  }

  async function reloadOne(name: string) {
    setLoadingMap((prev) => ({ ...prev, [name]: true }));

    const result = await fetchStatus();
    const updated = result.find((r: System) => r.name === name);

    setData((prev) =>
      prev.map((item) =>
        item.name === name ? updated : item
      )
    );

    setLoadingMap((prev) => ({ ...prev, [name]: false }));
  }

  useEffect(() => {
    load();
  }, []);

  const apiStg = data.filter((item) => envFromName(item.name) === "Staging" && typeFromName(item.name) === "API");
  const apiPrd = data.filter((item) => envFromName(item.name) === "Produção" && typeFromName(item.name) === "API");
  const frontStg = data.filter((item) => envFromName(item.name) === "Staging" && typeFromName(item.name) === "Front");
  const frontPrd = data.filter((item) => envFromName(item.name) === "Produção" && typeFromName(item.name) === "Front");
  const other = data.filter((item) => envFromName(item.name) === "Outros");

  return (
    <div className="space-y-6">
      <section className="space-y-4">
        <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
          Produção
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              API
            </div>
            {apiPrd.length > 0 ? (
              apiPrd.map((item) => (
                <StatusCard
                  key={item.name}
                  {...item}
                  loading={loadingMap[item.name]}
                  onReload={() => reloadOne(item.name)}
                />
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-slate-700 p-4 text-sm text-slate-400">
                Nenhum sistema API Produção encontrado.
              </div>
            )}
          </div>
          <div className="space-y-4">
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Front
            </div>
            {frontPrd.length > 0 ? (
              frontPrd.map((item) => (
                <StatusCard
                  key={item.name}
                  {...item}
                  loading={loadingMap[item.name]}
                  onReload={() => reloadOne(item.name)}
                />
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-slate-700 p-4 text-sm text-slate-400">
                Nenhum sistema Front Produção encontrado.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
          Staging
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              API
            </div>
            {apiStg.length > 0 ? (
              apiStg.map((item) => (
                <StatusCard
                  key={item.name}
                  {...item}
                  loading={loadingMap[item.name]}
                  onReload={() => reloadOne(item.name)}
                />
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-slate-700 p-4 text-sm text-slate-400">
                Nenhum sistema API Staging encontrado.
              </div>
            )}
          </div>
          <div className="space-y-4">
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Front
            </div>
            {frontStg.length > 0 ? (
              frontStg.map((item) => (
                <StatusCard
                  key={item.name}
                  {...item}
                  loading={loadingMap[item.name]}
                  onReload={() => reloadOne(item.name)}
                />
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-slate-700 p-4 text-sm text-slate-400">
                Nenhum sistema Front Staging encontrado.
              </div>
            )}
          </div>
        </div>
      </section>

      {other.length > 0 && (
        <section className="space-y-4">
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
            Outros
          </div>
          {other.map((item) => (
            <StatusCard
              key={item.name}
              {...item}
              loading={loadingMap[item.name]}
              onReload={() => reloadOne(item.name)}
            />
          ))}
        </section>
      )}
    </div>
  );
}