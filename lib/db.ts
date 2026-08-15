import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import type { Medication, Resident } from "./types";

const dataDirectory = path.join(process.cwd(), "data");
fs.mkdirSync(dataDirectory, { recursive: true });
const sqlite = new Database(path.join(dataDirectory, "cuidado.db"));

sqlite.pragma("journal_mode = WAL");
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS residents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    preferred_name TEXT,
    birth_date TEXT NOT NULL,
    room TEXT NOT NULL,
    photo_url TEXT,
    status TEXT NOT NULL DEFAULT 'Ativo',
    general_info TEXT NOT NULL,
    specific_needs TEXT NOT NULL,
    emergency_contact TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS medications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    resident_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    dosage TEXT NOT NULL,
    time TEXT NOT NULL,
    days TEXT NOT NULL,
    color TEXT NOT NULL,
    FOREIGN KEY (resident_id) REFERENCES residents(id) ON DELETE CASCADE
  );
`);

const total = sqlite.prepare("SELECT COUNT(*) AS total FROM residents").get() as { total: number };

if (total.total === 0) {
  const insertResident = sqlite.prepare(`
    INSERT INTO residents (full_name, preferred_name, birth_date, room, status, general_info, specific_needs, emergency_contact, updated_at)
    VALUES (@full_name, @preferred_name, @birth_date, @room, @status, @general_info, @specific_needs, @emergency_contact, @updated_at)
  `);
  const insertMedication = sqlite.prepare(`
    INSERT INTO medications (resident_id, name, dosage, time, days, color)
    VALUES (@resident_id, @name, @dosage, @time, @days, @color)
  `);
  const seed = sqlite.transaction(() => {
    const ana = insertResident.run({
      full_name: "Ana Beatriz de Souza", preferred_name: "Dona Ana", birth_date: "1942-08-19", room: "Suíte 12", status: "Ativo",
      general_info: "Gosta de conversar depois do café e ouvir músicas antigas. Mantém boa autonomia nas atividades diárias.",
      specific_needs: "Utiliza aparelho auditivo. Atenção ao piso molhado e acompanhamento em caminhadas longas.",
      emergency_contact: "Luciana de Souza (filha) · (11) 99876-2345", updated_at: "2026-08-14 14:30"
    }).lastInsertRowid;
    const jose = insertResident.run({
      full_name: "José Carlos Ribeiro", preferred_name: "Seu José", birth_date: "1938-03-02", room: "Suíte 04", status: "Atenção",
      general_info: "Prefere refeições leves e leitura no período da tarde. Precisa de lembrete para hidratação.",
      specific_needs: "Diabético. Verificar glicemia conforme orientação clínica e oferecer auxílio ao se levantar.",
      emergency_contact: "Rafael Ribeiro (filho) · (11) 98811-7220", updated_at: "2026-08-14 10:10"
    }).lastInsertRowid;
    const maria = insertResident.run({
      full_name: "Maria Aparecida Lima", preferred_name: "Dona Cida", birth_date: "1940-11-27", room: "Suíte 08", status: "Ativo",
      general_info: "Participa das atividades de artesanato e aprecia chá de camomila antes de dormir.",
      specific_needs: "Mobilidade reduzida no joelho esquerdo. Acompanhar deslocamento em escadas.",
      emergency_contact: "Renata Lima (neta) · (11) 99770-1204", updated_at: "2026-08-13 16:45"
    }).lastInsertRowid;

    const medicines = [
      [ana, "Losartana", "50 mg", "08:00", "SEG,TER,QUA,QUI,SEX,SAB,DOM", "#3b82f6"],
      [ana, "Vitamina D", "2.000 UI", "12:00", "SEG,QUA,SEX", "#f59e0b"],
      [ana, "Melatonina", "3 mg", "21:00", "SEG,TER,QUA,QUI,SEX,SAB,DOM", "#8b5cf6"],
      [jose, "Metformina", "850 mg", "08:00", "SEG,TER,QUA,QUI,SEX,SAB,DOM", "#ef4444"],
      [maria, "Cálcio", "600 mg", "09:00", "TER,QUI,SAB", "#10b981"]
    ];
    for (const [resident_id, name, dosage, time, days, color] of medicines) {
      insertMedication.run({ resident_id, name, dosage, time, days, color });
    }
  });
  seed();
}

export function getResidents() {
  return sqlite.prepare("SELECT * FROM residents ORDER BY full_name").all() as Resident[];
}

export function getResident(id: number) {
  return sqlite.prepare("SELECT * FROM residents WHERE id = ?").get(id) as Resident | undefined;
}

export function getMedications(residentId: number) {
  return sqlite.prepare("SELECT * FROM medications WHERE resident_id = ? ORDER BY time").all(residentId) as Medication[];
}
