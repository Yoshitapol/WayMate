import { Suspense } from "react";
import { getRides } from "@/lib/rides";
import { FindRides } from "@/components/find-rides";

export default async function FindPage() {
  const rides = await getRides();
  return <div className="space-y-5"><div><h1 className="text-2xl font-semibold">Find a Ride</h1><p className="text-muted-foreground">Filter by route, date, and seats.</p></div><Suspense fallback={<p className="text-sm text-muted-foreground">Loading rides...</p>}><FindRides rides={rides} /></Suspense></div>;
}
