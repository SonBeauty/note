import { db } from "@/lib/db";

/** Trần độ dài để một file khổng lồ không làm phình row và chậm index. */
const MAX_SEARCHABLE_LENGTH = 1_000_000;

/**
 * Tính lại Note.searchableText = title + body + text trích từ mọi attachment.
 *
 * ĐÂY LÀ NƠI DUY NHẤT ĐƯỢC PHÉP GHI CỘT NÀY.
 * Rải logic này ra nhiều chỗ là cách chắc chắn nhất để cột bị lệch với thực tế.
 * Gọi sau khi: sửa note, convert xong attachment, xoá attachment.
 */
export async function rebuildSearchableText(noteId: string): Promise<void> {
  const note = await db.note.findUnique({
    where: { id: noteId },
    select: {
      title: true,
      body: true,
      checklist: true,
      attachments: { select: { fileName: true, extractedText: true } },
    },
  });

  if (!note) return;

  const parts: string[] = [note.title, note.body];

  // Tên file cũng nên tìm được — người dùng hay nhớ tên file hơn nội dung.
  for (const a of note.attachments) {
    parts.push(a.fileName);
    if (a.extractedText) parts.push(a.extractedText);
  }

  if (Array.isArray(note.checklist)) {
    for (const item of note.checklist) {
      if (item && typeof item === "object" && "text" in item) {
        parts.push(String((item as { text: unknown }).text ?? ""));
      }
    }
  }

  const searchableText = parts
    .filter(Boolean)
    .join("\n")
    .slice(0, MAX_SEARCHABLE_LENGTH);

  await db.note.update({
    where: { id: noteId },
    data: { searchableText },
  });
}
