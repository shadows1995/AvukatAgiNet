# How to Revert Changes After Apple Review

Once your application has been approved by the Apple App Store, you can re-enable the Premium and Payment features for your web users and non-mobile app users.

## 1. Quick Revert (Recommended)

The entire logic is controlled by a single configuration flag.

1.  Open `config.ts` in the root of your project.
2.  Change `SHOW_PREMIUM_FEATURES` from `false` to `true`.

```typescript
// config.ts

// Set to true to ENABLE premium/payment features
export const SHOW_PREMIUM_FEATURES = true;
```

This single change will:
*   Show "Premium" links and badges in the Navbar for Desktop users.
*   Re-enable the `/premium` and `/payment` routes.
*   Show the "Premium ile Başvur" buttons on Job Cards.
*   Show the "Beta Welcome Modal" for new users.
*   Show the earnings charts and ads on the Home Page.
*   Show Premium stats on Auth and Profile pages.

**Note:** The application attempts to detect if it is running inside the Mobile App (`isMobileApp`). Even if `SHOW_PREMIUM_FEATURES` is `true`, specific "Upgrade" buttons may still remain hidden *inside the mobile app webview* to remain compliant, depending on the specific logic left in `Navbar.tsx` or `JobCard.tsx`. But for your website users, everything will return to normal.

## 2. Permanent Revert (Optional)

If you want to completely remove the logic added for the review:

1.  Delete `config.ts`.
2.  Search your codebase for `SHOW_PREMIUM_FEATURES` and remove the conditions check `&& SHOW_PREMIUM_FEATURES`.

Files modified:
*   `Navbar.tsx`
*   `App.tsx`
*   `HomePage.tsx`
*   `JobCard.tsx`
*   `pages/ProfilePage.tsx`

## 3. Revert Automatic Beta Premium Grant

During the review period, new users were automatically granted "Premium Plus (Beta)" status for 60 days to allow testing without payment. To revert this to the standard "Free" user flow:

1.  Open `pages/AuthPages.tsx`.
2.  Find the `handleSubmit` function in `RegisterPage`.
3.  Locate the `supabase.auth.signUp` call (around line 230).
4.  Remove the Premium/Beta fields from the `options.data` object:

```typescript
// pages/AuthPages.tsx

// CHANGE FROM:
const { data, error } = await supabase.auth.signUp({
  // ...
  options: {
    data: {
      // ...
      role: 'free',
      job_status: 'active',
      created_at: new Date().toISOString(),
      // Auto-activate Beta Premium for new users
      is_premium: true,
      membership_type: 'premium_plus',
      premium_plan: 'beta',
      premium_until: new Date().getTime() + (60 * 24 * 60 * 60 * 1000), // 60 Days
      premium_since: new Date().getTime(),
    }
  }
});

// CHANGE TO:
const { data, error } = await supabase.auth.signUp({
  // ...
  options: {
    data: {
      // ...
      role: 'free',
      job_status: 'active'
      // REMOVE all premium_* and is_premium fields
    }
  }
});
```


5.  (Optional) You can also check the `supabase.from('users').upsert` call further down, but the primary source of truth for the trigger is now the `signUp` metadata.

## 4. Revert Applicant Premium Indicators

In `pages/MyJobs.tsx`, we hid the "PREMIUM+" badging and highlighting for applicants to pass the review. To restore this:

1.  Open `pages/MyJobs.tsx`.
2.  Search for the `isPremiumPlus` logic inside the `applications.map` loop.
3.  Restore the styling condition:

```typescript
// pages/MyJobs.tsx

// CHANGE FROM:
const isPremiumPlus = false; // FOR_REVIEW: Force false to hide premium status

// CHANGE TO:
const isPremiumPlus = app.membershipType === 'premium_plus';
```

4.  Uncomment or restore the "PREMIUM+" badge rendering:

```typescript
// pages/MyJobs.tsx

// RESTORE THIS CODE BLOCK:
```

## 5. Revert Account Deletion Warning

In `pages/SettingsPage.tsx`, we hid the warning about Premium cancellation in the "Delete Account" tab. To restore this:

1.  Open `pages/SettingsPage.tsx`.
2.  Find the `DeleteAccountTab` component.
3.  Uncomment the list item about Premium membership:

```typescript
// pages/SettingsPage.tsx

// RESTORE THIS LINE:
{/* FOR_REVIEW: Hidden Premium Warning
```

## 6. Revert Informational Pages

The following pages were rewritten to remove all references to "Premium" membership and present the app as completely free:
*   `pages/AboutPage.tsx`
*   `pages/HowItWorksPage.tsx`
*   `pages/TermsOfUse.tsx`
*   `pages/DistanceSalesAgreementPage.tsx`

To restore the original content mentioning Premium memberships and pricing:

1.  Use `git` to checkout the version of these files from before the Apple Review submission.
    ```bash
    git checkout <commit-hash-before-review> -- pages/AboutPage.tsx pages/HowItWorksPage.tsx pages/TermsOfUse.tsx pages/DistanceSalesAgreementPage.tsx
    ```
2.  Alternatively, manually restore the "Premium" sections in `TermsOfUse.tsx` and `HowItWorksPage.tsx`.




