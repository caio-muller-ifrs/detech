import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getResident } from "../../../../lib/db";
import { deleteResident, updateResident } from "../../../../lib/mutations";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) { const { id } = await params; const resident = getResident(Number(id)); return resident ? NextResponse.json(resident) : NextResponse.json({ error: "Residente não encontrado." }, { status: 404 }); }

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try { if (!updateResident(Number(id), await request.json())) return NextResponse.json({ error: "Residente não encontrado." }, { status: 404 }); revalidatePath("/"); revalidatePath(`/idosos/${id}`); return NextResponse.json({ ok: true }); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Não foi possível atualizar o residente." }, { status: 400 }); }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) { const { id } = await params; if (!deleteResident(Number(id))) return NextResponse.json({ error: "Residente não encontrado." }, { status: 404 }); revalidatePath("/"); return new NextResponse(null, { status: 204 }); }
