"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminApi = void 0;
var supabaseClient_1 = require("../supabaseClient");
// Helper to create audit logs directly in Supabase
var createAuditLog = function (action_1, targetType_1, targetId_1) {
    var args_1 = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        args_1[_i - 3] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([action_1, targetType_1, targetId_1], args_1, true), void 0, function (action, targetType, targetId, details) {
        var user, error_1;
        if (details === void 0) { details = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, supabaseClient_1.supabase.auth.getUser()];
                case 1:
                    user = (_a.sent()).data.user;
                    if (!user)
                        return [2 /*return*/];
                    return [4 /*yield*/, supabaseClient_1.supabase.from('admin_audit_logs').insert({
                            admin_id: user.id,
                            admin_email: user.email,
                            action: action,
                            target_type: targetType,
                            target_id: targetId,
                            details: details
                        })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error('Error creating audit log:', error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
};
exports.adminApi = {
    getUsers: function (filters) {
        return __awaiter(this, void 0, void 0, function () {
            var query, search, page, limitVal, from, to, _a, users, count, error, mappedUsers;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        query = supabaseClient_1.supabase.from('users').select('*', { count: 'exact' });
                        // Client-side filtering (moved to server-side where possible for efficiency)
                        if (filters.role) {
                            query = query.eq('role', filters.role);
                        }
                        if (filters.accountStatus) {
                            query = query.eq('account_status', filters.accountStatus);
                        }
                        if (filters.searchQuery) {
                            search = "%".concat(filters.searchQuery, "%");
                            query = query.or("email.ilike.".concat(search, ",full_name.ilike.").concat(search));
                        }
                        page = Number(filters.page) || 1;
                        limitVal = Number(filters.limit) || 20;
                        from = (page - 1) * limitVal;
                        to = from + limitVal - 1;
                        return [4 /*yield*/, query.range(from, to)];
                    case 1:
                        _a = _b.sent(), users = _a.data, count = _a.count, error = _a.error;
                        if (error)
                            throw error;
                        mappedUsers = (users || []).map(function (user) { return ({
                            uid: user.uid,
                            fullName: user.full_name,
                            email: user.email,
                            role: user.role,
                            accountStatus: user.account_status,
                            createdAt: user.created_at
                        }); });
                        return [2 /*return*/, {
                                users: mappedUsers,
                                total: count || 0,
                                page: page,
                                totalPages: Math.ceil((count || 0) / limitVal)
                            }];
                }
            });
        });
    },
    getUserDetail: function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, user, error, jobsCreated, jobsCompleted, jobsInProgress, activeBans, assignedJobs, applications;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabaseClient_1.supabase
                            .from('users')
                            .select('*')
                            .eq('uid', userId)
                            .single()];
                    case 1:
                        _a = _b.sent(), user = _a.data, error = _a.error;
                        if (error || !user)
                            throw new Error('User not found');
                        return [4 /*yield*/, supabaseClient_1.supabase
                                .from('jobs')
                                .select('*', { count: 'exact', head: true })
                                .eq('created_by', userId)];
                    case 2:
                        jobsCreated = (_b.sent()).count;
                        return [4 /*yield*/, supabaseClient_1.supabase
                                .from('jobs')
                                .select('*', { count: 'exact', head: true })
                                .eq('assigned_to', userId)
                                .eq('status', 'completed')];
                    case 3:
                        jobsCompleted = (_b.sent()).count;
                        return [4 /*yield*/, supabaseClient_1.supabase
                                .from('jobs')
                                .select('*', { count: 'exact', head: true })
                                .eq('assigned_to', userId)
                                .eq('status', 'in_progress')];
                    case 4:
                        jobsInProgress = (_b.sent()).count;
                        return [4 /*yield*/, supabaseClient_1.supabase
                                .from('user_bans')
                                .select('*')
                                .eq('user_id', userId)
                                .eq('is_active', true)];
                    case 5:
                        activeBans = (_b.sent()).data;
                        return [4 /*yield*/, supabaseClient_1.supabase
                                .from('jobs')
                                .select('*')
                                .eq('assigned_to', userId)
                                .order('created_at', { ascending: false })];
                    case 6:
                        assignedJobs = (_b.sent()).data;
                        return [4 /*yield*/, supabaseClient_1.supabase
                                .from('applications')
                                .select('*, jobs(*)') // Join with jobs to get job details
                                .eq('applicant_id', userId)
                                .order('created_at', { ascending: false })];
                    case 7:
                        applications = (_b.sent()).data;
                        return [2 /*return*/, {
                                user: user,
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
                            }];
                }
            });
        });
    },
    banUser: function (userId, data) {
        return __awaiter(this, void 0, void 0, function () {
            var user, _a, banRef, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabaseClient_1.supabase.auth.getUser()];
                    case 1:
                        user = (_b.sent()).data.user;
                        return [4 /*yield*/, supabaseClient_1.supabase.from('users').update({ account_status: 'banned' }).eq('uid', userId)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, supabaseClient_1.supabase.from('user_bans').insert({
                                user_id: userId,
                                banned_by: user === null || user === void 0 ? void 0 : user.id,
                                is_active: true,
                                reason: data.reason,
                                // banned_at defaults to now()
                            }).select().single()];
                    case 3:
                        _a = _b.sent(), banRef = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [4 /*yield*/, createAuditLog('USER_BANNED', 'user', userId, { reason: data.reason })];
                    case 4:
                        _b.sent();
                        return [2 /*return*/, { success: true, banId: banRef.ban_id }];
                }
            });
        });
    },
    unbanUser: function (userId, reason) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, supabaseClient_1.supabase.from('users').update({ account_status: 'active' }).eq('uid', userId)];
                    case 1:
                        _a.sent();
                        // Deactivate active bans
                        return [4 /*yield*/, supabaseClient_1.supabase.from('user_bans')
                                .update({ is_active: false, unbanned_at: new Date().toISOString() })
                                .eq('user_id', userId)
                                .eq('is_active', true)];
                    case 2:
                        // Deactivate active bans
                        _a.sent();
                        return [4 /*yield*/, createAuditLog('USER_UNBANNED', 'user', userId, { reason: reason })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, { success: true }];
                }
            });
        });
    },
    changeUserRole: function (userId, newRole, reason) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, supabaseClient_1.supabase.from('users').update({
                            role: newRole,
                            membership_type: newRole,
                            is_premium: newRole !== 'free'
                        }).eq('uid', userId)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, createAuditLog('USER_ROLE_CHANGED', 'user', userId, { newRole: newRole, reason: reason })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, { success: true }];
                }
            });
        });
    },
    getJobs: function (filters) {
        return __awaiter(this, void 0, void 0, function () {
            var query, page, limitVal, from, to, _a, jobs, count, error, mappedJobs;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        query = supabaseClient_1.supabase.from('jobs').select('*', { count: 'exact' });
                        // Sort by created_at desc
                        query = query.order('created_at', { ascending: false });
                        if (filters.status) {
                            query = query.eq('status', filters.status);
                        }
                        if (filters.city) {
                            query = query.eq('city', filters.city);
                        }
                        page = Number(filters.page) || 1;
                        limitVal = Number(filters.limit) || 20;
                        from = (page - 1) * limitVal;
                        to = from + limitVal - 1;
                        return [4 /*yield*/, query.range(from, to)];
                    case 1:
                        _a = _b.sent(), jobs = _a.data, count = _a.count, error = _a.error;
                        if (error)
                            throw error;
                        mappedJobs = (jobs || []).map(function (job) { return ({
                            jobId: job.job_id,
                            title: job.title,
                            status: job.status,
                            city: job.city,
                            courthouse: job.courthouse,
                            createdAt: job.created_at,
                            createdBy: job.created_by,
                            assignedTo: job.assigned_to
                        }); });
                        return [2 /*return*/, {
                                jobs: mappedJobs,
                                total: count || 0,
                                page: page,
                                totalPages: Math.ceil((count || 0) / limitVal)
                            }];
                }
            });
        });
    },
    getJobDetail: function (jobId) {
        return __awaiter(this, void 0, void 0, function () {
            var cleanId, _a, job, error, owner, ownerDoc, assignedLawyer, lawyerDoc, applications, history;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!jobId)
                            throw new Error('Job ID is required');
                        cleanId = jobId.trim();
                        console.log("[AdminAPI] Fetching job: '".concat(cleanId, "'"));
                        return [4 /*yield*/, supabaseClient_1.supabase
                                .from('jobs')
                                .select('*')
                                .eq('job_id', cleanId)
                                .single()];
                    case 1:
                        _a = _b.sent(), job = _a.data, error = _a.error;
                        if (error || !job) {
                            console.error("[AdminAPI] Job not found: '".concat(cleanId, "'"));
                            throw new Error("Job not found (ID: ".concat(cleanId, ")"));
                        }
                        owner = null;
                        if (!job.created_by) return [3 /*break*/, 3];
                        return [4 /*yield*/, supabaseClient_1.supabase.from('users').select('*').eq('uid', job.created_by).single()];
                    case 2:
                        ownerDoc = (_b.sent()).data;
                        if (ownerDoc)
                            owner = ownerDoc;
                        _b.label = 3;
                    case 3:
                        assignedLawyer = null;
                        if (!job.assigned_to) return [3 /*break*/, 5];
                        return [4 /*yield*/, supabaseClient_1.supabase.from('users').select('*').eq('uid', job.assigned_to).single()];
                    case 4:
                        lawyerDoc = (_b.sent()).data;
                        if (lawyerDoc)
                            assignedLawyer = lawyerDoc;
                        _b.label = 5;
                    case 5: return [4 /*yield*/, supabaseClient_1.supabase
                            .from('applications')
                            .select('*')
                            .eq('job_id', cleanId)];
                    case 6:
                        applications = (_b.sent()).data;
                        return [4 /*yield*/, supabaseClient_1.supabase
                                .from('admin_audit_logs')
                                .select('*')
                                .eq('target_id', cleanId)
                                .order('timestamp', { ascending: false })
                                .limit(20)];
                    case 7:
                        history = (_b.sent()).data;
                        return [2 /*return*/, { job: job, owner: owner, assignedLawyer: assignedLawyer, applications: applications || [], history: history || [] }];
                }
            });
        });
    },
    updateJobStatus: function (jobId, newStatus, reason) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, supabaseClient_1.supabase.from('jobs').update({
                            status: newStatus,
                            updated_at: new Date().toISOString()
                        }).eq('job_id', jobId)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, createAuditLog('JOB_STATUS_CHANGED', 'job', jobId, { newStatus: newStatus, reason: reason })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, { success: true }];
                }
            });
        });
    },
    deleteJob: function (jobId, reason) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, supabaseClient_1.supabase.from('jobs').delete().eq('job_id', jobId)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, createAuditLog('JOB_DELETED', 'job', jobId, { reason: reason })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, { success: true }];
                }
            });
        });
    },
    getBotStatus: function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabaseClient_1.supabase
                            .from('system_settings')
                            .select('value')
                            .eq('key', 'job_bot_enabled')
                            .single()];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error) {
                            console.error('Error fetching bot status:', error);
                            return [2 /*return*/, { enabled: false }];
                        }
                        return [2 /*return*/, { enabled: (data === null || data === void 0 ? void 0 : data.value) === 'true' || (data === null || data === void 0 ? void 0 : data.value) === true }];
                }
            });
        });
    },
    updateBotStatus: function (enabled) {
        return __awaiter(this, void 0, void 0, function () {
            var error;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, supabaseClient_1.supabase
                            .from('system_settings')
                            .upsert({
                            key: 'job_bot_enabled',
                            value: enabled.toString(),
                            updated_at: new Date().toISOString()
                        })];
                    case 1:
                        error = (_a.sent()).error;
                        if (error)
                            throw error;
                        return [4 /*yield*/, createAuditLog('BOT_STATUS_CHANGED', 'system', 'job_bot', { enabled: enabled })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, { success: true }];
                }
            });
        });
    },
    getDashboardStats: function () {
        return __awaiter(this, void 0, void 0, function () {
            var today, todayIso, totalUsers, totalJobs, activeJobs, premiumUsers, todayJobs, todayCompleted, activeUsers, newUsers;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        today = new Date();
                        today.setHours(0, 0, 0, 0);
                        todayIso = today.toISOString();
                        return [4 /*yield*/, supabaseClient_1.supabase.from('users').select('*', { count: 'exact', head: true })];
                    case 1:
                        totalUsers = (_a.sent()).count;
                        return [4 /*yield*/, supabaseClient_1.supabase.from('jobs').select('*', { count: 'exact', head: true })];
                    case 2:
                        totalJobs = (_a.sent()).count;
                        return [4 /*yield*/, supabaseClient_1.supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'open')];
                    case 3:
                        activeJobs = (_a.sent()).count;
                        return [4 /*yield*/, supabaseClient_1.supabase.from('users').select('*', { count: 'exact', head: true }).eq('is_premium', true)];
                    case 4:
                        premiumUsers = (_a.sent()).count;
                        return [4 /*yield*/, supabaseClient_1.supabase.from('jobs').select('*', { count: 'exact', head: true }).gte('created_at', todayIso)];
                    case 5:
                        todayJobs = (_a.sent()).count;
                        return [4 /*yield*/, supabaseClient_1.supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'completed').gte('completed_at', todayIso)];
                    case 6:
                        todayCompleted = (_a.sent()).count;
                        return [4 /*yield*/, supabaseClient_1.supabase.from('users').select('*', { count: 'exact', head: true }).eq('account_status', 'active')];
                    case 7:
                        activeUsers = (_a.sent()).count;
                        return [4 /*yield*/, supabaseClient_1.supabase.from('users').select('*', { count: 'exact', head: true }).gte('created_at', todayIso)];
                    case 8:
                        newUsers = (_a.sent()).count;
                        return [2 /*return*/, {
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
                                    premiumUsers: premiumUsers || 0
                                }
                            }];
                }
            });
        });
    }
};
