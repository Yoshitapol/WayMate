import "dotenv/config";
import { faker } from "@faker-js/faker";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client";
import { auth } from "../lib/auth";

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

const names = [
  "Aarav Sharma",
  "Maya Patel",
  "Kabir Singh",
  "Nisha Rao",
  "Rohan Mehta",
];

async function getOrCreateUser(name: string, role = "MEMBER") {
  const email = `${name.toLowerCase().replaceAll(" ", ".")}@campusride.demo`;

  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) return existing;

  const result = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password: "CampusRide123!",
    },
  });

  if (!result?.user) {
    throw new Error(`Could not create ${email}`);
  }

  return prisma.user.update({
    where: { id: result.user.id },
    data: { role },
  });
}

async function main() {
  const users = [];

  for (let i = 0; i < names.length; i++) {
    users.push(
      await getOrCreateUser(
        names[i],
        i === 0 ? "ADMIN" : "MEMBER",
      ),
    );
  }

  await prisma.rideRequest.deleteMany();
  await prisma.ride.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.auditLog.deleteMany();

  const locations = [
    "DJSCE Main Gate",
    "Thane Station",
    "Mulund Check Naka",
    "Vartak Nagar",
    "Wagle Estate",
  ];

  const destinations = [
    "Dadar",
    "Andheri",
    "Powai",
    "BKC",
    "Ghatkopar",
  ];

  const rides = [];

  for (let i = 0; i < 12; i++) {
    const driver = users[i % users.length];

    const ride = await prisma.ride.create({
      data: {
        source: locations[i % locations.length],
        destination: destinations[i % destinations.length],
        date: faker.date
          .soon({ days: 7 })
          .toISOString()
          .slice(0, 10),
        time: `${String(8 + (i % 10)).padStart(2, "0")}:${i % 2 ? "30" : "00"}`,
        seatsAvailable: faker.number.int({
          min: 1,
          max: 4,
        }),
        notes: faker.helpers.arrayElement([
          "Can stop near the main road.",
          "Small luggage is fine.",
          "Leaving on time after lectures.",
          "Flexible pickup within 10 minutes.",
        ]),
        driverId: driver.id,
      },
    });

    rides.push(ride);
  }

  for (let i = 0; i < 8; i++) {
    const passenger = users[(i + 1) % users.length];
    const ride = rides[i % rides.length];

    if (ride.driverId === passenger.id) {
      continue;
    }

    await prisma.rideRequest.create({
      data: {
        rideId: ride.id,
        passengerId: passenger.id,
        status: i % 3 === 0 ? "ACCEPTED" : "PENDING",
      },
    });
  }

  await prisma.auditLog.create({
    data: {
      userId: users[0].id,
      action: "DATABASE_SEED",
      entityType: "SYSTEM",
      metadata: {
        users: users.length,
        rides: rides.length,
      },
    },
  });

  console.log(
    `Seeded ${users.length} users, ${rides.length} rides and demo requests.`,
  );

  console.log(
    "Demo password for seeded accounts: CampusRide123!",
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });