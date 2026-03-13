# Daily Teller Transaction Refresh Implementation Plan

## Overview
Implement daily transaction updates for subscription users (monthly/annual) while keeping the connect/disconnect model for one-time payment users. Teller charges **$0.30 per month per enrollment** for transaction subscriptions.

## Current State Analysis

### Existing Infrastructure
1. **Database Tables:**
   - `connected_accounts`: Tracks enrolled accounts with `enrollment_id`, `enrollment_status`, `last_synced_at`, `needs_refresh`
   - `stripe_subscriptions`: Tracks user subscription status
   - `teller_webhook_events`: Stores webhook events for audit

2. **Current Flow:**
   - Users connect via Teller Connect → Get `access_token`
   - Fetch transactions via `/api/pnl/fetch-data`
   - **Currently disconnects ALL accounts** after fetch (line 374-396 in `fetch-data/route.ts`)
   - Webhook handler marks `needs_refresh` but can't actually refresh (no tokens stored)

3. **Key Files:**
   - `app/api/pnl/fetch-data/route.ts` - Main fetch endpoint (disconnects after fetch)
   - `app/api/webhooks/teller/route.ts` - Handles Teller webhooks
   - `lib/stripe/helpers.ts` - Subscription checking (`getActiveSubscription`)
   - `app/(authenticated)/connect/page.tsx` - Connect UI

## Requirements

### For Subscription Users (Monthly/Annual)
1. **Keep enrollments active** - Don't disconnect after initial fetch
2. **Store encrypted access tokens** - Required for refreshing transactions
3. **Daily refresh button** - Limit to once per day per account
4. **Auto-sync from webhooks** - When Teller sends `transactions.processed` webhook
5. **Cost**: $0.30/month per enrollment (billed by Teller)

### For One-Time Payment Users
1. **Keep current behavior** - Connect → Fetch → Disconnect
2. **No token storage** - Not needed for one-time users
3. **No daily refresh** - Must reconnect to refresh data

## Implementation Plan

### Phase 1: Database Schema Updates

#### 1.1 Add Access Token Storage
**File:** Create new migration `supabase/migrations/20260120000000_add_teller_tokens.sql`

```sql
-- Add encrypted access token storage for subscription users
ALTER TABLE connected_accounts
  ADD COLUMN IF NOT EXISTS encrypted_access_token text, -- Encrypted access token
  ADD COLUMN IF NOT EXISTS token_encrypted_at timestamptz, -- When token was encrypted
  ADD COLUMN IF NOT EXISTS last_refresh_attempt timestamptz, -- Track refresh attempts
  ADD COLUMN IF NOT EXISTS can_refresh_daily boolean DEFAULT false; -- Whether user can refresh daily

-- Index for daily refresh queries
CREATE INDEX IF NOT EXISTS connected_accounts_refresh_check_idx 
  ON connected_accounts(user_id, last_refresh_attempt) 
  WHERE can_refresh_daily = true;
```

**Security Considerations:**
- Use environment variable for encryption key (e.g., `TELLER_TOKEN_ENCRYPTION_KEY`)
- Use AES-256-GCM encryption
- Never log decrypted tokens
- Encrypt at rest in database

#### 1.2 Update RLS Policies
- Ensure `encrypted_access_token` is only accessible by service role (admin operations)
- Users can query if they can refresh but not see tokens

---

### Phase 2: Encryption Utility

#### 2.1 Create Token Encryption Helper
**File:** `utils/teller-token-encryption.ts` (new file)

```typescript
import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const KEY_LENGTH = 32;

function getEncryptionKey(): Buffer {
  const key = process.env.TELLER_TOKEN_ENCRYPTION_KEY;
  if (!key) {
    throw new Error('TELLER_TOKEN_ENCRYPTION_KEY environment variable is required');
  }
  // Derive key from environment variable using PBKDF2
  return crypto.pbkdf2Sync(key, 'teller-token-salt', 100000, KEY_LENGTH, 'sha512');
}

export function encryptToken(token: string): string {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(token, 'utf8');
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  const tag = cipher.getAuthTag();
  
  // Combine: salt + iv + tag + encrypted
  const result = Buffer.concat([iv, tag, encrypted]);
  return result.toString('base64');
}

export function decryptToken(encryptedToken: string): string {
  const key = getEncryptionKey();
  const tokenBuffer = Buffer.from(encryptedToken, 'base64');
  
  const iv = tokenBuffer.slice(0, IV_LENGTH);
  const tag = tokenBuffer.slice(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
  const encrypted = tokenBuffer.slice(IV_LENGTH + TAG_LENGTH);
  
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);
  
  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  
  return decrypted.toString('utf8');
}
```

