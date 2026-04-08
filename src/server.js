"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var express_1 = require("express");
var body_parser_1 = require("body-parser");
var garantiClient_cjs_1 = require("./garantiClient.cjs");
var cors_1 = require("cors");
var supabase_js_1 = require("@supabase/supabase-js");
var path_1 = require("path");
var node_cron_1 = require("node-cron");
var dotenv_1 = require("dotenv");
var jobBot_js_1 = require("./services/jobBot.js");
var url_1 = require("url");
var fs_1 = require("fs");
var xml2js_1 = require("xml2js");
var courthouses_js_1 = require("../data/courthouses.js");
var garantiPaymentService_js_1 = require("./services/garantiPaymentService.js");
dotenv_1.default.config();
var __filename = (0, url_1.fileURLToPath)(import.meta.url);
var __dirname = path_1.default.dirname(__filename);
var app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false })); // Critical for Garanti Callback
// app.use(express.urlencoded({ extended: true })); // Removed in favor of bodyParser above
// Serve static files from the dist directory (one level up from src where server.js resides)
var staticPath = path_1.default.join(__dirname, '../dist');
console.log('📂 Static Path resolved to:', staticPath);
if (fs_1.default.existsSync(staticPath)) {
    console.log('✅ Static directory exists.');
    console.log('   Contents:', fs_1.default.readdirSync(staticPath));
    var assetsPath = path_1.default.join(staticPath, 'assets');
    if (fs_1.default.existsSync(assetsPath)) {
        console.log('   Assets Contents:', fs_1.default.readdirSync(assetsPath));
    }
    else {
        console.log('   ❌ No assets folder found in dist');
    }
}
else {
    console.error('❌ Static directory DOES NOT exist at:', staticPath);
}
// Log all requests
app.use(function (req, res, next) {
    console.log("Incoming Request: ".concat(req.method, " ").concat(req.url));
    next();
});
app.use(express_1.default.static(staticPath));
// Initialize Supabase Admin Client
var supabaseUrl = process.env.VITE_SUPABASE_URL;
var supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}
var supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseServiceKey);
var notificationService_js_1 = require("./services/notificationService.js");
// Endpoint: Notify users about a new job
app.post('/api/notify-new-job', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, city, courthouse, jobType, jobId, createdBy, date, time, offeredFee, isOutside, result;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, city = _a.city, courthouse = _a.courthouse, jobType = _a.jobType, jobId = _a.jobId, createdBy = _a.createdBy, date = _a.date, time = _a.time, offeredFee = _a.offeredFee, isOutside = _a.isOutside;
                return [4 /*yield*/, (0, notificationService_js_1.notifyNewJob)(supabase, {
                        city: city,
                        courthouse: courthouse,
                        jobType: jobType,
                        jobId: jobId,
                        createdBy: createdBy,
                        date: date,
                        offeredFee: offeredFee,
                        isOutside: isOutside
                    })];
            case 1:
                result = _b.sent();
                if (result.success) {
                    // Trigger Push Notification asynchronously (fire and forget)
                    sendNewJobPush({
                        city: city,
                        courthouse: courthouse,
                        jobType: jobType,
                        jobId: jobId,
                        createdBy: createdBy, // Use this to potentially exclude self-notification?
                        offeredFee: offeredFee,
                        date: date,
                        time: time
                    }).catch(function (err) { return console.error("Async Push Error:", err); });
                    res.json(result);
                }
                else {
                    res.status(500).json(result);
                }
                return [2 /*return*/];
        }
    });
}); });
// Endpoint: Notify applicant about approval
app.post('/api/notify-application-approved', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, applicantId, jobTitle, _b, user, error, message, response, err_1;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = req.body, applicantId = _a.applicantId, jobTitle = _a.jobTitle;
                if (!applicantId) {
                    return [2 /*return*/, res.status(400).json({ error: 'Missing applicantId' })];
                }
                _c.label = 1;
            case 1:
                _c.trys.push([1, 4, , 5]);
                return [4 /*yield*/, supabase
                        .from('users')
                        .select('uid, phone, full_name')
                        .eq('uid', applicantId)
                        .single()];
            case 2:
                _b = _c.sent(), user = _b.data, error = _b.error;
                if (error || !user) {
                    return [2 /*return*/, res.status(404).json({ error: 'User not found' })];
                }
                if (!user.phone) {
                    return [2 /*return*/, res.status(400).json({ error: 'User has no phone number' })];
                }
                message = "Avukat A\u011F\u0131 - Say\u0131n Meslekta\u015F\u0131m\u0131z, \"".concat(jobTitle, "\" g\u00F6revi i\u00E7in ba\u015Fvurunuz kabul edilmi\u015Ftir. G\u00F6revi yapmaya ba\u015Flayabilirsiniz. Detaylar i\u00E7in uygulamay\u0131 kontrol ediniz.");
                return [4 /*yield*/, (0, notificationService_js_1.sendSms)(user.phone, message)];
            case 3:
                response = _c.sent();
                // --- PUSH: Trigger Application Accepted Notification ---
                (0, pushService_js_1.sendPushNotification)({
                    user_id: user.uid, // Applicant ID (wait, is .uid correct from DB select? Yes)
                    title: 'Başvurunuz Onaylandı! 🎉',
                    body: "\"".concat(jobTitle, "\" g\u00F6revi i\u00E7in onayland\u0131n\u0131z. Detaylar\u0131 g\u00F6rmek i\u00E7in dokunun."),
                    data: { type: 'application_approved' }
                }).catch(function (err) { return console.error("Async App Approved Push Error:", err); });
                res.json({ message: 'Notification sent', response: response });
                return [3 /*break*/, 5];
            case 4:
                err_1 = _c.sent();
                console.error('Server error:', err_1);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// Endpoint: Health Check
app.get('/api/health', function (req, res) {
    res.json({ ok: true, time: new Date().toISOString() });
});
// Endpoint: Debug Telegram Env variables (Internal diagnostic)
app.get('/api/debug-telegram-env', function (req, res) {
    res.json({
        globalChatId: process.env.TELEGRAM_GLOBAL_CHAT_ID || 'MISSING',
        botTokenSet: !!process.env.TELEGRAM_BOT_TOKEN
    });
});
app.get('/api/debug-log', function (req, res) {
    try {
        var logPath = path_1.default.join(process.cwd(), 'notification.log');
        if (fs_1.default.existsSync(logPath)) {
            res.type('text/plain').send(fs_1.default.readFileSync(logPath, 'utf8'));
        }
        else {
            res.type('text/plain').send('Log file not found or empty.');
        }
    }
    catch (e) {
        res.type('text/plain').send('Error reading log: ' + e.message);
    }
});
// Endpoint: Activate Beta Trial (Securely)
app.post('/api/activate-beta', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, _a, user, authError, _b, userData, fetchError, now, currentUntil, newUntil, updatePayload, updateError, err_2;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                token = req.body.token;
                if (!token) {
                    return [2 /*return*/, res.status(401).json({ error: 'Missing token' })];
                }
                _c.label = 1;
            case 1:
                _c.trys.push([1, 5, , 6]);
                return [4 /*yield*/, supabase.auth.getUser(token)];
            case 2:
                _a = _c.sent(), user = _a.data.user, authError = _a.error;
                if (authError || !user) {
                    return [2 /*return*/, res.status(401).json({ error: 'Invalid or expired token' })];
                }
                return [4 /*yield*/, supabase
                        .from('users')
                        .select('premium_until, claimed_beta_promo')
                        .eq('uid', user.id)
                        .single()];
            case 3:
                _b = _c.sent(), userData = _b.data, fetchError = _b.error;
                if (fetchError || !userData) {
                    return [2 /*return*/, res.status(404).json({ error: 'User not found in database' })];
                }
                if (userData.claimed_beta_promo) {
                    return [2 /*return*/, res.status(400).json({ error: 'Bu promosyondan daha önce yararlandınız.' })];
                }
                now = new Date();
                currentUntil = userData.premium_until ? new Date(userData.premium_until) : now;
                // If their premium expired, start from now
                if (currentUntil < now) {
                    currentUntil = now;
                }
                newUntil = new Date(currentUntil);
                newUntil.setMonth(newUntil.getMonth() + 2);
                updatePayload = {
                    is_premium: true,
                    membership_type: 'premium_plus',
                    premium_until: newUntil.toISOString(),
                    premium_price: 0,
                    premium_plan: 'beta',
                    claimed_beta_promo: true
                };
                if (currentUntil <= now) {
                    updatePayload.premium_since = now.toISOString();
                }
                return [4 /*yield*/, supabase
                        .from('users')
                        .update(updatePayload)
                        .eq('uid', user.id)];
            case 4:
                updateError = (_c.sent()).error;
                if (updateError) {
                    console.error('Beta activation DB error:', updateError);
                    return [2 /*return*/, res.status(500).json({ error: 'Database update failed' })];
                }
                console.log("\u2705 User ".concat(user.id, " activated BETA trial."));
                res.json({ success: true });
                return [3 /*break*/, 6];
            case 5:
                err_2 = _c.sent();
                console.error('Beta activation server error:', err_2);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
// Endpoint: General SMS sending (protected)
app.post('/api/send-sms', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, phone, message, authHeader, token, _b, user, error, result, err_3;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = req.body, phone = _a.phone, message = _a.message;
                authHeader = req.headers.authorization;
                console.log("Incoming /api/send-sms request", phone);
                if (!authHeader) {
                    return [2 /*return*/, res.status(401).json({ error: 'Missing Authorization header' })];
                }
                if (!phone || !message) {
                    return [2 /*return*/, res.status(400).json({ error: 'Missing phone or message' })];
                }
                _c.label = 1;
            case 1:
                _c.trys.push([1, 4, , 5]);
                token = authHeader.replace('Bearer ', '');
                return [4 /*yield*/, supabase.auth.getUser(token)];
            case 2:
                _b = _c.sent(), user = _b.data.user, error = _b.error;
                if (error || !user) {
                    return [2 /*return*/, res.status(401).json({ error: 'Invalid or expired token' })];
                }
                console.log("\uD83D\uDCE8 Authenticated SMS request from user ".concat(user.id, " to ").concat(phone));
                return [4 /*yield*/, (0, notificationService_js_1.sendSms)(phone, message)];
            case 3:
                result = _c.sent();
                if (result.success) {
                    return [2 /*return*/, res.json(result)];
                }
                else {
                    return [2 /*return*/, res.status(500).json(result)];
                }
                return [3 /*break*/, 5];
            case 4:
                err_3 = _c.sent();
                console.error('Server error during SMS send:', err_3);
                res.status(500).json({ error: 'Internal server error', details: err_3.message });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// --- Payment Endpoints (3D Secure) ---
var garantiPaymentService_js_2 = require("./services/garantiPaymentService.js");
// Endpoint: Initiate 3D Payment
app.post('/api/payment/initiate', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userId, plan, period, price, cardData, billingInfo, _b, user, error, finalPrice, isPremium, isYearly, isPremiumMembership, hasTimeLeft, expiryDate, now, fourMonthsLater, isEligibleForDiscount, orderId, formData, err_4;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = req.body, userId = _a.userId, plan = _a.plan, period = _a.period, price = _a.price, cardData = _a.cardData, billingInfo = _a.billingInfo;
                if (!userId || !cardData || !price) {
                    return [2 /*return*/, res.status(400).json({ error: 'Missing required payment fields' })];
                }
                _c.label = 1;
            case 1:
                _c.trys.push([1, 4, , 5]);
                return [4 /*yield*/, supabase
                        .from('users')
                        .select('email, full_name, is_premium, membership_type, premium_plan, premium_until')
                        .eq('uid', userId)
                        .single()];
            case 2:
                _b = _c.sent(), user = _b.data, error = _b.error;
                if (error || !user)
                    return [2 /*return*/, res.status(404).json({ error: 'User not found' })];
                finalPrice = parseFloat(price);
                // Check for Premium -> Premium Plus Discount Eligibility
                // Conditions: Premium User, Yearly Plan, Upgrading to Premium Plus Yearly, > 4 months remaining
                if (plan === 'premium_plus' && period === 'yearly') {
                    isPremium = user.is_premium;
                    isYearly = user.premium_plan === 'yearly';
                    isPremiumMembership = user.membership_type === 'premium';
                    hasTimeLeft = false;
                    if (user.premium_until) {
                        expiryDate = new Date(user.premium_until);
                        now = new Date();
                        fourMonthsLater = new Date();
                        fourMonthsLater.setMonth(now.getMonth() + 4);
                        if (expiryDate > fourMonthsLater) {
                            hasTimeLeft = true;
                        }
                    }
                    isEligibleForDiscount = isPremium && isYearly && isPremiumMembership && hasTimeLeft;
                    if (isEligibleForDiscount) {
                        console.log("\u2705 User ".concat(userId, " is eligible for Premium+ Upgrade Discount. Price: 500 TL"));
                        // If the frontend sent 500, we accept it. Or we enforce it here.
                        // Let's enforce/validate.
                        // If user sent something else but IS eligible, we could technically allow 500, but let's just validate what was sent matches expectations.
                        // Actually, safer to OVERRIDE or Validate.
                        // If client says 500 and is eligible -> OK.
                        // If client says 1399 but is eligible -> OK (user pays full price, weird but allowed).
                        // If client says 500 but NOT eligible -> REJECT or Correction.
                        // Better approach: Trust the price sent BUT strict check if it's the discounted one.
                        if (Math.abs(finalPrice - 500) < 1) {
                            // OK, authorized
                        }
                        else if (Math.abs(finalPrice - 1399) < 1) {
                            // OK, paying full price
                        }
                        else {
                            // Invalid price for this plan
                            return [2 /*return*/, res.status(400).json({ error: 'Invalid price for this plan.' })];
                        }
                    }
                    else {
                        // Not eligible, must pay full price (1399)
                        if (Math.abs(finalPrice - 500) < 1) {
                            return [2 /*return*/, res.status(400).json({ error: 'Not eligible for discount.' })];
                        }
                    }
                }
                orderId = "AVG-".concat(Date.now(), "-").concat(Math.floor(Math.random() * 1000));
                formData = (0, garantiPaymentService_js_2.generateDtPaymentForm)({
                    orderId: orderId,
                    amount: parseFloat(price),
                    installmentCount: "", // No installments for now
                    cardNumber: cardData.number.replace(/\s/g, ''),
                    expMonth: cardData.expiry.split('/')[0],
                    expYear: cardData.expiry.split('/')[1],
                    cvv: cardData.cvc,
                    cardHolderName: cardData.name,
                    customerEmail: user.email || 'noreply@avukatagi.net',
                    customerIp: req.ip || '127.0.0.1',
                    userId: userId
                });
                // Store temporary transaction state if needed (Optional: create 'transactions' table)
                // For now, we rely on the Callback carrying the OrderID and potentially UserID metadata if we had a way to pass custom fields.
                // Garanti doesn't easily support custom pass-through fields in Form mode except potentially hijacking 'terminaluserid' or similar, but that's risky.
                // Better approach: We will parse userid from 'oid' if we encoded it there, OR we must save the OrderID->UserID mapping in DB.
                // Let's create a Pending Transaction in DB to track who this order belongs to.
                // We'll create a `payment_transactions` table or just store in a simple local cache/log if DB migration is too heavy.
                // Given constraints, I'll encode UserID in OrderID or similar? No, OrderID has length limits.
                // Let's insert a row into a new `payment_logs` table if it existed.
                // As a Quick Fix: I'll repurpose `terminaluserid` field in the Form to store the `userId`. 
                // Docs say `terminaluserid` (Üye işyeri kullanıcı adı). Garanti might validate this.
                // Safe bet: Update `users` table with "last_pending_order_id" = orderId.
                return [4 /*yield*/, supabase.from('users').update({
                        last_order_id: orderId,
                        last_order_plan: plan,
                        last_order_period: period
                    }).eq('uid', userId)];
            case 3:
                // Store temporary transaction state if needed (Optional: create 'transactions' table)
                // For now, we rely on the Callback carrying the OrderID and potentially UserID metadata if we had a way to pass custom fields.
                // Garanti doesn't easily support custom pass-through fields in Form mode except potentially hijacking 'terminaluserid' or similar, but that's risky.
                // Better approach: We will parse userid from 'oid' if we encoded it there, OR we must save the OrderID->UserID mapping in DB.
                // Let's create a Pending Transaction in DB to track who this order belongs to.
                // We'll create a `payment_transactions` table or just store in a simple local cache/log if DB migration is too heavy.
                // Given constraints, I'll encode UserID in OrderID or similar? No, OrderID has length limits.
                // Let's insert a row into a new `payment_logs` table if it existed.
                // As a Quick Fix: I'll repurpose `terminaluserid` field in the Form to store the `userId`. 
                // Docs say `terminaluserid` (Üye işyeri kullanıcı adı). Garanti might validate this.
                // Safe bet: Update `users` table with "last_pending_order_id" = orderId.
                _c.sent();
                res.json(formData);
                return [3 /*break*/, 5];
            case 4:
                err_4 = _c.sent();
                console.error('Payment Init Error:', err_4);
                res.status(500).json({ error: err_4.message });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// Endpoint: Payment Callback FAIL
app.post('/api/payment/callback/fail', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var body, errorMsg;
    return __generator(this, function (_a) {
        console.log('❌ Payment Failed Callback Body:', req.body);
        console.log('❌ Payment Failed Callback Headers:', req.headers);
        body = req.body || {};
        errorMsg = body.mderrormessage || body.errmsg || 'Ödeme başarısız oldu (Bilinmeyen Hata).';
        // Redirect to frontend error page
        res.redirect("https://avukatagi.net/payment-failed?msg=".concat(encodeURIComponent(errorMsg), "&code=").concat(body.procreturncode, "&md=").concat(body.mdstatus, "&hashparams=").concat(encodeURIComponent(body.hashparams || ''), "&oid=").concat(body.orderid));
        return [2 /*return*/];
    });
}); });
// Endpoint: Payment Callback SUCCESS
app.post('/api/payment/callback/success', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var isValid, orderId, _a, user, error, plan, period, amount, updateData;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                console.log('✅ Payment Success Callback:', req.body);
                isValid = (0, garantiPaymentService_js_1.verifyGarantiCallback)(req.body);
                if (!isValid) {
                    console.error('❌ Hash Mismatch! Possible Fraud.');
                    return [2 /*return*/, res.redirect('https://avukatagi.net/payment-failed?msg=Guvenlik_Hatasi')];
                }
                // 2. Check ProcReturnCode (must be 00)
                if (req.body.procreturncode !== '00') {
                    console.error('❌ ProcReturnCode Not 00:', req.body.procreturncode);
                    return [2 /*return*/, res.redirect("https://avukatagi.net/payment-failed?msg=".concat(encodeURIComponent(req.body.errmsg || 'Islem onaylanmadi'), "&code=").concat(req.body.procreturncode))];
                }
                orderId = req.body.orderid;
                return [4 /*yield*/, supabase
                        .from('users')
                        .select('*')
                        .eq('last_order_id', orderId)
                        .single()];
            case 1:
                _a = _b.sent(), user = _a.data, error = _a.error;
                if (error || !user) {
                    console.error('❌ Could not find user for OrderID:', orderId);
                    return [2 /*return*/, res.redirect('https://avukatagi.net/payment-failed?msg=Kullanici_Bulunamadi')];
                }
                plan = user.last_order_plan || 'pro';
                period = user.last_order_period || 'monthly';
                amount = parseFloat(req.body.txnamount) / 100;
                updateData = {
                    is_premium: true,
                    membership_type: plan,
                    premium_plan: period,
                    premium_price: amount,
                    premium_since: new Date().toISOString(),
                    premium_until: new Date(Date.now() + ((period === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000)).toISOString(),
                    updated_at: new Date().toISOString(),
                    last_order_id: null // Clear it
                };
                return [4 /*yield*/, supabase.from('users').update(updateData).eq('uid', user.uid)];
            case 2:
                _b.sent();
                console.log("\uD83C\uDF89 User ".concat(user.uid, " upgraded via 3D Secure!"));
                // Redirect to BrowserRouter path
                res.redirect('https://avukatagi.net/payment-success');
                return [2 /*return*/];
        }
    });
}); });
app.get("/api/garanti/test-sale", function (req, res) {
    res.status(405).send("Method Not Allowed. Please use POST to submit a sale request.");
});
app.post("/api/garanti/test-sale", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, amount, cardNumber, expMonth, expYear, cvv, email, userId, plan, period, billingInfo, orderId, result, updateData, _b, data, error, err_5;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 5, , 6]);
                _a = req.body, amount = _a.amount, cardNumber = _a.cardNumber, expMonth = _a.expMonth, expYear = _a.expYear, cvv = _a.cvv, email = _a.email, userId = _a.userId, plan = _a.plan, period = _a.period, billingInfo = _a.billingInfo;
                orderId = Date.now().toString();
                return [4 /*yield*/, (0, garantiClient_cjs_1.sendSaleRequest)({
                        orderId: orderId,
                        amountMajor: parseFloat(amount),
                        cardNumber: cardNumber,
                        expMonth: expMonth,
                        expYear: expYear,
                        cvv: cvv,
                        customerEmail: email,
                    })];
            case 1:
                result = _c.sent();
                if (!(result.approved && userId)) return [3 /*break*/, 3];
                updateData = {
                    is_premium: true,
                    membership_type: plan,
                    premium_plan: period,
                    premium_price: parseFloat(amount),
                    premium_since: new Date().toISOString(),
                    premium_until: new Date(Date.now() + ((period === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000)).toISOString(),
                    updated_at: new Date().toISOString(),
                    billing_address: billingInfo === null || billingInfo === void 0 ? void 0 : billingInfo.address,
                    tc_id: billingInfo === null || billingInfo === void 0 ? void 0 : billingInfo.tcId
                };
                // const fs = require('fs'); // Removed: using top-level import
                fs_1.default.appendFileSync('debug_log.txt', "\n--- Supabase Update Attempt ---\nUser: ".concat(userId, "\nPlan: ").concat(plan, "\nData: ").concat(JSON.stringify(updateData, null, 2), "\n"));
                return [4 /*yield*/, supabase.from('users').update(updateData).eq('uid', userId).select()];
            case 2:
                _b = _c.sent(), data = _b.data, error = _b.error;
                if (error) {
                    console.error("Supabase update error:", error);
                    fs_1.default.appendFileSync('debug_log.txt', "Error: ".concat(JSON.stringify(error, null, 2), "\n-------------------------------\n"));
                }
                else {
                    console.log("User ".concat(userId, " upgraded to ").concat(plan));
                    fs_1.default.appendFileSync('debug_log.txt', "Success: Updated ".concat(data === null || data === void 0 ? void 0 : data.length, " rows.\n-------------------------------\n"));
                }
                return [3 /*break*/, 4];
            case 3:
                // const fs = require('fs'); // Removed: using top-level import
                fs_1.default.appendFileSync('debug_log.txt', "\n--- Supabase Update Skipped ---\nApproved: ".concat(result.approved, "\nUserId: ").concat(userId, "\n-------------------------------\n"));
                _c.label = 4;
            case 4:
                res.json(result);
                return [3 /*break*/, 6];
            case 5:
                err_5 = _c.sent();
                console.error(err_5);
                // const fs = require('fs'); // Removed: using top-level import
                try {
                    fs_1.default.appendFileSync('debug_log.txt', "\n--- SALE REQUEST ERROR ---\nError: ".concat(err_5.message, "\nStack: ").concat(err_5.stack, "\n--------------------------\n"));
                }
                catch (e) { }
                res.status(500).json({ error: "Garanti test sale failed", details: err_5 === null || err_5 === void 0 ? void 0 : err_5.message });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
// Endpoint: RSS Feed for Zapier/Telegram
app.get('/rss', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, jobs, error, feedObj, builder, xml, err_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, supabase
                        .from('jobs')
                        .select('*')
                        .eq('status', 'open') // Only active/open jobs
                        .order('created_at', { ascending: false })
                        .limit(20)];
            case 1:
                _a = _b.sent(), jobs = _a.data, error = _a.error;
                if (error)
                    throw error;
                feedObj = {
                    rss: {
                        $: {
                            version: "2.0",
                            "xmlns:atom": "http://www.w3.org/2005/Atom"
                        },
                        channel: {
                            title: "AvukatAğı Yeni Görevler",
                            link: "https://avukatagi.net",
                            description: "AvukatAğı üzerinde yayınlanan en yeni görevler.",
                            language: "tr-TR",
                            lastBuildDate: new Date().toUTCString(),
                            item: jobs === null || jobs === void 0 ? void 0 : jobs.map(function (job) {
                                var cityCourthouses = courthouses_js_1.COURTHOUSES[job.city] || [];
                                var isKnown = cityCourthouses.includes(job.courthouse);
                                // If not known, treat as Outside
                                var isOutside = !isKnown;
                                var title = '';
                                var locationLine = '';
                                if (isOutside) {
                                    title = "".concat(job.city, " (Adliye D\u0131\u015F\u0131) - ").concat(job.courthouse);
                                    locationLine = "<strong>G\u00F6rev Yeri:</strong> ".concat(job.courthouse);
                                }
                                else {
                                    title = "".concat(job.city, " - ").concat(job.courthouse, " - ").concat(job.job_type);
                                    locationLine = "<strong>Adliye:</strong> ".concat(job.courthouse);
                                }
                                // Format date to DD/MM/YYYY
                                var formattedDate = job.date;
                                if (job.date && job.date.includes('-')) {
                                    var parts = job.date.split('-');
                                    if (parts.length === 3) {
                                        formattedDate = "".concat(parts[2], "/").concat(parts[1], "/").concat(parts[0]);
                                    }
                                }
                                return {
                                    title: title,
                                    link: "https://avukatagi.net/job/".concat(job.job_id),
                                    description: "\n                                <strong>\u015Eehir:</strong> ".concat(job.city, "<br>\n                                ").concat(locationLine, "<br>\n                                <strong>G\u00F6rev T\u00FCr\u00FC:</strong> ").concat(job.job_type, "<br>\n                                <strong>Tarih:</strong> ").concat(formattedDate, " ").concat(job.time, "<br>\n                                <strong>\u00DCcret:</strong> ").concat(job.offered_fee, " TL\n                            ").trim(),
                                    pubDate: new Date(job.created_at).toUTCString(),
                                    guid: {
                                        $: { isPermaLink: "false" },
                                        _: job.job_id
                                    }
                                };
                            })
                        }
                    }
                };
                builder = new xml2js_1.Builder();
                xml = builder.buildObject(feedObj);
                res.set('Content-Type', 'application/xml');
                res.send(xml);
                return [3 /*break*/, 3];
            case 2:
                err_6 = _b.sent();
                console.error('RSS Generation Error:', err_6);
                res.status(500).send('Error generating RSS feed');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Endpoint: Get Marketing Stats
app.get('/api/admin/marketing-stats', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var authHeader, token, _a, user, error, profile, sentCount, unsentCount, err_7;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                authHeader = req.headers.authorization;
                if (!authHeader)
                    return [2 /*return*/, res.status(401).json({ error: "No token provided" })];
                token = authHeader.replace('Bearer ', '');
                return [4 /*yield*/, supabase.auth.getUser(token)];
            case 1:
                _a = _b.sent(), user = _a.data.user, error = _a.error;
                if (error || !user)
                    return [2 /*return*/, res.status(401).json({ error: "Invalid token" })];
                return [4 /*yield*/, supabase.from('users').select('role').eq('uid', user.id).single()];
            case 2:
                profile = (_b.sent()).data;
                if ((profile === null || profile === void 0 ? void 0 : profile.role) !== 'admin')
                    return [2 /*return*/, res.status(403).json({ error: "Unauthorized" })];
                return [4 /*yield*/, supabase.from('marketing_emails').select('*', { count: 'exact', head: true }).eq('sent', true)];
            case 3:
                sentCount = (_b.sent()).count;
                return [4 /*yield*/, supabase.from('marketing_emails').select('*', { count: 'exact', head: true }).eq('sent', false)];
            case 4:
                unsentCount = (_b.sent()).count;
                res.json({ sent: sentCount || 0, unsent: unsentCount || 0, total: (sentCount || 0) + (unsentCount || 0) });
                return [3 /*break*/, 6];
            case 5:
                err_7 = _b.sent();
                console.error('Marketing Stats Error:', err_7);
                res.status(500).json({ error: 'Failed to fetch stats', details: err_7.message });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
// Endpoint: Send 100 marketing emails
app.post('/api/admin/send-marketing', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var authHeader, token, _a, user, error, profile, _b, unsentEmails, fetchError, validEmails_1, invalidEmails, MAILTRAP_TOKEN, payload, response, errorText, sentEmails, updateError, err_8;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 10, , 11]);
                authHeader = req.headers.authorization;
                if (!authHeader)
                    return [2 /*return*/, res.status(401).json({ error: "No token provided" })];
                token = authHeader.replace('Bearer ', '');
                return [4 /*yield*/, supabase.auth.getUser(token)];
            case 1:
                _a = _c.sent(), user = _a.data.user, error = _a.error;
                if (error || !user)
                    return [2 /*return*/, res.status(401).json({ error: "Invalid token" })];
                return [4 /*yield*/, supabase.from('users').select('role').eq('uid', user.id).single()];
            case 2:
                profile = (_c.sent()).data;
                if ((profile === null || profile === void 0 ? void 0 : profile.role) !== 'admin')
                    return [2 /*return*/, res.status(403).json({ error: "Unauthorized" })];
                return [4 /*yield*/, supabase
                        .from('marketing_emails')
                        .select('*')
                        .eq('sent', false)
                        .limit(100)];
            case 3:
                _b = _c.sent(), unsentEmails = _b.data, fetchError = _b.error;
                if (fetchError)
                    throw fetchError;
                if (!unsentEmails || unsentEmails.length === 0) {
                    return [2 /*return*/, res.json({ message: 'Tüm gönderimler tamamlandı.', count: 0 })];
                }
                validEmails_1 = unsentEmails.filter(function (e) {
                    var emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                    return e.email && emailRegex.test(e.email);
                });
                invalidEmails = unsentEmails.filter(function (e) { return !validEmails_1.includes(e); });
                if (!(invalidEmails.length > 0)) return [3 /*break*/, 5];
                console.warn("Skipping ".concat(invalidEmails.length, " invalid emails."));
                // Mark invalid emails as sent so they don't block the queue
                return [4 /*yield*/, supabase
                        .from('marketing_emails')
                        .update({ sent: true, sent_at: new Date().toISOString() })
                        .in('email', invalidEmails.map(function (e) { return e.email; }))];
            case 4:
                // Mark invalid emails as sent so they don't block the queue
                _c.sent();
                _c.label = 5;
            case 5:
                if (validEmails_1.length === 0) {
                    return [2 /*return*/, res.json({ message: 'Geçerli e-posta adresi bulunamadı. Hatalı adresler atlandı.', count: 0 })];
                }
                MAILTRAP_TOKEN = '6f03fcbc60f27b98ec05e5bc932eb05c';
                payload = {
                    from: { email: "hello@avukatagi.net", name: "AvukatAğı" },
                    to: validEmails_1.map(function (e) { return ({ email: e.email, name: "".concat(e.first_name || '', " ").concat(e.last_name || '').trim() }); }),
                    template_uuid: "029f73fa-3a7a-4850-a6ab-4241898bd502",
                    template_variables: {}
                };
                return [4 /*yield*/, fetch("https://bulk.api.mailtrap.io/api/send", {
                        method: "POST",
                        headers: {
                            "Authorization": "Bearer ".concat(MAILTRAP_TOKEN),
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(payload)
                    })];
            case 6:
                response = _c.sent();
                if (!!response.ok) return [3 /*break*/, 8];
                return [4 /*yield*/, response.text()];
            case 7:
                errorText = _c.sent();
                throw new Error("Mailtrap API error: ".concat(response.status, " ").concat(errorText));
            case 8:
                sentEmails = validEmails_1.map(function (e) { return e.email; });
                return [4 /*yield*/, supabase
                        .from('marketing_emails')
                        .update({ sent: true, sent_at: new Date().toISOString() })
                        .in('email', sentEmails)];
            case 9:
                updateError = (_c.sent()).error;
                if (updateError)
                    throw updateError;
                res.json({ message: "Ba\u015Far\u0131yla ".concat(sentEmails.length, " ki\u015Fiye e-posta g\u00F6nderildi. ").concat(invalidEmails.length > 0 ? "(".concat(invalidEmails.length, " hatal\u0131 e-posta atland\u0131)") : ''), count: sentEmails.length });
                return [3 /*break*/, 11];
            case 10:
                err_8 = _c.sent();
                console.error('Marketing Bulk Send Error:', err_8);
                res.status(500).json({ error: 'Gönderim başarısız.', details: err_8.message });
                return [3 /*break*/, 11];
            case 11: return [2 /*return*/];
        }
    });
}); });
// Removed React routing wildcard from middle of file to place it at the end
// Endpoint: Manually trigger Job Bot
app.post('/api/trigger-bot', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var err_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                console.log('🤖 Manual Trigger: Starting Job Bot...');
                return [4 /*yield*/, (0, jobBot_js_1.runJobBot)(supabase)];
            case 1:
                _a.sent();
                res.json({ message: 'Job Bot triggered successfully. Check server logs for details.' });
                return [3 /*break*/, 3];
            case 2:
                err_9 = _a.sent();
                console.error('Manual Trigger Error:', err_9);
                res.status(500).json({ error: 'Failed to trigger bot', details: err_9.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Job Bot Schedule (Every 20 minutes)
node_cron_1.default.schedule('*/20 * * * *', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('🤖 Cron Job: Triggering Job Bot...');
                return [4 /*yield*/, (0, jobBot_js_1.runJobBot)(supabase)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
// --- Push Notification Cron Jobs ---
// 1. Premium Expiry Warning (Daily at 10:00 AM)
node_cron_1.default.schedule('0 10 * * *', function () { return __awaiter(void 0, void 0, void 0, function () {
    var tomorrow, tomorrowStr, rangeStart, rangeEnd, _a, expiringUsers, error, err_10;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                console.log('⏰ Cron: Checking Premium Expiry...');
                _b.label = 1;
            case 1:
                _b.trys.push([1, 5, , 6]);
                tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                tomorrowStr = tomorrow.toISOString().split('T')[0];
                rangeStart = "".concat(tomorrowStr, "T00:00:00.000Z");
                rangeEnd = "".concat(tomorrowStr, "T23:59:59.999Z");
                return [4 /*yield*/, supabase
                        .from('users')
                        .select('uid, full_name, premium_until')
                        .gte('premium_until', rangeStart)
                        .lte('premium_until', rangeEnd)];
            case 2:
                _a = _b.sent(), expiringUsers = _a.data, error = _a.error;
                if (error) {
                    console.error('❌ Failed to fetch expiring users:', error);
                    return [2 /*return*/];
                }
                if (!(expiringUsers && expiringUsers.length > 0)) return [3 /*break*/, 4];
                console.log("\u26A0\uFE0F Founding ".concat(expiringUsers.length, " users expiring tomorrow."));
                return [4 /*yield*/, Promise.all(expiringUsers.map(function (u) {
                        return (0, pushService_js_1.sendPushNotification)({
                            user_id: u.uid,
                            title: 'Üyeliğiniz Sona Eriyor',
                            body: 'Premium avantajlarını kaybetmemek için üyeliğinizi yenilemeyi unutmayın.',
                            data: { type: 'premium_expiry' }
                        });
                    }))];
            case 3:
                _b.sent();
                _b.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                err_10 = _b.sent();
                console.error('Cron Expiry Error:', err_10);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
// 2. Job Application Window Timeout (Every minute)
// Notify Job Owner when the application period (5m or 15m) ends so they can select an applicant.
node_cron_1.default.schedule('* * * * *', function () { return __awaiter(void 0, void 0, void 0, function () {
    var now, oneMin, win15_start, win15_end, win5_start, win5_end, _a, jobs, error, err_11;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                now = Date.now();
                oneMin = 60 * 1000;
                win15_start = new Date(now - 15 * oneMin - oneMin).toISOString();
                win15_end = new Date(now - 15 * oneMin).toISOString();
                win5_start = new Date(now - 5 * oneMin - oneMin).toISOString();
                win5_end = new Date(now - 5 * oneMin).toISOString();
                _b.label = 1;
            case 1:
                _b.trys.push([1, 5, , 6]);
                return [4 /*yield*/, supabase
                        .from('jobs')
                        .select('job_id, user_id, city, courthouse, created_at, job_type')
                        .eq('status', 'open')
                        .gte('created_at', win15_start)
                        .lte('created_at', win15_end)];
            case 2:
                _a = _b.sent(), jobs = _a.data, error = _a.error;
                if (!(jobs && jobs.length > 0)) return [3 /*break*/, 4];
                console.log("\u23F3 Job Timeout Check: Found ".concat(jobs.length, " jobs passing 15m mark."));
                return [4 /*yield*/, Promise.all(jobs.map(function (job) {
                        return (0, pushService_js_1.sendPushNotification)({
                            user_id: job.user_id, // Notify Owner
                            title: 'Başvuru Süresi Doldu',
                            body: "".concat(job.city, " ").concat(job.courthouse, " g\u00F6reviniz i\u00E7in ba\u015Fvurular\u0131 inceleyip atama yapabilirsiniz."),
                            data: { jobId: job.job_id, type: 'job_timeout' }
                        });
                    }))];
            case 3:
                _b.sent();
                _b.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                err_11 = _b.sent();
                console.error('Job Timeout Cron Error:', err_11);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
// Telegram Service Imports
var telegramService_js_1 = require("./services/telegramService.js");
// --- Telegram Webhook Endpoint ---
// This endpoint receives updates from Telegram (e.g. /start 123456)
app.post('/api/telegram/webhook', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var secretToken, EXPECTED_SECRET, update, messageText, chatId, userIdFromTelegram, parts, code, _a, linkRecord, fetchError, avukatUserId, updateError, err_12;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                secretToken = req.headers['x-telegram-bot-api-secret-token'];
                EXPECTED_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET;
                // 1. Security Check
                if (EXPECTED_SECRET && secretToken !== EXPECTED_SECRET) {
                    console.warn('⚠️ Telegram Webhook: Invalid Secret Token');
                    return [2 /*return*/, res.status(403).send('Forbidden')];
                }
                _d.label = 1;
            case 1:
                _d.trys.push([1, 13, , 14]);
                update = req.body;
                // We only care about messages with text
                if (!update.message || !update.message.text) {
                    return [2 /*return*/, res.status(200).send('OK')];
                }
                messageText = update.message.text.trim();
                chatId = update.message.chat.id.toString();
                userIdFromTelegram = (_c = (_b = update.message.from) === null || _b === void 0 ? void 0 : _b.id) === null || _c === void 0 ? void 0 : _c.toString();
                console.log("\uD83D\uDCE9 Telegram Message from ".concat(chatId, ": ").concat(messageText));
                if (!messageText.startsWith('/start')) return [3 /*break*/, 12];
                parts = messageText.split(' ');
                if (!(parts.length === 2)) return [3 /*break*/, 10];
                code = parts[1].trim();
                return [4 /*yield*/, supabase
                        .from('telegram_link_codes')
                        .select('*')
                        .eq('code', code)
                        .is('used_at', null)
                        .gt('expires_at', new Date().toISOString())
                        .single()];
            case 2:
                _a = _d.sent(), linkRecord = _a.data, fetchError = _a.error;
                if (!(fetchError || !linkRecord)) return [3 /*break*/, 4];
                return [4 /*yield*/, (0, telegramService_js_1.sendTelegramMessage)(chatId, '❌ Bu kod geçersiz veya süresi dolmuş. Lütfen uygulamadan yeni bir kod alınız.')];
            case 3:
                _d.sent();
                return [2 /*return*/, res.status(200).send('OK')];
            case 4:
                avukatUserId = linkRecord.user_id;
                return [4 /*yield*/, supabase
                        .from('users')
                        .update({
                        telegram_chat_id: chatId,
                        telegram_notifications_enabled: true,
                        telegram_connected_at: new Date().toISOString()
                    })
                        .eq('uid', avukatUserId)];
            case 5:
                updateError = (_d.sent()).error;
                if (!updateError) return [3 /*break*/, 7];
                console.error('❌ Failed to link Telegram user:', updateError);
                return [4 /*yield*/, (0, telegramService_js_1.sendTelegramMessage)(chatId, '❌ Bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.')];
            case 6:
                _d.sent();
                return [2 /*return*/, res.status(200).send('OK')];
            case 7: 
            // Mark code as used
            return [4 /*yield*/, supabase
                    .from('telegram_link_codes')
                    .update({ used_at: new Date().toISOString() })
                    .eq('id', linkRecord.id)];
            case 8:
                // Mark code as used
                _d.sent();
                return [4 /*yield*/, (0, telegramService_js_1.sendTelegramMessage)(chatId, '✅ Hesabınız başarıyla eşleşti! Artık platformdaki önemli bildirimleri buradan alacaksınız.')];
            case 9:
                _d.sent();
                console.log("\u2705 Telegram Linked: User ".concat(avukatUserId, " -> Chat ").concat(chatId));
                return [3 /*break*/, 12];
            case 10: return [4 /*yield*/, (0, telegramService_js_1.sendTelegramMessage)(chatId, '👋 Merhaba! AvukatAğı botuna hoş geldiniz. Hesabınızı bağlamak için uygulamadaki "Ayarlar" sayfasından alacağınız kodu kullanın.')];
            case 11:
                _d.sent();
                _d.label = 12;
            case 12:
                res.status(200).send('OK');
                return [3 /*break*/, 14];
            case 13:
                err_12 = _d.sent();
                console.error('❌ Telegram Webhook Error:', err_12);
                // Always return 200 to Telegram to prevent retry loops
                res.status(200).send('OK');
                return [3 /*break*/, 14];
            case 14: return [2 /*return*/];
        }
    });
}); });
// --- Generate Link Code Endpoint ---
app.post('/api/telegram/link-code', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, _a, user, error, userId, existingCode, code, expiresAt, insertError, err_13;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                token = req.body.token;
                if (!token)
                    return [2 /*return*/, res.status(400).json({ error: 'Missing token' })];
                _b.label = 1;
            case 1:
                _b.trys.push([1, 6, , 7]);
                return [4 /*yield*/, supabase.auth.getUser(token)];
            case 2:
                _a = _b.sent(), user = _a.data.user, error = _a.error;
                if (error || !user)
                    return [2 /*return*/, res.status(401).json({ error: 'Unauthorized' })];
                userId = user.id;
                return [4 /*yield*/, supabase
                        .from('telegram_link_codes')
                        .select('code, expires_at')
                        .eq('user_id', userId)
                        .is('used_at', null)
                        .gt('expires_at', new Date().toISOString())
                        .maybeSingle()];
            case 3:
                existingCode = (_b.sent()).data;
                if (existingCode) {
                    console.log("\u267B\uFE0F Reusing existing active code for user ".concat(userId));
                    return [2 /*return*/, res.json({ code: existingCode.code, expiresAt: existingCode.expires_at })];
                }
                // 2. Clean up old unused codes for this user to keep DB clean
                return [4 /*yield*/, supabase
                        .from('telegram_link_codes')
                        .delete()
                        .eq('user_id', userId)
                        .is('used_at', null)];
            case 4:
                // 2. Clean up old unused codes for this user to keep DB clean
                _b.sent();
                code = Math.floor(100000 + Math.random() * 900000).toString();
                expiresAt = new Date(Date.now() + 10 * 60 * 1000);
                return [4 /*yield*/, supabase
                        .from('telegram_link_codes')
                        .insert({
                        user_id: userId,
                        code: code,
                        expires_at: expiresAt.toISOString()
                    })];
            case 5:
                insertError = (_b.sent()).error;
                if (insertError) {
                    console.error('❌ Failed to generate link code:', insertError);
                    return [2 /*return*/, res.status(500).json({ error: 'Failed to generate code' })];
                }
                res.json({ code: code, expiresAt: expiresAt });
                return [3 /*break*/, 7];
            case 6:
                err_13 = _b.sent();
                console.error('Server error:', err_13);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
// --- Setup Webhook Manual Endpoint (Optional/Admin) ---
app.post('/api/telegram/setup-webhook', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var secret, baseUrl, webhookUrl, webhookSecret, result, err_14;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                secret = req.body.secret;
                if (secret !== process.env.SUPABASE_SERVICE_ROLE_KEY) {
                    return [2 /*return*/, res.status(403).json({ error: 'Forbidden' })];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                baseUrl = process.env.PUBLIC_BASE_URL || 'https://avukatagi.net';
                webhookUrl = "".concat(baseUrl, "/api/telegram/webhook");
                webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
                console.log("Setting Telegram Webhook to: ".concat(webhookUrl));
                return [4 /*yield*/, (0, telegramService_js_1.setTelegramWebhook)(webhookUrl, webhookSecret)];
            case 2:
                result = _a.sent();
                res.json(result);
                return [3 /*break*/, 4];
            case 3:
                err_14 = _a.sent();
                console.error('Webhook setup error:', err_14.message);
                res.status(500).json({ error: err_14.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
var port = process.env.PORT || 3001;
// --- Push Notifications Integration ---
var pushService_js_1 = require("./services/pushService.js");
// Helper: Notify users of new job (Push)
// Called within /api/notify-new-job logic
function sendNewJobPush(parsedJob) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, users, error, formattedDate, parts, timeStr, title_1, body_1, err_15;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, supabase
                            .from('users')
                            .select('uid, preferred_courthouses, full_name')
                            .contains('preferred_courthouses', [parsedJob.courthouse])];
                case 1:
                    _a = _b.sent(), users = _a.data, error = _a.error;
                    if (error) {
                        console.error('❌ Failed to fetch users for push:', error);
                        return [2 /*return*/];
                    }
                    if (!users || users.length === 0) {
                        return [2 /*return*/];
                    }
                    console.log("\uD83D\uDCE3 Sending New Job Push to ".concat(users.length, " users."));
                    formattedDate = parsedJob.date;
                    if (parsedJob.date && parsedJob.date.includes('-')) {
                        parts = parsedJob.date.split('-');
                        if (parts.length === 3) {
                            formattedDate = "".concat(parts[2], "/").concat(parts[1], "/").concat(parts[0]);
                        }
                    }
                    timeStr = parsedJob.time ? "\u23F0 ".concat(parsedJob.time) : '';
                    title_1 = "Yeni G\u00F6rev: ".concat(parsedJob.jobType);
                    body_1 = "".concat(parsedJob.city, " - ").concat(parsedJob.courthouse, "\n\uD83D\uDCC5 ").concat(formattedDate, " ").concat(timeStr, "\n\uD83D\uDCB0 ").concat(parsedJob.offeredFee, " TL\nDetaylar i\u00E7in dokunun.");
                    // Use Promise.all for speed
                    return [4 /*yield*/, Promise.all(users.map(function (u) {
                            return (0, pushService_js_1.sendPushNotification)({
                                user_id: u.uid,
                                title: title_1,
                                body: body_1,
                                data: { jobId: parsedJob.jobId, type: 'new_job' }
                            });
                        }))];
                case 2:
                    // Use Promise.all for speed
                    _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_15 = _b.sent();
                    console.error('❌ Push Logic Error inside sendNewJobPush:', err_15);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// Update /api/notify-new-job to call this
// NOTE: We are patching the existing route handler logic below by redefining the route or injecting calls.
// Since I can't easily inject into the middle of the existing handler with 'replace_file_content' without replacing the whole block, 
// I will create a separate helper and call it. 
// However, the cleanest way is to MODIFY the existing route handler. 
// --- Admin Push Endpoint ---
app.post('/api/admin/send-push', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userIds, title, body, filters, authHeader, token, _b, user, error, targetUserIds, query, isPremiumBool, _c, usersData, usersError, results, err_16;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _a = req.body, userIds = _a.userIds, title = _a.title, body = _a.body, filters = _a.filters;
                authHeader = req.headers.authorization;
                if (!authHeader) {
                    return [2 /*return*/, res.status(401).json({ error: 'Missing Authorization header' })];
                }
                _d.label = 1;
            case 1:
                _d.trys.push([1, 8, , 9]);
                token = authHeader.replace('Bearer ', '');
                return [4 /*yield*/, supabase.auth.getUser(token)];
            case 2:
                _b = _d.sent(), user = _b.data.user, error = _b.error;
                if (error || !user) {
                    return [2 /*return*/, res.status(401).json({ error: 'Invalid token' })];
                }
                targetUserIds = [];
                if (!(userIds && Array.isArray(userIds) && userIds.length > 0)) return [3 /*break*/, 3];
                targetUserIds = userIds;
                return [3 /*break*/, 6];
            case 3:
                if (!filters) return [3 /*break*/, 5];
                query = supabase.from('users').select('uid');
                if (filters.isPremium !== undefined && filters.isPremium !== 'all') {
                    isPremiumBool = filters.isPremium === true || filters.isPremium === 'true';
                    query = query.eq('is_premium', isPremiumBool);
                }
                if (filters.city && filters.city !== '' && filters.city !== 'all') {
                    query = query.eq('city', filters.city);
                }
                return [4 /*yield*/, query];
            case 4:
                _c = _d.sent(), usersData = _c.data, usersError = _c.error;
                if (usersError) {
                    console.error("Error fetching filtered users:", usersError);
                    return [2 /*return*/, res.status(500).json({ error: 'Error fetching users' })];
                }
                if (usersData) {
                    targetUserIds = usersData.map(function (u) { return u.uid; });
                }
                return [3 /*break*/, 6];
            case 5: return [2 /*return*/, res.status(400).json({ error: 'Invalid payload: Provide userIds or filters' })];
            case 6:
                if (!title || !body) {
                    return [2 /*return*/, res.status(400).json({ error: 'Invalid payload: Missing title or body' })];
                }
                if (targetUserIds.length === 0) {
                    return [2 /*return*/, res.json({ sent: 0, message: "No users matching criteria found." })];
                }
                console.log("\uD83D\uDC6E Admin Push: Sending to ".concat(targetUserIds.length, " users (Requested by ").concat(user.email, ")."));
                return [4 /*yield*/, Promise.all(targetUserIds.map(function (uid) {
                        return (0, pushService_js_1.sendPushNotification)({
                            user_id: uid,
                            title: title,
                            body: body,
                            data: { type: 'admin_msg' }
                        });
                    }))];
            case 7:
                results = _d.sent();
                res.json({ sent: results.length });
                return [3 /*break*/, 9];
            case 8:
                err_16 = _d.sent();
                console.error('Admin Push Error:', err_16);
                res.status(500).json({ error: 'Internal Server Error' });
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); });
// Endpoint: Delete Account
app.post('/api/delete-account', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, uid, token, _b, user, authError, currentUser, originalPhone, anonymizedEmail, anonymizedPhone, updateError, deleteError, banError, err_17;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = req.body, uid = _a.uid, token = _a.token;
                if (!uid || !token) {
                    return [2 /*return*/, res.status(400).json({ error: 'Missing uid or token' })];
                }
                _c.label = 1;
            case 1:
                _c.trys.push([1, 8, , 9]);
                return [4 /*yield*/, supabase.auth.getUser(token)];
            case 2:
                _b = _c.sent(), user = _b.data.user, authError = _b.error;
                if (authError || !user || user.id !== uid) {
                    return [2 /*return*/, res.status(401).json({ error: 'Unauthorized: Invalid token or user mismatch.' })];
                }
                console.log("\uD83D\uDDD1\uFE0F Deleting account for user: ".concat(uid));
                return [4 /*yield*/, supabase.from('users').select('phone').eq('uid', uid).single()];
            case 3:
                currentUser = (_c.sent()).data;
                originalPhone = (currentUser === null || currentUser === void 0 ? void 0 : currentUser.phone) || 'unknown';
                anonymizedEmail = "deleted_".concat(uid, "_").concat(Date.now(), "@avukatagi.net");
                anonymizedPhone = "DEL_".concat(originalPhone);
                return [4 /*yield*/, supabase
                        .from('users')
                        .update({
                        full_name: 'Silinmiş Kullanıcı',
                        email: anonymizedEmail,
                        phone: anonymizedPhone,
                        about_me: null,
                        avatar_url: null,
                        job_status: 'passive',
                        telegram_chat_id: null,
                        telegram_notifications_enabled: false,
                        sms_notifications_enabled: false,
                        // Optional: clear other PII
                    })
                        .eq('uid', uid)];
            case 4:
                updateError = (_c.sent()).error;
                if (updateError) {
                    console.error('Failed to anonymize user data:', updateError);
                    return [2 /*return*/, res.status(500).json({ error: 'Failed to clear user data.' })];
                }
                return [4 /*yield*/, supabase.auth.admin.deleteUser(uid)];
            case 5:
                deleteError = (_c.sent()).error;
                if (!deleteError) return [3 /*break*/, 7];
                console.error('Failed to delete auth user (likely due to FK constraints). Attempting Fallback (Ban & Email Release)...', deleteError);
                return [4 /*yield*/, supabase.auth.admin.updateUserById(uid, {
                        email: anonymizedEmail,
                        ban_duration: "876000h", // ~100 years
                        user_metadata: { deleted: true }
                    })];
            case 6:
                banError = (_c.sent()).error;
                if (banError) {
                    console.error('CRITICAL: Failed to BAN user after deletion failure:', banError);
                    return [2 /*return*/, res.status(500).json({ error: 'Failed to delete or ban account. Please contact support.' })];
                }
                console.log("\u2705 User ".concat(uid, " BANNED and Email Anonymized (Fallback Success)."));
                _c.label = 7;
            case 7:
                console.log("\u2705 Account deleted successfully: ".concat(uid));
                res.json({ success: true, message: 'Hesap başarıyla silindi ve veriler anonimleştirildi.' });
                return [3 /*break*/, 9];
            case 8:
                err_17 = _c.sent();
                console.error('Delete Account Error:', err_17);
                res.status(500).json({ error: 'Internal Server Error', details: err_17.message });
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); });
// --- REFERRAL SYSTEM ENDPOINTS ---
// 1. Generate Referral Code
app.post('/api/referral/generate', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, _a, user, authError, uid, _b, existingUser, checkError, generatedCode, isUnique, attempts, updateError, confirmCheck, err_18;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                token = req.body.token;
                if (!token)
                    return [2 /*return*/, res.status(401).json({ error: 'Missing token' })];
                _c.label = 1;
            case 1:
                _c.trys.push([1, 10, , 11]);
                return [4 /*yield*/, supabase.auth.getUser(token)];
            case 2:
                _a = _c.sent(), user = _a.data.user, authError = _a.error;
                if (authError || !user)
                    return [2 /*return*/, res.status(401).json({ error: 'Unauthorized' })];
                uid = user.id;
                return [4 /*yield*/, supabase.from('users').select('referral_code').eq('uid', uid).single()];
            case 3:
                _b = _c.sent(), existingUser = _b.data, checkError = _b.error;
                if (checkError && checkError.code !== 'PGRST116')
                    return [2 /*return*/, res.status(500).json({ error: 'Database error' })];
                if (existingUser && existingUser.referral_code) {
                    return [2 /*return*/, res.json({ referral_code: existingUser.referral_code })];
                }
                generatedCode = void 0;
                isUnique = false;
                attempts = 0;
                _c.label = 4;
            case 4:
                if (!(!isUnique && attempts < 5)) return [3 /*break*/, 9];
                generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
                return [4 /*yield*/, supabase.from('users').update({ referral_code: generatedCode }).eq('uid', uid)];
            case 5:
                updateError = (_c.sent()).error;
                if (!!updateError) return [3 /*break*/, 7];
                return [4 /*yield*/, supabase.from('users').select('referral_code').eq('uid', uid).single()];
            case 6:
                confirmCheck = (_c.sent()).data;
                if (confirmCheck && confirmCheck.referral_code === generatedCode) {
                    isUnique = true;
                }
                else if (!confirmCheck) {
                    return [2 /*return*/, res.status(500).json({ error: 'User does not exist in users table yet.' })];
                }
                return [3 /*break*/, 8];
            case 7:
                if (updateError.code !== '23505') {
                    return [2 /*return*/, res.status(500).json({ error: 'Could not update user referral code.' })];
                }
                else {
                    attempts++;
                }
                _c.label = 8;
            case 8: return [3 /*break*/, 4];
            case 9:
                if (!isUnique)
                    return [2 /*return*/, res.status(500).json({ error: 'Could not generate a unique code, try again.' })];
                res.json({ referral_code: generatedCode });
                return [3 /*break*/, 11];
            case 10:
                err_18 = _c.sent();
                console.error('Error generating referral code:', err_18);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 11];
            case 11: return [2 /*return*/];
        }
    });
}); });
// 2. Apply Referral Code
app.post('/api/referral/apply', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, token, referralCode, _b, user, authError, uid, _c, currentUser, userError, _d, friendUser, friendError, extendPremium, currentUpdates, friendUpdates, err_19;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _a = req.body, token = _a.token, referralCode = _a.referralCode;
                if (!token || !referralCode)
                    return [2 /*return*/, res.status(400).json({ error: 'Missing parameters' })];
                _e.label = 1;
            case 1:
                _e.trys.push([1, 7, , 8]);
                return [4 /*yield*/, supabase.auth.getUser(token)];
            case 2:
                _b = _e.sent(), user = _b.data.user, authError = _b.error;
                if (authError || !user)
                    return [2 /*return*/, res.status(401).json({ error: 'Unauthorized' })];
                uid = user.id;
                return [4 /*yield*/, supabase.from('users')
                        .select('uid, referred_by, referral_code, is_premium, membership_type, premium_until, premium_plan')
                        .eq('uid', uid)
                        .single()];
            case 3:
                _c = _e.sent(), currentUser = _c.data, userError = _c.error;
                if (userError || !currentUser)
                    return [2 /*return*/, res.status(500).json({ error: 'User not found' })];
                if (currentUser.referred_by) {
                    return [2 /*return*/, res.status(400).json({ error: 'You have already used a referral code' })];
                }
                if (currentUser.referral_code === referralCode) {
                    return [2 /*return*/, res.status(400).json({ error: 'You cannot use your own referral code' })];
                }
                return [4 /*yield*/, supabase.from('users')
                        .select('uid, is_premium, membership_type, premium_until, premium_plan')
                        .eq('referral_code', referralCode)
                        .single()];
            case 4:
                _d = _e.sent(), friendUser = _d.data, friendError = _d.error;
                if (friendError || !friendUser)
                    return [2 /*return*/, res.status(400).json({ error: 'Invalid referral code' })];
                extendPremium = function (dbUser) {
                    var newUntil = dbUser.premium_until;
                    var nowMs = Date.now();
                    if (!newUntil || new Date(newUntil).getTime() < nowMs) {
                        newUntil = new Date(nowMs + (30 * 24 * 60 * 60 * 1000)).toISOString();
                    }
                    else {
                        newUntil = new Date(new Date(newUntil).getTime() + (30 * 24 * 60 * 60 * 1000)).toISOString();
                    }
                    var newType = dbUser.membership_type;
                    if (newType !== 'premium_plus')
                        newType = 'premium';
                    return { membership_type: newType, is_premium: true, premium_until: newUntil };
                };
                currentUpdates = __assign(__assign({}, extendPremium(currentUser)), { referred_by: friendUser.uid });
                friendUpdates = extendPremium(friendUser);
                return [4 /*yield*/, supabase.from('users').update(currentUpdates).eq('uid', uid)];
            case 5:
                _e.sent();
                return [4 /*yield*/, supabase.from('users').update(friendUpdates).eq('uid', friendUser.uid)];
            case 6:
                _e.sent();
                res.json({ message: 'Referral applied successfully', premium_until: currentUpdates.premium_until });
                return [3 /*break*/, 8];
            case 7:
                err_19 = _e.sent();
                console.error('Error applying referral:', err_19);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); });
