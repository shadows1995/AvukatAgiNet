import crypto from "crypto";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const iconv = require("iconv-lite");

// --- Types ---

interface GarantiConfig {
    mode: "TEST" | "PROD";
    version: string;
    terminalId: string;
    terminalUserId: string; // Specific for 3D Secure Service
    terminalMerchantId: string;
    provUserId: string; // For Provisioning
    provPassword: string;
    storeKey: string; // 3D Pay Store Key for hash calculation
    successUrl: string;
    errorUrl: string;
    gatewayUrl: string; // The 3D Secure POST URL
}

interface PaymentRequest {
    orderId: string;
    amount: number; // Major units (e.g. 150.00)
    installmentCount: string; // "" or "2"-"12"
    cardNumber: string;
    expMonth: string;
    expYear: string; // "YY"
    cvv: string;
    cardHolderName: string;
    customerEmail: string;
    customerIp: string;
    userId: string; // Internal User ID for callback tracking
}

interface GarantiFormData {
    mode: string;
    apiversion: string;
    secure3dsecuritylevel: string;
    terminalprovuserid: string;
    terminaluserid: string;
    terminalmerchantid: string;
    terminalid: string;
    orderid: string;
    successurl: string;
    errorurl: string;
    customeremailaddress: string;
    customeripaddress: string;
    companyname: string;
    lang: string;
    txntimestamp: string;
    refreshtime: string;
    secure3dhash: string;
    txnamount: string; // Major units "100" (Garanti Form asks for "100" for 1 TL usually? No, "txnamount" in docs says "100" as example. Wait, docs say "100" implies 1.00?
    // Double check: In XML API (Process), Amount is Minor (100 = 1.00 TL).
    // In 3D Secure Form API (Gateway), existing usage in many places implies Major units or Minor?
    // Docs say: "txnamount" value="100".
    // Let's stick strictly to the docs example: value="100". This is ambiguous.
    // However, usually Gateway Forms use Major units (1.00) or Minor (100).
    // Looking at the provided `garantiClient.cjs`, `buildSaleXml` used Minor (10000 for 100 TL).
    // The provided DOC says "txnamount" id="txnamount" value="100".
    // It also says "Amount alanında toplam işlem tutarı yollanılır."
    // Garanti Virtual POS usually expects Amount in Cents (KURUS) for API, but for Form...
    // Let's assume implied decimal is NOT present if it's integer 100.
    // Wait, Garanti documentation standard is typically Minor units (Kurus) for everything. 1 TL = 100.
    // I will use Minor units (100 TL = 10000) to be safe, matching the XML logic which definitely worked.

    txntype: string; // "sales"
    txncurrencycode: string; // "949"
    txninstallmentcount: string;
    cardholdername: string;
    cardnumber: string;
    cardexpiredatemonth: string;
    cardexpiredateyear: string;
    cardcvv2: string;
    gatewayUrl?: string; // Helper for frontend
}

// --- Configuration Loader ---

function getConfig(): GarantiConfig {
    if (isTest) {
        // Enforce Correct Test Keys from User Doc for 3D_PAY
        // Model: 3D_PAY -> TerminalID: 30691298, MerchantID: 7000679
        return {
            mode: "TEST",
            version: (process.env.GARANTI_VERSION || "512").trim(),
            terminalId: "30691298", // Correct ID for 3D_PAY
            terminalUserId: "GARANTI", // Default to GARANTI
            terminalMerchantId: "7000679",
            provUserId: (process.env.GARANTI_PROV_USER_ID || "PROVAUT").trim(),
            provPassword: (process.env.GARANTI_PROV_PASSWORD || "123qweASD/").trim(),
            storeKey: (process.env.GARANTI_STORE_KEY || "12345678").trim(),
            successUrl: (process.env.PUBLIC_BASE_URL ? `${process.env.PUBLIC_BASE_URL}/api/payment/callback/success` : "https://avukatagi.net/api/payment/callback/success").trim(),
            errorUrl: (process.env.PUBLIC_BASE_URL ? `${process.env.PUBLIC_BASE_URL}/api/payment/callback/fail` : "https://avukatagi.net/api/payment/callback/fail").trim(),
            gatewayUrl: "https://sanalposprovtest.garantibbva.com.tr/servlet/gt3dengine"
        };
    }
}

// --- Hashing Helpers ---

/**
 * SHA1 with ISO-8859-9 encoding
 * Used for hashed password generation
 */
function sha1Iso(text: string): string {
    const buf = iconv.encode(text, "ISO-8859-9");
    return crypto.createHash("sha1").update(buf).digest("hex").toUpperCase();
}

/**
 * SHA512 with ISO-8859-9 encoding
 * Used for final hash generation
 */
function sha512Iso(text: string): string {
    const buf = iconv.encode(text, "ISO-8859-9");
    return crypto.createHash("sha512").update(buf).digest("hex").toUpperCase();
}

// --- Main Functions ---

/**
 * Generates the Form Data required to POST to Garanti 3D Gateway
 */
export function generateDtPaymentForm(request: PaymentRequest): GarantiFormData {
    const config = getConfig();

    // 1. Format Data
    const amountMinor = Math.round(request.amount * 100); // 100.00 TL -> 10000
    const currency = "949"; // TRY
    // MD: 7 Fix Attempt:
    // Reverting "0" which caused MD:99.
    // Back to "" (Empty) which yielded MD:1 (Success) on Debit.
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
    const hashString =
        terminalId +
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

    // 3. Construct Form Data
    return {
        mode: config.mode,
        apiversion: config.version,
        secure3dsecuritylevel: "3D_PAY", // Standard 3D Pay
        terminalprovuserid: config.provUserId,
        terminaluserid: config.terminalUserId || "GARANTI", // Fallback for TEST
        terminalmerchantid: config.terminalMerchantId,
        terminalid: terminalId,
        orderid: orderId,
        successurl: config.successUrl,
        errorurl: config.errorUrl,
        customeremailaddress: request.customerEmail,
        customeripaddress: request.customerIp,
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
    };
}

/**
 * Verifies the Callback Hash from Garanti
 * Returns true if valid, false otherwise.
 */
export function verifyGarantiCallback(params: any): boolean {
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
    for (const param of paramList) {
        if (!param) continue; // Skip empty splits if any
        // Get value from the main params object
        // Note: Garanti sends POST data. Express `req.body` should have these keys lowercase or as sent.
        // We assume `params` is `req.body` which usually preserves case or is lowercase depending on middleware.
        // Garanti usually sends lowercase keys for these standard fields? check docs.
        // Docs table shows "mdstatus", "oid". We should be case-insensitive or try exact match.
        // Best approach: Try to find the key case-insensitively if not found.

        let value = params[param] || params[param.toLowerCase()] || params[param.toUpperCase()] || "";
        if (value === null || value === undefined) value = "";

        digestData += value;
    }

    // 3. Append Store Key
    digestData += config.storeKey;

    // 4. Calculate SHA512
    // var sha = new System.Security.Cryptography.SHA512CryptoServiceProvider();
    // inputbytes = sha.ComputeHash(hashbytes);
    const calculatedHash = sha512Iso(digestData);

    console.log(`🔐 Hash Verify:\nDigest: ${digestData}\nCalc: ${calculatedHash}\nRecv: ${responseHash}`);

    return calculatedHash === responseHash;
}
