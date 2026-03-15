# Prop Firm PNL Tracker - Product & Business Model

## Positioning

### One-Click Bank-Verified Stats
> "Connect your bank. Get your PNL. That's it."

### Automated Prop Trading P&L Tracking
> "Track all your prop firm payouts and fees automatically. See your real profit and loss broken down by month."

**Target Market:** Prop traders who trade with multiple prop firms and need to track their overall P&L across all accounts, payouts, and fees.

---

## Core Value Proposition

**1 Click. Bank Verified Stats!!!**

Instead of manually tracking:
- Which prop firm paid out
- How much you paid in fees/subscriptions
- Your net profit across all firms
- Monthly breakdowns

Just connect your bank account(s) and get instant, accurate PNL reports.

---

## Features

### Core Functionality

#### 1. Bank Account Connection
- **Connect via Teller** - Same secure bank connection as income verifier
- **Multiple accounts supported** - Connect checking, savings, or multiple accounts
- **Auto-sync** - Transactions sync automatically (or on-demand refresh)
- **Secure & Private** - Bank credentials never stored, direct API connection

#### 2. Prop Firm Transaction Matching

**Incoming Deposits (Profits/Payouts):**
- Match deposits from **common prop firm names** (e.g., FTMO, TopStep, Apex, MyForexFunds, etc.)
- Match deposits via **Rise** - Popular payout processor used by prop firms
- Match deposits via **Wise** (formerly TransferWise) - Common international payout method
- Match deposits via **other payment processors** commonly used by prop firms

**Outgoing Payments (Fees/Costs):**
- Match payments to **prop firm subscriptions/challenges** (e.g., FTMO Challenge, TopStep Evaluation, etc.)
- Match payments via **Rise** - Fee payments
- Match payments via **Wise** - Fee payments
- Track recurring subscription fees
- Track one-time challenge fees

#### 3. PNL Calculation & Reporting

**Monthly Breakdown:**
- Total deposits (profits/payouts) per month
- Total payments (fees/costs) per month
- Net PNL per month (deposits - payments)
- Running total PNL
- Year-to-date summary

**Per-Prop-Firm Breakdown:**
- PNL by individual prop firm
- Deposits received from each firm
- Fees paid to each firm
- Net profit/loss per firm

**Transaction Details:**
- Full transaction history
- Matched transactions (verified prop firm activity)
- Unmatched transactions (manual review)
- Transaction search and filtering
- Export to CSV/PDF

#### 4. Multi-Account Support
- Connect multiple bank accounts
- Aggregate PNL across all accounts
- Per-account breakdown
- Unified dashboard view

#### 5. Real-Time Updates
- Automatic transaction sync
- Manual refresh option
- Historical data analysis (3+ months of history)
- Continuous monitoring

---

## Business Model

### Target Users

**Primary:** Active prop traders trading with multiple firms
- Need to track overall profitability
- Want automated tracking vs. manual spreadsheets
- Value time savings and accuracy

**Secondary:** Serious prop traders
- Trade with 1-2 firms but want detailed tracking
- Need tax reporting data
- Want to analyze profitability trends

---

## Pricing Structure

---

## Feature Comparison

### Free trial
- ✅ 1 bank account connection
- ✅ 3 months transaction history
- ✅ Advanced prop firm matching (names + Rise + Wise)
- ✅ Monthly PNL breakdown
- ✅ Per-prop-firm PNL breakdown
- ✅ Enhanced dashboard with charts
- ✅ CSV/PDF export
- ✅ Transaction search & filters
- ✅ Shareble public link 
- ❌ Transactions update
- 

### Pro ($14.99/mo) ⭐ (79 yearly)
- ✅ Connect up to 5 bank accounts
- ✅ 12 month transaction history
- ✅ Advanced prop firm matching (names + Rise + Wise)
- ✅ Monthly PNL breakdown
- ✅ Per-prop-firm PNL breakdown
- ✅ Enhanced dashboard with charts
- ✅ CSV/PDF export
- ✅ Transaction search & filters
- ✅ Shareble public link 
- ✅ Transactions update weekly 


### One time pull $19.99
- ✅ Connect up to 5 bank accounts
- ✅ 12 month transaction history
- ✅ Advanced prop firm matching (names + Rise + Wise)
- ✅ Monthly PNL breakdown
- ✅ Per-prop-firm PNL breakdown
- ✅ Enhanced dashboard with charts
- ✅ CSV/PDF export
- ✅ Transaction search & filters
- ✅ Shareble public link 




---

## Key Differentiators

| Us | Manual Tracking | Other Tools |
|----|-----------------|-------------|
| **1-click bank connection** | Manual entry | Manual import |
| **Automatic matching** | Manual categorization | Basic rules |
| **Multi-account aggregation** | Separate tracking | Limited support |
| **Prop firm specific** | Generic | Generic expense tracking |
| **Monthly breakdowns** | Manual calculations | Limited reporting |
| **$14.99/mo or $19.99 one-time** | Free but time-consuming | $50+/mo (enterprise tools) |
| **Bank-verified data** | Self-reported | Self-reported |

---

## Prop Firm Matching Strategy

