import { prisma } from "@/lib/prisma";
import type { Ride } from "@/lib/schema";

export async function getRides(): Promise<Ride[]> {
  const rides = await prisma.ride.findMany({
    where: { status: "OPEN" },
    include: { driver: { select: { name: true } } },
    orderBy: [{ date: "asc" }, { time: "asc" }],
  });

  return rides.map((ride) => ({
    id: ride.id,
    driverName: ride.driver.name,
    source: ride.source,
    destination: ride.destination,
    date: ride.date,
    time: ride.time,
    seatsAvailable: ride.seatsAvailable,
    notes: ride.notes,
  }));
}

export async function getRide(id: string): Promise<Ride | undefined> {
  const ride = await prisma.ride.findUnique({
    where: { id },
    include: { driver: { select: { name: true } } },
  });
  if (!ride) return undefined;
  return {
    id: ride.id,
    driverName: ride.driver.name,
    source: ride.source,
    destination: ride.destination,
    date: ride.date,
    time: ride.time,
    seatsAvailable: ride.seatsAvailable,
    notes: ride.notes,
  };
}
