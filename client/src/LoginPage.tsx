import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof schema>;

interface User {
  id: string;
  name: string;
  email: string;
}

interface Props {
  onLogin: (user: User) => void;
}

export default function LoginPage({ onLogin }: Props) {
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    setServerError("");
    try {
      const res = await fetch("/api/auth/sign-in/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        setServerError(body.message ?? "Invalid email or password.");
        return;
      }

      onLogin(body.user);
    } catch {
      setServerError("Network error. Please try again.");
    }
  }

  return (
    <div style={{ maxWidth: 360, margin: "80px auto", padding: "0 16px" }}>
      <h1>Log in</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="email">Email</label>
          <br />
          <input
            id="email"
            type="email"
            {...register("email")}
            style={{ width: "100%", padding: "6px 8px", marginTop: 4 }}
          />
          {errors.email && (
            <p style={{ color: "red", margin: "4px 0 0" }}>{errors.email.message}</p>
          )}
        </div>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="password">Password</label>
          <br />
          <input
            id="password"
            type="password"
            {...register("password")}
            style={{ width: "100%", padding: "6px 8px", marginTop: 4 }}
          />
          {errors.password && (
            <p style={{ color: "red", margin: "4px 0 0" }}>{errors.password.message}</p>
          )}
        </div>
        {serverError && <p style={{ color: "red", marginBottom: 12 }}>{serverError}</p>}
        <button type="submit" disabled={isSubmitting} style={{ width: "100%", padding: "8px" }}>
          {isSubmitting ? "Logging in…" : "Log in"}
        </button>
      </form>
    </div>
  );
}
