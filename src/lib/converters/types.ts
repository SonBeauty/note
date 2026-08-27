import type { AttachmentKind } from "@/types/note";

export type ConvertMeta = {
  fileName: string;
  mimeType: string;
  /** Dùng để dựng URL cho ảnh và các asset con của file. */
  attachmentId: string;
};

export type ConversionResult = {
  /** HTML đã sanitize, sẵn sàng render. */
  html: string;
  /** Text thô cho full-text search và RAG giai đoạn 2. */
  text: string;
};

export type Converter = (
  buffer: Buffer,
  meta: ConvertMeta,
) => Promise<ConversionResult>;

export type ConvertOutcome = ConversionResult & {
  kind: AttachmentKind;
  status: "ready" | "unsupported" | "failed";
  errorMessage?: string;
};
