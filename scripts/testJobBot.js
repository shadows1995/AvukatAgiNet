"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var supabase_js_1 = require("@supabase/supabase-js");
var dotenv_1 = require("dotenv");
var jobBot_ts_1 = require("../src/services/jobBot.ts");
// Load environment variables
dotenv_1.default.config();
var supabaseUrl = process.env.VITE_SUPABASE_URL;
var supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}
var supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseServiceKey);
var fs_1 = require("fs");
var util_1 = require("util");
var logFile = fs_1.default.createWriteStream('bot_test.log', { flags: 'w' });
var logStdout = process.stdout;
console.log = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    logFile.write(util_1.default.format.apply(util_1.default, args) + '\n');
    logStdout.write(util_1.default.format.apply(util_1.default, args) + '\n');
};
console.error = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    logFile.write(util_1.default.format.apply(util_1.default, args) + '\n');
    logStdout.write(util_1.default.format.apply(util_1.default, args) + '\n');
};
console.log('🚀 Starting Job Bot Test...');
(0, jobBot_ts_1.runJobBot)(supabase).then(function () {
    console.log('✅ Job Bot Test Completed.');
}).catch(function (err) {
    console.error('❌ Job Bot Test Failed:', err);
});
