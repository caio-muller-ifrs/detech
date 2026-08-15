import { ResidentTable } from "../components/resident-table";
import { CreateResidentButton } from "../components/create-resident-button";
import { Sidebar } from "../components/sidebar";
import { getResidents } from "../lib/db";

export default function HomePage() {
  const residents = getResidents();
  const attention = residents.filter((resident) => resident.status === "Atenção").length;
  return <div className="flex min-h-screen bg-paper"><Sidebar /><main className="min-w-0 flex-1 px-5 py-6 sm:px-9 lg:px-12 lg:py-10">
    <header className="mb-10 flex items-start justify-between"><div><p className="mb-2 text-sm font-medium text-moss">Gestão de residentes</p><h1 className="text-3xl font-semibold tracking-tight text-ink">Idosos</h1><p className="mt-2 text-sm text-slate-500">Acompanhe as informações e a rotina de quem está sob seus cuidados.</p></div><CreateResidentButton /></header>
    <section className="mb-7 grid gap-4 sm:grid-cols-3"><div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-soft"><p className="text-sm text-slate-500">Residentes ativos</p><p className="mt-2 text-3xl font-semibold text-ink">{residents.length}</p><p className="mt-2 text-xs font-medium text-emerald-600">● Cadastros acompanhados</p></div><div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-soft"><p className="text-sm text-slate-500">Demandam atenção</p><p className="mt-2 text-3xl font-semibold text-ink">{attention}</p><p className="mt-2 text-xs font-medium text-amber-600">● Revisar anotações clínicas</p></div><div className="rounded-2xl bg-moss p-5 text-white shadow-soft"><p className="text-sm text-emerald-100">Rotina de hoje</p><p className="mt-2 text-3xl font-semibold">8</p><p className="mt-2 text-xs text-emerald-100">medicamentos programados</p></div></section>
    <ResidentTable residents={residents} />
  </main></div>;
}
