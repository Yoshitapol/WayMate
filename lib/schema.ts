import { z } from "zod";

export const rideSchema = z.object({
  source: z.string().min(2, "Source must be at least 2 characters."),
  destination: z.string().min(2, "Destination must be at least 2 characters."),
  date: z.string().min(1, "Choose a date."),
  time: z.string().min(1, "Choose a time."),
  seatsAvailable: z.coerce
    .number()
    .int("Seats must be a whole number.")
    .min(1, "Offer at least 1 seat.")
    .max(6, "Keep seats between 1 and 6."),
  notes: z.string().max(180, "Notes must be 180 characters or less.").optional(),
});

export type RideFormValues = z.infer<typeof rideSchema>;

export type Ride = RideFormValues & {
  id: string;
  driverName: string;
  notes: string;
};
