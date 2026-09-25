import { PostRideForm } from "@/components/post-ride-form";

export default function PostPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">Post a Ride</h1>
        <p className="text-muted-foreground">Add the basic route details so students can find your ride.</p>
      </div>
      <PostRideForm />
    </div>
  );
}
