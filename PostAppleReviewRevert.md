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
*   `pages/AuthPages.tsx`
*   `pages/ProfilePage.tsx`
