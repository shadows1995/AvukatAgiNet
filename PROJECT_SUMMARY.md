# AvukatAğı (AvukatAgiNet) — Comprehensive Project & Architecture Documentation

## 1. Project Overview
**AvukatAğı** (`avukatagi.net`) is a full-stack legal task delegation (*tevkil*) platform built for lawyers in Turkey. It enables lawyers to post courthouse (*Adliye İçi*) or outside (*Adliye Dışı*) legal tasks (hearings, enforcement actions, file reviews, petitions, etc.), receive applications from colleagues in those cities/courthouses within a timed window (5 minutes for urgent tasks, 15 minutes for standard tasks), assign tasks, track earnings, and receive instant multi-channel notifications (SMS, Telegram, Push, and In-App).

---

## 2. Technology Stack
* **Frontend:** React 19, TypeScript, Vite 6, React Router v7 (`BrowserRouter`), Tailwind CSS, Lucide Icons, Recharts (analytics/earnings visualization), `react-helmet-async` (SEO).
* **Backend:** Node.js (Express 5), compiled from TypeScript (`src/server.ts` -> `src/server.js`) via `tsconfig.server.json`.
* **Database & Auth:** Supabase (PostgreSQL, Supabase Auth, Realtime Postgres Changes, Row-Level Security, Edge Functions).
* **Integrations & External Services:**
  * **Garanti BBVA Virtual POS (GVPS):** 3D Secure (`3d_pay` / `DT` form flow) and direct XML sale API for Premium / Premium+ subscriptions.
  * **NetGSM XML API:** Automated SMS delivery for newly opened jobs in monitored courthouses and application approval notifications.
  * **Telegram Bot API (`@AvukatAgiBot` & `@avukatagitevkil`):** Account linking via 6-digit one-time codes (`telegram_link_codes`), private notifications, and global channel announcements.
  * **Google Gemini AI (`@google/genai` / `@google/generative-ai`):** Powers the automated **Job Bot** (`src/services/jobBot.ts`) to generate realistic legal task titles, descriptions, and fees.
  * **Mailtrap Bulk API:** Marketing email campaigns managed from the Admin Panel (`/admin/marketing`).
  * **Mobile WebView & Push Notifications:** Native iOS/Android WebView detection (`hooks/useMobileApp.ts`), global `window.registerPushToken` bridge, and Supabase Edge Function (`supabase/functions/send-push`) for Expo/APNs/FCM push notifications.

---

## 3. Directory & File Structure

