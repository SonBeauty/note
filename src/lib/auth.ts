import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "./db";

const googleId = process.env.GOOGLE_CLIENT_ID;
const googleSecret = process.env.GOOGLE_CLIENT_SECRET;
const hasGoogle = Boolean(googleId && googleSecret);

export const auth = betterAuth({
  database: prismaAdapter(db, { provider: "postgresql" }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },

  // Google chỉ bật khi có credential — app vẫn chạy đủ với email/password.
  socialProviders: hasGoogle
    ? { google: { clientId: googleId!, clientSecret: googleSecret! } }
    : {},

  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 ngày
    updateAge: 60 * 60 * 24, // gia hạn tối đa 1 lần/ngày
  },

  // Chặn dò mật khẩu.
  rateLimit: {
    enabled: true,
    window: 60,
    max: 20,
  },

  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
  },
});

export type AuthSession = typeof auth.$Infer.Session;