### Phase 1: Common Prop Firm Names
Build database of known prop firms:
- FTMO
- TopStep
- Apex
- MyForexFunds
- FundedNext
- Apex Trader Funding
- SurgeTrader
- Earn2Trade
- And 50+ more...

### Phase 2: Payment Processors
- **Rise** - Very common for prop firm payouts
- **Wise** (TransferWise) - International payouts
- **Stripe** - Some firms use for payments
- **Payoneer** - International payouts
- **Skrill** - Some firms use
- Pattern matching for these processors

### Phase 3: Advanced Matching
- Fuzzy matching for variations in names
- Amount-based heuristics (e.g., round numbers = payouts)
- Date-based patterns (e.g., monthly subscription fees)
- User-defined custom matching rules (Power plan)

---

## Implementation Considerations

### Technical Reuse from Income Verifier
- ✅ Teller API integration (already built)
- ✅ Bank account connection flow
- ✅ Transaction fetching and storage
- ✅ Supabase database structure
- ✅ Authentication system
- ✅ Stripe payment integration
- ✅ Multi-account support (can extend current architecture)

### New Requirements
- 🔨 Prop firm name database and matching logic
- 🔨 Rise/Wise payment processor detection
- 🔨 PNL calculation engine (different from income calculations)
- 🔨 Monthly breakdown reporting
- 🔨 Per-firm aggregation
- 🔨 Custom matching rules (Power plan)
- 🔨 Enhanced dashboard with PNL-specific visualizations

### Database Changes Needed
- New table: `connected_accounts` (reuse from income verifier pattern)
- New table: `prop_firm_matches` (known firm names/patterns)
- New table: `pnl_transactions` (categorized transactions)
- New table: `pnl_reports` (monthly summaries)
- Extend user table for subscription tier

---

## Competitive Landscape

**Direct Competitors:**
- None identified (prop trading PNL tracking is underserved)

**Indirect Competitors:**
- Manual spreadsheets (most common)
- Generic expense tracking apps (Mint, YNAB, etc.)
- Accounting software (QuickBooks, etc.)

**Our Edge:**
- Purpose-built for prop traders
- Automatic matching for prop firms
- Bank-verified data (no manual entry)
- Affordable pricing ($9.99-$39.99/mo)
- Simple, focused UI

---

## Success Metrics

### User Acquisition
- Sign-ups per month
- Free trial → paid conversion rate
- Account connection success rate

### Engagement
- Active users (logged in past 30 days)
- Accounts connected per user
- Reports generated per user
- Sync frequency

### Revenue
- MRR (Monthly Recurring Revenue)
- Average revenue per user (ARPU)
- Churn rate
- Lifetime value (LTV)

### Product
- Matching accuracy rate
- Unmatched transactions % (should be low)
- Support tickets
- Feature usage

---

## Go-to-Market Strategy

### Phase 1: Launch
- Target: Prop trading communities (Reddit, Discord, forums)
- Positioning: "Stop using spreadsheets. Automate your PNL tracking."
- Pricing: Launch discount (e.g., 50% off first 3 months)

### Phase 2: Growth
- Content marketing: Blog posts about prop trading P&L, tax implications
- Partnerships: Prop trading educators, YouTubers
- Referral program: "Refer a friend, get 1 month free"

### Phase 3: Scale
- Paid advertising (Google Ads, social media)
- API partnerships with prop firms
- White-label option for prop firms to offer to their traders

---

## Future Enhancements

### Phase 2 Features
- [ ] Tax export (Form 1099-ready formats)
- [ ] Email reports (weekly/monthly summaries)
- [ ] Mobile app (iOS/Android)
- [ ] Goal tracking (e.g., "Reach $10k PNL this year")
- [ ] Performance analytics (win rate, average payout, etc.)

### Phase 3 Features
- [ ] API access for third-party integrations
- [ ] Webhooks for real-time updates
- [ ] Multi-currency support
- [ ] Co-trading account support (share with partner)
- [ ] Historical backtesting ("What if I traded with X firm?")

### Phase 4 Features
- [ ] Direct prop firm integrations (if partnerships form)
- [ ] White-label solution for prop firms
- [ ] Advanced analytics and insights
- [ ] Trading journal integration

---

## Risk Considerations

### Technical Risks
- **Teller API changes** - Mitigation: Monitor API updates, have fallback plan
- **Matching accuracy** - Mitigation: Start conservative, allow manual adjustments
- **Multi-account complexity** - Mitigation: Phase rollout, extensive testing

### Business Risks
- **Low market size** - Mitigation: Prop trading is growing, target early adopters
- **Competition** - Mitigation: First-mover advantage, build strong moat (data + accuracy)
- **Pricing sensitivity** - Mitigation: Start with freemium or low entry price

### User Experience Risks
- **Bank connection friction** - Mitigation: Clear instructions, support docs
- **Matching confusion** - Mitigation: Clear UI showing matched/unmatched, allow manual fixes
- **Privacy concerns** - Mitigation: Clear privacy policy, encrypted storage, no data sharing

---

## Next Steps

1. **Validate pricing** - Survey prop traders, test price points
2. **Build MVP** - Core features: bank connection, basic matching, monthly PNL
3. **Beta test** - 10-20 users, gather feedback
4. **Launch** - Start with Pro plan, add tiers based on demand
5. **Iterate** - Add features based on user feedback
