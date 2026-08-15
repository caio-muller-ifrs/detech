"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Resident } from "../lib/types";
import { ResidentForm } from "./resident-form";

export function ResidentActions({ resident }: { resident: Resident }) {
  const router = useRouter(); const [editing, setEditing] = useState(false); const [removing, setRemoving] = useState(false);
  async function remove() { if (!confirm(`Excluir o cadastro de ${resident.full_name}? Esta ação não pode ser desfeita.`)) return; setRemoving(true); const response = await fetch(`/api/idosos/${resident.id}`, { method: "DELETE" }); if (response.ok) router.push("/"); else { setRemoving(false); alert("Não foi possível excluir o residente."); } }
  return <><div className="flex gap-2"><button onClick={() => setEditing(true)} className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-ink">Editar informações</button><button onClick={remove} disabled={removing} className="rounded-xl border border-red-300 px-3 py-2.5 text-sm font-semibold text-red-200 hover:bg-red-500 hover:text-white">{removing ? "..." : "Excluir"}</button></div>{editing && <div className="fixed inset-0 z-50 grid place-items-center bg-ink/40 p-4"><div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"><div className="mb-5"><h2 className="text-xl font-semibold text-ink">Editar residente</h2><p className="mt-1 text-sm text-slate-500">Atualize os dados e as necessidades de cuidado.</p></div><ResidentForm resident={resident} onCancel={() => setEditing(false)} onSaved={() => setEditing(false)} /></div></div>}</>;
}
