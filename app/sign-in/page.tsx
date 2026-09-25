import Link from "next/link";
import { AuthForm } from "@/components/auth-form";

export default function SignInPage() {
  return (
    <div className="space-y-4">
      <AuthForm mode="sign-in" />
      <p className="text-center text-sm text-muted-foreground">
        New to WayMate? <Link href="/sign-up" className="text-primary hover:underline">Create an account</Link>
      </p>
    </div>
  );
}
