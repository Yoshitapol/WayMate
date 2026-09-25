import Link from "next/link";
import { CalendarDays, MapPin, Users } from "lucide-react";
import type { Ride } from "@/lib/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function RideCard({ ride }: { ride: Ride }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{ride.source} to {ride.destination}</CardTitle>
        <p className="text-sm text-muted-foreground">Driver: {ride.driverName}</p>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-primary" aria-hidden="true" />
          <span>{ride.date} at {ride.time}</span>
        </p>
        <p className="flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" aria-hidden="true" />
          <span>{ride.seatsAvailable} seat{ride.seatsAvailable === 1 ? "" : "s"} available</span>
        </p>
        <p className="flex items-start gap-2 text-muted-foreground">
          <MapPin className="mt-0.5 h-4 w-4 text-primary" aria-hidden="true" />
          <span>{ride.notes}</span>
        </p>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link href={`/rides/${ride.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
