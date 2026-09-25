import { Mail, MapPin, UserRound } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="text-muted-foreground">A simple mock student profile for Assignment 1.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Student Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <p className="flex items-center gap-2">
            <UserRound className="h-4 w-4 text-primary" aria-hidden="true" />
            Aarav Sharma
          </p>
          <p className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-primary" aria-hidden="true" />
            aarav.sharma@college.edu
          </p>
          <p className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
            North Campus Hostel
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
