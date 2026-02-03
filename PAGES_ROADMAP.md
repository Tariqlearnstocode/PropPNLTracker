# Pages Roadmap

Strategy for new pages on Prop PNL. Ordered by impact and ease of implementation.

---

## Current pages

| Route | Purpose |
|-------|---------|
| `/` | Landing page |
| `/pricing` | Plans & comparison |
| `/security` | Security & privacy policy |
| `/disclaimers` | Legal disclaimers |
| `/report/[token]` | Shareable PNL report |
| `/share/[token]` | Alternative share URL |
| `/connect` | Bank connection flow (auth) |
| `/settings` | Account management (auth) |

---

## Phase 1: High-impact, low-effort

### 1. Supported Firms page (`/firms`)

**What**: A simple, static-ish page listing every prop firm Prop PNL can detect and categorize. Not a full directory — just "these are the firms we track." Similar to how SmartPropFirm lists partner firms with cards, but simpler: no affiliate deals, no reviews, just a grid of firms with logos and basic info.

**Why build this**:
- **SEO**: Every firm name becomes an indexable keyword ("Topstep P&L tracker," "FTMO fee tracking," etc.)
- **Trust**: Visitors landing from a specific firm want to see it listed before connecting their bank
- **Conversion**: Reduces "does this work with my firm?" friction — a major objection
- **Content foundation**: Each firm card can later link to a dedicated firm page or guide

**Structure**:
```
/firms (grid of all supported firms)
```

**Per-firm card** (data-driven, one array):
- Firm name
- Logo (or placeholder)
- Payout processor (Rise, Wise, Stripe, etc.)
- Detection status: "Auto-detected" or "Manual tag"
- Optional: one-line note ("Payouts via Rise, fees via Stripe")

**Data source**: A single `firms.ts` config file with an array of objects. Easy to maintain — just add to the array as new firms are supported.

**Example firms to include** (from the existing matching logic):
- Topstep
- FTMO
- The5ers
- Rise (payout processor)
- Wise (payout processor)
- Apex Trader Funding
- MyFundedFutures (now MyFundedFX)
- Earn2Trade
- Bulenox
- TradeDay
- TakeProfitTrader
- Tradeify
- FundedNext
- Leeloo Trading
- Elite Trader Funding
- BluSky Trading

**Implementation**: Static page, server-rendered. One data file, one page component. Can ship in a single session.

---

### 2. Leaderboard page (`/leaderboard`)

**What**: A public page showing anonymized (or opt-in named) top performers by verified bank P&L. Users who share their report publicly could opt into appearing on the leaderboard.

**Why build this**:
- **Viral loop**: Traders are competitive. Leaderboard rank is shareable on Twitter/Discord
- **Social proof**: "Real traders, real bank-verified numbers" — proves the product works
- **Differentiation**: No competitor has a bank-verified leaderboard. Every other leaderboard is self-reported or platform-reported
- **Retention**: Users come back to check rank, keep their subscription active to stay on the board

**Structure**:
```
/leaderboard (public page, no auth required)
```

**Display**:
- Rank, display name (or anonymous), net P&L, number of firms, months tracked
- Badge: "Bank-verified" on every row (this IS the differentiator)
- Time filters: All time, last 12 months, last 3 months
- Opt-in only — users toggle leaderboard visibility in settings
- Link to their public report if they've enabled sharing

**Data requirements**:
- New column on user/report: `show_on_leaderboard` (boolean, default false)
- New column: `leaderboard_display_name` (string, default "Anonymous Trader")
- API endpoint: `GET /api/leaderboard` — returns ranked list of opted-in users
- Cache aggressively (refresh hourly or on sync)

**Privacy**: Only show data the user has explicitly opted to share. No PII by default.

---

### 3. Blog (`/blog`)

**What**: MDX-based blog for SEO content, guides, and product updates.

