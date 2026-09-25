import Link from "next/link";
import { CarFront } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { SessionNav } from "@/components/session-nav";

const links = [
  { href: "/", label: "Home" },
  { href: "/find", label: "Find a Ride" },
  { href: "/post", label: "Post a Ride" },
  { href: "/my-rides", label: "My Rides" },
  { href: "/profile", label: "Profile" },
];

export function Navbar() {
  return (
    <header className="border-b bg-background">
      <nav className="mx-auto flex min-h-16 w-full max-w-6xl flex-col gap-3 px-4 py-3 sm:px-6 md:flex-row md:items-center md:justify-between">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold" aria-label="WayMate home">
          <CarFront className="h-5 w-5 text-primary" aria-hidden="true" />
          WayMate
        </Link>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-1" aria-label="Main navigation">
            {links.map((link) => <Link key={link.href} href={link.href} className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{link.label}</Link>)}
          </div>
          <div className="flex items-center gap-2"><ThemeToggle /><SessionNav /></div>
        </div>
      </nav>
    </header>
  );
}
