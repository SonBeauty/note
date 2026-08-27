import { NextResponse, type NextRequest } from "next/server";
import { apiHandler } from "@/lib/api/handler";
import { requireUser } from "@/lib/get-session";
import { deleteNote, getNote, updateNote } from "@/lib/notes/note-service";
import { updateNoteSchema } from "@/lib/validation/note-schema";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export const GET = apiHandler(async (_request: NextRequest, ctx: Ctx) => {
  const user = await requireUser();
  const { id } = await ctx.params;
  return NextResponse.json(await getNote(user.id, id));
});

export const PATCH = apiHandler(async (request: NextRequest, ctx: Ctx) => {
  const user = await requireUser();
  const { id } = await ctx.params;
  const input = updateNoteSchema.parse(await request.json());
  return NextResponse.json(await updateNote(user.id, id, input));
});

export const DELETE = apiHandler(async (request: NextRequest, ctx: Ctx) => {
  const user = await requireUser();
  const { id } = await ctx.params;
  const permanent = request.nextUrl.searchParams.get("permanent") === "true";
  return NextResponse.json(await deleteNote(user.id, id, permanent));
});
