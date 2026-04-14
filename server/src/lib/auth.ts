import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "./db";

const secret = process.env.BETTER_AUTH_SECRET;
const baseURL = process.env.BETTER_AUTH_URL;
const clientURL = process.env.CLIENT_URL;

if (!secret) throw new Error("BETTER_AUTH_SECRET is not set");
if (!baseURL) throw new Error("BETTER_AUTH_URL is not set");
if (!clientURL) throw new Error("CLIENT_URL is not set");

if (process.env.NODE_ENV === "production" && !baseURL.startsWith("https://")) {
  throw new Error("BETTER_AUTH_URL must use HTTPS in production");
}

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 12,
  },
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
  },
  secret,
  baseURL,
  trustedOrigins: [clientURL],
});
