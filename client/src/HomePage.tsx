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
      <nav style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 24px",
        borderBottom: "1px solid #e5e7eb",
      }}>
        <span style={{ fontWeight: 600 }}>Leitner Box</span>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span>{user.name || user.email}</span>
          <button onClick={handleSignOut}>Sign out</button>
        </div>
      </nav>
      <main style={{ padding: "24px" }}>
        <h1>Home</h1>
      </main>
    </div>
  );
}
