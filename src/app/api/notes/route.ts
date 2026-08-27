import { NextResponse, type NextRequest } from "next/server";
import { apiHandler } from "@/lib/api/handler";
import { requireUser } from "@/lib/get-session";
import { createNote, listNotes } from "@/lib/notes/note-service";
import {
  createNoteSchema,
  listNotesQuerySchema,
} from "@/lib/validation/note-schema";

// Prisma + converter chỉ chạy được ở Node runtime.
export const runtime = "nodejs";

export const GET = apiHandler(async (request: NextRequest) => {
  const user = await requireUser();
  const query = listNotesQuerySchema.parse(
    Object.fromEntries(request.nextUrl.searchParams),
  );
  const result = await listNotes(user.id, query);
  return NextResponse.json(result);
});

export const POST = apiHandler(async (request: NextRequest) => {
  const user = await requireUser();
  const body = createNoteSchema.parse(await request.json().catch(() => ({})));
  const note = await createNote(user.id, body);
  return NextResponse.json(note, { status: 201 });
});
