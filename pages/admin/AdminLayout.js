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
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var lucide_react_1 = require("lucide-react");
var supabaseClient_1 = require("../../supabaseClient");
var AdminLayout = function () {
    var _a = react_1.default.useState(true), isSidebarOpen = _a[0], setIsSidebarOpen = _a[1];
    var navigate = (0, react_router_dom_1.useNavigate)();
    var handleLogout = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, supabaseClient_1.supabase.auth.signOut()];
                case 1:
                    _a.sent();
                    navigate('/login');
                    return [2 /*return*/];
            }
        });
    }); };
    var navItems = [
        { to: '/admin', icon: lucide_react_1.LayoutDashboard, label: 'Dashboard', end: true },
        { to: '/admin/jobs', icon: lucide_react_1.Briefcase, label: 'Görev Yönetimi' },
        { to: '/admin/users', icon: lucide_react_1.Users, label: 'Kullanıcı Yönetimi' },
        { to: '/admin/security', icon: lucide_react_1.Shield, label: 'Güvenlik & Loglar' },
    ];
    return (<div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside className={"fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out ".concat(isSidebarOpen ? 'translate-x-0' : '-translate-x-full', " lg:relative lg:translate-x-0")}>
                <div className="h-full flex flex-col">
                    <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                        <h1 className="text-xl font-bold text-white">Admin Paneli</h1>
                        <button onClick={function () { return setIsSidebarOpen(false); }} className="lg:hidden text-slate-400 hover:text-white">
                            <lucide_react_1.X className="w-6 h-6"/>
                        </button>
                    </div>

                    <nav className="flex-1 p-4 space-y-2">
                        {navItems.map(function (item) { return (<react_router_dom_1.NavLink key={item.to} to={item.to} end={item.end} className={function (_a) {
                var isActive = _a.isActive;
                return "flex items-center px-4 py-3 rounded-lg transition-colors ".concat(isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white');
            }}>
                                <item.icon className="w-5 h-5 mr-3"/>
                                {item.label}
                            </react_router_dom_1.NavLink>); })}
                    </nav>

                    <div className="p-4 border-t border-slate-800">
                        <button onClick={handleLogout} className="flex items-center w-full px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
                            <lucide_react_1.LogOut className="w-5 h-5 mr-3"/>
                            Çıkış Yap
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Mobile Header */}
                <header className="lg:hidden bg-white shadow-sm p-4 flex items-center">
                    <button onClick={function () { return setIsSidebarOpen(true); }} className="text-gray-600 hover:text-gray-900">
                        <lucide_react_1.Menu className="w-6 h-6"/>
                    </button>
                    <span className="ml-4 font-semibold text-gray-900">Admin Paneli</span>
                </header>

                <main className="flex-1 overflow-y-auto p-4 lg:p-8">
                    <react_router_dom_1.Outlet />
                </main>
            </div>
        </div>);
};
exports.default = AdminLayout;
