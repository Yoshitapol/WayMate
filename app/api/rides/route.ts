import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rideSchema } from "@/lib/schema";
import { sendRideEmail } from "@/lib/email";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const source = url.searchParams.get("source")?.trim() ?? "";
  const destination = url.searchParams.get("destination")?.trim() ?? "";
  const date = url.searchParams.get("date") ?? "";

  const rides = await prisma.ride.findMany({
    where: {
      status: "OPEN",
      ...(source ? { source: { contains: source, mode: "insensitive" } } : {}),
      ...(destination ? { destination: { contains: destination, mode: "insensitive" } } : {}),
      ...(date ? { date } : {}),
    },
    include: { driver: { select: { name: true } } },
    orderBy: [{ date: "asc" }, { time: "asc" }],
  });

  return NextResponse.json(rides);
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const result = rideSchema.safeParse(await request.json());
  if (!result.success) {
    return NextResponse.json({ error: "Invalid ride data", details: result.error.flatten() }, { status: 400 });
  }

  if (result.data.source.trim().toLowerCase() === result.data.destination.trim().toLowerCase()) {
    return NextResponse.json({ error: "Source and destination should be different" }, { status: 400 });
  }

  const ride = await prisma.$transaction(async (tx) => {
    const created = await tx.ride.create({
      data: { ...result.data, notes: result.data.notes ?? "", driverId: session.user.id },
      include: { driver: { select: { name: true, email: true } } },
    });

    await tx.auditLog.create({
      data: {
        userId: session.user.id,
        action: "CREATE_RIDE",
        entityType: "Ride",
        entityId: created.id,
        metadata: { source: created.source, destination: created.destination },
      },
    });

    return created;
  });

  let emailId: string | null = null;
  try {
    const email = await sendRideEmail({
      to: ride.driver.email,
      name: ride.driver.name,
      subject: "Your WayMate ride was posted",
      message: `${ride.source} to ${ride.destination} on ${ride.date} at ${ride.time} is now live.`,
    });
    emailId = email.skipped ? null : email.id;
  } catch (error) {
    console.error("Ride email failed", error);
  }

  await prisma.notification.create({
    data: {
      userId: session.user.id,
      type: "RIDE_CREATED",
      title: "Ride posted",
      message: `${ride.source} to ${ride.destination} is now available.`,
      emailId,
      status: emailId ? "EMAILED" : "CREATED",
    },
  });

  return NextResponse.json(ride, { status: 201 });
}
