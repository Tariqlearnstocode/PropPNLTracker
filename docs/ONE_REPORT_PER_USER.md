# One Report Per User

This document describes the "one report per user" model: a single PNL report per user that aggregates data from all connected bank accounts.

## Overview

- **Before:** Each connected bank account had its own report row. Fetching multiple accounts wrote the same combined data to multiple rows; the UI suggested separate reports per account.
- **After:** Each user has exactly one report. All connected accounts’ transactions and metadata are stored in that report. Connecting more accounts or refreshing merges data into it; removing an account strips that account’s data from the report.

## User experience

1. **First connect** — User connects bank(s) via Teller and selects one or more accounts. They are redirected to their report. One report is created with all selected accounts’ data.
2. **Add account** — User goes to Settings → Add Account and connects another account. They are redirected to the same report; the new account’s data is merged in.
3. **Refresh** — Manual or automatic refresh pulls new transactions from every connected account and merges them into the single report.
4. **Remove account** — User deletes a connected account in Settings. That account disappears from the list; the report stays the same URL and token, but that account’s transactions (and manual assignments for those transactions) are removed.

## Database

- **Migration:** `supabase/migrations/20260202200000_one_report_per_user.sql`
- **Change:** `UNIQUE(user_id)` on `pnl_reports` so at most one report row per user.
- **`account_id`** on `pnl_reports` is nullable and no longer used to identify the report; the report is identified by `user_id` only.
- **`connected_accounts`** and **`manual_assignments`** (jsonb on `pnl_reports`) are unchanged.

## API and backend behavior

| Area | Behavior |
|------|----------|
| **fetch-data** | Looks up report by `user_id` only. If none, inserts one row with combined `raw_teller_data` (accounts + transactions) and `account_id: null`. If one exists, merges new transactions and accounts into it, preserves `manual_assignments`, recomputes `pnl_data`, updates that row. Upserts `connected_accounts` for each Teller account. Returns single `reportToken`. |
| **refresh-data** | For each account to refresh, fetches new transactions, loads the user’s single report by `user_id`, merges this account’s transactions and updates `raw_teller_data.accounts` (keeps all connected accounts). Updates the one report row and the refreshed account’s `connected_accounts` row. |
| **accounts/delete** | Loads the user’s single report by `user_id`. Removes the deleted account’s transactions from `raw_teller_data.transactions`, removes that account from `raw_teller_data.accounts`, removes affected keys from `manual_assignments`, recomputes `pnl_data`, updates the report. Deletes the `connected_accounts` row for that account. Does not delete any `pnl_reports` row. |
| **Teller webhook** | Resolves user by `connected_accounts` where `account_id` = webhook account; uses that `user_id` for subscription check and for updating `connected_accounts` (e.g. `needs_refresh`). No lookup by `account_id` on `pnl_reports`. |
| **accounts/list** | Returns only `connected_accounts` for the user. No join to reports; no `reports` or `reportCount` in the response. |
| **user/report-token** | Unchanged; returns the user’s single report token (one row per user). |
| **pnl/assignments** | Unchanged; reads/writes `manual_assignments` on the single report by report id. |

## Frontend

- **Settings** — Connected Bank Accounts lists synced accounts (name, type, last synced) and the Add Account button. “Back to Report” in the header goes to the user’s single report. No per-account “View Report” or report count.
- **Connect** — Unchanged; after fetch-data, redirects to `report/${reportToken}` (the single report).
- **Report page, share, OG** — Unchanged; load by `report_token`.

## Transaction and account merging

- **Transactions** are deduped by transaction `id`; newer data overwrites older when merging (e.g. refresh or add-account).
- **Accounts** in `raw_teller_data.accounts` are merged by account `id` so the report always reflects all connected accounts (or all minus removed ones after delete).
- **Manual assignments** are keyed by transaction id; when an account is deleted, assignments for that account’s transactions are removed from the report’s `manual_assignments`.

## Running the migration

Apply the migration with your usual Supabase workflow (e.g. `supabase db push` or run the SQL in the dashboard). The unique index will enforce one report per user; existing duplicate rows (if any) must be resolved before the migration can succeed.
