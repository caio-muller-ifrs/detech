import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

const directory = path.join(process.cwd(), "data");
fs.mkdirSync(directory, { recursive: true });
const db = new Database(path.join(directory, "cuidado.db"));
db.exec(`CREATE TABLE IF NOT EXISTS residents (id INTEGER PRIMARY KEY AUTOINCREMENT, full_name TEXT NOT NULL, preferred_name TEXT, birth_date TEXT NOT NULL, room TEXT NOT NULL, photo_url TEXT, status TEXT NOT NULL DEFAULT 'Ativo', general_info TEXT NOT NULL, specific_needs TEXT NOT NULL, emergency_contact TEXT NOT NULL, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP); CREATE TABLE IF NOT EXISTS medications (id INTEGER PRIMARY KEY AUTOINCREMENT, resident_id INTEGER NOT NULL, name TEXT NOT NULL, dosage TEXT NOT NULL, time TEXT NOT NULL, days TEXT NOT NULL, color TEXT NOT NULL, FOREIGN KEY (resident_id) REFERENCES residents(id) ON DELETE CASCADE);`);

const residentFields = ["full_name", "preferred_name", "birth_date", "room", "photo_url", "status", "general_info", "specific_needs", "emergency_contact"] as const;
type ResidentField = typeof residentFields[number];
type Payload = Partial<Record<ResidentField, string>>;

export function createResident(body: Payload) {
  const required = ["full_name", "birth_date", "room", "general_info", "specific_needs", "emergency_contact"] as const;
  if (required.some((field) => !body[field]?.trim())) throw new Error("Preencha todos os campos obrigatórios.");
  const result = db.prepare(`INSERT INTO residents (full_name, preferred_name, birth_date, room, photo_url, status, general_info, specific_needs, emergency_contact, updated_at) VALUES (@full_name, @preferred_name, @birth_date, @room, @photo_url, @status, @general_info, @specific_needs, @emergency_contact, datetime('now'))`).run({ preferred_name: null, photo_url: null, status: "Ativo", ...body });
  return result.lastInsertRowid;
}

export function updateResident(id: number, body: Payload) {
  const changes = residentFields.filter((field) => typeof body[field] === "string");
  if (!changes.length) throw new Error("Nenhuma informação para atualizar.");
  const values = Object.fromEntries(changes.map((field) => [field, body[field]]));
  const result = db.prepare(`UPDATE residents SET ${changes.map((field) => `${field} = @${field}`).join(", ")}, updated_at = datetime('now') WHERE id = @id`).run({ ...values, id });
  return result.changes > 0;
}

export function deleteResident(id: number) {
  db.prepare("DELETE FROM medications WHERE resident_id = ?").run(id);
  return db.prepare("DELETE FROM residents WHERE id = ?").run(id).changes > 0;
}

type MedicationPayload = {
  name?: string;
  dosage?: string;
  time?: string;
  days?: string;
  color?: string;
};

export function createMedication(residentId: number, body: MedicationPayload) {
  const required = ["name", "dosage", "time", "days", "color"] as const;

  if (required.some((field) => !body[field]?.trim())) {
    throw new Error("Preencha todos os campos do medicamento.");
  }

  const resident = db
    .prepare("SELECT id FROM residents WHERE id = ?")
    .get(residentId);

  if (!resident) {
    throw new Error("Residente não encontrado.");
  }

  const result = db
    .prepare(`
      INSERT INTO medications (
        resident_id,
        name,
        dosage,
        time,
        days,
        color
      )
      VALUES (
        @resident_id,
        @name,
        @dosage,
        @time,
        @days,
        @color
      )
    `)
    .run({
      resident_id: residentId,
      name: body.name!.trim(),
      dosage: body.dosage!.trim(),
      time: body.time!.trim(),
      days: body.days!.trim(),
      color: body.color!.trim(),
    });

  return result.lastInsertRowid;
}