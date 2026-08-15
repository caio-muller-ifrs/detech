import type { Medication } from "../lib/types";

const days = ["SEG", "TER", "QUA", "QUI", "SEX", "SÁB", "DOM"];
const dayKey: Record<string, string> = { SEG: "SEG", TER: "TER", QUA: "QUA", QUI: "QUI", SEX: "SEX", "SÁB": "SAB", DOM: "DOM" };

export function MedicationSchedule({ medications }: { medications: Medication[] }) {
  return <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
    <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-semibold text-ink">Cronograma de medicamentos</h2><p className="mt-1 text-xs text-slate-400">Programação semanal por horário</p></div><span className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-moss">{medications.length} medicamentos</span></div>
    <div className="overflow-x-auto p-5"><table className="w-full min-w-[650px] border-separate border-spacing-1.5 text-xs"><thead><tr><th className="w-28 text-left font-medium text-slate-400">Horário</th>{days.map((day) => <th key={day} className="h-8 text-center font-semibold text-slate-400">{day}</th>)}</tr></thead><tbody>{medications.map((medication) => { const activeDays = medication.days.split(","); return <tr key={medication.id}><td className="pr-2 align-middle"><p className="font-semibold text-ink">{medication.time}</p><p className="mt-0.5 text-slate-400">{medication.name}</p></td>{days.map((day) => <td key={day} className="h-12 min-w-16 rounded-lg bg-slate-50 p-1">{activeDays.includes(dayKey[day]) && <div title={`${medication.name} · ${medication.dosage}`} style={{ backgroundColor: medication.color }} className="flex h-full items-center justify-center rounded-md px-1 text-center text-[10px] font-bold leading-3 text-white shadow-sm">{medication.name.split(" ")[0]}</div>}</td>)}</tr>; })}</tbody></table></div>
    <div className="flex flex-wrap gap-x-4 gap-y-2 border-t border-slate-100 px-5 py-4">{medications.map((medication) => <div key={medication.id} className="flex items-center gap-1.5 text-xs text-slate-500"><i style={{ backgroundColor: medication.color }} className="h-2.5 w-2.5 rounded-full" />{medication.name} · {medication.dosage}</div>)}</div>
  </div>;
}
