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
Object.defineProperty(exports, "__esModule", { value: true });
exports.runJobBot = void 0;
var geminiService_js_1 = require("./geminiService.js");
var courthouses_js_1 = require("../../data/courthouses.js");
var notificationService_js_1 = require("./notificationService.js");
// Bot User Configuration
var BOT_EMAIL = 'bot@avukatagi.net';
var BOT_PASSWORD = 'bot-secure-password-123!';
var runJobBot = function (supabase) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, settings, settingsError, isEnabled, existingProfile, botUserId, _b, newUser, createError, users, authUser, profileError, now, trTime, dayOfWeek, hourOfDay, allowedJobTypes, allCourthouses_1, selectedCourthouses, i, randomIndex, _i, selectedCourthouses_1, ch, nowRaw, trNowStr, trNow, tomorrow, year, month, day, targetDate, existingJobs, jobDetails, randomHour, randomMin, timeString, deadlineDate, _c, insertedJob, insertError, notifyError_1, err_1;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                console.log('🤖 Job Bot: Starting run...');
                _d.label = 1;
            case 1:
                _d.trys.push([1, 22, , 23]);
                return [4 /*yield*/, supabase
                        .from('system_settings')
                        .select('value')
                        .eq('key', 'job_bot_enabled')
                        .single()];
            case 2:
                _a = _d.sent(), settings = _a.data, settingsError = _a.error;
                if (settingsError && settingsError.code !== 'PGRST116') {
                    console.error('🤖 Job Bot: Error checking settings:', settingsError);
                    return [2 /*return*/];
                }
                isEnabled = (settings === null || settings === void 0 ? void 0 : settings.value) === true || (settings === null || settings === void 0 ? void 0 : settings.value) === 'true';
                if (!isEnabled) {
                    console.log('🤖 Job Bot: Disabled in settings. Skipping.');
                    return [2 /*return*/];
                }
                return [4 /*yield*/, supabase
                        .from('users')
                        .select('uid')
                        .eq('email', BOT_EMAIL)
                        .single()];
            case 3:
                existingProfile = (_d.sent()).data;
                botUserId = existingProfile === null || existingProfile === void 0 ? void 0 : existingProfile.uid;
                if (!!botUserId) return [3 /*break*/, 11];
                console.log('🤖 Job Bot: Bot user not found. Creating...');
                return [4 /*yield*/, supabase.auth.admin.createUser({
                        email: BOT_EMAIL,
                        password: BOT_PASSWORD,
                        email_confirm: true,
                        user_metadata: {
                            full_name: 'Sistem Botu',
                            is_bot: true
                        }
                    })];
            case 4:
                _b = _d.sent(), newUser = _b.data, createError = _b.error;
                if (!(createError || !newUser.user)) return [3 /*break*/, 8];
                if (!(createError && createError.code === 'email_exists')) return [3 /*break*/, 6];
                console.log('🤖 Job Bot: Auth user exists but missing profile. Attempting to recover...');
                return [4 /*yield*/, supabase.auth.admin.listUsers({ perPage: 1000 })];
            case 5:
                users = (_d.sent()).data.users;
                authUser = users.find(function (u) { return u.email === BOT_EMAIL; });
                if (authUser) {
                    botUserId = authUser.id;
                }
                else {
                    console.error('🤖 Job Bot: Could not find existing auth user ID.');
                    return [2 /*return*/];
                }
                return [3 /*break*/, 7];
            case 6:
                console.error('🤖 Job Bot: Failed to create bot user:', createError);
                return [2 /*return*/];
            case 7: return [3 /*break*/, 9];
            case 8:
                botUserId = newUser.user.id;
                _d.label = 9;
            case 9: return [4 /*yield*/, supabase.from('users').insert({
                    uid: botUserId,
                    email: BOT_EMAIL,
                    full_name: 'Sistem Botu',
                    role: 'admin',
                    is_premium: true,
                    membership_type: 'premium_plus',
                    city: 'İstanbul',
                    baro_city: 'İstanbul',
                    baro_number: '00000',
                    phone: '5550000000'
                })];
            case 10:
                profileError = (_d.sent()).error;
                if (profileError) {
                    console.error('🤖 Job Bot: Failed to create bot profile:', profileError);
                }
                console.log('🤖 Job Bot: Bot user profile created successfully.');
                _d.label = 11;
            case 11:
                now = new Date();
                trTime = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Istanbul" }));
                dayOfWeek = trTime.getDay();
                hourOfDay = trTime.getHours();
                // Rule: Only run between 09:00 and 18:00
                if (hourOfDay < 9 || hourOfDay > 17) {
                    console.log("\uD83E\uDD16 Job Bot: Outside operating hours (09:00-18:00). Current hour (Turkey time): ".concat(hourOfDay, ". Skipping."));
                    return [2 /*return*/];
                }
                // Rule 2: No jobs on weekends
                if (dayOfWeek === 0 || dayOfWeek === 6) {
                    console.log('🤖 Job Bot: It is weekend. No jobs will be created.');
                    return [2 /*return*/];
                }
                allowedJobTypes = ["İcra İşlemi", "Dosya İnceleme", "Haciz", "Dilekçe", "Diğer"];
                if (dayOfWeek === 2 || dayOfWeek === 4) {
                    allowedJobTypes.push("Duruşma");
                }
                allCourthouses_1 = [];
                Object.entries(courthouses_js_1.COURTHOUSES).forEach(function (_a) {
                    var city = _a[0], list = _a[1];
                    list.forEach(function (ch) { return allCourthouses_1.push({ city: city, name: ch }); });
                });
                selectedCourthouses = [];
                for (i = 0; i < 3; i++) {
                    randomIndex = Math.floor(Math.random() * allCourthouses_1.length);
                    selectedCourthouses.push(allCourthouses_1[randomIndex]);
                }
                console.log("\uD83E\uDD16 Job Bot: Selected ".concat(selectedCourthouses.length, " courthouses for potential jobs. Allowed types: ").concat(allowedJobTypes.join(', ')));
                _i = 0, selectedCourthouses_1 = selectedCourthouses;
                _d.label = 12;
            case 12:
                if (!(_i < selectedCourthouses_1.length)) return [3 /*break*/, 21];
                ch = selectedCourthouses_1[_i];
                nowRaw = new Date();
                trNowStr = nowRaw.toLocaleString("en-US", { timeZone: "Europe/Istanbul" });
                trNow = new Date(trNowStr);
                tomorrow = new Date(trNow);
                tomorrow.setDate(tomorrow.getDate() + 1);
                year = tomorrow.getFullYear();
                month = String(tomorrow.getMonth() + 1).padStart(2, '0');
                day = String(tomorrow.getDate()).padStart(2, '0');
                targetDate = "".concat(year, "-").concat(month, "-").concat(day);
                return [4 /*yield*/, supabase
                        .from('jobs')
                        .select('job_id')
                        .eq('courthouse', ch.name)
                        .eq('date', targetDate)
                        .limit(1)];
            case 13:
                existingJobs = (_d.sent()).data;
                /*
                if (existingJobs && existingJobs.length > 0) {
                    console.log(`🤖 Job Bot: Job already exists for ${ch.name} today. Skipping.`);
                    continue;
                }
                */
                // Generate Content
                console.log("\uD83E\uDD16 Job Bot: Generating content for ".concat(ch.name, "..."));
                return [4 /*yield*/, (0, geminiService_js_1.generateJobDetails)(ch.name, allowedJobTypes)];
            case 14:
                jobDetails = _d.sent();
                if (!jobDetails) {
                    console.error("\uD83E\uDD16 Job Bot: Failed to generate content for ".concat(ch.name, "."));
                    return [3 /*break*/, 20];
                }
                randomHour = Math.floor(Math.random() * (18 - 9)) + 9;
                randomMin = Math.floor(Math.random() * 60);
                timeString = "".concat(String(randomHour).padStart(2, '0'), ":").concat(String(randomMin).padStart(2, '0'));
                deadlineDate = new Date(nowRaw);
                deadlineDate.setMinutes(deadlineDate.getMinutes() + 15);
                return [4 /*yield*/, supabase.from('jobs').insert({
                        title: jobDetails.title,
                        description: jobDetails.description,
                        city: ch.city,
                        courthouse: ch.name,
                        date: targetDate, // Tomorrow's date in Turkey Time
                        time: timeString,
                        job_type: jobDetails.jobType,
                        offered_fee: jobDetails.offeredFee,
                        created_by: botUserId,
                        owner_name: jobDetails.ownerName,
                        owner_phone: '555' + Math.floor(1000000 + Math.random() * 9000000),
                        status: 'open',
                        applications_count: Math.floor(Math.random() * (6 - 4 + 1)) + 4, // Random between 4 and 6
                        is_urgent: false,
                        application_deadline: deadlineDate.toISOString()
                        // created_at and updated_at are handled by the database default value (now())
                    }).select().single()];
            case 15:
                _c = _d.sent(), insertedJob = _c.data, insertError = _c.error;
                if (!insertError) return [3 /*break*/, 16];
                console.error("\uD83E\uDD16 Job Bot: Error inserting job for ".concat(ch.name, ":"), insertError);
                return [3 /*break*/, 20];
            case 16:
                console.log("\uD83E\uDD16 Job Bot: \u2705 Job created for ".concat(ch.name, " by ").concat(jobDetails.ownerName));
                _d.label = 17;
            case 17:
                _d.trys.push([17, 19, , 20]);
                return [4 /*yield*/, (0, notificationService_js_1.notifyNewJob)(supabase, {
                        city: ch.city,
                        courthouse: ch.name,
                        jobType: jobDetails.jobType,
                        jobId: insertedJob.job_id,
                        createdBy: botUserId,
                        date: targetDate,
                        offeredFee: String(jobDetails.offeredFee)
                    })];
            case 18:
                _d.sent();
                console.log("\uD83E\uDD16 Job Bot: \uD83D\uDCE8 Notification triggered for job ".concat(insertedJob.job_id));
                return [3 /*break*/, 20];
            case 19:
                notifyError_1 = _d.sent();
                console.error('🤖 Job Bot: Failed to trigger notification:', notifyError_1);
                return [3 /*break*/, 20];
            case 20:
                _i++;
                return [3 /*break*/, 12];
            case 21: return [3 /*break*/, 23];
            case 22:
                err_1 = _d.sent();
                console.error('🤖 Job Bot: Critical error:', err_1);
                return [3 /*break*/, 23];
            case 23: return [2 /*return*/];
        }
    });
}); };
exports.runJobBot = runJobBot;
