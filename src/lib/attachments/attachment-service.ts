import { randomUUID } from "node:crypto";
import { db } from "@/lib/db";
import { BadRequestError, NotFoundError } from "@/lib/errors";
import { convertFile } from "@/lib/converters/convert-file";
import { rebuildSearchableText } from "@/lib/notes/rebuild-searchable-text";
import { getStorage } from "@/lib/storage";

const MAX_FILE_SIZE = Number(process.env.MAX_FILE_SIZE_BYTES ?? 26_214_400);
const MAX_NOTE_TOTAL = Number(process.env.MAX_NOTE_TOTAL_BYTES ?? 104_857_600);

/** Chỉ dùng cho ảnh phục vụ inline — không cho phép mime tuỳ ý để tránh XSS qua file. */
const INLINE_IMAGE_TYPES = new Set([
  "image/png", "image/jpeg", "image/gif", "image/webp", "image/bmp",
]);

async function assertNoteOwned(userId: string, noteId: string) {
  const note = await db.note.findFirst({
    where: { id: noteId, userId },
    select: { id: true },
  });
  if (!note) throw new NotFoundError("Không tìm thấy ghi chú");
}

export async function addAttachment(
  userId: string,
  noteId: string,
  file: { name: string; type: string; buffer: Buffer },
) {
  await assertNoteOwned(userId, noteId);

  if (file.buffer.length === 0) {
    throw new BadRequestError("File rỗng");
  }
  if (file.buffer.length > MAX_FILE_SIZE) {
    const mb = (MAX_FILE_SIZE / 1024 / 1024).toFixed(0);
    throw new BadRequestError(`File vượt quá ${mb}MB`);
  }

  const existing = await db.attachment.aggregate({
    where: { noteId },
    _sum: { sizeBytes: true },
  });
  if ((existing._sum.sizeBytes ?? 0) + file.buffer.length > MAX_NOTE_TOTAL) {
    throw new BadRequestError("Ghi chú này đã vượt quá dung lượng đính kèm cho phép");
  }

  // Sinh id trước khi chạm DB: converter cần id để dựng URL cho ảnh tách ra,
  // và storageKey là cột unique nên không thể tạo row với giá trị rỗng tạm thời.
  const attachmentId = randomUUID();
  const storageKey = `${attachmentId}/original`;
  const mimeType = file.type || "application/octet-stream";

  await getStorage().put(storageKey, file.buffer, mimeType);

  const outcome = await convertFile(file.buffer, {
    fileName: file.name,
    mimeType,
    attachmentId,
  });

  const saved = await db.attachment.create({
    data: {
      id: attachmentId,
      noteId,
      userId,
      fileName: file.name,
      mimeType,
      sizeBytes: file.buffer.length,
      storageKey,
      kind: outcome.kind,
      status: outcome.status,
      renderedHtml: outcome.html,
      extractedText: outcome.text,
      errorMessage: outcome.errorMessage ?? null,
    },
    select: {
      id: true, fileName: true, mimeType: true, sizeBytes: true,
      kind: true, status: true, errorMessage: true, createdAt: true,
    },
  });

  await rebuildSearchableText(noteId);
  return saved;
}

/** Bản ghi kèm quyền sở hữu đã kiểm tra. Mọi route đụng file đều đi qua đây. */
export async function getOwnedAttachment(userId: string, attachmentId: string) {
  const attachment = await db.attachment.findFirst({
    where: { id: attachmentId, userId },
  });
  if (!attachment) throw new NotFoundError("Không tìm thấy tệp đính kèm");
  return attachment;
}

export async function getAttachmentContent(userId: string, attachmentId: string) {
  const a = await getOwnedAttachment(userId, attachmentId);
  return {
    id: a.id,
    fileName: a.fileName,
    kind: a.kind,
    status: a.status,
    errorMessage: a.errorMessage,
    html: a.renderedHtml ?? "",
  };
}

export async function deleteAttachment(userId: string, attachmentId: string) {
  const a = await getOwnedAttachment(userId, attachmentId);
  const storage = getStorage();

  await storage.delete(a.storageKey).catch(() => {
    // File đã biến mất khỏi storage không nên chặn việc xoá bản ghi.
  });

  await db.attachment.delete({ where: { id: a.id } });
  await rebuildSearchableText(a.noteId);
  return { deleted: true };
}

export function isInlineImage(mimeType: string): boolean {
  return INLINE_IMAGE_TYPES.has(mimeType);
}
