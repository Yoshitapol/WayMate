import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Ride } from "@/lib/schema";
import { MyRidesList } from "@/components/my-rides-list";

export default async function MyRidesPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;
  const [posted, joined] = await Promise.all([
    prisma.ride.findMany({ where: { driverId: session.user.id }, include: { driver: { select: { name: true } } }, orderBy: { date: "asc" } }),
    prisma.ride.findMany({ where: { requests: { some: { passengerId: session.user.id, status: { in: ["PENDING", "ACCEPTED"] } } } }, include: { driver: { select: { name: true } } }, orderBy: { date: "asc" } }),
  ]);
  const mapRide = (ride: typeof posted[number]): Ride => ({ id: ride.id, driverName: ride.driver.name, source: ride.source, destination: ride.destination, date: ride.date, time: ride.time, seatsAvailable: ride.seatsAvailable, notes: ride.notes });
  return <div className="space-y-5"><div><h1 className="text-2xl font-semibold">My Rides</h1><p className="text-muted-foreground">Manage rides you posted and requested.</p></div><MyRidesList postedRides={posted.map(mapRide)} joinedRides={joined.map(mapRide)} /></div>;
}
