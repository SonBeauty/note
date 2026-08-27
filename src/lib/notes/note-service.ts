import { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { ConflictError, NotFoundError } from "@/lib/errors";
import type { ListNotesQuery, UpdateNoteInput } from "@/lib/validation/note-schema";
import { rebuildSearchableText } from "./rebuild-searchable-text";
import { searchNoteIds } from "./note-search";

/**
 * MỌI hàm ở đây nhận userId làm tham số đầu tiên, không có ngoại lệ.
 * Không có hàm nào được phép query note chỉ bằng id — đó là lỗ hổng IDOR.
 */

const NOTE_SELECT = {
  id: true,
  title: true,
  body: true,
  checklist: true,
  color: true,
  isPinned: true,
  isArchived: true,
  deletedAt: true,
  createdAt: true,
  updatedAt: true,
  labels: { select: { id: true, name: true } },
  attachments: {
    select: {
      id: true,
      fileName: true,
      mimeType: true,
      sizeBytes: true,
      kind: true,
      status: true,
      errorMessage: true,
      createdAt: true,
    },
    orderBy: { createdAt: "asc" },
  },
} as const;

export type NoteWithRelations = Awaited<ReturnType<typeof getNote>>;

export async function createNote(userId: string, input: { title?: string; body?: string }) {
  const note = await db.note.create({
    data: {
      userId,
      title: input.title ?? "",
      body: input.body ?? "",
      searchableText: [input.title, input.body].filter(Boolean).join("\n"),
    },
    select: NOTE_SELECT,
  });
  return note;
}

export async function getNote(userId: string, noteId: string) {
  const note = await db.note.findFirst({
    where: { id: noteId, userId },
    select: NOTE_SELECT,
  });
  // Không tồn tại và không phải của mình đều trả 404 giống hệt nhau,
  // để không lộ ra note đó có thật.
  if (!note) throw new NotFoundError("Không tìm thấy ghi chú");
  return note;
}

export async function listNotes(userId: string, query: ListNotesQuery) {
  const { q, view, label, cursor, limit } = query;

  if (q) {
    const ids = await searchNoteIds({ userId, term: q, view, limit });
    if (ids.length === 0) return { notes: [], nextCursor: null };

    const notes = await db.note.findMany({
      where: { id: { in: ids }, userId },
      select: NOTE_SELECT,
    });
    // Giữ đúng thứ tự xếp hạng của SQL search.
    const byId = new Map(notes.map((n) => [n.id, n]));
    return {
      notes: ids.map((id) => byId.get(id)).filter((n) => n !== undefined),
      nextCursor: null,
    };
  }

  const where = {
    userId,
    ...(view === "trash"
      ? { deletedAt: { not: null } }
      : { deletedAt: null, isArchived: view === "archived" }),
    ...(label ? { labels: { some: { name: label, userId } } } : {}),
  };

  const notes = await db.note.findMany({
    where,
    select: NOTE_SELECT,
    orderBy: [{ isPinned: "desc" }, { updatedAt: "desc" }],
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
  });

  const hasMore = notes.length > limit;
  const page = hasMore ? notes.slice(0, limit) : notes;

  return {
    notes: page,
    nextCursor: hasMore ? (page[page.length - 1]?.id ?? null) : null,
  };
}

export async function updateNote(userId: string, noteId: string, input: UpdateNoteInput) {
  const { expectedUpdatedAt, checklist, ...fields } = input;

  const current = await db.note.findFirst({
    where: { id: noteId, userId },
    select: { updatedAt: true },
  });
  if (!current) throw new NotFoundError("Không tìm thấy ghi chú");

  // Autosave gửi rất nhiều PATCH; request đến trễ không được ghi đè bản mới hơn.
  if (
    expectedUpdatedAt &&
    current.updatedAt.getTime() > new Date(expectedUpdatedAt).getTime()
  ) {
    throw new ConflictError("Ghi chú đã được sửa ở nơi khác");
  }

  await db.note.update({
    where: { id: noteId },
    data: {
      ...fields,
      // Prisma phân biệt "không đổi" (undefined) với "gán NULL" (Prisma.DbNull).
      ...(checklist !== undefined
        ? { checklist: checklist === null ? Prisma.DbNull : checklist }
        : {}),
    },
  });

  await rebuildSearchableText(noteId);
  return getNote(userId, noteId);
}

/** Mặc định đưa vào thùng rác. permanent = xoá hẳn, kéo theo attachment. */
export async function deleteNote(userId: string, noteId: string, permanent: boolean) {
  const note = await db.note.findFirst({
    where: { id: noteId, userId },
    select: { id: true },
  });
  if (!note) throw new NotFoundError("Không tìm thấy ghi chú");

  if (permanent) {
    await db.note.delete({ where: { id: noteId } });
    return { deleted: "permanent" as const };
  }

  await db.note.update({
    where: { id: noteId },
    data: { deletedAt: new Date(), isPinned: false },
  });
  return { deleted: "trashed" as const };
}

export async function restoreNote(userId: string, noteId: string) {
  const note = await db.note.findFirst({
    where: { id: noteId, userId, deletedAt: { not: null } },
    select: { id: true },
  });
  if (!note) throw new NotFoundError("Không tìm thấy ghi chú trong thùng rác");

  await db.note.update({ where: { id: noteId }, data: { deletedAt: null } });
  return getNote(userId, noteId);
}
