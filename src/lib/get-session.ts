import { headers } from "next/headers";
import { auth } from "./auth";
import { UnauthorizedError } from "./errors";

/** Session hiện tại, hoặc null. Dùng khi trang có thể xem ẩn danh. */
export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

/**
 * Chốt chặn bảo mật của mọi API route.
 *
 * Middleware chỉ redirect cho đẹp UX — cookie có thể giả, nên KHÔNG được coi
 * middleware là hàng rào. Mọi route đụng dữ liệu người dùng đều phải gọi hàm này.
 */
export async function requireUser() {
  const session = await getSession();
  if (!session?.user) {
    throw new UnauthorizedError();
  }
  return session.user;
}
