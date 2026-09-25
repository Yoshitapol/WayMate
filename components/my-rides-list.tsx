"use client";

import Link from "next/link";
import type { Ride } from "@/lib/schema";
import { useRideStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function MyRidesList({ postedRides, joinedRides }: { postedRides: Ride[]; joinedRides: Ride[] }) {
  const selectedRideId = useRideStore((state) => state.selectedRideId);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader><CardTitle className="text-base">Rides Posted</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {postedRides.length ? postedRides.map((ride) => <RideLine key={ride.id} ride={ride} selected={selectedRideId === ride.id} />) : <p className="text-sm text-muted-foreground">You have not posted a ride yet.</p>}
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-base">Rides Joined</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {joinedRides.length ? joinedRides.map((ride) => <RideLine key={ride.id} ride={ride} selected={selectedRideId === ride.id} />) : <p className="text-sm text-muted-foreground">You have not joined a ride yet.</p>}
        </CardContent>
      </Card>
    </div>
  );
}

function RideLine({ ride, selected }: { ride: Ride; selected: boolean }) {
  return (
    <div className="rounded-md border p-3">
      <p className="font-medium">{ride.source} to {ride.destination}</p>
      <p className="text-sm text-muted-foreground">{ride.date} at {ride.time} with {ride.driverName}</p>
      {selected ? <p className="mt-1 text-sm text-primary">Currently selected</p> : null}
      <Button asChild variant="outline" size="sm" className="mt-3"><Link href={`/rides/${ride.id}`}>Open</Link></Button>
    </div>
  );
}