```text
AvukatAgiNet/
├── App.tsx                         # Main router, Supabase session & profile loader, push token bridge, Beta promo modal
├── config.ts                       # Feature flags (SHOW_PREMIUM_FEATURES, IS_BETA_PROMO_ACTIVE)
├── types.ts                        # Core TypeScript interfaces (User, Job, Application, Notification, JobType, UserRole)
├── supabaseClient.ts               # Frontend Supabase client (uses VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY)
├── Dockerfile                      # 2-stage Docker build (Vite frontend build + tsc server build -> Node 20 Alpine on port 80)
├── deploy.sh                       # Production VPS deployment script (/root/AvukatAgiNet)
├── tsconfig.json                   # Frontend TypeScript configuration
├── tsconfig.server.json            # Backend TypeScript configuration (compiles src/ and data/)
├── data/
│   └── courthouses.ts (.js)        # All 81 Turkish cities (TURKISH_CITIES) and their courthouses (COURTHOUSES)
├── components/
│   ├── Navbar.tsx                  # Top navigation, realtime notification bell dropdown, mobile menu, Premium status modal
│   ├── Footer.tsx                  # Footer links (shown on public/landing routes)
│   ├── JobCard.tsx                 # Job card on Dashboard with live countdown timer (5m/15m) & Apply button
│   ├── ApplyModal.tsx              # Modal for submitting a job application with a custom message & proposed fee
│   ├── BetaWelcomeModal.tsx        # 2-month free Beta Premium+ activation modal
│   ├── ProfileCompletionModal.tsx  # Prompts users missing phone, courthouses, or specializations
│   ├── RatingModal.tsx             # Post-job completion lawyer rating & review modal
│   ├── RequireAdmin.tsx            # Route guard restricting /admin/* to users with role === 'admin'
│   ├── InteractiveSphere.tsx       # 3D canvas animation on the HomePage hero banner
│   ├── SEO.tsx                     # Dynamic meta tags via react-helmet-async
│   └── Toast.tsx                   # Notification toast UI
├── contexts/
│   ├── AlertContext.tsx            # Global confirmation/alert modal provider
│   └── NotificationContext.tsx     # Global toast notification provider
├── hooks/
│   └── useMobileApp.ts             # Detects mobile app WebView via User-Agent / URL params / localStorage
├── pages/
│   ├── AuthPages.tsx               # LandingPage (/), LoginPage (/login), RegisterPage (/register), Forgot/Reset Password
│   ├── HomePage.tsx                # User dashboard (/home): KPIs, Earnings charts, Live feed ("AvukatAğı Gündem"), Archive
│   ├── Dashboard.tsx               # Open Jobs board (/dashboard): Realtime job list filtered by user's courthouses & Turkey time
│   ├── CreateJob.tsx               # Create Job form (/create-job): Courthouse vs. Outside, fee rules, urgent toggle, daily limit (10)
│   ├── MyJobs.tsx                  # Created Jobs (/my-jobs): Countdown timer, applicant review & sorting, job assignment
│   ├── AcceptedJobs.tsx            # Assigned Jobs (/accepted-jobs): Contact owner (WhatsApp/Phone), complete task, rate owner
│   ├── JobDetails.tsx              # Single job view (/job/:jobId): Details, apply, complete, or cancel job
│   ├── SettingsPage.tsx            # User settings (/settings): Personal info, courthouses, notifications (SMS/Telegram), referrals, password, delete account
│   ├── ProfilePage.tsx             # Public/colleague lawyer profile (/profile/:userId)
│   ├── PremiumPage.tsx             # Membership tiers (/premium): Premium vs. Premium+ (Monthly/Yearly)
│   ├── Payment.tsx                 # Credit card & billing form (/payment) initiating Garanti 3D Secure flow
│   ├── PaymentSuccessPage.tsx      # Post-3D Secure success landing page (/payment-success)
│   ├── PaymentFailedPage.tsx       # Post-3D Secure failure landing page (/payment-failed)
│   ├── TaskDisputePage.tsx         # Dispute submission page (/task-dispute)
│   └── admin/                      # Admin Panel (/admin, /admin/jobs, /admin/users, /admin/disputes, /admin/marketing, /admin/security)
└── src/
    ├── server.ts (.js)             # Express production server: API routes, cron jobs, static dist/ serving
    ├── garantiClient.cts (.cjs)    # Direct Garanti XML sale client
    └── services/
        ├── garantiPaymentService.ts# Garanti BBVA 3D Secure hash generation & callback verification
        ├── geminiService.ts        # Gemini AI prompt & JSON generator for realistic legal tasks
        ├── jobBot.ts               # Automated cron bot creating jobs on weekdays (09:00-18:00 TR time)
        ├── marketingService.ts     # Automated daily AI marketing email campaign engine & rotation service
        ├── notificationService.ts  # NetGSM SMS & Telegram notification fan-out for new jobs
        ├── pushService.ts          # Invokes Supabase send-push Edge Function for mobile push notifications
        └── telegramService.ts      # Telegram Bot HTTP wrapper (sendTelegramMessage, setTelegramWebhook)
```

---

## 4. Core System Workflows & Business Logic

### 4.1. Authentication & User Profiles
1. **Supabase Auth** handles email/password login, signup, and password recovery.
2. On login or page load (`App.tsx`), `fetchUserProfile(uid)` queries `public.users` where `uid = session.user.id`.
   * If the profile row is missing (`PGRST116`), the app automatically signs the user out and alerts them to prevent a broken session state.
3. **Membership Tiers (`membership_type` & `role`):**
   * **`free`**: Can create jobs and browse the platform, but cannot apply to open jobs when `SHOW_PREMIUM_FEATURES = true`.
   * **`premium`**: Can monitor courthouses within **1 city** and apply to open jobs.
   * **`premium_plus`**: Can monitor courthouses across **multiple cities** (Beta trial users get 2 months of `premium_plus` with up to 2 cities), receives highlighted priority placement at the top of applicant lists in `MyJobs.tsx`, and displays specializations on applications.
   * **`admin` (`role = 'admin'`)**: Full access to `/admin/*`, bypasses the 10-job daily creation limit, and sees **all** open jobs across Turkey on `/dashboard` regardless of `preferred_courthouses`.

### 4.2. Job Creation Flow (`pages/CreateJob.tsx`)
1. **Location Mode:**
   * **Adliye İçi (`courthouse`):** User selects a city (`TURKISH_CITIES`), a courthouse from `COURTHOUSES[city]`, a `JobType` (*Duruşma, İcra İşlemi, Dosya İnceleme, Haciz, Dilekçe, Diğer*), and a minimum fee enforced by job type (*Duruşma*: min 900 TL, *Haciz/Dosya İnceleme*: min 700 TL, *İcra*: min 600 TL, *Dilekçe*: min 500 TL).
   * **Adliye Dışı (`outside`):** Job type is locked to `Diğer`, location is a free-text input (e.g., notary, land registry, police station), and fee is a custom number input.
