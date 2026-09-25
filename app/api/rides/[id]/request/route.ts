import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendRideEmail } from "@/lib/email";

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const { id } = await params;
  const ride = await prisma.ride.findUnique({ where: { id }, include: { driver: true } });
  if (!ride || ride.status !== "OPEN") return NextResponse.json({ error: "Ride is not available" }, { status: 404 });
  if (ride.driverId === session.user.id) return NextResponse.json({ error: "You cannot request your own ride" }, { status: 400 });

  try {
    const request = await prisma.rideRequest.create({
      data: { rideId: id, passengerId: session.user.id },
      include: { ride: { include: { driver: true } }, passenger: true },
    });

    await prisma.notification.create({
      data: {
        userId: ride.driverId,
        type: "RIDE_REQUEST",
        title: "New ride request",
        message: `${session.user.name} requested your ${ride.source} to ${ride.destination} ride.`,
      },
    });

    await prisma.auditLog.create({
      data: { userId: session.user.id, action: "REQUEST_RIDE", entityType: "RideRequest", entityId: request.id },
    });

    return NextResponse.json(request, { status: 201 });
  } catch {
    return NextResponse.json({ error: "You have already requested this ride" }, { status: 409 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const status = body.status as "ACCEPTED" | "REJECTED";
  if (!["ACCEPTED", "REJECTED"].includes(status)) {
    return NextResponse.json({ error: "Status must be ACCEPTED or REJECTED" }, { status: 400 });
  }

  const existing = await prisma.rideRequest.findUnique({
    where: { id },
    include: { ride: { include: { driver: true } }, passenger: true },
  });
  if (!existing) return NextResponse.json({ error: "Request not found" }, { status: 404 });

  const role = String((session.user as { role?: string }).role ?? "MEMBER");
  if (existing.ride.driverId !== session.user.id && role !== "ADMIN") {
    return NextResponse.json({ error: "Only the ride owner or admin can decide" }, { status: 403 });
  }

  const updated = await prisma.$transaction(async (tx) => {
    const requestUpdate = await tx.rideRequest.update({ where: { id }, data: { status } });

    if (status === "ACCEPTED") {
      const changed = await tx.ride.updateMany({
        where: { id: existing.rideId, status: "OPEN", seatsAvailable: { gt: 0 } },
        data: { seatsAvailable: { decrement: 1 } },
      });
      if (changed.count !== 1) throw new Error("No seats available");
    }

    await tx.auditLog.create({
      data: {
        userId: session.user.id,
        action: `REQUEST_${status}`,
        entityType: "RideRequest",
        entityId: id,
      },
    });

    return requestUpdate;
  });

  let emailId: string | null = null;
  try {
    const email = await sendRideEmail({
      to: existing.passenger.email,
      name: existing.passenger.name,
      subject: `WayMate ride request ${status.toLowerCase()}`,
      message: `Your request for ${existing.ride.source} to ${existing.ride.destination} was ${status.toLowerCase()}.`,
    });
    emailId = email.skipped ? null : email.id;
  } catch (error) {
    console.error("Request email failed", error);
  }

  await prisma.notification.create({
    data: {
      userId: existing.passengerId,
      type: `REQUEST_${status}`,
      title: `Ride request ${status.toLowerCase()}`,
      message: `Your request for ${existing.ride.source} to ${existing.ride.destination} was ${status.toLowerCase()}.`,
      emailId,
      status: emailId ? "EMAILED" : "CREATED",
    },
  });

  return NextResponse.json(updated);
}
