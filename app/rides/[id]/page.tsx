import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { CalendarDays, MapPin, User, Users } from "lucide-react";
import { getRide } from "@/lib/rides";
import { JoinRideButton } from "@/components/join-ride-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function RideDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ride = await getRide(id);
  if (!ride) notFound();
  return <div className="mx-auto max-w-3xl space-y-5"><div><h1 className="text-2xl font-semibold">Ride Details</h1><p className="text-muted-foreground">{ride.source} to {ride.destination}</p></div><Card><CardHeader><CardTitle>{ride.source} to {ride.destination}</CardTitle></CardHeader><CardContent className="space-y-4"><Detail icon={<User className="h-4 w-4" />} label="Driver" value={ride.driverName} /><Detail icon={<CalendarDays className="h-4 w-4" />} label="When" value={`${ride.date} at ${ride.time}`} /><Detail icon={<Users className="h-4 w-4" />} label="Seats" value={`${ride.seatsAvailable} available`} /><Detail icon={<MapPin className="h-4 w-4" />} label="Notes" value={ride.notes} /><JoinRideButton rideId={ride.id} /></CardContent></Card></div>;
}
function Detail({ icon, label, value }: { icon: ReactNode; label: string; value: string }) { return <div className="rounded-md border p-3"><p className="mb-1 flex items-center gap-2 text-sm font-medium"><span className="text-primary" aria-hidden="true">{icon}</span>{label}</p><p className="text-sm text-muted-foreground">{value}</p></div>; }