2. **Validation:**
   * **Daily Limit:** Non-admin users can create at most **10 jobs per day**.
   * **Date/Time Check:** Parses `date` and `time` in **Turkey Time (`UTC+03:00`)** and rejects dates in the past.
3. **Application Window (`application_deadline`):**
   * Standard jobs: `created_at + 15 minutes`.
   * Urgent jobs (`is_urgent = true`, Premium feature): `created_at + 5 minutes`.
4. **Notification Fan-Out (`POST /api/notify-new-job`):**
   * Immediately after inserting into `public.jobs`, the frontend triggers `/api/notify-new-job`, which:
     * Sends **SMS via NetGSM** and **Telegram messages** (`notificationService.ts`) to users monitoring that courthouse (using Turkish-aware diacritic normalization and parenthesis stripping).
     * Broadcasts to the global Telegram channel (`TELEGRAM_GLOBAL_CHAT_ID`).
     * Triggers **Mobile Push Notifications** (`sendNewJobPush` in `src/server.ts`) to users whose `preferred_courthouses` contains the job's courthouse.

### 4.3. Dashboard & Job Filtering Logic (`pages/Dashboard.tsx`)
1. Fetches up to 1,000 non-cancelled jobs from `public.jobs` ordered by `created_at DESC` and subscribes to `postgres_changes` on `public.jobs` for live updates.
2. Filters jobs client-side (`filteredJobs`):
   * **Creator Exclusion:** Hides jobs created by the logged-in user (`job.createdBy === user.uid`). Users manage their own jobs on `/my-jobs`.
   * **Status Filter:** Only shows jobs where `job.status === 'open'`.
   * **Job Type Filter:** Filters by `JobType` if selected in the dropdown.
   * **Courthouse / City Filter (for non-admins):**
     * If `job.courthouse` is a standard courthouse in `COURTHOUSES[job.city]`, checks `user.preferredCourthouses.includes(job.courthouse)`.
     * If `job.courthouse` is *Adliye Dışı* (`isOutside`), shows the job if the user's `city === job.city` OR if the user monitors any courthouse in `job.city`.
   * **Expiration Filter (Turkey Time `UTC+03:00`):**
     * Parses `job.date` (`YYYY-MM-DD` or `DD.MM.YYYY`) and `job.time` (`HH:MM` or `HH:MM:SS`) explicitly as `${YYYY}-${MM}-${DD}T${HH}:${mm}:${ss}+03:00`.
     * Hides the job if `jobDate < now` (unless the user is the creator or `selectedApplicant`).

### 4.4. Application, Assignment & Reward Flow (`MyJobs.tsx` & `/api/jobs/assign`)
1. Lawyers apply to open jobs via `ApplyModal.tsx` while the 5m/15m countdown (`application_deadline`) is active.
2. While the countdown is running, the job owner sees a timer (`Seçim İçin: MM:SS`) on `/my-jobs` and cannot assign an applicant yet—giving all lawyers a fair window to apply.
3. Once the 5m/15m window closes:
   * A backend cron job notifies the owner via push notification that the application period has ended.
   * The owner opens **Başvuruları Yönet** on `/my-jobs`.
   * Applicants are sorted by:
     1. `membershipType === 'premium_plus'` first.
     2. Ascending `monthlyJobCount` (from `user_monthly_stats`) so lawyers who have taken fewer jobs this month get priority.
     3. Fairness rule: Applicants whose `monthlyJobCount` exceeds `minJobCount + 3` are marked `SEÇİLEMEZ` (restricted).
4. When the owner clicks **Görevi Ver**, `POST /api/jobs/assign` executes:
   * Updates `jobs.status = 'in_progress'` and `jobs.selected_applicant = applicantId`.
   * Marks the chosen application as `accepted` and others as `rejected`.
   * **Tevkil Verin Kazanın Reward:** Automatically extends the **job owner's** Premium membership by **+15 days** (`premium_until += 15 days`).
   * Sends in-app notifications, SMS (`/api/notify-application-approved`), and Push notifications to the selected lawyer, unlocking contact details (Phone & WhatsApp) for both parties.

### 4.5. Automated Job Bot (`src/services/jobBot.ts`)
* Scheduled via `node-cron` in `src/server.ts` to run every 20 minutes (`*/20 * * * *`).
* Checks `system_settings` table for `key = 'job_bot_enabled'`.
* **Operating Rules:**
  * Only runs Monday–Friday (no weekends) between **09:00 and 17:59 Turkey Time (`Europe/Istanbul`)**.
  * Picks 3 random courthouses across Turkey and uses **Google Gemini** (`geminiService.ts`) to generate realistic lawyer tasks scheduled for **tomorrow's date**.
  * Inserts the job under `bot@avukatagi.net` with a `555xxxxxxx` phone number and a 15-minute `application_deadline`.
  * On `JobCard.tsx`, once a bot job's 15-minute window expires, it displays `"Görev Atandı: A. Y."` (deterministic initials from `jobId`) so the board looks active and organic.

