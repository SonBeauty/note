import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = { title: "Đăng nhập" };

export default function LoginPage() {
  return (
    // LoginForm đọc ?next= bằng useSearchParams, nên phải có Suspense
    // thì Next mới prerender được trang này.
    <Suspense fallback={<Skeleton className="h-80 w-full rounded-xl" />}>
      <LoginForm />
    </Suspense>
  );
}
