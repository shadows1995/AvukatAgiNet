
export enum UserRole {
  FREE = 'free',
  PREMIUM = 'premium',
  ADMIN = 'admin'
}

export enum JobType {
  DURUSMA = 'Duruşma',
  ICRA = 'İcra İşlemi',
  DOSYA_INCELEME = 'Dosya İnceleme',
  HACIZ = 'Haciz',
  DILEKCE = 'Dilekçe',
  DIGER = 'Diğer'
}

// Firestore User Collection Schema
export interface User {
  uid: string;
  email: string;
  fullName: string;
  baroNumber: string;
  baroCity: string;
  phone?: string;
  specializations?: string[];
  city: string;
  address?: string;
  preferredCourthouses?: string[];
  isPremium: boolean;
  membershipType?: 'free' | 'premium' | 'premium_plus';
  premiumUntil?: number; // timestamp
  premiumSince?: number; // timestamp
  premiumPlan?: 'monthly' | 'yearly';
  premiumPrice?: number;
  role: UserRole;
  rating: number;
  completedJobs: number;
  avatarUrl?: string;
  createdAt: any;
  updatedAt?: any;
  jobStatus?: 'active' | 'passive';
  aboutMe?: string;
  title?: string;
  billingAddress?: string;
  tcId?: string;
}

// Firestore Job Collection Schema
export interface Job {
  jobId?: string;
  title: string;
  createdBy: string;
  ownerName?: string;
  ownerPhone?: string;
  city: string;
  courthouse: string;
  date: string;
  time: string;
  jobType: JobType;
  description: string;
  offeredFee: number;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  applicationsCount: number;
  selectedApplicant?: string | null;
  createdAt: any;
  updatedAt?: any;
  // New fields for Application Flow
  isUrgent?: boolean; // Acil İlan (5 dk süre)
  applicationDeadline?: any; // Timestamp when the application period ends
  completedAt?: any; // Timestamp when the job was completed
}

export interface Application {
  applicationId?: string; // Made optional for creation
  jobId: string;
  applicantId: string;
  applicantName: string;
  message: string;
  proposedFee: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: any;
  // Denormalized fields for UI efficiency
  applicantPhone?: string;
  applicantRating?: number;
  membershipType?: 'free' | 'premium' | 'premium_plus';
}

export interface Notification {
  id?: string;
  userId: string; // Who receives the notification
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning';
  read: boolean;
  createdAt: any;
}