"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const days = [
  { label: "SEG", value: "SEG" },
  { label: "TER", value: "TER" },
  { label: "QUA", value: "QUA" },
  { label: "QUI", value: "QUI" },
  { label: "SEX", value: "SEX" },
  { label: "SÁB", value: "SAB" },
  { label: "DOM", value: "DOM" },
];

const colors = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
];

type MedicationFormProps = {
  residentId: number;
  onClose: () => void;
};

export function MedicationForm({
  residentId,
  onClose,
}: MedicationFormProps) {
  const router = useRouter();

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
        throw new Error(data.error || "Não foi possível cadastrar o medicamento.");
      }

      onClose();
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
            onClick={onClose}
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
                const selected = selectedDays.includes(day.value);

                return (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => toggleDay(day.value)}
                    className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                      selected
                        ? "bg-moss text-white"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    }`}
                  >
                    {day.label}
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
                  aria-label={`Selecionar cor ${item}`}
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
              onClick={onClose}
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
  );
}