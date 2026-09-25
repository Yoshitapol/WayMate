import { Resend } from "resend";
import { RideNotificationEmail } from "@/emails/ride-notification";

export async function sendRideEmail({
  to,
  name,
  subject,
  message,
}: {
  to: string;
  name: string;
  subject: string;
  message: string;
}) {
  if (!process.env.RESEND_API_KEY) return { skipped: true as const };

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? "WayMate <onboarding@resend.dev>",
    to: [to],
    subject,
    react: RideNotificationEmail({ name, message }),
  });

  if (error) throw new Error(error.message);
  return { skipped: false as const, id: data?.id ?? null };
}
