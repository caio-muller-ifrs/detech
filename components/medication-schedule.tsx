"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Medication } from "../lib/types";

const days = ["SEG", "TER", "QUA", "QUI", "SEX", "SÁB", "DOM"];
const dayKey: Record<string, string> = { SEG: "SEG", TER: "TER", QUA: "QUA", QUI: "QUI", SEX: "SEX", "SÁB": "SAB", DOM: "DOM" };

const colors = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
];

export function MedicationSchedule({
  medications,
  residentId,
}: {
  medications: Medication[];
  residentId: number;
}) {
  const router = useRouter();

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [time, setTime] = useState("");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [color, setColor] = useState(colors[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function toggleDay(day: string) {
    setSelectedDays((current) =>
      current.includes(day)
        ? current.filter((item) => item !== day)
        : [...current, day],
    );
  }

  function resetForm() {
    setName("");
    setDosage("");
    setTime("");
    setSelectedDays([]);
    setColor(colors[0]);
    setError("");
  }

  function closeForm() {
    if (loading) return;

    resetForm();
    setShowForm(false);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!name.trim() || !dosage.trim() || !time) {
      setError("Preencha o nome, a dosagem e o horário.");
      return;
    }

    if (selectedDays.length === 0) {
      setError("Selecione pelo menos um dia da semana.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/idosos/${residentId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          dosage,
          time,
          days: selectedDays.join(","),
          color,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Não foi possível cadastrar o medicamento.",
        );
      }

      resetForm();
      setShowForm(false);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível cadastrar o medicamento.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-ink">Cronograma de medicamentos</h2>
            <p className="mt-1 text-xs text-slate-400">Programação semanal por horário</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-moss">
              {medications.length} medicamentos
            </span>

            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="rounded-xl bg-moss px-4 py-2 text-xs font-semibold text-white hover:opacity-90"
            >
              + Adicionar medicamento
            </button>
          </div>
        </div>

        <div className="overflow-x-auto p-5">
          <table className="w-full min-w-[650px] border-separate border-spacing-1.5 text-xs">
            <thead>
              <tr>
                <th className="w-28 text-left font-medium text-slate-400">
                  Horário
                </th>

                {days.map((day) => (
                  <th
                    key={day}
                    className="h-8 text-center font-semibold text-slate-400"
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {medications.map((medication) => {
                const activeDays = medication.days.split(",");

                return (
                  <tr key={medication.id}>
                    <td className="pr-2 align-middle">
                      <p className="font-semibold text-ink">
                        {medication.time}
                      </p>

                      <p className="mt-0.5 text-slate-400">
                        {medication.name}
                      </p>
                    </td>

                    {days.map((day) => (
                      <td
                        key={day}
                        className="h-12 min-w-16 rounded-lg bg-slate-50 p-1"
                      >
                        {activeDays.includes(dayKey[day]) && (
                          <div
                            title={`${medication.name} · ${medication.dosage}`}
                            style={{
                              backgroundColor: medication.color,
                            }}
                            className="flex h-full items-center justify-center rounded-md px-1 text-center text-[10px] font-bold leading-3 text-white shadow-sm"
                          >
                            {medication.name.split(" ")[0]}
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-2 border-t border-slate-100 px-5 py-4">
          {medications.map((medication) => (
            <div
              key={medication.id}
              className="flex items-center gap-1.5 text-xs text-slate-500"
            >
              <i
                style={{ backgroundColor: medication.color }}
                className="h-2.5 w-2.5 rounded-full"
              />

              {medication.name} · {medication.dosage}
            </div>
          ))}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold text-ink">
                  Adicionar medicamento
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Cadastre a programação do medicamento.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                className="text-xl text-slate-400 hover:text-slate-600"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Nome do medicamento
                </label>

                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Ex.: Losartana"
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-moss"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Dosagem
                </label>

                <input
                  value={dosage}
                  onChange={(event) => setDosage(event.target.value)}
                  placeholder="Ex.: 50 mg"
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-moss"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Horário
                </label>

                <input
                  type="time"
                  value={time}
                  onChange={(event) => setTime(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-moss"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Dias da semana
                </label>

                <div className="flex flex-wrap gap-2">
                  {days.map((day) => {
                    const value = dayKey[day];
                    const selected = selectedDays.includes(value);

                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(value)}
                        className={`rounded-lg px-3 py-2 text-xs font-semibold ${
                          selected
                            ? "bg-moss text-white"
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Cor no cronograma
                </label>

                <div className="flex gap-3">
                  {colors.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setColor(item)}
                      style={{ backgroundColor: item }}
                      className={`h-8 w-8 rounded-full ${
                        color === item
                          ? "ring-2 ring-offset-2 ring-slate-500"
                          : ""
                      }`}
                    />
                  ))}
                </div>
              </div>

              {error && (
                <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={loading}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl bg-moss px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
                >
                  {loading ? "Adicionando..." : "Adicionar medicamento"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}