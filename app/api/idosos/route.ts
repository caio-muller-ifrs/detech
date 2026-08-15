import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getResidents } from "../../../lib/db";
import { createResident } from "../../../lib/mutations";

export async function GET() { return NextResponse.json(getResidents()); }

export async function POST(request: Request) {
  try { const id = createResident(await request.json()); revalidatePath("/"); return NextResponse.json({ id }, { status: 201 }); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Não foi possível criar o residente." }, { status: 400 }); }
}
