"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rideSchema } from "@/lib/schema";

export type PostRideState = {
  status: "idle" | "success" | "error";
  message: string;
  errors?: Partial<
    Record<
      "source" | "destination" | "date" | "time" | "seatsAvailable" | "notes",
      string
    >
  >;
};

export async function createRideAction(
  _previousState: PostRideState,
  formData: FormData,
): Promise<PostRideState> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return {
        status: "error",
        message: "Please sign in before posting a ride.",
      };
    }

    const rawRide = {
      source: formData.get("source"),
      destination: formData.get("destination"),
      date: formData.get("date"),
      time: formData.get("time"),
      seatsAvailable: formData.get("seatsAvailable"),
      notes: formData.get("notes") || "",
    };

    const result = rideSchema.safeParse(rawRide);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;

      return {
        status: "error",
        message: "Please fix the highlighted fields.",
        errors: Object.fromEntries(
          Object.entries(fieldErrors).map(([key, value]) => [
            key,
            value?.[0] ?? "Invalid value",
          ]),
        ),
      };
    }

    if (
      result.data.source.trim().toLowerCase() ===
      result.data.destination.trim().toLowerCase()
    ) {
      return {
        status: "error",
        message: "Source and destination should be different.",
      };
    }

    await prisma.$transaction(async (tx) => {
      const ride = await tx.ride.create({
        data: {
          ...result.data,
          notes: result.data.notes ?? "",
          driverId: session.user.id,
        },
      });

      await tx.auditLog.create({
        data: {
          userId: session.user.id,
          action: "CREATE_RIDE",
          entityType: "Ride",
          entityId: ride.id,
        },
      });
    });

    return {
      status: "success",
      message: "Ride posted successfully.",
    };
  } catch (error) {
    console.error("Create ride error:", error);

    return {
      status: "error",
      message: "Something went wrong while posting the ride.",
    };
  }
}