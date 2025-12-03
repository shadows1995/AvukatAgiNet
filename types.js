"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobType = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["FREE"] = "free";
    UserRole["PREMIUM"] = "premium";
    UserRole["ADMIN"] = "admin";
})(UserRole || (exports.UserRole = UserRole = {}));
var JobType;
(function (JobType) {
    JobType["DURUSMA"] = "Duru\u015Fma";
    JobType["ICRA"] = "\u0130cra \u0130\u015Flemi";
    JobType["DOSYA_INCELEME"] = "Dosya \u0130nceleme";
    JobType["HACIZ"] = "Haciz";
    JobType["DILEKCE"] = "Dilek\u00E7e";
    JobType["DIGER"] = "Di\u011Fer";
})(JobType || (exports.JobType = JobType = {}));
