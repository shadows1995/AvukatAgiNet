# Apple Review Changes

This file documents all changes made to the codebase to comply with Apple App Store review guidelines. These changes hide premium/payment features in the mobile webview version.

## Changes to Revert (Post-App Store Approval if desired)

### 1. New File: hooks/useMobileApp.ts
- Created to detect mobile webview environment using `window.ReactNativeWebView` or `sessionStorage`.

### 2. File: components/Navbar.tsx
- Integrated `useMobileApp`.
- Hidden "Premium" navigation link for non-premium users on mobile.
- Hidden "Premium" status badge/button for premium users on mobile.

### 3. File: pages/JobDetails.tsx
- Integrated `useMobileApp`.
- Replaced the "Upgrade to Premium" prompts with a generic block message: "Your account does not have access to this feature" when a non-premium user views a job detail on mobile.

### 4. File: pages/PremiumPage.tsx
- Integrated `useMobileApp`.
- Completely replaced page content with the block message "Your account does not have access to this feature" if accessed on mobile.

### 5. File: pages/Payment.tsx
- Integrated `useMobileApp`.
- Completely replaced page content with the block message "Your account does not have access to this feature" if accessed on mobile.

### 6. File: pages/CreateJob.tsx
- Integrated `useMobileApp`.
- Modified "Urgent Job" checkbox (Premium feature):
    - On mobile, if a non-premium user checks it, they see an alert "Your account does not have access to this feature" instead of an upsell confirmation dialog.
- Hidden the "PREMIUM" text badge next to the generic "Urgent Job" label on mobile.

### 7. File: pages/HomePage.tsx
- Integrated `useMobileApp`.
- Hidden "Kazanç Grafiği" (Earnings Chart) and "Adliye Dağılımı" (Pie Chart) on mobile if the user is not premium.
    - Prevents displaying the "Premium ile Kazancınızı Takip Edin" upsell overlay.

### 8. File: components/JobCard.tsx
- Integrated `useMobileApp`.
- If on mobile and user is non-premium:
    - Display "Bu göreve başvuramazsın" instead of "Premium ile Başvur".
    - Disable the application button.
    - Show an alert "Bu göreve başvuramazsın" if clicked (defensive check).

## Summary of Strategy
The strategy relies on the `useMobileApp` hook returning `true` inside the React Native Webview.
- **Frontend Only:** All changes are client-side.
- **Compliance:** Removed all direct links to payment, "Upgrade" buttons, and pricing information on the mobile interface.
- **User Feedback:** Replaced upsells with a neutral "Access Denied" message to avoid confusing the user while satisfying Apple's "No external links or hidden buy buttons" policy.
