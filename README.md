# CampusRide

CampusRide is a simple Assignment 1 Next.js app for a student carpool and ride-sharing platform. It uses mock ride data only.

## Run

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Assignment 1 Notes

- Built with Next.js App Router, TypeScript, Tailwind CSS, shadcn-style UI components, and Radix primitives.
- Most route files in `app/` are Server Components. They load static mock ride data and pass it down as props.
- Client Components are used only where browser state or events are needed: theme switching, ride filters, joining rides, My Rides state, and the Post Ride form.
- `next-themes` is mounted in `components/theme-provider.tsx`, and `app/layout.tsx` uses `suppressHydrationWarning` on `<html>` to avoid theme hydration mismatch.
- Zustand stores persisted filter values, the selected ride, and joined rides in `lib/store.ts`.
- The Post Ride form uses `react-hook-form` with the shared Zod schema in `lib/schema.ts`; the Server Action in `app/actions.ts` validates with the same schema.
- Assignment 2 items like Prisma, database storage, auth, email, and external backend frameworks are intentionally not included.
