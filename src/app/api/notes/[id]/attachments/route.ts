import { NextResponse, type NextRequest } from "next/server";
import { apiHandler } from "@/lib/api/handler";
import { requireUser } from "@/lib/get-session";
import { addAttachment } from "@/lib/attachments/attachment-service";
import { BadRequestError } from "@/lib/errors";

// mammoth và pdfjs chỉ chạy được ở Node runtime.
export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export const POST = apiHandler(async (request: NextRequest, ctx: Ctx) => {
  const user = await requireUser();
  const { id: noteId } = await ctx.params;

  const form = await request.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    throw new BadRequestError("Thiếu trường 'file'");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const saved = await addAttachment(user.id, noteId, {
    name: file.name,
    type: file.type,
    buffer,
  });

  return NextResponse.json(saved, { status: 201 });
});
