import "dotenv/config";
import express from "express";
import cors from "cors";
import { betterAuthMiddleware } from "./middleware/betterAuth";
import { authenticate } from "./middleware/authenticate";

const app = express();
const PORT = Number(process.env.PORT ?? 3000);
const CLIENT_URL = process.env.CLIENT_URL ?? "http://localhost:5173";

app.use(cors({ origin: CLIENT_URL, credentials: true }));

// Better Auth handles /api/auth/* — must be mounted before express.json()
app.use(betterAuthMiddleware);

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/protected", authenticate, (req, res) => {
  res.json({ message: "Access granted", user: req.user });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
