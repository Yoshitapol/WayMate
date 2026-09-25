"use client";

import * as React from "react";
import type { Ride } from "@/lib/schema";
import { useRideStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RideCard } from "@/components/ride-card";

export function FindRides({ rides }: { rides: Ride[] }) {
  const filters = useRideStore((state) => state.filters);
  const setFilter = useRideStore((state) => state.setFilter);
  const resetFilters = useRideStore((state) => state.resetFilters);

  const filteredRides = React.useMemo(() => {
    return rides.filter((ride) => {
      const sourceMatch = ride.source.toLowerCase().includes(filters.source.toLowerCase());
      const destinationMatch = ride.destination.toLowerCase().includes(filters.destination.toLowerCase());
      const dateMatch = filters.date ? ride.date === filters.date : true;
      const seatMatch = ride.seatsAvailable >= filters.minSeats;
      return sourceMatch && destinationMatch && dateMatch && seatMatch;
    });
  }, [filters, rides]);

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" aria-label="Ride filters">
            <div className="space-y-2">
              <Label htmlFor="source">Source</Label>
              <Input
                id="source"
                value={filters.source}
                onChange={(event) => setFilter("source", event.target.value)}
                placeholder="Library Circle"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="destination">Destination</Label>
              <Input
                id="destination"
                value={filters.destination}
                onChange={(event) => setFilter("destination", event.target.value)}
                placeholder="Metro Station"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={filters.date}
                onChange={(event) => setFilter("date", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minSeats">Available seats</Label>
              <Input
                id="minSeats"
                type="number"
                min={1}
                max={6}
                value={filters.minSeats}
                onChange={(event) => setFilter("minSeats", Number(event.target.value))}
              />
            </div>
            <Button type="button" variant="secondary" className="w-full" onClick={resetFilters}>
              Clear Filters
            </Button>
          </form>
        </CardContent>
      </Card>
      <section aria-live="polite" aria-label="Filtered ride results">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">Available Rides</h2>
          <p className="text-sm text-muted-foreground">{filteredRides.length} found</p>
        </div>
        {filteredRides.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredRides.map((ride) => (
              <RideCard key={ride.id} ride={ride} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-5 text-sm text-muted-foreground">
              No rides match those filters. Try a different place or date.
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}
