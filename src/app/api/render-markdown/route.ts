import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { apiHandler } from "@/lib/api/handler";
import { requireUser } from "@/lib/get-session";
import { convertMarkdown } from "@/lib/converters/markdown-converter";

export const runtime = "nodejs";

const schema = z.object({ text: z.string().max(1_000_000) });

/**
 * Xem trước markdown khi đang gõ note.
 *
 * Render ở server để dùng lại đúng bộ sanitize + shiki đã kiểm chứng, thay vì
 * nhồi markdown-it và toàn bộ grammar của shiki vào bundle phía client.
 */
export const POST = apiHandler(async (request: NextRequest) => {
  await requireUser();
  const { text } = schema.parse(await request.json());
  const { html } = await convertMarkdown(Buffer.from(text, "utf8"), {
    fileName: "note.md",
    mimeType: "text/markdown",
    attachmentId: "note",
  });
  return NextResponse.json({ html });
});
