import { NextResponse, type NextRequest } from "next/server";
import { apiHandler } from "@/lib/api/handler";
import { requireUser } from "@/lib/get-session";
import { getAttachmentContent } from "@/lib/attachments/attachment-service";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

/** HTML đã render. Tách khỏi GET note vì nội dung có thể rất lớn. */
export const GET = apiHandler(async (_request: NextRequest, ctx: Ctx) => {
  const user = await requireUser();
  const { id } = await ctx.params;
  return NextResponse.json(await getAttachmentContent(user.id, id));
});
