"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export function SessionNav() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) return null;

  if (!session) {
    return <Button asChild size="sm"><Link href="/sign-in">Sign in</Link></Button>;
  }

  return (
    <div className="flex items-center gap-2">
      <span className="hidden text-sm text-muted-foreground sm:inline">{session.user.name}</span>
      <Button size="sm" variant="outline" onClick={() => authClient.signOut()}>Sign out</Button>
    </div>
  );
}
