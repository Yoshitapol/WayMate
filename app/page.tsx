import { Suspense } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { Clock, Route, Users } from "lucide-react";
import { getRides } from "@/lib/rides";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RideCard } from "@/components/ride-card";

export default async function HomePage() {
  const rides = await getRides();
  const seats = rides.reduce((total, ride) => total + ride.seatsAvailable, 0);
  return <div className="space-y-8"><section className="grid gap-5 md:grid-cols-[1fr_320px] md:items-start"><div className="space-y-4"><p className="text-sm font-medium text-primary">Student carpool board</p><h1 className="text-3xl font-semibold tracking-normal sm:text-4xl">WayMate</h1><p className="max-w-2xl text-muted-foreground">Find students going your way, or post a ride when you have extra seats.</p><div className="flex flex-wrap gap-3"><Button asChild><Link href="/find">Find a Ride</Link></Button><Button asChild variant="outline"><Link href="/post">Post a Ride</Link></Button></div></div><Card><CardHeader><CardTitle className="text-base">Quick Stats</CardTitle></CardHeader><CardContent className="space-y-3 text-sm"><Stat icon={<Route className="h-4 w-4" />} label="Active rides" value={rides.length} /><Stat icon={<Users className="h-4 w-4" />} label="Open seats" value={seats} /><Stat icon={<Clock className="h-4 w-4" />} label="Next ride" value={rides[0]?.time ?? "--"} /></CardContent></Card></section><section><div className="mb-4 flex items-center justify-between gap-3"><h2 className="text-xl font-semibold">Recent Rides</h2><Button asChild variant="ghost" size="sm"><Link href="/find">See all</Link></Button></div><Suspense fallback={<p className="text-sm text-muted-foreground">Loading recent rides...</p>}><div className="grid gap-4 md:grid-cols-3">{rides.slice(0, 3).map((ride) => <RideCard key={ride.id} ride={ride} />)}</div></Suspense></section></div>;
}
function Stat({ icon, label, value }: { icon: ReactNode; label: string; value: number | string }) { return <div className="flex items-center justify-between gap-4 rounded-md border p-3"><span className="flex items-center gap-2 text-muted-foreground">{icon}{label}</span><strong>{value}</strong></div>; }
