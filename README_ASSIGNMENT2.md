# WayMate - Assignment 2 additions

These files extend the existing Assignment 1 project with Prisma, Better Auth, protected Route Handlers, Faker seeding, and Resend/React Email.

## Install
npm install

## Environment
Copy `.env.example` to `.env` and set DATABASE_URL. PostgreSQL is required by the assignment.

## Database
npm run db:generate
npm run db:migrate -- --name init
npm run db:seed

Useful commands:
- npm run db:reset
- npm run db:studio

Seeded demo accounts use:
- password: CampusRide123!
- Aarav Sharma is ADMIN
- the other seeded users are MEMBER

## Auth
- POST/GET `/api/auth/[...all]` is Better Auth.
- `/post`, `/my-rides`, `/profile` require login.
- ride mutation endpoints require login.

## Resend
Set RESEND_API_KEY and RESEND_FROM_EMAIL to enable email delivery. If the key is empty, the app still records the notification without sending an email, which keeps local development easy.

Set RESEND_WEBHOOK_SECRET after creating a Resend webhook pointing to `/api/webhooks/resend`.
