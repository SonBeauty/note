import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth";

// better-auth dùng crypto của Node — không chạy được trên Edge runtime.
export const runtime = "nodejs";

export const { GET, POST } = toNextJsHandler(auth.handler);
