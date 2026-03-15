# Codebase Cleanup Plan

Prioritized list of changes to improve code quality and professionalism.

---

## Deployment

Staying on **Vercel** — best-in-class for Next.js. White-label with a custom domain to remove any platform branding. Vercel references in code have already been cleaned up.

---

## High Impact

### 1. Fix TypeScript type safety — DONE
- Removed all 40+ `any` types from production code
- Replaced `as unknown as` double-casts with proper types
- Fixed pre-existing type errors in Recharts components, fetch-data, refresh-data routes

### 2. Remove `eslint.ignoreDuringBuilds: true` — DONE
- Removed from `next.config.js`
- ESLint now runs during builds
- Added `@typescript-eslint/recommended` plugin with warn-level rules

### 3. Remove console.log statements — DONE
- Removed 130+ console.log/error/warn statements across 31 files
- Empty catch blocks left as `catch { }`

### 4. Add tests — DONE
- Added Vitest with 102 tests across 4 test files
- Covers: pnl-calculations, demo-leaderboard-data, helpers, sanitize

### 5. Break up large files — DONE
| File | Before | After | Reduction |
|------|--------|-------|-----------|
| `app/(public)/page.tsx` | 686 | 37 | -95% |
| `app/api/og/report/route.tsx` | 487 | 154 | -68% |
| `app/(public)/partner/PitchDeck.tsx` | 526 | 181 | -66% |
| `app/(authenticated)/settings/page.tsx` | 678 | 347 | -49% |
| `app/(public)/report/[token]/ReportContent.tsx` | 694 | 478 | -31% |

25+ new focused component files created.

---

## Medium Impact

### 6. Move inline styles to Tailwind config — DONE
- Added custom color tokens (`terminal.header`, `profit.light`, `loss.light`) to Tailwind config
- Added 5 gradient utilities (`bg-gradient-nav`, `bg-gradient-hero`, etc.)
- Replaced ~20 inline styles across 11 files
- Dynamic/computed styles and OG image routes left as inline (required)

### 7. Standardize error handling — DONE
- All `catch (error: any)` replaced with `catch (error: unknown)` or typed guards
- Zod validation provides typed error responses on API routes

### 8. Add API input validation — DONE
- Zod schemas added to 12 API routes (10 POST, 2 DELETE)
- Webhooks skipped (have their own signature verification)
- GET-only and body-less routes skipped

---

## Low Impact

### 9. Package.json metadata — DONE
- Added `"name": "prop-pnl"`, `"version": "1.0.0"`, `"engines": { "node": ">=18.0.0" }`

### 10. Stricter ESLint config — DONE
- Added `plugin:@typescript-eslint/recommended`
- Added rules: `no-console`, `no-explicit-any`, `no-unused-vars`, `import/order` (all warn level)

---

## Additional cleanup completed
- Removed 9 unused public assets, orphaned directories, dead code, template scripts
- Moved 10 markdown docs to `docs/`
- Deleted env example files
- Removed all Vercel branding from production code
- Uninstalled unused `lucide-react` package
- Removed unused exports from helpers, email, rate-limit, stripe/helpers
- Rewrote README for Prop PNL
- Added `tsconfig.tsbuildinfo` to `.gitignore`
