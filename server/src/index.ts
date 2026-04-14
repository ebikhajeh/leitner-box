import "dotenv/config";
import express from "express";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { authenticate } from "./middleware/authenticate";

const app = express();
const PORT = Number(process.env.PORT ?? 3000);
const CLIENT_URL = process.env.CLIENT_URL;

if (!CLIENT_URL) throw new Error("CLIENT_URL is not set");

app.use(cors({ origin: CLIENT_URL, credentials: true }));

const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
});

// Better Auth — must be mounted before express.json() (Express v5 wildcard syntax)
app.use("/api/auth", authRateLimit);
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/protected", authenticate, (req, res) => {
  res.json({ message: "Access granted", user: req.user });
});

app.listen(PORT, () => {
  const env = process.env.NODE_ENV ?? "development";
  console.log(`Server running on http://localhost:${PORT} (${env})`);
});
