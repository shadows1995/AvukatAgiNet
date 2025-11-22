import {
    collection, getDocs, doc, getDoc, updateDoc, deleteDoc,
    query, where, orderBy, limit, addDoc, serverTimestamp
} from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';

// Helper to create audit logs directly in Firestore
const createAuditLog = async (action: string, targetType: string, targetId: string, details: any = {}) => {
    try {
        const user = auth.currentUser;
        if (!user) return;

        await addDoc(collection(db, 'admin_audit_logs'), {
            timestamp: serverTimestamp(),
            adminId: user.uid,
            adminEmail: user.email,
            action,
            targetType,
            targetId,
            ...details
        });
    } catch (error) {
        console.error('Error creating audit log:', error);
    }
};

export const adminApi = {
    async getUsers(filters: any) {
        let q = collection(db, 'users');
        const snapshot = await getDocs(q);
        let users = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));

        // Client-side filtering
        if (filters.role) {
            users = users.filter((u: any) => u.role === filters.role);
        }
        if (filters.accountStatus) {
            users = users.filter((u: any) => u.accountStatus === filters.accountStatus);
        }
        if (filters.searchQuery) {
            const search = filters.searchQuery.toLowerCase();
            users = users.filter((u: any) =>
                u.email?.toLowerCase().includes(search) ||
                u.fullName?.toLowerCase().includes(search)
            );
        }

        // Pagination logic
        const page = Number(filters.page) || 1;
        const limitVal = Number(filters.limit) || 20;
        const startIndex = (page - 1) * limitVal;
        const paginatedUsers = users.slice(startIndex, startIndex + limitVal);

        return {
            users: paginatedUsers,
            total: users.length,
            page,
            totalPages: Math.ceil(users.length / limitVal)
        };
    },

    async getUserDetail(userId: string) {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (!userDoc.exists()) throw new Error('User not found');
        const user = { uid: userDoc.id, ...userDoc.data() };

        // Stats
        const jobsRef = collection(db, 'jobs');
        const createdSnap = await getDocs(query(jobsRef, where('createdBy', '==', userId)));
        const completedSnap = await getDocs(query(jobsRef, where('assignedTo', '==', userId), where('status', '==', 'completed')));
        const inProgressSnap = await getDocs(query(jobsRef, where('assignedTo', '==', userId), where('status', '==', 'in_progress')));

        // Active bans
        const bansSnap = await getDocs(query(collection(db, 'user_bans'), where('userId', '==', userId), where('isActive', '==', true)));
        const activeBans = bansSnap.docs.map(d => ({ banId: d.id, ...d.data() }));

        return {
            user,
            stats: {
                jobsCreated: createdSnap.size,
                jobsCompleted: completedSnap.size,
                jobsInProgress: inProgressSnap.size,
                totalEarnings: 0
            },
            recentLogins: [],
            activeBans
        };
    },

    async banUser(userId: string, data: any) {
        await updateDoc(doc(db, 'users', userId), { accountStatus: 'banned' });

        const banRef = await addDoc(collection(db, 'user_bans'), {
            userId,
            bannedBy: auth.currentUser?.uid,
            bannedAt: serverTimestamp(),
            isActive: true,
            ...data
        });

        await createAuditLog('USER_BANNED', 'user', userId, { reason: data.reason });
        return { success: true, banId: banRef.id };
    },

    async unbanUser(userId: string, reason: string) {
        await updateDoc(doc(db, 'users', userId), { accountStatus: 'active' });

        const bansSnap = await getDocs(query(collection(db, 'user_bans'), where('userId', '==', userId), where('isActive', '==', true)));
        bansSnap.forEach(async (d) => {
            await updateDoc(doc(db, 'user_bans', d.id), { isActive: false, unbannedAt: serverTimestamp() });
        });

        await createAuditLog('USER_UNBANNED', 'user', userId, { reason });
        return { success: true };
    },

    async changeUserRole(userId: string, newRole: string, reason: string) {
        await updateDoc(doc(db, 'users', userId), {
            role: newRole,
            membershipType: newRole,
            isPremium: newRole !== 'free'
        });

        await createAuditLog('USER_ROLE_CHANGED', 'user', userId, { newRole, reason });
        return { success: true };
    },

    async getJobs(filters: any) {
        let q = collection(db, 'jobs');
        const snapshot = await getDocs(q);
        let jobs = snapshot.docs.map(doc => ({ jobId: doc.id, ...doc.data() }));

        jobs.sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

        if (filters.status) {
            jobs = jobs.filter((j: any) => j.status === filters.status);
        }
        if (filters.city) {
            jobs = jobs.filter((j: any) => j.city === filters.city);
        }

        const page = Number(filters.page) || 1;
        const limitVal = Number(filters.limit) || 20;
        const startIndex = (page - 1) * limitVal;
        const paginatedJobs = jobs.slice(startIndex, startIndex + limitVal);

        return {
            jobs: paginatedJobs,
            total: jobs.length,
            page,
            totalPages: Math.ceil(jobs.length / limitVal)
        };
    },

    async getJobDetail(jobId: string) {
        const jobDoc = await getDoc(doc(db, 'jobs', jobId));
        if (!jobDoc.exists()) throw new Error('Job not found');
        const job = { jobId: jobDoc.id, ...jobDoc.data() } as any;

        let owner = null;
        if (job.createdBy) {
            const ownerDoc = await getDoc(doc(db, 'users', job.createdBy));
            if (ownerDoc.exists()) owner = { uid: ownerDoc.id, ...ownerDoc.data() };
        }

        let assignedLawyer = null;
        if (job.assignedTo) {
            const lawyerDoc = await getDoc(doc(db, 'users', job.assignedTo));
            if (lawyerDoc.exists()) assignedLawyer = { uid: lawyerDoc.id, ...lawyerDoc.data() };
        }

        const appsSnap = await getDocs(query(collection(db, 'applications'), where('jobId', '==', jobId)));
        const applications = appsSnap.docs.map(d => d.data());

        const historySnap = await getDocs(query(collection(db, 'admin_audit_logs'), where('targetId', '==', jobId), orderBy('timestamp', 'desc'), limit(20)));
        const history = historySnap.docs.map(d => d.data());

        return { job, owner, assignedLawyer, applications, history };
    },

    async updateJobStatus(jobId: string, newStatus: string, reason: string) {
        await updateDoc(doc(db, 'jobs', jobId), {
            status: newStatus,
            updatedAt: serverTimestamp()
        });
        await createAuditLog('JOB_STATUS_CHANGED', 'job', jobId, { newStatus, reason });
        return { success: true };
    },

    async deleteJob(jobId: string, reason: string) {
        await deleteDoc(doc(db, 'jobs', jobId));
        await createAuditLog('JOB_DELETED', 'job', jobId, { reason });
        return { success: true };
    },

    async getDashboardStats() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayTimestamp = today.getTime() / 1000;

        const jobsSnap = await getDocs(collection(db, 'jobs'));
        const usersSnap = await getDocs(collection(db, 'users'));

        const jobs = jobsSnap.docs.map(d => d.data());
        const users = usersSnap.docs.map(d => d.data());

        const todayJobs = jobs.filter((j: any) => j.createdAt?.seconds >= todayTimestamp);
        const todayCompleted = jobs.filter((j: any) => j.status === 'completed' && j.completedAt?.seconds >= todayTimestamp);
        const activeUsers = users.filter((u: any) => u.accountStatus === 'active');
        const premiumUsers = users.filter((u: any) => u.isPremium === true);
        const activeJobs = jobs.filter((j: any) => j.status === 'open');

        return {
            today: {
                jobsCreated: todayJobs.length,
                jobsCompleted: todayCompleted.length,
                newUsers: 0,
                activeUsers: activeUsers.length
            },
            totals: {
                totalUsers: users.length,
                totalJobs: jobs.length,
                activeJobs: activeJobs.length,
                premiumUsers: premiumUsers.length
            }
        };
    }
};