---

### Phase 3: Update Fetch Data Endpoint

#### 3.1 Modify `/api/pnl/fetch-data/route.ts`

**Key Changes:**

1. **Check subscription status BEFORE disconnecting:**
   ```typescript
   // Line ~159: Check subscription
   const subscription = await getActiveSubscription(user.id);
   const hasSubscription = !!subscription;
   
   // Store token if subscription user
   if (hasSubscription && access_token) {
     // Encrypt and store token
     const encryptedToken = encryptToken(access_token);
     // Store in connected_accounts (see Phase 1)
   }
   ```

2. **Conditional Disconnect Logic (replace lines 374-396):**
   ```typescript
   // 8. Delete account connections (Teller charges per active enrollment)
   // ONLY disconnect for one-time payment users
   // Subscription users keep enrollments active for daily refresh
   if (!hasSubscription) {
     console.log(`Disconnecting ${accounts.length} account(s) from Teller (one-time user)...`);
     
     // Existing disconnect logic here
     // ...
   } else {
     console.log(`Keeping ${accounts.length} enrollment(s) active for subscription user (daily refresh enabled)`);
     
     // Update connected_accounts to mark as refresh-enabled
     await Promise.all(
       accounts.map(async (account: any) => {
         await supabaseAdmin
           .from('connected_accounts')
           .update({
             encrypted_access_token: encryptToken(access_token),
             token_encrypted_at: new Date().toISOString(),
             can_refresh_daily: true,
             enrollment_status: 'connected',
           })
           .eq('user_id', user.id)
           .eq('account_id', account.id);
       })
     );
   }
   ```

3. **Store enrollment_id from account data:**
   - Teller account objects include `enrollment_id`
   - Already storing it (line 346), ensure it's preserved

---

### Phase 4: Daily Refresh Endpoint

#### 4.1 Create/Update Refresh Endpoint
**File:** `app/api/pnl/refresh-data/route.ts` (new file)

**Features:**
1. Check if user has active subscription
2. Check if user already refreshed today (rate limit: once per day)
3. Decrypt stored access token
4. Fetch new transactions from last_synced_at
5. Merge with existing transactions
6. Update last_refresh_attempt timestamp

**Pseudo-code:**
```typescript
export async function POST(request: NextRequest) {
  // 1. Authenticate user
  // 2. Check subscription status
  // 3. Get connected accounts for user (can_refresh_daily = true)
  // 4. For each account:
  //    a. Check last_refresh_attempt - if today, return error
  //    b. Decrypt access_token
  //    c. Call Teller API for new transactions
  //    d. Merge with existing data (similar to fetch-data logic)
  //    e. Update last_refresh_attempt
  // 5. Return success/updated data
}
```

**Rate Limiting:**
- Check `last_refresh_attempt` date - if same day, return 429 with message
- Error message: "You can refresh your data once per day. Last refreshed: [timestamp]"

---

### Phase 5: Frontend - Refresh Button

#### 5.1 Update Report Header
**File:** `components/report/controls/ReportHeader.tsx`

**Add:**
1. **Refresh Button** - Next to "Last updated" or in controls area
2. **State Management:**
   - Loading state during refresh
   - Disabled state if already refreshed today
   - Success/error toast notifications
3. **Subscription Check:**
   - Only show refresh button if user has subscription
   - Hide for one-time payment users

**Implementation:**
```typescript
// Add to ReportHeader props
onRefreshData?: () => Promise<void>;
canRefreshDaily?: boolean;
lastRefreshAttempt?: string;

// Add button in UI
{canRefreshDaily && (
  <button
    onClick={handleRefresh}
    disabled={isRefreshing || hasRefreshedToday}
    className="..."
  >
    {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
  </button>
)}
```

#### 5.2 Update Report Page
**File:** `app/(public)/report/[token]/ReportContent.tsx` or similar

