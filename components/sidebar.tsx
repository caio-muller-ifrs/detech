import Link from "next/link";

const items = [
  ["Visão geral", "⌂"], ["Idosos", "♙"], ["Agenda", "◷"], ["Equipe", "♧"], ["Relatórios", "▤"]
];

export function Sidebar() {
  return (
    <aside className="hidden min-h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white px-4 py-6 lg:flex">
      <Link href="/" className="mb-11 flex items-center gap-3 px-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-moss text-xl text-white">♥</span>
        <span><strong className="block font-semibold tracking-tight text-ink">Cuidar</strong><small className="text-slate-400">gestão humanizada</small></span>
      </Link>
      <nav className="space-y-1">
        {items.map(([label, icon]) => (
          <Link key={label} href={label === "Idosos" ? "/" : "#"} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm ${label === "Idosos" ? "bg-emerald-50 font-semibold text-moss" : "text-slate-500 hover:bg-slate-50"}`}>
            <span className="w-5 text-center text-base">{icon}</span>{label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto rounded-2xl bg-[#edf8f4] p-4 text-sm text-[#246759]">
        <p className="font-semibold">Precisa de ajuda?</p>
        <p className="mt-1 text-xs leading-5">Conte com nosso suporte para organizar a rotina de cuidados.</p>
        <button className="mt-3 text-xs font-semibold underline">Falar com suporte</button>
      </div>
      <div className="mt-5 flex items-center gap-3 px-2">
        <div className="grid h-9 w-9 place-items-center rounded-full bg-[#e7d7cc] text-xs font-bold text-[#7b5543]">MS</div>
        <div><p className="text-sm font-medium text-ink">Marina Santos</p><p className="text-xs text-slate-400">Administradora</p></div>
      </div>
    </aside>
  );
}
