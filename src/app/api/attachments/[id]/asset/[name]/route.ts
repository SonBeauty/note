import { type NextRequest } from "next/server";
import { apiHandler } from "@/lib/api/handler";
import { requireUser } from "@/lib/get-session";
import { getOwnedAttachment } from "@/lib/attachments/attachment-service";
import { fileSecurityHeaders } from "@/lib/attachments/file-response";
import { NotFoundError } from "@/lib/errors";
import { getStorage } from "@/lib/storage";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string; name: string }> };

/** Đúng dạng do docx-converter sinh ra, không nhận gì khác. */
const ASSET_NAME = /^img-\d{1,4}[.](png|jpg|gif|webp|bmp)$/;

const EXT_TO_MIME: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  bmp: "image/bmp",
};

/**
 * Ảnh tách ra từ file .docx.
 *
 * Tên asset phải khớp đúng khuôn mẫu — đây là chốt chặn path traversal.
 * Không có allowlist này thì "../../original" hay tên tuỳ ý sẽ lọt xuống storage.
 */
export const GET = apiHandler(async (_request: NextRequest, ctx: Ctx) => {
  const user = await requireUser();
  const { id, name } = await ctx.params;

  if (!ASSET_NAME.test(name)) {
    throw new NotFoundError("Tên tệp không hợp lệ");
  }

  // Kiểm tra quyền sở hữu attachment cha trước khi chạm vào storage.
  await getOwnedAttachment(user.id, id);

  const ext = name.slice(name.lastIndexOf(".") + 1);
  const object = await getStorage()
    .get(`${id}/${name}`)
    .catch(() => {
      throw new NotFoundError("Không tìm thấy tệp");
    });

  return new Response(new Uint8Array(object.body), {
    headers: {
      ...fileSecurityHeaders(),
      "Content-Type": EXT_TO_MIME[ext] ?? "application/octet-stream",
      "Cache-Control": "private, max-age=31536000, immutable",
    },
  });
});
