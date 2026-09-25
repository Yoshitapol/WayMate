import Link from "next/link";
import { AuthForm } from "@/components/auth-form";

export default function SignUpPage() {
  return (
    <div className="space-y-4">
      <AuthForm mode="sign-up" />
      <p className="text-center text-sm text-muted-foreground">
        Already have an account? <Link href="/sign-in" className="text-primary hover:underline">Sign in</Link>
      </p>
    </div>
  );
}
