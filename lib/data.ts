import type { Ride } from "@/lib/schema";

export const mockRides: Ride[] = [
  {
    id: "ride-101",
    driverName: "Aarav Sharma",
    source: "North Campus Gate",
    destination: "Metro Station",
    date: "2026-09-23",
    time: "08:15",
    seatsAvailable: 3,
    notes: "Leaving after the first lecture block.",
  },
  {
    id: "ride-102",
    driverName: "Maya Patel",
    source: "Library Circle",
    destination: "Tech Park",
    date: "2026-09-23",
    time: "17:30",
    seatsAvailable: 2,
    notes: "Can drop near the main bus stop.",
  },
  {
    id: "ride-103",
    driverName: "Kabir Singh",
    source: "Hostel Block C",
    destination: "City Center",
    date: "2026-09-24",
    time: "10:00",
    seatsAvailable: 4,
    notes: "Quick stop at the fuel station.",
  },
  {
    id: "ride-104",
    driverName: "Nisha Rao",
    source: "Sports Complex",
    destination: "Railway Station",
    date: "2026-09-24",
    time: "19:10",
    seatsAvailable: 1,
    notes: "Small backpack space only.",
  },
  {
    id: "ride-105",
    driverName: "Rohan Mehta",
    source: "Admin Block",
    destination: "Old Market",
    date: "2026-09-25",
    time: "12:45",
    seatsAvailable: 2,
    notes: "Returning after lunch if anyone needs a ride back.",
  },
];

export function getRideById(id: string) {
  return mockRides.find((ride) => ride.id === id);
}
