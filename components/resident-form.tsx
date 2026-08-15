"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { Resident } from "../lib/types";

type FormValue = { full_name: string; preferred_name: string; birth_date: string; room: string; status: "Ativo" | "Atenção"; general_info: string; specific_needs: string; emergency_contact: string };

const empty: FormValue = { full_name: "", preferred_name: "", birth_date: "", room: "", status: "Ativo", general_info: "", specific_needs: "", emergency_contact: "" };

export function ResidentForm({ resident, onCancel, onSaved }: { resident?: Resident; onCancel: () => void; onSaved?: () => void }) {
  const router = useRouter();
  const [value, setValue] = useState<FormValue>(resident ? { full_name: resident.full_name, preferred_name: resident.preferred_name ?? "", birth_date: resident.birth_date, room: resident.room, status: resident.status, general_info: resident.general_info, specific_needs: resident.specific_needs, emergency_contact: resident.emergency_contact } : empty);
  const [error, setError] = useState(""); const [saving, setSaving] = useState(false);
  const set = (field: keyof FormValue, next: string) => setValue((current) => ({ ...current, [field]: next }));
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setError("");
    const response = await fetch(resident ? `/api/idosos/${resident.id}` : "/api/idosos", { method: resident ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(value) });
    const body = await response.json(); setSaving(false);
    if (!response.ok) { setError(body.error ?? "Não foi possível salvar."); return; }
    if (!resident) router.push(`/idosos/${body.id}`); else { router.refresh(); onSaved?.(); }
  }
  return <form onSubmit={submit} className="space-y-4"><div className="grid gap-4 sm:grid-cols-2"><Field label="Nome completo *"><input required value={value.full_name} onChange={(e) => set("full_name", e.target.value)} /></Field><Field label="Como prefere ser chamado"><input value={value.preferred_name} onChange={(e) => set("preferred_name", e.target.value)} /></Field><Field label="Data de nascimento *"><input required type="date" value={value.birth_date} onChange={(e) => set("birth_date", e.target.value)} /></Field><Field label="Quarto / endereço *"><input required value={value.room} onChange={(e) => set("room", e.target.value)} /></Field><Field label="Status"><select value={value.status} onChange={(e) => set("status", e.target.value)}><option>Ativo</option><option>Atenção</option></select></Field><Field label="Contato de emergência *"><input required value={value.emergency_contact} onChange={(e) => set("emergency_contact", e.target.value)} /></Field></div><Field label="Informações gerais *"><textarea required rows={3} value={value.general_info} onChange={(e) => set("general_info", e.target.value)} /></Field><Field label="Necessidades específicas *"><textarea required rows={3} value={value.specific_needs} onChange={(e) => set("specific_needs", e.target.value)} /></Field>{error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}<div className="flex justify-end gap-3 border-t border-slate-100 pt-4"><button type="button" onClick={onCancel} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-500">Cancelar</button><button disabled={saving} className="rounded-xl bg-moss px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">{saving ? "Salvando..." : resident ? "Salvar alterações" : "Cadastrar residente"}</button></div></form>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block text-sm font-medium text-slate-600"><span className="mb-1.5 block">{label}</span><div className="[&>input]:w-full [&>input]:rounded-xl [&>input]:border [&>input]:border-slate-200 [&>input]:px-3 [&>input]:py-2.5 [&>select]:w-full [&>select]:rounded-xl [&>select]:border [&>select]:border-slate-200 [&>select]:px-3 [&>select]:py-2.5 [&>textarea]:w-full [&>textarea]:resize-none [&>textarea]:rounded-xl [&>textarea]:border [&>textarea]:border-slate-200 [&>textarea]:px-3 [&>textarea]:py-2.5">{children}</div></label>; }
