import { type NextRequest } from "next/server";
import { apiHandler } from "@/lib/api/handler";
import { requireUser } from "@/lib/get-session";
import { getOwnedAttachment } from "@/lib/attachments/attachment-service";
import {
  contentDisposition,
  fileSecurityHeaders,
} from "@/lib/attachments/file-response";
import { getStorage } from "@/lib/storage";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

/** Tải về file gốc, nguyên vẹn. Luôn là attachment, không bao giờ inline. */
export const GET = apiHandler(async (_request: NextRequest, ctx: Ctx) => {
  const user = await requireUser();
  const { id } = await ctx.params;

  const attachment = await getOwnedAttachment(user.id, id);
  const object = await getStorage().get(attachment.storageKey);

  return new Response(new Uint8Array(object.body), {
    headers: {
      ...fileSecurityHeaders(),
      "Content-Type": "application/octet-stream",
      "Content-Disposition": contentDisposition("attachment", attachment.fileName),
      "Content-Length": String(object.body.length),
    },
  });
});
