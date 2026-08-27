/** Trạng thái convert của một file đính kèm. */
export type AttachmentStatus = "pending" | "ready" | "failed" | "unsupported";

/** Loại nội dung đã nhận dạng được — quyết định dùng converter nào. */
export type AttachmentKind =
  | "markdown"
  | "docx"
  | "pdf"
  | "image"
  | "code"
  | "data"
  | "html"
  | "text"
  | "unknown";

/** Màu note, đúng bộ màu Keep dùng. */
export const NOTE_COLORS = [
  "default",
  "red",
  "orange",
  "yellow",
  "green",
  "teal",
  "blue",
  "purple",
  "pink",
  "gray",
] as const;

export type NoteColor = (typeof NOTE_COLORS)[number];

export type ChecklistItem = {
  id: string;
  text: string;
  checked: boolean;
  order: number;
};
