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
exports.sha1Iso = sha1Iso;
exports.sha512Iso = sha512Iso;
exports.getHashData = getHashData;
exports.verifyResponseHash = verifyResponseHash;
exports.buildSaleXml = buildSaleXml;
exports.sendSaleRequest = sendSaleRequest;
var crypto_1 = require("crypto");
var iconv_lite_1 = require("iconv-lite");
var axios_1 = require("axios");
var xml2js_1 = require("xml2js");
function sha1Iso(text) {
    var buf = iconv_lite_1.default.encode(text, "ISO-8859-9");
    return crypto_1.default.createHash("sha1").update(buf).digest("hex").toUpperCase();
}
function sha512Iso(text) {
    var buf = iconv_lite_1.default.encode(text, "ISO-8859-9");
    return crypto_1.default.createHash("sha512").update(buf).digest("hex").toUpperCase();
}
/**
 * userPassword = provizyon şifresi (ProvisionPassword)
 * terminalId   = TerminalID
 * orderId      = OrderID
 * cardNumber   = full card number (string)
 * amount       = integer minor units (e.g. 100.00 TL -> 10000)
 * currencyCode = 949 for TL
 */
function getHashData(userPassword, terminalId, orderId, cardNumber, amount, currencyCode) {
    var hashedPassword = sha1Iso(userPassword + "0" + terminalId);
    var text = orderId +
        terminalId +
        cardNumber +
        amount.toString() +
        currencyCode.toString() +
        hashedPassword;
    return sha512Iso(text).toUpperCase();
}
function verifyResponseHash(params) {
    var userPassword = params.userPassword, terminalId = params.terminalId, responseCode = params.responseCode, retrefNum = params.retrefNum, authCode = params.authCode, provDate = params.provDate, orderId = params.orderId, hashDataFromResponse = params.hashDataFromResponse;
    var hashedPassword = sha1Iso(userPassword + "0" + terminalId);
    var text = responseCode +
        retrefNum +
        authCode +
        provDate +
        orderId +
        hashedPassword;
    var calculated = sha512Iso(text).toUpperCase();
    var logData = "\n--- Hash Verification Debug ---\nResponseCode: ".concat(responseCode, "\nRetrefNum: ").concat(retrefNum, "\nAuthCode: ").concat(authCode, "\nProvDate: ").concat(provDate, "\nOrderId: ").concat(orderId, "\nHashedPassword (derived): ").concat(hashedPassword, "\nText to Hash: ").concat(text, "\nCalculated Hash: ").concat(calculated, "\nReceived Hash: ").concat(hashDataFromResponse, "\nMatch: ").concat(calculated === hashDataFromResponse, "\n-------------------------------\n");
    var fs = require('fs');
    fs.appendFileSync('debug_log.txt', logData);
    return calculated === hashDataFromResponse;
}
function buildSaleXml(req) {
    var mode = process.env.GARANTI_MODE;
    var version = process.env.GARANTI_VERSION;
    var merchantId = process.env.GARANTI_MERCHANT_ID;
    var terminalId = process.env.GARANTI_TERMINAL_ID;
    var provUserId = process.env.GARANTI_PROV_USER_ID;
    var provPassword = process.env.GARANTI_PROV_PASSWORD;
    var amountMinor = Math.round(req.amountMajor * 100); // 100.00 -> 10000
    var currencyCode = 949;
    var expireDate = req.expMonth + req.expYear; // "MMYY"
    var hashData = getHashData(provPassword, terminalId, req.orderId, req.cardNumber, amountMinor, currencyCode);
    var ip = req.customerIp || process.env.GARANTI_DEFAULT_CUSTOMER_IP;
    var email = req.customerEmail || process.env.GARANTI_DEFAULT_CUSTOMER_EMAIL;
    var xmlString = "<?xml version=\"1.0\" encoding=\"iso-8859-9\"?>\n<GVPSRequest>\n  <Mode>".concat(mode, "</Mode>\n  <Version>").concat(version, "</Version>\n  <Terminal>\n    <ProvUserID>").concat(provUserId, "</ProvUserID>\n    <HashData>").concat(hashData, "</HashData>\n    <UserID>").concat(provUserId, "</UserID>\n    <ID>").concat(terminalId, "</ID>\n    <MerchantID>").concat(merchantId, "</MerchantID>\n  </Terminal>\n  <Customer>\n    <IPAddress>").concat(ip, "</IPAddress>\n    <EmailAddress>").concat(email, "</EmailAddress>\n  </Customer>\n  <Card>\n    <Number>").concat(req.cardNumber, "</Number>\n    <ExpireDate>").concat(expireDate, "</ExpireDate>\n    <CVV2>").concat(req.cvv, "</CVV2>\n  </Card>\n  <Order>\n    <OrderID>").concat(req.orderId, "</OrderID>\n    <GroupID></GroupID>\n  </Order>\n  <Transaction>\n    <Type>sales</Type>\n    <Amount>").concat(amountMinor, "</Amount>\n    <CurrencyCode>").concat(currencyCode, "</CurrencyCode>\n    <CardholderPresentCode>0</CardholderPresentCode>\n    <MotoInd>N</MotoInd>\n  </Transaction>\n</GVPSRequest>");
    // IMPORTANT: the XML body should be encoded as ISO-8859-9
    var xmlBuffer = iconv_lite_1.default.encode(xmlString, "ISO-8859-9");
    return { xml: xmlBuffer, amountMinor: amountMinor };
}
function sendSaleRequest(req) {
    return __awaiter(this, void 0, void 0, function () {
        var xml, url, data, fs, rawHex, decoded, decodedUtf8, parsed, gvps, transaction, resp, responseCode, reasonCode, message, errorMsg, sysErrMsg, orderId, hashDataResp, retrefNum, authCode, provDate, hashOk, approved;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    xml = buildSaleXml(req).xml;
                    url = process.env.GARANTI_TEST_URL;
                    return [4 /*yield*/, axios_1.default.post(url, xml, {
                            headers: {
                                "Content-Type": "text/xml; charset=ISO-8859-9",
                            },
                            responseType: "arraybuffer", // ensure we handle encoding
                        })];
                case 1:
                    data = (_b.sent()).data;
                    fs = require('fs');
                    try {
                        rawHex = Buffer.from(data).toString('hex').substring(0, 200) + "...";
                        fs.appendFileSync('debug_log.txt', "\n--- RAW RESPONCE START ---\nHex: ".concat(rawHex, "\n"));
                    }
                    catch (e) { }
                    console.log("Raw Response Buffer:", Buffer.from(data).toString('hex').substring(0, 100) + "...");
                    decoded = iconv_lite_1.default.decode(Buffer.from(data), "ISO-8859-9");
                    try {
                        fs.appendFileSync('debug_log.txt', "Decoded ISO-8859-9: ".concat(decoded, "\n--- RAW RESPONCE END ---\n"));
                    }
                    catch (e) { }
                    console.log("Decoded Response (ISO-8859-9):", decoded);
                    decodedUtf8 = Buffer.from(data).toString('utf-8');
                    console.log("Decoded Response (UTF-8):", decodedUtf8);
                    return [4 /*yield*/, (0, xml2js_1.parseStringPromise)(decoded, { explicitArray: false })];
                case 2:
                    parsed = _b.sent();
                    gvps = parsed.GVPSResponse;
                    transaction = gvps.Transaction;
                    resp = transaction.Response;
                    responseCode = resp.Code;
                    reasonCode = resp.ReasonCode;
                    message = resp.Message;
                    errorMsg = resp.ErrorMsg || "";
                    sysErrMsg = resp.SysErrMsg || "";
                    orderId = ((_a = gvps.Order) === null || _a === void 0 ? void 0 : _a.OrderID) || req.orderId;
                    hashDataResp = transaction.HashData;
                    retrefNum = transaction.RetrefNum;
                    authCode = transaction.AuthCode;
                    provDate = transaction.ProvDate;
                    hashOk = verifyResponseHash({
                        userPassword: process.env.GARANTI_PROV_PASSWORD,
                        terminalId: process.env.GARANTI_TERMINAL_ID,
                        responseCode: responseCode,
                        retrefNum: retrefNum,
                        authCode: authCode,
                        provDate: provDate,
                        orderId: orderId,
                        hashDataFromResponse: hashDataResp,
                    });
                    approved = responseCode === "00" && reasonCode === "00" && hashOk;
                    return [2 /*return*/, {
                            approved: approved,
                            responseCode: responseCode,
                            reasonCode: reasonCode,
                            message: message,
                            errorMsg: errorMsg,
                            sysErrMsg: sysErrMsg,
                            orderId: orderId,
                            retrefNum: retrefNum,
                            authCode: authCode,
                        }];
            }
        });
    });
}