// 3. Get Referrals
app.post('/api/referral/list', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, _a, user, authError, uid, _b, referrals, error, err_20;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                token = req.body.token;
                if (!token)
                    return [2 /*return*/, res.status(401).json({ error: 'Missing token' })];
                _c.label = 1;
            case 1:
                _c.trys.push([1, 4, , 5]);
                return [4 /*yield*/, supabase.auth.getUser(token)];
            case 2:
                _a = _c.sent(), user = _a.data.user, authError = _a.error;
                if (authError || !user)
                    return [2 /*return*/, res.status(401).json({ error: 'Unauthorized' })];
                uid = user.id;
                return [4 /*yield*/, supabase.from('users')
                        .select('full_name, created_at')
                        .eq('referred_by', uid)
                        .order('created_at', { ascending: false })];
            case 3:
                _b = _c.sent(), referrals = _b.data, error = _b.error;
                if (error)
                    return [2 /*return*/, res.status(500).json({ error: 'Database error' })];
                res.json({ referrals: referrals || [] });
                return [3 /*break*/, 5];
            case 4:
                err_20 = _c.sent();
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// Handle React routing, return all requests to React app
// This must be the absolute last route
// --- JOB ASSIGNMENT AND REWARD ENDPOINT ---
app.post('/api/jobs/assign', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, token, jobId, applicationId, applicantId, applicantName, jobTitle, _b, user, authError, _c, jobInfo, jobError, jobUpdateError, appUpdateError, ownerData, newUntil, nowMs, newType, err_21;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _a = req.body, token = _a.token, jobId = _a.jobId, applicationId = _a.applicationId, applicantId = _a.applicantId, applicantName = _a.applicantName, jobTitle = _a.jobTitle;
                if (!token || !jobId || !applicationId || !applicantId)
                    return [2 /*return*/, res.status(400).json({ error: 'Missing parameters' })];
                _d.label = 1;
            case 1:
                _d.trys.push([1, 10, , 11]);
                return [4 /*yield*/, supabase.auth.getUser(token)];
            case 2:
                _b = _d.sent(), user = _b.data.user, authError = _b.error;
                if (authError || !user)
                    return [2 /*return*/, res.status(401).json({ error: 'Unauthorized' })];
                return [4 /*yield*/, supabase.from('jobs').select('status, created_by').eq('job_id', jobId).single()];
            case 3:
                _c = _d.sent(), jobInfo = _c.data, jobError = _c.error;
                if (jobError || !jobInfo)
                    return [2 /*return*/, res.status(404).json({ error: 'Job not found' })];
                if (jobInfo.created_by !== user.id)
                    return [2 /*return*/, res.status(403).json({ error: 'Forbidden. Not your job.' })];
                if (jobInfo.status !== 'open')
                    return [2 /*return*/, res.status(400).json({ error: 'Job is not open.' })];
                return [4 /*yield*/, supabase.from('jobs').update({
                        selected_applicant: applicantId,
                        status: 'in_progress'
                    }).eq('job_id', jobId)];
            case 4:
                jobUpdateError = (_d.sent()).error;
                if (jobUpdateError)
                    throw jobUpdateError;
                return [4 /*yield*/, supabase.from('applications').update({
                        status: 'accepted'
                    }).eq('application_id', applicationId)];
            case 5:
                appUpdateError = (_d.sent()).error;
                if (appUpdateError)
                    throw appUpdateError;
                // 4. Notifications
                return [4 /*yield*/, supabase.from('notifications').insert([
                        {
                            user_id: applicantId,
                            title: "Başvurunuz Kabul Edildi! 🎉",
                            message: "Tebrikler! \"".concat(jobTitle, "\" g\u00F6revi i\u00E7in se\u00E7ildiniz. G\u00F6rev sahibiyle ileti\u015Fime ge\u00E7ebilirsiniz."),
                            type: "success",
                            read: false,
                            created_at: new Date().toISOString(),
                            metadata: { jobId: jobId, type: 'application_accepted_applicant' }
                        },
                        {
                            user_id: user.id,
                            title: "Görev Atandı ✅ +15 Gün Premium",
                            message: "\"".concat(jobTitle, "\" g\u00F6revi Av. ").concat(applicantName, "'e atand\u0131. G\u00F6rev Verme \u00D6d\u00FCl\u00FC olarak +15 G\u00FCn Premium kazand\u0131n\u0131z."),
                            type: "info",
                            read: false,
                            created_at: new Date().toISOString(),
                            metadata: { jobId: jobId, type: 'application_accepted_owner' }
                        }
                    ])];
            case 6:
                // 4. Notifications
                _d.sent();
                return [4 /*yield*/, supabase.from('users').select('is_premium, membership_type, premium_until').eq('uid', user.id).single()];
            case 7:
                ownerData = (_d.sent()).data;
                if (!ownerData) return [3 /*break*/, 9];
                newUntil = ownerData.premium_until;
                nowMs = Date.now();
                if (!newUntil || new Date(newUntil).getTime() < nowMs) {
                    newUntil = new Date(nowMs + (15 * 24 * 60 * 60 * 1000)).toISOString();
                }
                else {
                    newUntil = new Date(new Date(newUntil).getTime() + (15 * 24 * 60 * 60 * 1000)).toISOString();
                }
                newType = ownerData.membership_type;
                if (newType !== 'premium_plus')
                    newType = 'premium';
                return [4 /*yield*/, supabase.from('users').update({
                        membership_type: newType,
                        is_premium: true,
                        premium_until: newUntil
                    }).eq('uid', user.id)];
            case 8:
                _d.sent();
                _d.label = 9;
            case 9:
                res.json({ success: true, message: 'Görev başarıyla atandı ve 15 gün premium kazandınız!' });
                return [3 /*break*/, 11];
            case 10:
                err_21 = _d.sent();
                console.error('Error assigning job:', err_21);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 11];
            case 11: return [2 /*return*/];
        }
    });
}); });
app.get(/.*/, function (req, res) {
    if (req.url.includes('.js') || req.url.includes('.css') || req.url.includes('.png') || req.url.includes('.jpg')) {
        console.warn("\u26A0\uFE0F  MISSING ASSET: Serving index.html for ".concat(req.url, " - File likely does not exist in dist/assets"));
    }
    res.sendFile(path_1.default.join(__dirname, '../dist', 'index.html'));
});
app.listen(port, function () {
    console.log("Server listening on port ".concat(port));
});
