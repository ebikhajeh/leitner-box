import { useNavigate } from "react-router";

interface User {
  id: string;
  name: string;
  email: string;
}

interface Props {
  user: User;
  onSignOut: () => void;
}

export default function HomePage({ user, onSignOut }: Props) {
  const navigate = useNavigate();

  async function handleSignOut() {
    try {
      await fetch("/api/auth/sign-out", { method: "POST", credentials: "include" });
    } finally {
      onSignOut();
      navigate("/login");
    }
  }

  return (
    <div>
      <nav className="flex items-center justify-between px-6 py-3 border-b border-gray-200">
        <span className="font-semibold text-lg">Leitner Box</span>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{user.name || user.email}</span>
          <button
            onClick={handleSignOut}
            className="text-sm px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            Sign out
          </button>
        </div>
      </nav>
      <main className="p-6">
        <h1 className="text-2xl font-semibold">Home</h1>
      </main>
    </div>
  );
}
