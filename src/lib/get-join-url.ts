// Robust join URL generator for SPARK QR codes and link sharing
// Solves the critical bug: never encodes localhost for physical phone QR scanning!

export async function resolveJoinUrl(roomCode: string): Promise<string> {
  if (typeof window === "undefined") {
    return `/join?code=${roomCode}`;
  }

  // 1. If explicit public production URL configured in env
  const envUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (envUrl && !envUrl.includes("localhost") && !envUrl.includes("127.0.0.1")) {
    const cleanBase = envUrl.replace(/\/$/, "");
    return `${cleanBase}/join?code=${roomCode}`;
  }

  const hostname = window.location.hostname;
  const port = window.location.port ? `:${window.location.port}` : "";
  const protocol = window.location.protocol;

  // 2. If running on public domain (Vercel preview/production, custom domain)
  if (hostname !== "localhost" && hostname !== "127.0.0.1") {
    return `${window.location.origin}/join?code=${roomCode}`;
  }

  // 3. If in local development on localhost/127.0.0.1, query LAN IP from API
  try {
    const res = await fetch("/api/network-ip");
    if (res.ok) {
      const data = await res.json();
      if (data.ip && data.ip !== "127.0.0.1") {
        return `${protocol}//${data.ip}${port}/join?code=${roomCode}`;
      }
    }
  } catch (err) {
    console.warn("Could not resolve LAN IP, falling back to window.location.origin", err);
  }

  // Fallback
  return `${window.location.origin}/join?code=${roomCode}`;
}
