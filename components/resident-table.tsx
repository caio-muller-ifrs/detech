"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Resident } from "../lib/types";

function age(birthDate: string) {
  const today = new Date();
  const birth = new Date(`${birthDate}T12:00:00`);
  let years = today.getFullYear() - birth.getFullYear();
  if (today < new Date(today.getFullYear(), birth.getMonth(), birth.getDate())) years--;
  return years;
}

export function ResidentTable({ residents }: { residents: Resident[] }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => residents.filter((resident) =>
    `${resident.full_name} ${resident.room}`.toLocaleLowerCase().includes(query.toLocaleLowerCase())
  ), [residents, query]);

  return <>
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-sm">
        <span className="pointer-events-none absolute left-4 top-3 text-slate-400">⌕</span>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por nome ou quarto" className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-moss focus:ring-4 focus:ring-emerald-50" />
      </div>
      <button className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600">⇅ Ordenar</button>
    </div>
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead className="border-b border-slate-100 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-400"><tr><th className="px-6 py-4">Residente</th><th className="px-5 py-4">Idade</th><th className="px-5 py-4">Quarto</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Atualização</th><th className="px-6 py-4"></th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((resident) => <tr key={resident.id} className="transition hover:bg-emerald-50/30">
              <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-full bg-[#e5efea] text-sm font-semibold text-moss">{resident.full_name.split(" ").slice(0, 2).map((part) => part[0]).join("")}</div><div><p className="font-semibold text-ink">{resident.preferred_name ?? resident.full_name}</p><p className="mt-0.5 text-xs text-slate-400">{resident.full_name}</p></div></div></td>
              <td className="px-5 py-4 text-slate-600">{age(resident.birth_date)} anos</td><td className="px-5 py-4 text-slate-600">{resident.room}</td>
              <td className="px-5 py-4"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${resident.status === "Ativo" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}><i className={`mr-1.5 mt-1 h-1.5 w-1.5 rounded-full ${resident.status === "Ativo" ? "bg-emerald-500" : "bg-amber-500"}`} />{resident.status}</span></td>
              <td className="px-5 py-4 text-xs text-slate-400">{resident.updated_at}</td>
              <td className="px-6 py-4 text-right"><Link href={`/idosos/${resident.id}`} className="font-semibold text-moss hover:underline">Ver perfil →</Link></td>
            </tr>)}
          </tbody>
        </table>
      </div>
      {filtered.length === 0 && <p className="p-10 text-center text-sm text-slate-400">Nenhum residente encontrado.</p>}
    </div>
  </>;
}