**Add:**
1. Check subscription status on page load
2. Fetch `can_refresh_daily` and `last_refresh_attempt` from API
3. Pass to ReportHeader component
4. Implement refresh handler that calls `/api/pnl/refresh-data`

---

### Phase 6: Webhook Auto-Refresh

#### 6.1 Update Webhook Handler
**File:** `app/api/webhooks/teller/route.ts`

**Current State:**
- `handleTransactionsProcessed` marks `needs_refresh = true` (line 159)
- Can't actually refresh because no tokens stored

**Changes:**
1. **Check if account has stored token:**
   ```typescript
   // In handleTransactionsProcessed
   const { data: connectedAccount } = await supabaseAdmin
     .from('connected_accounts')
     .select('encrypted_access_token, can_refresh_daily, user_id')
     .eq('account_id', account_id)
     .single();
   
   if (!connectedAccount?.encrypted_access_token || !connectedAccount.can_refresh_daily) {
     console.log('Account does not support auto-refresh, skipping');
     return;
   }
   ```

2. **Trigger Actual Refresh:**
   - Decrypt token
   - Call Teller API for new transactions
   - Merge with existing data
   - Update report

**OR** simpler approach:
- Mark `needs_refresh = true` (existing)
- User sees indicator on next login
- User clicks refresh button to pull updates

**Recommendation:** Start with indicator approach, add auto-refresh in Phase 7.

---

### Phase 7: User Experience Enhancements

#### 7.1 Refresh Status Indicators
- Show badge/indicator if `needs_refresh = true`
- Display "New transactions available" message
- Show last refresh time clearly

#### 7.2 Connect Page Updates
**File:** `app/(authenticated)/connect/page.tsx`

**Changes:**
1. **Different messaging for subscription vs one-time:**
   - Subscription: "Connect your bank for daily updates"
   - One-time: "Connect your bank for one-time report"

2. **Show existing connections:**
   - List connected accounts
   - Show last sync time
   - Show refresh status

---

### Phase 8: Settings/Account Management

#### 8.1 Disconnect Functionality
**File:** `app/api/accounts/delete/route.ts` (existing)

**Update:**
1. If subscription user:
   - Delete encrypted token from database
   - Disconnect from Teller API (DELETE /accounts/{id})
   - Set `can_refresh_daily = false`
   - Set `enrollment_status = 'disconnected'`

2. If one-time user:
   - Keep existing behavior

#### 8.2 Settings Page
**File:** `app/(authenticated)/settings/page.tsx`

**Add:**
1. **Connected Accounts Section:**
   - List all connected accounts
   - Show enrollment status
   - Show last refresh time
   - Disconnect button
   - Reconnect button if disconnected

---

## Security Considerations

### 1. Token Encryption
- ✅ Use AES-256-GCM (authenticated encryption)
- ✅ Store encryption key in environment variable
- ✅ Never log decrypted tokens
- ✅ Rotate encryption key periodically (requires re-encryption of all tokens)

### 2. Rate Limiting
- ✅ Daily refresh limit (once per day)
- ✅ Existing rate limits on fetch endpoint (5/hour)
- ✅ Webhook rate limiting (prevent spam)

### 3. Access Control
- ✅ RLS policies prevent users from accessing others' tokens
- ✅ Service role only for decryption operations
- ✅ Verify subscription before allowing daily refresh

### 4. Token Lifecycle
- ✅ Tokens expire (Teller access tokens have expiration)
- ✅ Handle token refresh via Teller API if available
- ✅ Clean up tokens when subscription ends

---

## Testing Plan

### Unit Tests
1. Token encryption/decryption
2. Daily refresh rate limiting
3. Subscription checking logic

### Integration Tests
1. Full refresh flow (subscription user)
2. Disconnect flow (subscription user)
3. One-time user flow (unchanged)
4. Webhook handling

### Manual Testing
1. Connect account as subscription user
2. Verify token is stored (encrypted)
3. Verify enrollment is NOT disconnected
4. Click refresh button (should work)
5. Click refresh button again (should be rate limited)
6. Wait 24 hours, refresh should work again
7. Disconnect account, verify cleanup

---

## Migration Strategy

### Step 1: Deploy Phase 1 (Database)
- Add columns to `connected_accounts`
- No breaking changes, backward compatible

