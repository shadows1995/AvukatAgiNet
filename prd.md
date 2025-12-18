# AvukatAğı - Product Requirements Document (PRD)

## 1. Introduction
AvukatAğı is a digital platform designed for lawyers to share and manage professional tasks (hearings, file reviews, execution proceedings, etc.) efficiently. The platform facilitates collaboration by allowing lawyers to post job listings, apply for tasks, and manage the completion process, supported by a subscription-based premium model.

## 2. User Personas
*   **Standard Lawyer (Free)**: Can view tasks, but with limitations (e.g., cannot apply to everything, limited visibility or delay). Can post 3 jobs per month.
*   **Premium Lawyer**: Unlimited access, instant notifications, priority support, can post unlimited jobs.
*   **Admin**: Manages the platform, users, job postings, and disputes.

## 3. Core Features & Functional Requirements

### 3.1 Authentication & User Management
*   **Sign Up/Login**: Email/Password authentication via Supabase.
*   **Profile**: Detailed profile including Baro Number, City, Specializations, and Avatar.
*   **Verification**: Email verification required. Telephone verification handled via SMS logic.
*   **Persistence**: JWT-based session management.

### 3.2 Job System (Task Management)
*   **Create Job**: Users can post jobs with details: Type (Duruşma, Haciz, etc.), City, Courthouse, Date, Time, Fee, Description.
*   **Job Listing**: Jobs are listed with filters (City, Type).
*   **Application Flow**:
    *   **Urgent Jobs**: 5-minute application window.
    *   **Standard Jobs**: 15-minute application window.
    *   **Timeout**: System automatically notifies the owner when the application window closes (via Cron).
*   **Job Status Workflow**:
    *   `Open`: Accepting applications.
    *   `In Progress`: Applicant selected and approved.
    *   `Completed`: Task finished by applicant.
    *   `Cancelled`: Removed by owner.
*   **RSS Feed**: `/rss` endpoint exposes open jobs for external integrations (Zapier/Telegram).

### 3.3 Premium Membership & Payments
*   **Subscription Models**: Monthly and Yearly plans.
*   **Payment Gateway**: **Garanti BBVA Virtual POS (3D Secure)**.
*   **Flow**:
    1.  User selects plan.
    2.  Backend generates 3D Secure form data (`/api/payment/initiate`).
    3.  Frontend submits form to Garanti.
    4.  Garanti callbacks to `/api/payment/callback/success` or `/fail`.
*   **Expiry**: Automated cron job checks for expiring memberships daily and sends push notifications.

### 3.4 Notifications & Communication
The system employs a multi-channel notification strategy:
*   **SMS (NetGSM)**:
    *   Verification codes.
    *   "Application Approved" alerts to applicants.
    *   Custom admin messages.
*   **Push Notifications (Firebase/FCM)**:
    *   New Job alerts (filtered by Courthouse preference).
    *   Application status updates.
    *   Premium expiry warnings.
    *   Admin-triggered custom pushes (Segmented by City/Premium status).
*   **Telegram Integration**:
    *   Bot for users to link accounts.
    *   Real-time notifications sent to linked Telegram chats.

### 3.5 Admin Dashboard
*   **Metrics**: View daily/total stats for Jobs, Users, Premium subscriptions.
*   **Management**:
    *   **Bot Control**: Toggle "Job Bot" (automated job generator for activity simulation/testing).
    *   **Push Sender**: UI to send manual push notifications to user segments (e.g., "All Premium Users in Istanbul").
*   **Disputes**: View and resolve reported tasks.

### 3.6 Automated Services (Cron Jobs)
*   **Job Bot**: Runs every 2 minutes (if enabled) to create synthetic activity.
*   **Application Window Watcher**: Runs every minute to identify jobs where the application period (5/15m) has ended and notifies the owner.
*   **Premium Expiry**: Runs daily at 10:00 AM.

## 4. Technical Stack
*   **Frontend**: React (Vite), TailwindCSS, Lucide Icons.
*   **Backend**: Node.js / Express (handling API, Cron, and Payment callbacks).
*   **Database**: Supabase (PostgreSQL) + RLS Policies.
*   **Storage**: Supabase Storage (Avatars, etc.).
*   **Hosting**: Server-based (Backend needs persistent process for Cron).

## 5. Security Requirements
*   **RLS (Row Level Security)**: Strict Supabase policies to ensure users only access their own data or public job data options.
*   **Payment Security**: 3D Secure implementation with hash verification.
*   **Admin Access**: Protected routes and backend verification for admin actions.

## 6. Future Considerations
*   **Mobile App**: Expo-based mobile app works in tandem with the web platform.
*   **Dispute Resolution**: Enhanced UI for handling task conflicts.
