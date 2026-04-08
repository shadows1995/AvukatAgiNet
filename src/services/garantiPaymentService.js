"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDtPaymentForm = generateDtPaymentForm;
exports.verifyGarantiCallback = verifyGarantiCallback;
var crypto_1 = require("crypto");
var module_1 = require("module");
var require = (0, module_1.createRequire)(import.meta.url);
var iconv = require("iconv-lite");
// --- Configuration Loader ---
function getConfig() {
    var isTest = (process.env.GARANTI_MODE || "TEST") === "TEST";
    if (isTest) {
        // Enforce Correct 3D_PAY Terminal (30691298) with Correct User (PROVAUT)
        // Previous attempt with 30691298 gave MD:0 because we used "GARANTI".
        // Now putting the pieces together: 30691298 + PROVAUT.
        return {
            mode: "TEST",
            version: (process.env.GARANTI_VERSION || "512").trim(),
            terminalId: "30691298", // 3D_PAY Terminal
            terminalUserId: "PROVAUT", // Correct User
            terminalMerchantId: "7000679",
            provUserId: (process.env.GARANTI_PROV_USER_ID || "PROVAUT").trim(),
            provPassword: (process.env.GARANTI_PROV_PASSWORD || "123qweASD/").trim(),
            storeKey: (process.env.GARANTI_STORE_KEY || "12345678").trim(),
            successUrl: (process.env.PUBLIC_BASE_URL ? "".concat(process.env.PUBLIC_BASE_URL, "/api/payment/callback/success") : "https://avukatagi.net/api/payment/callback/success").trim(),
            errorUrl: (process.env.PUBLIC_BASE_URL ? "".concat(process.env.PUBLIC_BASE_URL, "/api/payment/callback/fail") : "https://avukatagi.net/api/payment/callback/fail").trim(),
            gatewayUrl: "https://sanalposprovtest.garantibbva.com.tr/servlet/gt3dengine"
        };
    }
    var finalStoreKey = (process.env.GARANTI_STORE_KEY || "").trim();
    // PROD Configuration
    return {
        mode: "PROD",
        version: (process.env.GARANTI_VERSION || "512").trim(),
        terminalId: (process.env.GARANTI_TERMINAL_ID || "").trim(),
        terminalUserId: (process.env.GARANTI_TERMINAL_USER_ID || "").trim(),
        terminalMerchantId: (process.env.GARANTI_MERCHANT_ID || "").trim(),
        provUserId: (process.env.GARANTI_PROV_USER_ID || "").trim(),
        provPassword: (process.env.GARANTI_PROV_PASSWORD || "").trim(),
        storeKey: finalStoreKey,
        successUrl: (process.env.PUBLIC_BASE_URL ? "".concat(process.env.PUBLIC_BASE_URL, "/api/payment/callback/success") : "https://avukatagi.net/api/payment/callback/success").trim(),
        errorUrl: (process.env.PUBLIC_BASE_URL ? "".concat(process.env.PUBLIC_BASE_URL, "/api/payment/callback/fail") : "https://avukatagi.net/api/payment/callback/fail").trim(),
        gatewayUrl: "https://sanalposprov.garanti.com.tr/servlet/gt3dengine"
    };
}
// --- Hashing Helpers ---
/**
 * SHA1 with ISO-8859-9 encoding
 * Used for hashed password generation
 */
function sha1Iso(text) {
    var buf = iconv.encode(text, "ISO-8859-9");
    return crypto_1.default.createHash("sha1").update(buf).digest("hex").toUpperCase();
}
/**
 * SHA512 with ISO-8859-9 encoding
 * Used for final hash generation
 */
function sha512Iso(text) {
    var buf = iconv.encode(text, "ISO-8859-9");
    return crypto_1.default.createHash("sha512").update(buf).digest("hex").toUpperCase();
}
// --- Main Functions ---
/**
 * Generates the Form Data required to POST to Garanti 3D Gateway
 */
