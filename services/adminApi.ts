import { supabase } from '../supabaseClient';

// Helper to create audit logs directly in Supabase
const createAuditLog = async (action: string, targetType: string, targetId: string, details: any = {}) => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        await supabase.from('admin_audit_logs').insert({
            admin_id: user.id,
            admin_email: user.email,
            action,
            target_type: targetType,
            target_id: targetId,
            details
        });
    } catch (error) {
        console.error('Error creating audit log:', error);
    }
};

export const adminApi = {
    async getUsers(filters: any) {
        let query = supabase.from('users').select('*', { count: 'exact' });

        // Client-side filtering (moved to server-side where possible for efficiency)
        if (filters.role) {
            query = query.eq('role', filters.role);
        }
        if (filters.accountStatus) {
            query = query.eq('account_status', filters.accountStatus);
        }
        if (filters.searchQuery) {
            // Supabase ILIKE for case-insensitive search
            const search = `%${filters.searchQuery}%`;
            query = query.or(`email.ilike.${search},full_name.ilike.${search}`);
        }

        // Pagination logic
        const page = Number(filters.page) || 1;
        const limitVal = Number(filters.limit) || 20;
        const from = (page - 1) * limitVal;
        const to = from + limitVal - 1;

        const { data: users, count, error } = await query.range(from, to);

        if (error) throw error;

        // Map database fields to camelCase
        const mappedUsers = (users || []).map((user: any) => ({
            uid: user.uid,
            fullName: user.full_name,
            email: user.email,
            role: user.role,
            accountStatus: user.account_status,
            createdAt: user.created_at
        }));

        return {
            users: mappedUsers,
            total: count || 0,
            page,
            totalPages: Math.ceil((count || 0) / limitVal)
        };
    },

    async getUserDetail(userId: string) {
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('uid', userId)
            .single();

        if (error || !user) throw new Error('User not found');

        // Stats
        const { count: jobsCreated } = await supabase
            .from('jobs')
            .select('*', { count: 'exact', head: true })
            .eq('created_by', userId);

        const { count: jobsCompleted } = await supabase
            .from('jobs')
            .select('*', { count: 'exact', head: true })
            .eq('assigned_to', userId)
            .eq('status', 'completed');

        const { count: jobsInProgress } = await supabase
            .from('jobs')
            .select('*', { count: 'exact', head: true })
            .eq('assigned_to', userId)
            .eq('status', 'in_progress');

        // Active bans
        const { data: activeBans } = await supabase
            .from('user_bans')
            .select('*')
            .eq('user_id', userId)
            .eq('is_active', true);



        // Fetch assigned jobs (jobs where this user is the assigned lawyer)
        const { data: assignedJobs } = await supabase
            .from('jobs')
            .select('*')
            .eq('assigned_to', userId)
            .order('created_at', { ascending: false });

        // Fetch applications (jobs this user has applied to)
        const { data: applications } = await supabase
            .from('applications')
            .select('*, jobs(*)') // Join with jobs to get job details
            .eq('applicant_id', userId)
            .order('created_at', { ascending: false });

        return {
            user,
            stats: {
                jobsCreated: jobsCreated || 0,
                jobsCompleted: jobsCompleted || 0,
                jobsInProgress: jobsInProgress || 0,
                totalEarnings: 0 // Needs a separate calculation if needed
            },
            recentLogins: [], // Supabase auth logs are not directly accessible this way usually
            activeBans: activeBans || [],
            assignedJobs: assignedJobs || [],
            applications: applications || []
        };
    },

    async banUser(userId: string, data: any) {
        const { data: { user } } = await supabase.auth.getUser();

        await supabase.from('users').update({ account_status: 'banned' }).eq('uid', userId);

        const { data: banRef, error } = await supabase.from('user_bans').insert({
            user_id: userId,
            banned_by: user?.id,
            is_active: true,
            reason: data.reason,
            // banned_at defaults to now()
        }).select().single();

        if (error) throw error;

        await createAuditLog('USER_BANNED', 'user', userId, { reason: data.reason });
        return { success: true, banId: banRef.ban_id };
    },

    async unbanUser(userId: string, reason: string) {
        await supabase.from('users').update({ account_status: 'active' }).eq('uid', userId);

        // Deactivate active bans
        await supabase.from('user_bans')
            .update({ is_active: false, unbanned_at: new Date().toISOString() })
            .eq('user_id', userId)
            .eq('is_active', true);

        await createAuditLog('USER_UNBANNED', 'user', userId, { reason });
        return { success: true };
    },

    async changeUserRole(userId: string, newRole: string, reason: string) {
        await supabase.from('users').update({
            role: newRole,
            membership_type: newRole,
            is_premium: newRole !== 'free'
        }).eq('uid', userId);

        await createAuditLog('USER_ROLE_CHANGED', 'user', userId, { newRole, reason });
        return { success: true };
    },

    async getJobs(filters: any) {
        let query = supabase.from('jobs').select('*', { count: 'exact' });

        // Sort by created_at desc
        query = query.order('created_at', { ascending: false });

        if (filters.status) {
            query = query.eq('status', filters.status);
        }
        if (filters.city) {
            query = query.eq('city', filters.city);
        }

        const page = Number(filters.page) || 1;
        const limitVal = Number(filters.limit) || 20;
        const from = (page - 1) * limitVal;
        const to = from + limitVal - 1;

        const { data: jobs, count, error } = await query.range(from, to);

        if (error) throw error;

        // Map database fields to camelCase
        const mappedJobs = (jobs || []).map((job: any) => ({
            jobId: job.job_id,
            title: job.title,
            status: job.status,
            city: job.city,
            courthouse: job.courthouse,
            createdAt: job.created_at,
            createdBy: job.created_by,
            assignedTo: job.assigned_to
        }));

        return {
            jobs: mappedJobs,
            total: count || 0,
            page,
            totalPages: Math.ceil((count || 0) / limitVal)
        };
    },

    async getJobDetail(jobId: string) {
        if (!jobId) throw new Error('Job ID is required');
        const cleanId = jobId.trim();
        console.log(`[AdminAPI] Fetching job: '${cleanId}'`);

        const { data: job, error } = await supabase
            .from('jobs')
            .select('*')
            .eq('job_id', cleanId)
            .single();

        if (error || !job) {
            console.error(`[AdminAPI] Job not found: '${cleanId}'`);
            throw new Error(`Job not found (ID: ${cleanId})`);
        }

        let owner = null;
        if (job.created_by) {
            const { data: ownerDoc } = await supabase.from('users').select('*').eq('uid', job.created_by).single();
            if (ownerDoc) owner = ownerDoc;
        }

        let assignedLawyer = null;
        if (job.assigned_to) {
            const { data: lawyerDoc } = await supabase.from('users').select('*').eq('uid', job.assigned_to).single();
            if (lawyerDoc) assignedLawyer = lawyerDoc;
        }

        const { data: applications } = await supabase
            .from('applications')
            .select('*')
            .eq('job_id', cleanId);

        const { data: history } = await supabase
            .from('admin_audit_logs')
            .select('*')
            .eq('target_id', cleanId)
            .order('timestamp', { ascending: false })
            .limit(20);

        return { job, owner, assignedLawyer, applications: applications || [], history: history || [] };
    },

    async updateJobStatus(jobId: string, newStatus: string, reason: string) {
        await supabase.from('jobs').update({
            status: newStatus,
            updated_at: new Date().toISOString()
        }).eq('job_id', jobId);

        await createAuditLog('JOB_STATUS_CHANGED', 'job', jobId, { newStatus, reason });
        return { success: true };
    },

    async deleteJob(jobId: string, reason: string) {
        await supabase.from('jobs').delete().eq('job_id', jobId);
        await createAuditLog('JOB_DELETED', 'job', jobId, { reason });
        return { success: true };
    },

    async getBotStatus() {
        const { data, error } = await supabase
            .from('system_settings')
            .select('value')
            .eq('key', 'job_bot_enabled')
            .single();

        if (error) {
            console.error('Error fetching bot status:', error);
            return { enabled: false };
        }

        return { enabled: data?.value === 'true' || data?.value === true };
    },

    async updateBotStatus(enabled: boolean) {
        const { error } = await supabase
            .from('system_settings')
            .upsert({
                key: 'job_bot_enabled',
                value: enabled.toString(),
                updated_at: new Date().toISOString()
            });

        if (error) throw error;

        await createAuditLog('BOT_STATUS_CHANGED', 'system', 'job_bot', { enabled });
        return { success: true };
    },

    async getDashboardStats() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayIso = today.toISOString();

        const { count: totalUsers } = await supabase.from('users').select('*', { count: 'exact', head: true });
        const { count: totalJobs } = await supabase.from('jobs').select('*', { count: 'exact', head: true });
        const { count: activeJobs } = await supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'open');
        const { count: premiumUsers } = await supabase.from('users').select('*', { count: 'exact', head: true }).eq('is_premium', true);

        const { count: todayJobs } = await supabase.from('jobs').select('*', { count: 'exact', head: true }).gte('created_at', todayIso);
        const { count: todayCompleted } = await supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'completed').gte('completed_at', todayIso);
        const { count: activeUsers } = await supabase.from('users').select('*', { count: 'exact', head: true }).eq('account_status', 'active');
        const { count: newUsers } = await supabase.from('users').select('*', { count: 'exact', head: true }).gte('created_at', todayIso);
        const { count: openDisputes } = await supabase.from('disputes').select('*', { count: 'exact', head: true }).eq('status', 'open');

        return {
            today: {
                jobsCreated: todayJobs || 0,
                jobsCompleted: todayCompleted || 0,
                newUsers: newUsers || 0,
                activeUsers: activeUsers || 0
            },
            totals: {
                totalUsers: totalUsers || 0,
                totalJobs: totalJobs || 0,
                activeJobs: activeJobs || 0,
                premiumUsers: premiumUsers || 0,
                openDisputes: openDisputes || 0
            }
        };
    },

    // Disputes
    async getDisputes() {
        const { data, error } = await supabase
            .from('disputes')
            .select(`
                *,
                users:reporter_id (full_name, email, phone),
                jobs:job_id (title, city, courthouse)
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    async resolveDispute(disputeId: string, resolution: string) {
        const { error } = await supabase
            .from('disputes')
            .update({ status: 'resolved', resolution_notes: resolution }) // assuming we might want notes, or just status
            .eq('id', disputeId);

        if (error) throw error;
        await createAuditLog('DISPUTE_RESOLVED', 'dispute', disputeId, { resolution });
        return { success: true };
    }
};

