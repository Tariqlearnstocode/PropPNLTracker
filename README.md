# Prop Firm PNL Tracker

Automated Profit & Loss tracking for prop traders. Connect your bank account and get instant, bank-verified PNL reports across all your prop firm accounts.

## Overview

Prop Firm PNL Tracker automatically categorizes your banking transactions to track payouts from prop firms and fees paid to them, giving you a complete picture of your profitability across all trading accounts.

**Key Benefit:** Stop manually tracking spreadsheets. Connect your bank and get automated PNL reports.

## Features

### Core Functionality

- **Bank Account Connection** - Secure connection via Teller API (bank credentials never stored)
- **Automatic Prop Firm Matching** - Intelligent detection of:
  - Direct prop firm deposits (FTMO, TopStep, The5ers, MyForexFunds, etc.)
  - Payment processor transactions (Rise, Wise, Skrill)
  - Pattern matching for prop-firm-related transactions
- **PNL Reporting**:
  - Monthly breakdown of deposits, fees, and net PNL
  - Per-prop-firm breakdown showing profitability by firm
  - Transaction history with search and filtering
- **Manual Assignment** - Assign unmatched transactions to prop firms for accurate tracking
- **Bulk Operations** - Select and assign multiple transactions at once
- **Shareable Reports** - Generate shareable public links for your PNL reports
- **Multi-Account Support** - Connect multiple bank accounts and aggregate data

### User Experience

- Real-time client-side updates (no page refresh needed)
- Transaction search by amount and description
- Detailed transaction views with confidence levels
- Export capabilities (CSV/PDF)
- Responsive design for all devices

## Tech Stack

- **Framework:** Next.js 15 with React 18
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Banking API:** Teller Connect
- **Payments:** Stripe
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Language:** TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- Teller API credentials
- Stripe account (for payments)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Tariqlearnstocode/PropPNLTracker.git
cd PropPNLTracker
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Configure the following in `.env.local`:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Teller API
TELLER_APPLICATION_ID=your_teller_app_id
TELLER_SIGNING_KEY=your_teller_signing_key
TELLER_ENVIRONMENT=sandbox # or production

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Set up the database:
```bash
# Start Supabase locally (optional for local development)
npm run supabase:start

# Run migrations
npm run supabase:push
```

5. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Development

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run prettier-fix` - Format code with Prettier

### Supabase Commands

- `npm run supabase:start` - Start local Supabase instance
- `npm run supabase:stop` - Stop local Supabase instance
- `npm run supabase:status` - Check Supabase status
- `npm run supabase:reset` - Reset local database
- `npm run supabase:push` - Push migrations to remote
- `npm run supabase:generate-types` - Generate TypeScript types from database schema

## Project Structure

```
├── app/                          # Next.js app directory
│   ├── (authenticated)/         # Protected routes
│   ├── (public)/                # Public routes
│   │   ├── report/[token]/     # Shareable report pages
│   │   ├── pricing/            # Pricing page
│   │   └── security/           # Security information
│   └── api/                     # API routes
│       ├── pnl/                # PNL calculation endpoints
│       ├── teller/             # Teller API integration
│       └── stripe/             # Stripe payment handling
├── components/                   # React components
│   ├── ui/                     # Reusable UI components
│   └── icons/                  # Icon components
├── lib/                         # Core business logic
│   ├── pnl-calculations.ts     # PNL calculation engine
│   └── stripe/                 # Stripe utilities
├── utils/                       # Utility functions
│   └── supabase/               # Supabase client helpers
├── supabase/                    # Database files
│   └── migrations/             # Database migrations
└── public/                      # Static assets
```

## Key Components

### PNL Calculation Engine (`lib/pnl-calculations.ts`)
- Prop firm name matching
- Payment processor detection
- Pattern matching for prop-firm-related transactions
- PNL calculation and aggregation
- Monthly and per-firm breakdowns

### Transaction Matching
The system automatically matches transactions using:
1. **Direct Name Matching** - Recognizes 50+ prop firm names
2. **Payment Processor Detection** - Identifies transactions via Rise, Wise, Skrill
3. **Pattern Matching** - Detects generic prop-firm patterns (e.g., "funded", "challenge", "evaluation")
4. **Manual Assignment** - Users can assign unmatched transactions to specific firms

### Database Schema

Main tables:
- `pnl_reports` - Stores PNL report data and manual assignments
- `users` - User accounts and subscription information
- `connected_accounts` - Linked bank accounts via Teller

## Security

- Bank credentials are never stored (direct API connection via Teller)
- All sensitive data encrypted at rest
- Secure authentication via Supabase Auth
- Row-level security policies on database tables
- Secure API endpoints with authentication checks

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

See [LICENSE](LICENSE) file for details.

## Support

For issues, questions, or feature requests, please open an issue on GitHub.

---

Built with ❤️ for prop traders who want to focus on trading, not tracking.
