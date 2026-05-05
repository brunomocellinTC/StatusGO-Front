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
  if (upper.includes("(FRONT)")) return "Front";
  return "API";
}

type GroupedSystem = {
  baseName: string;
  env: string;
  api?: System;
  front?: System;
};

export default function StatusContainer() {
  const [data, setData] = useState<System[]>([]);
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  async function load() {
    setIsInitialLoading(true);
    const result = await fetchStatus();
    setData(result);
    setIsInitialLoading(false);
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

  if (isInitialLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-slate-700 border-t-sky-400 animate-spin"></div>
        </div>
        <p className="text-slate-400 font-medium">Testando sistemas...</p>
      </div>
    );
  }

  // Filtrar sistemas baseado no termo de busca
  const filteredData = searchTerm
    ? data.filter((system) =>
        system.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : data;

  // Agrupar sistemas por nome base e ambiente
  const grouped: Record<string, GroupedSystem[]> = { STG: [], PRD: [], Outros: [] };

  const groupMap = new Map<string, GroupedSystem>();

  filteredData.forEach((system) => {
    const env = envFromName(system.name);
    const type = typeFromName(system.name);
    const baseName = system.name
      .replace(/\s*\(Front\)\s*-\s*(STG|PRD)/, "")
      .replace(/\s*\(API\)\s*-\s*(STG|PRD)/, "")
      .replace(/\s*-\s*(STG|PRD)$/, "")
      .trim();

    const key = `${baseName}-${env}`;
    let group = groupMap.get(key);

    if (!group) {
      group = { baseName, env };
      groupMap.set(key, group);
    }

    if (type === "Front") {
      group.front = system;
    } else {
      group.api = system;
    }
  });

  // Separar por ambiente
  groupMap.forEach((group) => {
    if (group.env === "Staging") {
      grouped.STG.push(group);
    } else if (group.env === "Produção") {
      grouped.PRD.push(group);
    } else {
      grouped.Outros.push(group);
    }
  });

  const renderPlaceholder = (label: string) => (
    <div className="relative border border-slate-700/70 rounded-3xl p-4 pt-6 bg-slate-950/40 text-slate-500">
      <span className="absolute left-3 -top-4 inline-flex h-8 items-center rounded-2xl bg-slate-950/95 px-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-300 border border-slate-700/70">
        {label}
      </span>
      <div className="flex items-center justify-center text-center text-sm leading-relaxed py-6">
        {label} não configurado
      </div>
    </div>
  );

  const renderSection = (title: string, groups: GroupedSystem[]) => {
    if (groups.length === 0) return null;

    return (
      <section className="space-y-4">
        <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
          {title}
        </div>
        <div className="space-y-4">
          {groups.map((group) => {
            const apiSystem = group.api;
            const frontSystem = group.front;

            return (
              <div key={`${group.baseName}-${group.env}`}>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {apiSystem ? (
                    <StatusCard
                      {...apiSystem}
                      loading={loadingMap[apiSystem.name]}
                      onReload={() => reloadOne(apiSystem.name)}
                    />
                  ) : (
                    renderPlaceholder("API")
                  )}
                  {frontSystem ? (
                    <StatusCard
                      {...frontSystem}
                      loading={loadingMap[frontSystem.name]}
                      onReload={() => reloadOne(frontSystem.name)}
                    />
                  ) : (
                    renderPlaceholder("Front")
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-3xl font-bold">StatusGO 🚦</div>
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar sistema..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 rounded-xl border border-slate-700/70 bg-slate-900/95 px-4 py-2 text-sm text-slate-100 placeholder-slate-400 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              aria-label="Limpar busca"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {renderSection("Produção", grouped.PRD)}
      {renderSection("Staging", grouped.STG)}
      {renderSection("Outros", grouped.Outros)}
    </div>
  );
}