### Step 2: Deploy Phase 2 (Encryption)
- Add encryption utility
- Not used yet, safe to deploy

### Step 3: Deploy Phase 3 (Conditional Disconnect)
- **IMPORTANT:** This changes behavior for subscription users
- Test thoroughly before production
- Monitor for any disconnection issues

### Step 4: Deploy Phase 4 (Refresh Endpoint)
- New endpoint, doesn't affect existing flows
- Can deploy behind feature flag

### Step 5: Deploy Phase 5 (Frontend)
- Add refresh button
- Only visible to subscription users
- No impact on one-time users

### Step 6: Deploy Phase 6 (Webhooks)
- Enhanced webhook handling
- Backward compatible (just adds auto-refresh capability)

---

## Rollback Plan

If issues arise:

1. **Phase 3 Rollback:**
   - Revert to always disconnecting (comment out subscription check)
   - Subscription users will need to reconnect (one-time impact)

2. **Token Storage Issues:**
   - Remove `encrypted_access_token` requirement
   - Fall back to requiring re-authentication for refresh

3. **Rate Limiting Issues:**
   - Increase daily limit to test
   - Add manual override for testing

---

## Cost Analysis

### Current Cost (One-Time Users)
- $0.30 per enrollment per month
- Only charged during active enrollment (connect → fetch → disconnect = < 1 minute)
- **Cost: ~$0.005 per verification** (assuming enrollments last 1 minute)

### New Cost (Subscription Users)
- $0.30 per enrollment per month
- Enrollments stay active for entire subscription period
- **Cost: $0.30/month per connected account**

### Example Scenarios
- 100 subscription users, 1 account each = **$30/month**
- 1000 subscription users, 1 account each = **$300/month**

**Recommendation:**
- Consider passing cost to users (add to subscription price)
- Or absorb as cost of doing business (value-add feature)

---

## Future Enhancements

### Phase 9: Batch Refresh
- Refresh multiple accounts in one API call
- More efficient for users with multiple accounts

### Phase 10: Scheduled Auto-Refresh
- Cron job to refresh all subscription accounts daily
- Users don't need to click button
- More seamless experience

### Phase 11: Refresh History
- Track all refresh attempts
- Show refresh timeline in UI
- Debugging and analytics

### Phase 12: Token Refresh
- Handle Teller token expiration
- Automatic re-authentication flow
- Seamless user experience

---

## Success Metrics

1. **Adoption:**
   - % of subscription users who use daily refresh
   - Average refreshes per user per month

2. **Reliability:**
   - Success rate of refresh operations
   - Error rate and types

3. **Cost:**
   - Total Teller enrollment costs
   - Cost per active subscription user

4. **User Satisfaction:**
   - Feedback on refresh feature
   - Support tickets related to refresh

---

## Timeline Estimate

- **Phase 1-2:** 2-3 days (Database + Encryption)
- **Phase 3:** 2-3 days (Fetch endpoint updates)
- **Phase 4:** 3-4 days (Refresh endpoint)
- **Phase 5:** 2-3 days (Frontend button)
- **Phase 6:** 2-3 days (Webhook enhancements)
- **Phase 7-8:** 2-3 days (UX improvements)

**Total: ~15-20 days** (depending on testing and iteration)

---

## Open Questions

1. **Token Expiration:**
   - Do Teller access tokens expire?
   - If yes, how do we handle refresh?
   - Need to verify with Teller documentation

2. **Multi-Account Support:**
   - User connects multiple accounts
   - Each account = separate enrollment = $0.30/month each
   - Should we limit accounts per user?

3. **Subscription Cancellation:**
   - What happens when subscription ends?
   - Auto-disconnect enrollments?
   - Keep data but disable refresh?

4. **Error Handling:**
   - What if token decryption fails?
   - What if Teller API returns error?
   - Retry logic?

5. **Edge Cases:**
   - User upgrades from one-time to subscription mid-session
   - User downgrades from subscription to one-time
   - Account gets disconnected by bank (not user)

---

## Next Steps

1. **Review and approve this plan**
2. **Set up encryption key** in environment variables
3. **Start with Phase 1** (database migration)
4. **Test encryption utility** thoroughly
5. **Proceed with implementation** phase by phase
