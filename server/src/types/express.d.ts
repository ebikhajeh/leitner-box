import type { auth } from "../lib/auth";

type GetSessionResult = NonNullable<
  Awaited<ReturnType<typeof auth.api.getSession>>
>;

declare global {
  namespace Express {
    interface Request {
      user?: GetSessionResult["user"];
      session?: GetSessionResult["session"];
    }
  }
}
