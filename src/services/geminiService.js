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
exports.generateJobDetails = void 0;
var generative_ai_1 = require("@google/generative-ai");
var dotenv_1 = require("dotenv");
dotenv_1.default.config();
var apiKey = process.env.GEMINI_API_KEY;
var generateJobDetails = function (courthouse, allowedJobTypes) { return __awaiter(void 0, void 0, void 0, function () {
    var genAI, firstNames, lastNames, randomFirstName, randomLastName, generatedOwnerName, prompt_1, model, result, response, text, jsonStr, data, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!apiKey) {
                    console.error("Gemini API key is missing.");
                    return [2 /*return*/, null];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
                firstNames = ["Ahmet", "Mehmet", "Ali", "Can", "Burak", "Emre", "Barış", "Hüseyin", "Yusuf", "Mustafa", "Murat", "Hakan", "Oğuz", "Osman", "Fatih", "Serkan", "Gökhan", "Yasin", "İbrahim", "Kemal", "Ayşe", "Fatma", "Zeynep", "Elif", "Merve", "Büşra", "Ceren", "Derya", "Esra", "Gizem", "Seda", "Meltem", "Aslı", "Burcu", "Dilek", "Betül", "Tuğba", "Kübra", "Yasemin"];
                lastNames = ["Yılmaz", "Kaya", "Demir", "Çelik", "Şahin", "Yıldız", "Yıldırım", "Öztürk", "Aydın", "Özdemir", "Arslan", "Doğan", "Kılıç", "Aslan", "Çetin", "Kara", "Koç", "Kurt", "Özkan", "Şimşek", "Polat", "Öz", "Erdoğan", "Yavuz", "Can", "Acar", "Güneş", "Bozkurt", "Turan", "Yalçın", "Güler"];
                randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
                randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
                generatedOwnerName = "Av. ".concat(randomFirstName, " ").concat(randomLastName);
                prompt_1 = "\n        Sen T\u00FCrkiye'de yo\u011Fun \u00E7al\u0131\u015Fan bir avukats\u0131n ve tevkil (ba\u015Fka bir avukattan i\u015F i\u00E7in yard\u0131m alma) platformuna bir g\u00F6rev ilan\u0131 a\u00E7\u0131yorsun. \u0130lan\u0131n GER\u00C7EK B\u0130R \u0130NSAN taraf\u0131ndan yaz\u0131lm\u0131\u015F gibi tamamen do\u011Fal, g\u00FCnl\u00FCk avukat jargonuyla ve her defas\u0131nda birbirinden FARKLI stillerde olmal\u0131. Kesinlikle robotik veya kal\u0131p c\u00FCmleler (\u00F6rn: \"\u00D6nemli bir duru\u015Fma, destek rica olunur\") kullanma.\n\n        G\u00D6REV B\u0130LG\u0130LER\u0130:\n        - Adliye: ".concat(courthouse, "\n        - Ge\u00E7erli G\u00F6rev T\u00FCrleri: ").concat(allowedJobTypes ? allowedJobTypes.join(', ') : 'Herhangi bir tür', "\n\n        KURALLAR:\n        1. Asla selamlama ifadeleri kullanma (\"Merhaba\", \"\u0130yi \u00E7al\u0131\u015Fmalar\", \"De\u011Ferli meslekta\u015Flar\" vb. YASAK). Her zaman do\u011Frudan konuya ve g\u00F6reve ba\u015Fla.\n        2. \u0130\u00E7erik ve Mazeret: G\u00F6revin i\u00E7eri\u011Fiyle ilgili do\u011Frudan, net bilgiler ver. Mazeretler \u00E7ok detayl\u0131 olmas\u0131n, olabildi\u011Fince net, k\u0131sa ve do\u011Fal olsun (\u00F6rne\u011Fin: \"Ba\u015Fka duru\u015Fmayla \u00E7ak\u0131\u015Ft\u0131\u011F\u0131 i\u00E7in\", \"\u015Eehir d\u0131\u015F\u0131nda olaca\u011F\u0131m i\u00E7in\", \"Dosyadan belge sureti al\u0131nacak\"). Gereksiz uzun hikayelere girme.\n        3. Ba\u015Fl\u0131klar: Kesinlikle mahkeme numaras\u0131 veya adliye numaras\u0131 KULLANMA. \u0130\u00E7i bo\u015F ve a\u015F\u0131r\u0131 tekrar eden ba\u015Fl\u0131klar yerine, g\u00F6revin niteli\u011Fini belirten k\u0131sa ve farkl\u0131 ba\u015Fl\u0131klar at. \u00D6rnek: \"Asliye Ceza Duru\u015Fmas\u0131\", \"\u0130\u015F Mahkemesi Tan\u0131k Beyan\u0131\", \"\u0130cra Dairesinde Haciz \u0130\u015Flemi\", \"Karakol \u0130fade Temsili\".\n        4. \u00DCcret: Genelde 800 - 1500 TL aras\u0131 makul bir \u00FCcret ver. ANCAK \"Duru\u015Fma\" g\u00F6revi ise \u00FCcret KES\u0130NL\u0130KLE 900 TL'den az olamaz (En az 900 TL).\n        5. Asla markdown veya ekstra metin kullanma! Sadece a\u015Fa\u011F\u0131daki yap\u0131da JSON olarak yan\u0131t ver.\n\n        \u00C7IKTI FORMATI:\n        {\n            \"title\": \"K\u0131sa, numaras\u0131z, do\u011Fal ba\u015Fl\u0131k (\u00D6rn: Aile Mahkemesi \u00D6n \u0130nceleme Duru\u015Fmas\u0131)\",\n            \"description\": \"Selamlamas\u0131z, direkt konuya giren, k\u0131sa ve do\u011Fal mazeretli a\u00E7\u0131klama\",\n            \"jobType\": \"Duru\u015Fma\" | \"\u0130cra \u0130\u015Flemi\" | \"Dosya \u0130nceleme\" | \"Haciz\" | \"Dilek\u00E7e\" | \"Di\u011Fer\",\n            \"offeredFee\": 1200\n        }\n        ");
                model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
                return [4 /*yield*/, model.generateContent(prompt_1)];
            case 2:
                result = _a.sent();
                return [4 /*yield*/, result.response];
            case 3:
                response = _a.sent();
                text = response.text();
                if (!text) {
                    throw new Error("Empty response from Gemini");
                }
                jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
                data = JSON.parse(jsonStr);
                data.ownerName = generatedOwnerName;
                return [2 /*return*/, data];
            case 4:
                error_1 = _a.sent();
                console.error("Error generating job details with Gemini:", error_1);
                return [2 /*return*/, null];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.generateJobDetails = generateJobDetails;
