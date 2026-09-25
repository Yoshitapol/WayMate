import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";

const protectedPaths = ["/post", "/my-rides", "/profile", "/api/rides"];

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const needsAuth = protectedPaths.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));

  if (!needsAuth || (path.startsWith("/api/rides") && request.method === "GET")) return NextResponse.next();

  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    if (path.startsWith("/api/")) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    const url = new URL("/sign-in", request.url);
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  if (path.startsWith("/api/rides") && request.method !== "GET") {
    const role = String((session.user as { role?: string }).role ?? "MEMBER");
    if (!["ADMIN", "MEMBER"].includes(role)) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/post/:path*", "/my-rides/:path*", "/profile/:path*", "/api/rides/:path*"],
};
