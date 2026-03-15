# Prop PNL

Bank-verified P&L tracking for prop traders.

## What It Does

Prop PNL connects to users' bank accounts via the Teller API, automatically categorizes prop firm transactions (deposits, payouts, fees), and generates a verified P&L report. It recognizes 50+ prop firms including FTMO, Topstep, The5ers, and Apex, as well as common payment processors like Rise, Wise, and Skrill. The platform includes a public leaderboard and shareable report links.

## Tech Stack

- **Next.js 15** (App Router, Turbopack)
- **TypeScript**
- **Supabase** (Postgres, Auth, Row-Level Security)
- **Teller API** (bank connections)
- **Stripe** (subscriptions)
- **Tailwind CSS**
- **Recharts** (charts)
- **Vitest** (testing)

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase project
- Teller API credentials
- Stripe account

### Installation

```bash
git clone <repo-url>
cd PropPNLTracker
npm install
```

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
TELLER_APPLICATION_ID=
TELLER_SIGNING_SECRET=
```

### Run

```bash
npm run dev
```

The app starts at `http://localhost:3000`.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run prettier-fix` | Format code with Prettier |
| `npm test` | Run tests (Vitest) |
| `npm run supabase:start` | Start local Supabase |
| `npm run supabase:push` | Push migrations to remote |
| `npm run supabase:generate-types` | Generate TypeScript types from DB schema |

## Testing

```bash
npm test
```

Runs the test suite with Vitest.
