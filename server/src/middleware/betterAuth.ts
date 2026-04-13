import type { Request, Response, NextFunction } from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "../lib/auth";

const handler = toNodeHandler(auth);

export function betterAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.url.startsWith("/api/auth")) {
    handler(req, res);
  } else {
    next();
  }
}
