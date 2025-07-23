export async function login(username: string, password: string) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
    credentials: "include",
  });

  if (!res.ok) throw new Error("Login failed");
  return res.json();
}

export function saveUser(user: { username: string; avatar: string }) {
  // Save user profile info to localStorage
  localStorage.setItem("user", JSON.stringify(user));
}

export function getUser(): { username: string; avatar: string } | null {
  // Retrieve user profile info from localStorage
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

export async function logout() {
  localStorage.removeItem("user");

  await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });
}
