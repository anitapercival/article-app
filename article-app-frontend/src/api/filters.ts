export interface Analyst {
  slug: string;
  name: string;
}

export interface Channel {
  slug: string;
  name: string;
}

export async function fetchAnalysts(): Promise<Analyst[]> {
  const res = await fetch("/api/articles/analysts");
  if (!res.ok) throw new Error("Failed to fetch analysts");
  return res.json();
}

export async function fetchChannels(): Promise<Channel[]> {
  const res = await fetch("/api/articles/channels");
  if (!res.ok) throw new Error("Failed to fetch channels");
  return res.json();
}
