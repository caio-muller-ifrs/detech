export type Medication = {
  id: number;
  resident_id: number;
  name: string;
  dosage: string;
  time: string;
  days: string;
  color: string;
};

export type Resident = {
  id: number;
  full_name: string;
  preferred_name: string | null;
  birth_date: string;
  room: string;
  photo_url: string | null;
  status: "Ativo" | "Atenção";
  general_info: string;
  specific_needs: string;
  emergency_contact: string;
  updated_at: string;
};
