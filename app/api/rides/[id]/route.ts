import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ride = await prisma.ride.findUnique({
    where: { id },
    include: {
      driver: { select: { id: true, name: true, email: true } },
      requests: { include: { passenger: { select: { id: true, name: true } } } },
    },
  });

  if (!ride) return NextResponse.json({ error: "Ride not found" }, { status: 404 });
  return NextResponse.json(ride);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const { id } = await params;
  const ride = await prisma.ride.findUnique({ where: { id } });
  if (!ride) return NextResponse.json({ error: "Ride not found" }, { status: 404 });

  const role = String((session.user as { role?: string }).role ?? "MEMBER");
  if (ride.driverId !== session.user.id && role !== "ADMIN") {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }

  await prisma.ride.update({ where: { id }, data: { status: "CANCELLED" } });
  await prisma.auditLog.create({
    data: { userId: session.user.id, action: "CANCEL_RIDE", entityType: "Ride", entityId: id },
  });

  return NextResponse.json({ message: "Ride cancelled" });
}
