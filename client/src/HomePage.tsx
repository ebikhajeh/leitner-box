import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";

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
      <nav className="flex items-center justify-between px-6 py-3 border-b">
        <span className="font-semibold text-lg">Leitner Box</span>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">{user.name || user.email}</span>
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            Sign out
          </Button>
        </div>
      </nav>
      <main className="p-6">
        <h1 className="text-2xl font-semibold">Home</h1>
      </main>
    </div>
  );
}
