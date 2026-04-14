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
    <div className="max-w-sm mx-auto mt-20 px-4">
      <h1 className="text-3xl font-semibold mb-6">Log in</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register("password")}
            className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>
        {serverError && (
          <p className="text-red-500 text-sm mb-3">{serverError}</p>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? "Logging in…" : "Log in"}
        </button>
      </form>
    </div>
  );
}
