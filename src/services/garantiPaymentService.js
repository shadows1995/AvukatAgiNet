import crypto from "crypto";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const iconv = require("iconv-lite");
// --- Configuration Loader ---
function getConfig() {
    const isTest = (process.env.GARANTI_MODE || "TEST") === "TEST";
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
            successUrl: (process.env.PUBLIC_BASE_URL ? `${process.env.PUBLIC_BASE_URL}/api/payment/callback/success` : "https://avukatagi.net/api/payment/callback/success").trim(),
            errorUrl: (process.env.PUBLIC_BASE_URL ? `${process.env.PUBLIC_BASE_URL}/api/payment/callback/fail` : "https://avukatagi.net/api/payment/callback/fail").trim(),
            gatewayUrl: "https://sanalposprovtest.garantibbva.com.tr/servlet/gt3dengine"
        };
    }
    const finalStoreKey = (process.env.GARANTI_STORE_KEY || "").trim();
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
        successUrl: (process.env.PUBLIC_BASE_URL ? `${process.env.PUBLIC_BASE_URL}/api/payment/callback/success` : "https://avukatagi.net/api/payment/callback/success").trim(),
        errorUrl: (process.env.PUBLIC_BASE_URL ? `${process.env.PUBLIC_BASE_URL}/api/payment/callback/fail` : "https://avukatagi.net/api/payment/callback/fail").trim(),
        gatewayUrl: "https://sanalposprov.garanti.com.tr/servlet/gt3dengine"
    };
}
// --- Hashing Helpers ---
/**
 * SHA1 with ISO-8859-9 encoding
 * Used for hashed password generation
 */
function sha1Iso(text) {
    const buf = iconv.encode(text, "ISO-8859-9");
    return crypto.createHash("sha1").update(buf).digest("hex").toUpperCase();
}
/**
 * SHA512 with ISO-8859-9 encoding
 * Used for final hash generation
 */
function sha512Iso(text) {
    const buf = iconv.encode(text, "ISO-8859-9");
    return crypto.createHash("sha512").update(buf).digest("hex").toUpperCase();
}
// --- Main Functions ---
/**
 * Generates the Form Data required to POST to Garanti 3D Gateway
 */
export function generateDtPaymentForm(request) {
    const config = getConfig();
    // 1. Format Data
    const amountMinor = Math.round(request.amount * 100); // 100.00 TL -> 10000
    const currency = "949"; // TRY
    // Change: Reverting to "" as "0" caused MD:7/99 error.
    const installmentInput = request.installmentCount || "";
    // Both must be identical
    const hashInstallment = installmentInput;
    const formInstallment = installmentInput;
    const type = "sales";
    const terminalId = config.terminalId;
    const orderId = request.orderId;
    // Security Hash Keys
    const password = config.provPassword;
    const storeKey = config.storeKey; // 3D Secure Key
    // 2. Calculate Hash
    // Step A: Hash Password = SHA1(Password + "0" + TerminalID)
    const hashedPassword = sha1Iso(password + "0" + terminalId);
    // Step B: Hash String = TerminalID + OrderID + Amount + Currency + SuccessURL + ErrorURL + Type + Installment + StoreKey + HashedPassword
    const hashString = terminalId +
        orderId +
        amountMinor.toString() +
        currency +
        config.successUrl +
        config.errorUrl +
        type +
        hashInstallment + // Use "0" for Single Shot
        storeKey +
        hashedPassword;
    const secure3dhash = sha512Iso(hashString);
    console.log(`🔑 3D Hash Gen:\nStr: ${hashString}\nHash: ${secure3dhash}`);
    // Sanitize IP: Remove ::ffff: prefix if present
    let clientIp = request.customerIp || '127.0.0.1';
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
export function verifyGarantiCallback(params) {
    const config = getConfig();
    // Expected Params from Bank
    // hashparams: "clientid:oid:authcode:..."
    // hashparamsval: (Not used for calc)
    // hash: The hash to verify against
    const responseHash = params["hash"];
    const hashParamsStr = params["hashparams"];
    if (!responseHash || !hashParamsStr) {
        console.error("❌ Missing hash or hashparams in callback");
        return false;
    }
    // 1. Split hashparams to get the list of fields
    const paramList = hashParamsStr.split(":");
    // 2. Concatenate values in order
    let digestData = "";
    // Debug Param construction
    const debugParts = [];
    for (const param of paramList) {
        if (!param)
            continue; // Skip empty splits if any
        // Get value from the main params object
        // Note: Garanti sends POST data. Express `req.body` should have these keys lowercase or as sent.
        // We assume `params` is `req.body` which usually preserves case or is lowercase depending on middleware.
        // Garanti usually sends lowercase keys for these standard fields? check docs.
        // Docs table shows "mdstatus", "oid". We should be case-insensitive or try exact match.
        // Best approach: Try to find the key case-insensitively if not found.
        const key = Object.keys(params).find(k => k.toLowerCase() === param.toLowerCase());
        let value = key ? params[key] : "";
        if (value === null || value === undefined)
            value = "";
        digestData += value;
        debugParts.push(`${param}(${value})`);
    }
    // 3. Append Store Key
    // 3. Append Store Key
    const storeKey = config.storeKey;
    digestData += storeKey;
    debugParts.push(`StoreKey(HIDDEN)`);
    // Debug Log
    // console.log('Store Key Used:', storeKey); // Do not log in PROD for security
    // 4. Calculate SHA512
    // var sha = new System.Security.Cryptography.SHA512CryptoServiceProvider();
    // inputbytes = sha.ComputeHash(hashbytes);
    const calculatedHash = sha512Iso(digestData);
    if (calculatedHash !== responseHash) {
        console.error(`❌ Hash Mismatch Details:`);
        console.error(`Expected (Bank): ${responseHash}`);
        console.error(`Calculated (Us): ${calculatedHash}`);
        console.error(`Digest Parts: ${debugParts.join(" + ")}`);
        console.error(`Raw HashParams: ${hashParamsStr}`);
    }
    else {
        console.log(`✅ Hash Verified Successfully.`);
    }
    return calculatedHash === responseHash;
}
