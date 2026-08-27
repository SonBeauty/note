import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { HttpError } from "@/lib/errors";

/**
 * Bọc mọi route handler: dịch lỗi đã biết thành status code đúng,
 * và chặn không cho lỗi lạ rò chi tiết nội bộ ra ngoài.
 */
export function apiHandler<Args extends unknown[]>(
  fn: (...args: Args) => Promise<NextResponse | Response>,
) {
  return async (...args: Args): Promise<NextResponse | Response> => {
    try {
      return await fn(...args);
    } catch (error) {
      if (error instanceof HttpError) {
        return NextResponse.json(
          { error: error.message },
          { status: error.status },
        );
      }

      if (error instanceof ZodError) {
        return NextResponse.json(
          { error: "Dữ liệu không hợp lệ", issues: error.issues },
          { status: 400 },
        );
      }

      // Lỗi ngoài dự kiến: log đầy đủ ở server, trả ra ngoài thông báo chung chung.
      console.error("[api] unhandled error:", error);
      return NextResponse.json({ error: "Lỗi máy chủ" }, { status: 500 });
    }
  };
}
