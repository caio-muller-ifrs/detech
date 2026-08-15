"use client";

import { useState } from "react";
import { ResidentForm } from "./resident-form";

export function CreateResidentButton() {
  const [open, setOpen] = useState(false);
  return <><button onClick={() => setOpen(true)} className="rounded-xl bg-moss px-4 py-2.5 text-sm font-semibold text-white shadow-soft hover:bg-[#125748]">+ Novo residente</button>{open && <div className="fixed inset-0 z-50 grid place-items-center bg-ink/40 p-4"><div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"><div className="mb-5"><h2 className="text-xl font-semibold text-ink">Cadastrar residente</h2><p className="mt-1 text-sm text-slate-500">Registre os dados principais para iniciar o acompanhamento.</p></div><ResidentForm onCancel={() => setOpen(false)} /></div></div>}</>;
}
