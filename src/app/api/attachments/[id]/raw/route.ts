import { type NextRequest } from "next/server";
import { apiHandler } from "@/lib/api/handler";
import { requireUser } from "@/lib/get-session";
import {
  getOwnedAttachment,
  isInlineImage,
} from "@/lib/attachments/attachment-service";
import {
  contentDisposition,
  fileSecurityHeaders,
} from "@/lib/attachments/file-response";
import { getStorage } from "@/lib/storage";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

/**
 * Phục vụ file gốc để nhúng inline (thẻ img trong viewer).
 *
 * CHỈ ảnh mới được hiện inline. Mọi thứ khác bị ép tải về — nếu không, một file
 * HTML upload lên sẽ chạy được script trên chính origin của app.
 */
export const GET = apiHandler(async (_request: NextRequest, ctx: Ctx) => {
  const user = await requireUser();
  const { id } = await ctx.params;

  const attachment = await getOwnedAttachment(user.id, id);
  const object = await getStorage().get(attachment.storageKey);

  const inline = isInlineImage(attachment.mimeType);

  return new Response(new Uint8Array(object.body), {
    headers: {
      ...fileSecurityHeaders(),
      "Content-Type": inline ? attachment.mimeType : "application/octet-stream",
      "Content-Disposition": contentDisposition(
        inline ? "inline" : "attachment",
        attachment.fileName,
      ),
    },
  });
});
