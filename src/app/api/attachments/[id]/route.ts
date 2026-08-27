import { NextResponse, type NextRequest } from "next/server";
import { apiHandler } from "@/lib/api/handler";
import { requireUser } from "@/lib/get-session";
import { deleteAttachment } from "@/lib/attachments/attachment-service";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export const DELETE = apiHandler(async (_request: NextRequest, ctx: Ctx) => {
  const user = await requireUser();
  const { id } = await ctx.params;
  return NextResponse.json(await deleteAttachment(user.id, id));
});
