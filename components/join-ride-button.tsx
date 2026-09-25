"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useRideStore } from "@/lib/store";
import { Button } from "@/components/ui/button";

export function JoinRideButton({ rideId }: { rideId: string }) {
  const router = useRouter();
  const joined = useRideStore((state) => state.joinedRideIds.includes(rideId));
  const joinRide = useRideStore((state) => state.joinRide);
  const [pending, setPending] = React.useState(false);
  const [message, setMessage] = React.useState("");

  async function handleJoin() {
    setPending(true);
    setMessage("");
    const response = await fetch(`/api/rides/${rideId}/request`, { method: "POST" });
    const data = await response.json();
    setPending(false);

    if (!response.ok) {
      setMessage(data.error ?? "Could not join this ride.");
      return;
    }

    joinRide(rideId);
    setMessage("Request sent to the driver.");
    router.refresh();
  }

  return (
    <div className="space-y-2">
      <Button type="button" onClick={handleJoin} disabled={joined || pending} aria-live="polite" className="w-full sm:w-auto">
        {pending ? "Sending..." : joined ? "Request Sent" : "Join Ride"}
      </Button>
      {message ? <p className="text-sm text-muted-foreground" role="status">{message}</p> : null}
    </div>
  );
}
