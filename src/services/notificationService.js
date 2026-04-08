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
exports.customLog = customLog;
exports.customError = customError;
exports.sendSms = sendSms;
exports.notifyNewJob = notifyNewJob;
var axios_1 = require("axios");
var courthouses_js_1 = require("../../data/courthouses.js");
var telegramService_js_1 = require("./telegramService.js");
var fs_1 = require("fs");
var path_1 = require("path");
function customLog() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    try {
        var msg = args.map(function (a) { return typeof a === 'object' ? JSON.stringify(a) : String(a); }).join(' ');
        var time = new Date().toISOString();
        var logLine = "[".concat(time, "] ").concat(msg, "\n");
        fs_1.default.appendFileSync(path_1.default.join(process.cwd(), 'notification.log'), logLine);
        console.log.apply(console, args);
    }
    catch (e) {
        console.log.apply(console, args);
    }
}
function customError() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    try {
        var msg = args.map(function (a) { return typeof a === 'object' ? JSON.stringify(a) : String(a); }).join(' ');
        var time = new Date().toISOString();
        var logLine = "[ERROR ".concat(time, "] ").concat(msg, "\n");
        fs_1.default.appendFileSync(path_1.default.join(process.cwd(), 'notification.log'), logLine);
        console.error.apply(console, args);
    }
    catch (e) {
        console.error.apply(console, args);
    }
}
// Helper to send SMS via NetGSM XML API
function sendSms(phone, message) {
    return __awaiter(this, void 0, void 0, function () {
        var cleanPhone, url, xmlData, response, responseCode, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // ... (existing sendSms implementation)
                    console.log('📨 sendSms called', phone, message);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    cleanPhone = phone.replace(/\D/g, '');
                    url = 'https://api.netgsm.com.tr/sms/send/xml';
                    xmlData = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<mainbody>\n    <header>\n        <company dil=\"TR\">Netgsm</company>\n        <usercode>".concat(process.env.NETGSM_USERNAME, "</usercode>\n        <password>").concat(process.env.NETGSM_PASSWORD, "</password>\n        <type>1:n</type>\n        <msgheader>").concat(process.env.NETGSM_HEADER, "</msgheader>\n    </header>\n    <body>\n        <msg><![CDATA[").concat(message, "]]></msg>\n        <no>").concat(cleanPhone, "</no>\n    </body>\n</mainbody>");
                    return [4 /*yield*/, axios_1.default.post(url, xmlData, {
                            headers: {
                                'Content-Type': 'application/xml'
                            },
                            timeout: 10000 // 10 seconds timeout
                        })];
                case 2:
                    response = _a.sent();
                    responseCode = response.data.toString().trim().substring(0, 2);
                    if (responseCode === '00' || responseCode === '01') {
                        // console.log(`✅ SMS sent successfully to ${cleanPhone}. Code: ${responseCode}`);
                        return [2 /*return*/, { success: true, code: responseCode, providerResponse: response.data }];
                    }
                    else {
                        console.log("\u274C SMS failed to ".concat(cleanPhone, ". Code: ").concat(responseCode));
                        return [2 /*return*/, { success: false, code: responseCode, providerResponse: response.data }];
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error('❌ NetGSM error', error_1.message);
                    return [2 /*return*/, { success: false, error: error_1.message }];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function notifyNewJob(supabase, jobData) {
    return __awaiter(this, void 0, void 0, function () {
        var city, courthouse, jobType, jobId, createdBy, date, offeredFee, isOutside, query, _a, users, error, normalizeString_1, usersToNotify, targetCourthouse_1, cityCourthouses, cityCourthousesNormalized_1, stripParentheses_1, targetCourthouseStripped_1, formattedDate, _b, y, m, d, feeStr, smsDatePart, smsMessage, telegramMessage, sentTelegramCount_1, sentSmsCount_1, promises, globalChatId_1, results, _loop_1, _i, usersToNotify_1, user, resultsAll, err_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    city = jobData.city, courthouse = jobData.courthouse, jobType = jobData.jobType, jobId = jobData.jobId, createdBy = jobData.createdBy, date = jobData.date, offeredFee = jobData.offeredFee, isOutside = jobData.isOutside;
                    customLog('📨 Notification Service: Processing new job:', { city: city, courthouse: courthouse, jobType: jobType, createdBy: createdBy, isOutside: isOutside });
                    if (!courthouse || !jobType) {
                        customError('❌ Notification Service: Missing required fields');
                        return [2 /*return*/, { success: false, error: 'Missing required fields' }];
                    }
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 6, , 7]);
                    query = supabase
                        .from('users')
                        .select('uid, phone, full_name, membership_type, preferred_courthouses, telegram_chat_id, telegram_notifications_enabled, sms_notifications_enabled')
                        .neq('uid', createdBy);
                    return [4 /*yield*/, query];
                case 2:
                    _a = _c.sent(), users = _a.data, error = _a.error;
                    if (error) {
                        customError('❌ Notification Service: Error fetching users:', error);
                        throw error;
                    }
                    customLog("\uD83D\uDCCA Total potential users found: ".concat((users === null || users === void 0 ? void 0 : users.length) || 0));
                    if (!users || users.length === 0) {
                        customLog('⚠️ No users found to notify.');
                        return [2 /*return*/, { success: true, message: 'No users to notify', count: 0 }];
                    }
                    normalizeString_1 = function (str) {
                        if (!str)
                            return '';
                        var s = str.toLocaleLowerCase('tr-TR');
                        s = s.normalize('NFD').replace(/\p{Diacritic}/gu, '');
                        s = s.normalize('NFC');
                        s = s.trim().replace(/\s+/g, ' ');
                        return s;
                    };
                    usersToNotify = [];
                    targetCourthouse_1 = normalizeString_1(courthouse);
                    if (isOutside) {
                        cityCourthouses = courthouses_js_1.COURTHOUSES[city] || [];
                        cityCourthousesNormalized_1 = cityCourthouses.map(function (c) { return normalizeString_1(c); });
                        usersToNotify = users.filter(function (user) {
                            try {
                                var prefs = user.preferred_courthouses;
                                if (!prefs)
                                    return false;
                                var userCourthouses = [];
                                // Handle JSON/String formats
                                if (Array.isArray(prefs)) {
                                    userCourthouses = prefs.map(function (p) { return typeof p === 'string' ? p : ((p === null || p === void 0 ? void 0 : p.name) || (p === null || p === void 0 ? void 0 : p.label) || ''); }).filter(Boolean);
                                }
                                else if (typeof prefs === 'string') {
                                    var trimmed = prefs.trim();
                                    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
                                        try {
                                            var parsed = JSON.parse(trimmed);
                                            userCourthouses = Array.isArray(parsed) ? parsed.map(function (p) { return typeof p === 'string' ? p : ((p === null || p === void 0 ? void 0 : p.name) || (p === null || p === void 0 ? void 0 : p.label) || ''); }).filter(Boolean) : [trimmed];
                                        }
                                        catch (e) {
                                            userCourthouses = [trimmed];
                                        }
                                    }
                                    else if (trimmed.includes(',')) {
                                        userCourthouses = trimmed.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
                                    }
                                    else {
                                        userCourthouses = [trimmed];
                                    }
                                }
                                // Check if ANY of user's courthouses belong to this city
                                return userCourthouses.some(function (uc) {
                                    var normUc = normalizeString_1(uc);
                                    return cityCourthousesNormalized_1.some(function (cityCh) { return normUc.includes(cityCh) || cityCh.includes(normUc); });
                                });
                            }
                            catch (e) {
                                return false;
                            }
                        });
                    }
                    else {
                        stripParentheses_1 = function (str) {
                            if (!str)
                                return '';
                            return str.replace(/\([^)]*\)/g, '').trim().replace(/\s+/g, ' ');
                        };
                        targetCourthouseStripped_1 = stripParentheses_1(targetCourthouse_1);
                        usersToNotify = users.filter(function (user) {
                            try {
                                var prefs = user.preferred_courthouses;
                                if (!prefs)
                                    return false;
                                var userCourthouses = [];
                                if (Array.isArray(prefs)) {
                                    userCourthouses = prefs.map(function (p) { return typeof p === 'string' ? p : ((p === null || p === void 0 ? void 0 : p.name) || (p === null || p === void 0 ? void 0 : p.label) || ''); }).filter(Boolean);
                                }
                                else if (typeof prefs === 'string') {
                                    var trimmed = prefs.trim();
                                    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
                                        try {
                                            var parsed = JSON.parse(trimmed);
                                            userCourthouses = Array.isArray(parsed) ? parsed.map(function (p) { return typeof p === 'string' ? p : ((p === null || p === void 0 ? void 0 : p.name) || (p === null || p === void 0 ? void 0 : p.label) || ''); }).filter(Boolean) : [trimmed];
                                        }
                                        catch (e) {
                                            userCourthouses = [trimmed];
                                        }
                                    }
                                    else if (trimmed.includes(',')) {
                                        userCourthouses = trimmed.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
                                    }
                                    else {
                                        userCourthouses = [trimmed];
                                    }
                                }
                                return userCourthouses.some(function (c) {
                                    if (typeof c !== 'string')
                                        return false;
                                    var normalizedPref = normalizeString_1(c);
                                    var normalizedPrefStripped = stripParentheses_1(normalizedPref);
                                    if (normalizedPref === targetCourthouse_1)
                                        return true;
                                    if (normalizedPrefStripped && normalizedPrefStripped === targetCourthouseStripped_1)
                                        return true;
                                    return false;
                                });
                            }
                            catch (filterError) {
                                return false;
                            }
                        });
                    }
                    console.log("\uD83C\uDFAF Users matching location: ".concat(usersToNotify.length));
                    formattedDate = date;
                    try {
                        if (date && date.includes('-')) {
                            _b = date.split('-'), y = _b[0], m = _b[1], d = _b[2];
                            if (d && m && y) {
                                formattedDate = "".concat(d, "/").concat(m, "/").concat(y);
                            }
                        }
                    }
                    catch (e) {
                        console.error('Date parsing error', e);
                    }
                    feeStr = offeredFee ? "".concat(offeredFee, " TL \u00FCcretli ") : '';
                    smsDatePart = formattedDate ? "".concat(formattedDate, " tarihli, ") : '';
                    smsMessage = isOutside
                        ? "Say\u0131n Meslekta\u015F\u0131m\u0131z, ".concat(city, "'da (Adliye D\u0131\u015F\u0131), ").concat(smsDatePart, "yeni bir g\u00F6rev a\u00E7\u0131ld\u0131. G\u00F6rev yeri : ").concat(courthouse, ". Hemen incelemek i\u00E7in AvukatA\u011F\u0131 uygulamas\u0131n\u0131 ziyaret ediniz.")
                        : "Say\u0131n Meslekta\u015F\u0131m\u0131z, ".concat(courthouse, " adliyesinde, ").concat(smsDatePart).concat(feeStr, "yeni bir ").concat(jobType, " g\u00F6revi a\u00E7\u0131ld\u0131. Hemen incelemek i\u00E7in AvukatA\u011F\u0131 uygulamas\u0131n\u0131 ziyaret ediniz.");
                    telegramMessage = "\uD83D\uDCE2 AvukatA\u011F\u0131 Platformunda yeni g\u00F6rev yay\u0131nland\u0131.\n\n" +
                        "G\u00F6rev detaylar\u0131:\n" +
                        "\u015Eehir: ".concat(city, "\n") +
                        (isOutside ? "G\u00F6rev Yeri: ".concat(courthouse, " (Adliye D\u0131\u015F\u0131)\n") : "Adliye: ".concat(courthouse, "\n")) +
                        "G\u00F6rev T\u00FCr\u00FC: ".concat(jobType, "\n") +
                        "Tarih: ".concat(formattedDate, "\n") + // Uses DD/MM/YYYY
                        "\u00DCcret: ".concat(offeredFee, " TL\n\n") +
                        "Ba\u015Fvurmak i\u00E7in avukatagi.net sitesini veya mobil uygulamas\u0131n\u0131 ziyaret edin.";
                    sentTelegramCount_1 = 0;
                    sentSmsCount_1 = 0;
                    promises = [];
                    globalChatId_1 = process.env.TELEGRAM_GLOBAL_CHAT_ID;
                    customLog("[DEBUG] globalChatId configured as: >".concat(globalChatId_1, "<"));
                    if (globalChatId_1) {
                        promises.push((0, telegramService_js_1.sendTelegramMessage)(globalChatId_1, telegramMessage)
                            .then(function () {
                            customLog("\u2705 Telegram broadcast sent to global group: ".concat(globalChatId_1));
                            sentTelegramCount_1++;
                        })
                            .catch(function (e) { return customError("\u274C Global Telegram broadcast fail", e); }));
                    }
                    else {
                        customLog("[DEBUG] Skipping global broadcast because globalChatId is falsy");
                    }
                    if (!(usersToNotify.length === 0)) return [3 /*break*/, 4];
                    customLog("[DEBUG] No personal users to notify. Waiting for ".concat(promises.length, " promises."));
                    return [4 /*yield*/, Promise.allSettled(promises)];
                case 3:
                    results = _c.sent();
                    customLog("[DEBUG] Early Return Promise Results:", results.map(function (r) { return r.status; }));
                    return [2 /*return*/, { success: true, message: 'No matching personal users for this courthouse, but global broadcast processed.', counts: { sms: 0, telegram: sentTelegramCount_1 } }];
                case 4:
                    _loop_1 = function (user) {
                        // SMS Logic
                        // Include user if strict true, OR if legacy null (not strictly false)
                        var isSmsEnabled = user.sms_notifications_enabled !== false;
                        if (user.phone && isSmsEnabled) {
                            promises.push(sendSms(user.phone, smsMessage)
                                .then(function (res) { if (res && res.success)
                                sentSmsCount_1++; })
                                .catch(function (e) { return console.error("SMS fail ".concat(user.uid), e); }));
                        }
                        // Telegram Logic
                        if (user.telegram_notifications_enabled && user.telegram_chat_id) {
                            promises.push((0, telegramService_js_1.sendTelegramMessage)(user.telegram_chat_id, telegramMessage)
                                .then(function () { return sentTelegramCount_1++; })
                                .catch(function (e) { return console.error("Telegram fail ".concat(user.uid), e); }));
                        }
                    };
                    // 4. Send Notifications in Parallel
                    for (_i = 0, usersToNotify_1 = usersToNotify; _i < usersToNotify_1.length; _i++) {
                        user = usersToNotify_1[_i];
                        _loop_1(user);
                    }
                    customLog("[DEBUG] Waiting for ".concat(promises.length, " personal/global promises."));
                    return [4 /*yield*/, Promise.allSettled(promises)];
                case 5:
                    resultsAll = _c.sent();
                    customLog("[DEBUG] All Promise Results:", resultsAll.map(function (r) { return r.status; }));
                    customLog("\u2705 Notifications sent. SMS: ".concat(sentSmsCount_1, ", Telegram: ").concat(sentTelegramCount_1));
                    return [2 /*return*/, {
                            success: true,
                            message: 'Notifications processed',
                            counts: { sms: sentSmsCount_1, telegram: sentTelegramCount_1 },
                            totalTargets: usersToNotify.length
                        }];
                case 6:
                    err_1 = _c.sent();
                    customError('❌ Notification Service Error:', err_1);
                    return [2 /*return*/, { success: false, error: err_1.message }];
                case 7: return [2 /*return*/];
            }
        });
    });
}
