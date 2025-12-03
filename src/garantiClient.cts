import crypto from "crypto";
import iconv from "iconv-lite";
import axios from "axios";
import { parseStringPromise } from "xml2js";

export function sha1Iso(text: string): string {
  const buf = iconv.encode(text, "ISO-8859-9");
  return crypto.createHash("sha1").update(buf).digest("hex").toUpperCase();
}

export function sha512Iso(text: string): string {
  const buf = iconv.encode(text, "ISO-8859-9");
  return crypto.createHash("sha512").update(buf).digest("hex").toUpperCase();
}

/**
 * userPassword = provizyon şifresi (ProvisionPassword)
 * terminalId   = TerminalID
 * orderId      = OrderID
 * cardNumber   = full card number (string)
 * amount       = integer minor units (e.g. 100.00 TL -> 10000)
 * currencyCode = 949 for TL
 */
export function getHashData(
  userPassword: string,
  terminalId: string,
  orderId: string,
  cardNumber: string,
  amount: number,
  currencyCode: number
): string {
  const hashedPassword = sha1Iso(userPassword + "0" + terminalId);
  const text =
    orderId +
    terminalId +
    cardNumber +
    amount.toString() +
    currencyCode.toString() +
    hashedPassword;
  return sha512Iso(text).toUpperCase();
}

export function verifyResponseHash(params: {
  userPassword: string;
  terminalId: string;
  responseCode: string;
  retrefNum: string;
  authCode: string;
  provDate: string;
  orderId: string;
  hashDataFromResponse: string;
}): boolean {
  const {
    userPassword,
    terminalId,
    responseCode,
    retrefNum,
    authCode,
    provDate,
    orderId,
    hashDataFromResponse,
  } = params;

  const hashedPassword = sha1Iso(userPassword + "0" + terminalId);
  const text =
    responseCode +
    retrefNum +
    authCode +
    provDate +
    orderId +
    hashedPassword;

  const calculated = sha512Iso(text).toUpperCase();

  const logData = `
--- Hash Verification Debug ---
ResponseCode: ${responseCode}
RetrefNum: ${retrefNum}
AuthCode: ${authCode}
ProvDate: ${provDate}
OrderId: ${orderId}
HashedPassword (derived): ${hashedPassword}
Text to Hash: ${text}
Calculated Hash: ${calculated}
Received Hash: ${hashDataFromResponse}
Match: ${calculated === hashDataFromResponse}
-------------------------------
`;
  const fs = require('fs');
  fs.appendFileSync('debug_log.txt', logData);

  return calculated === hashDataFromResponse;
}

export interface GarantiSaleRequest {
  orderId: string;
  amountMajor: number; // e.g. 100.00 => 100.00
  cardNumber: string;
  expMonth: string; // "03"
  expYear: string;  // "23"
  cvv: string;
  customerIp?: string;
  customerEmail?: string;
}