**Why build this**:
- **SEO**: Long-tail keywords around prop trading, P&L tracking, tax guides, firm comparisons
- **Authority**: Positions Prop PNL as the expert in prop firm profitability
- **Content marketing flywheel**: Blog posts → organic traffic → signups → more data → more content

**Structure**:
```
/blog (list page)
/blog/[slug] (individual post)
```

**Tech**: MDX files in a `/content/blog` directory. Use `next-mdx-remote` or `contentlayer` for parsing. Each file has frontmatter (title, date, description, tags, author). Server-rendered, static generation.

**Starter content ideas** (ordered by SEO value):

1. **"Are You Actually Profitable? How to Calculate Your Real Prop Firm P&L"**
   - Target: "prop firm profitability," "prop firm P&L calculator"
   - Format: Guide with examples, links to free report

2. **"The True Cost of Prop Firm Trading: Fees Most Traders Forget"**
   - Target: "prop firm fees," "prop firm hidden costs," "prop firm reset fees"
   - Format: Breakdown of all fee types with real numbers

3. **"Prop Firm Taxes: What Traders Need to Know"**
   - Target: "prop firm taxes," "do I pay taxes on prop firm profits"
   - Format: Tax guide, self-employment tax surprise, CSV export plug

4. **"Topstep vs FTMO vs The5ers: Real P&L Comparison"**
   - Target: firm comparison keywords
   - Format: Data-driven comparison using anonymized aggregate data

5. **"How to Track P&L Across Multiple Prop Firms"**
   - Target: "track prop firm P&L," "prop firm spreadsheet"
   - Format: Problem → manual methods → Prop PNL as solution

---

## Phase 2: Medium effort, strong SEO

### 4. Prop Firm Guide (`/guide` or `/learn`)

**What**: An evergreen educational hub explaining how prop firms work, with a focus on the financial side (costs, payouts, profitability math).

**Why build this**:
- **Top-of-funnel SEO**: Captures traders researching prop firms before they need P&L tracking
- **Authority**: "The prop firm profitability guide" — positions Prop PNL as the source of truth
- **Conversion path**: Guide reader → realizes they need to track P&L → free report CTA

**Structure**:
```
/guide (hub page with links to all sections)
/guide/how-prop-firms-work
/guide/prop-firm-fees-explained
/guide/calculating-real-pnl
/guide/choosing-a-prop-firm
/guide/prop-firm-taxes
```

**Difference from blog**: The guide is evergreen, structured, and interlinked. Blog posts are timely and standalone. The guide is a reference; the blog is a feed.

---

### 5. Individual Firm Pages (`/firms/[slug]`)

**What**: Dedicated pages for each supported prop firm — how Prop PNL detects their transactions, what payout processor they use, typical fee structure.

**Why build this**:
- **Long-tail SEO**: "Topstep P&L tracker," "FTMO fee tracking," "Apex payout tracking"
- **Conversion**: Trader Googles "[firm name] P&L" → lands on firm page → signs up
- **Programmatic SEO**: Generate from the same `firms.ts` data file, scale to 20+ pages

**Structure**:
```
/firms/topstep
/firms/ftmo
/firms/the5ers
/firms/apex-trader-funding
...
```

**Per-page content** (template-driven):
- Firm name, logo, brief description
- How Prop PNL detects their transactions
- Payout processor used
- Typical fee types (challenge, reset, activation, data)
- "Track your [Firm] P&L" CTA
- Link back to `/firms` grid

**Implementation**: Programmatic — one `[slug]/page.tsx` template, data from `firms.ts`. Can generate 15-20 pages from one template.

---

### 6. Compare page (`/compare`)

**What**: Side-by-side comparison of Prop PNL vs alternatives (Prop Firm Tracker, spreadsheets, manual tracking).

**Why build this**:
- **Bottom-of-funnel SEO**: "prop firm tracker alternative," "prop firm P&L tracker comparison"
- **Conversion**: Visitors comparing tools are high-intent
- **Differentiation**: The bank connection advantage is most obvious in a comparison table