function generateDtPaymentForm(request) {
    var config = getConfig();
    // 1. Format Data
    var amountMinor = Math.round(request.amount * 100); // 100.00 TL -> 10000
    var currency = "949"; // TRY
    // Change: Reverting to "" as "0" caused MD:7/99 error.
    var installmentInput = request.installmentCount || "";
    // Both must be identical
    var hashInstallment = installmentInput;
    var formInstallment = installmentInput;
    var type = "sales";
    var terminalId = config.terminalId;
    var orderId = request.orderId;
    // Security Hash Keys
    var password = config.provPassword;
    var storeKey = config.storeKey; // 3D Secure Key
    // 2. Calculate Hash
    // Step A: Hash Password = SHA1(Password + "0" + TerminalID)
    var hashedPassword = sha1Iso(password + "0" + terminalId);
    // Step B: Hash String = TerminalID + OrderID + Amount + Currency + SuccessURL + ErrorURL + Type + Installment + StoreKey + HashedPassword
    var hashString = terminalId +
        orderId +
        amountMinor.toString() +
        currency +
        config.successUrl +
        config.errorUrl +
        type +
        hashInstallment + // Use "0" for Single Shot
        storeKey +
        hashedPassword;
    var secure3dhash = sha512Iso(hashString);
    console.log("\uD83D\uDD11 3D Hash Gen:\nStr: ".concat(hashString, "\nHash: ").concat(secure3dhash));
    // Sanitize IP: Remove ::ffff: prefix if present
    var clientIp = request.customerIp || '127.0.0.1';
    if (clientIp.startsWith('::ffff:')) {
        clientIp = clientIp.substring(7);
    }
    // 3. Construct Form Data
    return {
        mode: config.mode,
        apiversion: config.version,
        secure3dsecuritylevel: "3D_PAY", // Standard 3D Pay
        terminalprovuserid: config.provUserId,
        terminaluserid: config.terminalUserId || config.provUserId, // Change: Use provUserId as default (PROD fix)
        terminalmerchantid: config.terminalMerchantId,
        terminalid: terminalId,
        orderid: orderId,
        successurl: config.successUrl,
        errorurl: config.errorUrl,
        customeremailaddress: request.customerEmail,
        customeripaddress: clientIp,
        companyname: "AvukatAgi",
        lang: "tr",
        txntimestamp: new Date().toISOString(), // Reverted to ISO as MD:99 occurred with compact format
        refreshtime: "1",
        secure3dhash: secure3dhash,
        txnamount: amountMinor.toString(),
        txntype: type,
        txncurrencycode: currency,
        txninstallmentcount: formInstallment, // Use "" for Single Shot
        cardholdername: request.cardHolderName,
        cardnumber: request.cardNumber,
        cardexpiredatemonth: request.expMonth,
        cardexpiredateyear: request.expYear,
        cardcvv2: request.cvv,
        gatewayUrl: config.gatewayUrl
    };
}
/**
 * Verifies the Callback Hash from Garanti
 * Returns true if valid, false otherwise.
 */
function verifyGarantiCallback(params) {
    var config = getConfig();
    // Expected Params from Bank
    // hashparams: "clientid:oid:authcode:..."
    // hashparamsval: (Not used for calc)
    // hash: The hash to verify against
    var responseHash = params["hash"];
    var hashParamsStr = params["hashparams"];
    if (!responseHash || !hashParamsStr) {
        console.error("❌ Missing hash or hashparams in callback");
        return false;
    }
    // 1. Split hashparams to get the list of fields
    var paramList = hashParamsStr.split(":");
    // 2. Concatenate values in order
    var digestData = "";
    // Debug Param construction
    var debugParts = [];
    var _loop_1 = function (param) {
        if (!param)
            return "continue"; // Skip empty splits if any
        // Get value from the main params object
        // Note: Garanti sends POST data. Express `req.body` should have these keys lowercase or as sent.
        // We assume `params` is `req.body` which usually preserves case or is lowercase depending on middleware.
        // Garanti usually sends lowercase keys for these standard fields? check docs.
        // Docs table shows "mdstatus", "oid". We should be case-insensitive or try exact match.
        // Best approach: Try to find the key case-insensitively if not found.
        var key = Object.keys(params).find(function (k) { return k.toLowerCase() === param.toLowerCase(); });
        var value = key ? params[key] : "";
        if (value === null || value === undefined)
            value = "";
        digestData += value;
        debugParts.push("".concat(param, "(").concat(value, ")"));
    };
    for (var _i = 0, paramList_1 = paramList; _i < paramList_1.length; _i++) {
        var param = paramList_1[_i];
        _loop_1(param);
    }
    // 3. Append Store Key
    // 3. Append Store Key
    var storeKey = config.storeKey;
    digestData += storeKey;
    debugParts.push("StoreKey(HIDDEN)");
    // Debug Log
    // console.log('Store Key Used:', storeKey); // Do not log in PROD for security
    // 4. Calculate SHA512
    // var sha = new System.Security.Cryptography.SHA512CryptoServiceProvider();
    // inputbytes = sha.ComputeHash(hashbytes);
    var calculatedHash = sha512Iso(digestData);
    if (calculatedHash !== responseHash) {
        console.error("\u274C Hash Mismatch Details:");
        console.error("Expected (Bank): ".concat(responseHash));
        console.error("Calculated (Us): ".concat(calculatedHash));
        console.error("Digest Parts: ".concat(debugParts.join(" + ")));
        console.error("Raw HashParams: ".concat(hashParamsStr));
    }
    else {
        console.log("\u2705 Hash Verified Successfully.");
    }
    return calculatedHash === responseHash;
}
