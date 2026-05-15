import React, { useState } from "react";
import { useAuth } from "@context/AuthContext";
import NeoButton from "@components/common/NeoButton";

interface LoginFormProps {
  onSuccess: () => void;
  onSwitchToRegister: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onSwitchToRegister,
}) => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(username, password);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="font-old-english text-2xl">Sign In</h2>
      {error && <p className="font-sans text-sm text-press-red">{error}</p>}
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        className="border border-ink bg-paper px-3 py-2 font-sans text-sm outline-none focus:ring-1 focus:ring-ink"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="border border-ink bg-paper px-3 py-2 font-sans text-sm outline-none focus:ring-1 focus:ring-ink"
      />
      <NeoButton type="submit" disabled={loading}>
        {loading ? "Signing in…" : "Sign In"}
      </NeoButton>
      <button
        type="button"
        onClick={onSwitchToRegister}
        className="font-sans text-sm underline"
      >
        No account? Register
      </button>
    </form>
  );
};
