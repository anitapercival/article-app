import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { login, saveUser } from "../api/auth";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: Location })?.from?.pathname || "/";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      const data = await login(username, password);
      saveUser(data.user);
      window.dispatchEvent(new Event("authChange"));
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      setError("Invalid username or password");
    }
  }

  return (
    <div className="max-w-md mx-auto mt-32 p-10 border border-gray-200 rounded-xl shadow-lg bg-white">
      <h1 className="text-3xl font-extrabold text-center mb-8">Login</h1>

      {error && <div className="mb-4 text-center text-red-600">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 rounded-none transition cursor-pointer"
        >
          Login
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600">
        Don&apos;t have an account?{" "}
        <span className="text-yellow-500 cursor-pointer hover:underline">
          Sign up here
        </span>
      </div>
    </div>
  );
}