**Structure**:
```
/compare (Prop PNL vs alternatives)
/compare/prop-firm-tracker (specific competitor comparison — optional)
```

**Key comparison points**:
| Feature | Prop PNL | Prop Firm Tracker | Spreadsheet |
|---------|----------|-------------------|-------------|
| Data source | Bank (automatic) | Manual entry | Manual entry |
| Setup time | ~60 seconds | Hours | Hours |
| Missed transactions | None (bank is truth) | Common | Common |
| Multi-firm | Automatic detection | Manual tagging | Manual |
| Shareable proof | Bank-verified link | Screenshot | Screenshot |
| Tax export | CSV/PDF | PDF | Manual |
| Price | Free / $14.99/mo | $5/mo | Free |

---

## Phase 3: Community & growth loops

### 7. Public Reports Feed (`/reports` or `/community`)

**What**: A feed of public, bank-verified reports from opted-in users. Think "proof feed."

**Why**: Social proof at scale. Every shared report is a mini case study. Creates a browsable gallery of real prop firm results.

---

### 8. Affiliate / Referral page (`/refer`)

**What**: Referral program where existing users earn credit or free months for referring new users.

**Why**: Prop trading communities are tight-knit. Word-of-mouth is the primary distribution channel. A referral program with the leaderboard creates a double viral loop.

---

### 9. Changelog (`/changelog`)

**What**: Simple log of product updates, new firm support, and feature releases.

**Why**: Shows the product is alive and improving. Reduces "is this maintained?" concern. Good for re-engagement emails.

---

## Priority matrix

| Page | SEO Value | Conversion Impact | Build Effort | Priority |
|------|-----------|-------------------|--------------|----------|
| `/firms` (grid) | High | High | Low | **Ship first** |
| `/leaderboard` | Medium | High | Medium | **Ship second** |
| `/blog` (infrastructure) | High | Medium | Medium | **Ship third** |
| `/guide` (hub) | High | Medium | Medium | Phase 2 |
| `/firms/[slug]` (individual) | Very High | High | Low (template) | Phase 2 |
| `/compare` | High | Very High | Low | Phase 2 |
| `/reports` feed | Medium | High | Medium | Phase 3 |
| `/refer` | Low | High | Medium | Phase 3 |
| `/changelog` | Low | Low | Very Low | Whenever |

---

## Firm data structure (shared across pages)

All firm-related pages (`/firms`, `/firms/[slug]`, leaderboard filters, blog references) should pull from one canonical data file:

```ts
// lib/firms.ts
export const SUPPORTED_FIRMS = [
  {
    slug: 'topstep',
    name: 'Topstep',
    logo: '/firms/topstep.svg', // or null for placeholder
    payoutProcessor: 'Rise',
    feeProcessor: 'Stripe',
    detection: 'auto',
    description: 'Futures prop firm with evaluation-based funding.',
    typicalFees: ['Challenge fee', 'Reset fee', 'Data feed'],
    website: 'https://topstep.com',
  },
  // ... more firms
] as const;
```

This single source of truth powers:
- The `/firms` grid page
- Individual `/firms/[slug]` pages (programmatic SEO)
- The trust bar check marks on the landing page
- The firm detection logic display
- Blog post references

---

## Notes

- **SmartPropFirm model**: They list partner firms as deal cards with discount codes and affiliate links. Our `/firms` page is different — it's "firms we detect and track," not "firms we promote." This is more trustworthy and aligns with the bank-verified positioning. However, affiliate partnerships could be added later as a revenue stream.
- **Leaderboard uniqueness**: No other prop firm tool has a bank-verified leaderboard. This is a genuine first-mover advantage and could become the primary growth driver if it gets traction on trading Twitter/Discord.
- **Blog vs Guide**: Keep these separate. Blog = timely, opinion, updates. Guide = evergreen, structured, reference. Both link to each other but serve different search intents.