### 4.6. Automated AI Email Marketing Engine (`src/services/marketingService.ts` & `/admin/marketing`)
* **State Persistence:** Stored in `public.system_settings` under `key = 'marketing_campaign_state'`, while the recipient list lives in `public.marketing_emails` (`email`, `first_name`, `last_name`, `sent`, `sent_at`).
* **Daily Automated Sending (`0 * * * *` cron in `src/server.ts`):**
  * Checks hourly between **10:00 and 18:00 Turkey Time**. If `autoSendEnabled === true` and `sentTodayCount < dailyLimit` (default `100` emails/day), automatically sends the active campaign email (`subject`, `html`, `text`) via Mailtrap Bulk API (`https://bulk.api.mailtrap.io/api/send`) to the next `unsent` (`sent = false`) recipients and marks them `sent = true`.
* **Automatic AI Campaign Rotation When List Finishes (`unsent === 0`):**
  * As soon as every recipient in `marketing_emails` has received the current campaign (`remainingUnsent === 0`), the engine automatically archives the finished campaign into `history`, increments `campaignNumber`, generates a **new persuasive email** highlighting a **different feature/side of AvukatAğı** (using Gemini AI `gemini-2.5-flash` with an automatic 7-angle built-in Turkish lawyer campaign library fallback), and resets `sent = false` across `marketing_emails` so the next cycle begins the following day.
* **Dynamic Recipient List (`POST /api/admin/marketing-add-emails`):**
  * Admins can paste new email addresses (or `email, first_name, last_name` CSV lines) directly in `/admin/marketing`. Existing emails preserve their current `sent` state (`ignoreDuplicates: true`), while new emails are inserted with `sent = false` so they immediately join the active queue.

---

## 5. GitHub & Production Deployment Workflow

### 5.1. Git Repository Details
* **Remote Repository:** `https://github.com/shadows1995/AvukatAgiNet` (`origin`)
* **Primary Branch:** `main`

### 5.2. Step-by-Step Workflow After Making Code Changes

#### Step 1: Compile Backend TypeScript (If Backend Files Changed)
Because the Docker container and `npm run server` run `src/server.js`, any changes made to `.ts` files in `src/` or `data/` should be compiled (Note: `Dockerfile` also runs `npx tsc --project tsconfig.server.json` automatically during `docker build`):
```bash
npx tsc --project tsconfig.server.json
```

#### Step 2: Verify Frontend Build Locally (Optional Sanity Check)
```bash
npm run build
```

#### Step 3: Stage, Commit, and Push Changes to GitHub
```bash
# 1. Check modified files
git status

# 2. Stage the modified files
git add <files>   # or: git add .

# 3. Commit with a descriptive message
git commit -m "fix: parse job dates in Turkey timezone (+03:00) on Dashboard, MyJobs, and CreateJob"

# 4. Push to GitHub (origin/main)
git push origin main
```

#### Step 4: Deploy on the Production VPS Server
Once pushed to `https://github.com/shadows1995/AvukatAgiNet` (`main` branch), SSH into the production Linux server and run `/root/AvukatAgiNet/deploy.sh`:
```bash
cd /root/AvukatAgiNet
./deploy.sh
```
**What `deploy.sh` & `Dockerfile` do automatically on the server:**
1. Verifies `/root/AvukatAgiNet/.env` exists.
2. Runs `git pull` to fetch the latest commit from `origin/main`.
3. Runs `docker build --no-cache -t avukat-agi:latest .`:
   * **Stage 1 (`build`):** Installs dependencies, runs `npm run build` (producing `dist/`), and runs `npx tsc --project tsconfig.server.json` (compiling `src/` and `data/`).
   * **Stage 2 (`production`):** Copies `dist/`, `src/`, `data/`, and `scripts/` into a clean `node:20-alpine` image, sets `ENV PORT=80`, and sets entrypoint `CMD ["node", "src/server.js"]`.
4. Stops and removes the old `avukat-agi-container`.
5. Starts the new container mounting `.env` and mapping port `80:80`:
   ```bash
   docker run -d --name avukat-agi-container -p 80:80 -v "$(pwd)/.env:/app/.env" avukat-agi:latest
   ```
6. To inspect live server logs after deployment:
   ```bash
   docker logs -f avukat-agi-container
   ```

