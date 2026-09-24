import { NextResponse } from "next/server";
import os from "os";

export async function GET() {
  const interfaces = os.networkInterfaces();
  let localIp = "127.0.0.1";

  for (const name of Object.keys(interfaces)) {
    const netList = interfaces[name];
    if (!netList) continue;

    for (const net of netList) {
      // Skip internal (127.0.0.1) and non-ipv4 addresses
      if (net.family === "IPv4" && !net.internal) {
        // Prefer standard local area network IP ranges (192.168.x.x, 10.x.x.x, 172.16-31.x.x)
        if (
          net.address.startsWith("192.168.") ||
          net.address.startsWith("10.") ||
          net.address.startsWith("172.")
        ) {
          localIp = net.address;
          break;
        }
      }
    }
    if (localIp !== "127.0.0.1") break;
  }

  return NextResponse.json({
    ip: localIp,
    isLocal: localIp !== "127.0.0.1",
  });
}
