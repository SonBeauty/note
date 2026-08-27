import { getSessionCookie } from "better-auth/cookies";
import { NextResponse, type NextRequest } from "next/server";

const AUTH_PAGES = ["/login", "/register"];

/**
 * CHỈ để redirect cho mượt UX — đây KHÔNG phải hàng rào bảo mật.
 *
 * Middleware chạy ở Edge nên không query được DB; nó chỉ nhìn thấy cookie có tồn tại
 * hay không, chứ không xác thực được chữ ký. Việc kiểm tra thật nằm ở requireUser()
 * trong từng API route và server component.
 */
export function middleware(request: NextRequest) {
  const hasCookie = Boolean(getSessionCookie(request));
  const { pathname } = request.nextUrl;
  const isAuthPage = AUTH_PAGES.some((p) => pathname.startsWith(p));

  if (!hasCookie && !isAuthPage) {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (hasCookie && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