export function buildSaleXml(req: GarantiSaleRequest): { xml: Buffer; amountMinor: number } {
  const mode = process.env.GARANTI_MODE!;
  const version = process.env.GARANTI_VERSION!;
  const merchantId = process.env.GARANTI_MERCHANT_ID!;
  const terminalId = process.env.GARANTI_TERMINAL_ID!;
  const provUserId = process.env.GARANTI_PROV_USER_ID!;
  const provPassword = process.env.GARANTI_PROV_PASSWORD!;

  const amountMinor = Math.round(req.amountMajor * 100); // 100.00 -> 10000
  const currencyCode = 949;

  const expireDate = req.expMonth + req.expYear; // "MMYY"

  const hashData = getHashData(
    provPassword,
    terminalId,
    req.orderId,
    req.cardNumber,
    amountMinor,
    currencyCode
  );

  const ip = req.customerIp || process.env.GARANTI_DEFAULT_CUSTOMER_IP!;
  const email = req.customerEmail || process.env.GARANTI_DEFAULT_CUSTOMER_EMAIL!;

  const xmlString = `<?xml version="1.0" encoding="iso-8859-9"?>
<GVPSRequest>
  <Mode>${mode}</Mode>
  <Version>${version}</Version>
  <Terminal>
    <ProvUserID>${provUserId}</ProvUserID>
    <HashData>${hashData}</HashData>
    <UserID>${provUserId}</UserID>
    <ID>${terminalId}</ID>
    <MerchantID>${merchantId}</MerchantID>
  </Terminal>
  <Customer>
    <IPAddress>${ip}</IPAddress>
    <EmailAddress>${email}</EmailAddress>
  </Customer>
  <Card>
    <Number>${req.cardNumber}</Number>
    <ExpireDate>${expireDate}</ExpireDate>
    <CVV2>${req.cvv}</CVV2>
  </Card>
  <Order>
    <OrderID>${req.orderId}</OrderID>
    <GroupID></GroupID>
  </Order>
  <Transaction>
    <Type>sales</Type>
    <Amount>${amountMinor}</Amount>
    <CurrencyCode>${currencyCode}</CurrencyCode>
    <CardholderPresentCode>0</CardholderPresentCode>
    <MotoInd>N</MotoInd>
  </Transaction>
</GVPSRequest>`;

  // IMPORTANT: the XML body should be encoded as ISO-8859-9
  const xmlBuffer = iconv.encode(xmlString, "ISO-8859-9");
  return { xml: xmlBuffer, amountMinor };
}

export interface GarantiSaleResult {
  approved: boolean;
  responseCode: string;
  reasonCode: string;
  message: string;
  errorMsg: string;
  sysErrMsg: string;
  orderId: string;
  retrefNum?: string;
  authCode?: string;
}

export async function sendSaleRequest(req: GarantiSaleRequest): Promise<GarantiSaleResult> {
  const { xml } = buildSaleXml(req);
  const url = process.env.GARANTI_TEST_URL!;

  const { data } = await axios.post(url, xml, {
    headers: {
      "Content-Type": "text/xml; charset=ISO-8859-9",
    },
    responseType: "arraybuffer", // ensure we handle encoding
  });

  console.log("Raw Response Buffer:", Buffer.from(data).toString('hex').substring(0, 100) + "...");
  const decoded = iconv.decode(Buffer.from(data), "ISO-8859-9");
  console.log("Decoded Response (ISO-8859-9):", decoded);

  // Try UTF-8 just in case
  const decodedUtf8 = Buffer.from(data).toString('utf-8');
  console.log("Decoded Response (UTF-8):", decodedUtf8);

  const parsed = await parseStringPromise(decoded, { explicitArray: false });

  const gvps = parsed.GVPSResponse;
  const transaction = gvps.Transaction;
  const resp = transaction.Response;

  const responseCode = resp.Code;
  const reasonCode = resp.ReasonCode;
  const message = resp.Message;
  const errorMsg = resp.ErrorMsg || "";
  const sysErrMsg = resp.SysErrMsg || "";
  const orderId = gvps.Order?.OrderID || req.orderId;

  // Optional: verify response HashData
  const hashDataResp = transaction.HashData;
  const retrefNum = transaction.RetrefNum;
  const authCode = transaction.AuthCode;
  const provDate = transaction.ProvDate;

  const hashOk = verifyResponseHash({
    userPassword: process.env.GARANTI_PROV_PASSWORD!,
    terminalId: process.env.GARANTI_TERMINAL_ID!,
    responseCode,
    retrefNum,
    authCode,
    provDate,
    orderId,
    hashDataFromResponse: hashDataResp,
  });

  const approved = responseCode === "00" && reasonCode === "00" && hashOk;

  return {
    approved,
    responseCode,
    reasonCode,
    message,
    errorMsg,
    sysErrMsg,
    orderId,
    retrefNum,
    authCode,
  };
}
