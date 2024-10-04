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
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './SavvyService.css';
import SavvyBot from "./components/SavvyBot/SavvyBot";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { auth } from "../../firebase/firebase-init";
import UserServiceAPI from "../../api/userServiceAPI";
import { useTheme } from "../../themes/ThemeContext";
import React from "react";
import Conversation from "./components/ConversationHistory/ConversationHistory";
var SavvyService = function () {
    var _a = useState(false), isSidebarOpen = _a[0], setSidebarOpen = _a[1];
    var _b = useState(false), dropdownOpen = _b[0], setDropdownOpen = _b[1];
    var _c = useTheme(), themeName = _c.themeName, toggleTheme = _c.toggleTheme;
    var navigate = useNavigate();
    var toggleSidebar = function () {
        setSidebarOpen(!isSidebarOpen);
    };
    var toggleDropdown = function () {
        setDropdownOpen(!dropdownOpen);
    };
    var handleLogOut = function () { return __awaiter(void 0, void 0, void 0, function () {
        var err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, UserServiceAPI.getInstance().signOutUser()];
                case 1:
                    _a.sent();
                    navigate('/');
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    if (err_1 instanceof Error) {
                        console.log("An error has occurred during logout:", err_1.message);
                    }
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var _d = useState(null), userIconUrl = _d[0], setUserIconUrl = _d[1];
    var _e = useState(''), username = _e[0], setUsername = _e[1];
    useEffect(function () {
        var requestCount = 0;
        var unsubscribe = auth.onAuthStateChanged(function (currentUser) {
            var _a, _b;
            if (currentUser && requestCount < 1) {
                requestCount++;
                setUserIconUrl(currentUser.photoURL);
                setUsername(((_a = currentUser.displayName) === null || _a === void 0 ? void 0 : _a.replace(/\s+/g, '').toLowerCase()) || ((_b = currentUser.email) === null || _b === void 0 ? void 0 : _b.replace(/\s+/g, '').toLowerCase().replace(/@|\.com/g, '')) || '');
                setTimeout(function () {
                    requestCount = 0;
                }, 1000);
            }
            else {
                setUserIconUrl(null);
                setUsername('');
            }
        });
        return function () { return unsubscribe(); };
    }, []);
    return (React.createElement("div", { className: "savvy-container" },
        React.createElement("header", { className: "header" },
            React.createElement("div", { className: "header-content" },
                isSidebarOpen ? (React.createElement("div", { className: "toggle-icon-wrapper" },
                    React.createElement("svg", { onClick: toggleSidebar, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", className: "icon-xl-heavy" },
                        React.createElement("path", { fill: "currentColor", d: "M8.857 3h6.286c1.084 0 1.958 0 2.666.058.729.06 1.369.185 1.961.487a5 5 0 0 1 2.185 2.185c.302.592.428 1.233.487 1.961.058.708.058 1.582.058 2.666v3.286c0 1.084 0 1.958-.058 2.666-.06.729-.185 1.369-.487 1.961a5 5 0 0 1-2.185 2.185c-.592.302-1.232.428-1.961.487C17.1 21 16.227 21 15.143 21H8.857c-1.084 0-1.958 0-2.666-.058-.728-.06-1.369-.185-1.96-.487a5 5 0 0 1-2.186-2.185c-.302-.592-.428-1.232-.487-1.961C1.5 15.6 1.5 14.727 1.5 13.643v-3.286c0-1.084 0-1.958.058-2.666.06-.728.185-1.369.487-1.96A5 5 0 0 1 4.23 3.544c.592-.302 1.233-.428 1.961-.487C6.9 3 7.773 3 8.857 3M6.354 5.051c-.605.05-.953.142-1.216.276a3 3 0 0 0-1.311 1.311c-.134.263-.226.611-.276 1.216-.05.617-.051 1.41-.051 2.546v3.2c0 1.137 0 1.929.051 2.546.05.605.142.953.276 1.216a3 3 0 0 0 1.311 1.311c.263.134.611.226 1.216.276.617.05 1.41.051 2.546.051h.6V5h-.6c-1.137 0-1.929 0-2.546.051M11.5 5v14h3.6c1.137 0 1.929 0 2.546-.051.605-.05.953-.142 1.216-.276a3 3 0 0 0 1.311-1.311c.134-.263.226-.611.276-1.216.05-.617.051-1.41.051-2.546v-3.2c0-1.137 0-1.929-.051-2.546-.05-.605-.142-.953-.276-1.216a3 3 0 0 0-1.311-1.311c-.263-.134-.611-.226-1.216-.276C17.029 5.001 16.236 5 15.1 5zM5 8.5a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1M5 12a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1" })))) : (React.createElement("div", { className: "toggle-icon-wrapper" },
                    React.createElement("svg", { onClick: toggleSidebar, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", className: "icon-xl-heavy" },
                        React.createElement("path", { fill: "currentColor", d: "M8.857 3h6.286c1.084 0 1.958 0 2.666.058.729.06 1.369.185 1.961.487a5 5 0 0 1 2.185 2.185c.302.592.428 1.233.487 1.961.058.708.058 1.582.058 2.666v3.286c0 1.084 0 1.958-.058 2.666-.06.729-.185 1.369-.487 1.961a5 5 0 0 1-2.185 2.185c-.592.302-1.232.428-1.961.487C17.1 21 16.227 21 15.143 21H8.857c-1.084 0-1.958 0-2.666-.058-.728-.06-1.369-.185-1.96-.487a5 5 0 0 1-2.186-2.185c-.302-.592-.428-1.232-.487-1.961C1.5 15.6 1.5 14.727 1.5 13.643v-3.286c0-1.084 0-1.958.058-2.666.06-.728.185-1.369.487-1.96A5 5 0 0 1 4.23 3.544c.592-.302 1.233-.428 1.961-.487C6.9 3 7.773 3 8.857 3M6.354 5.051c-.605.05-.953.142-1.216.276a3 3 0 0 0-1.311 1.311c-.134.263-.226.611-.276 1.216-.05.617-.051 1.41-.051 2.546v3.2c0 1.137 0 1.929.051 2.546.05.605.142.953.276 1.216a3 3 0 0 0 1.311 1.311c.263.134.611.226 1.216.276.617.05 1.41.051 2.546.051h.6V5h-.6c-1.137 0-1.929 0-2.546.051M11.5 5v14h3.6c1.137 0 1.929 0 2.546-.051.605-.05.953-.142 1.216-.276a3 3 0 0 0 1.311-1.311c.134-.263.226-.611.276-1.216.05-.617.051-1.41.051-2.546v-3.2c0-1.137 0-1.929-.051-2.546-.05-.605-.142-.953-.276-1.216a3 3 0 0 0-1.311-1.311c-.263-.134-.611-.226-1.216-.276C17.029 5.001 16.236 5 15.1 5zM5 8.5a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1M5 12a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1" })))),
                React.createElement(Link, { to: '/', style: { textDecoration: 'none' } },
                    React.createElement("h1", { className: "savvy-title ".concat(isSidebarOpen ? 'with-sidebar-open' : 'with-sidebar-closed') }, "SavvyCSV")),
                React.createElement("div", { className: "spacer" }),
                userIconUrl ? (React.createElement("div", { className: "profile-content" },
                    React.createElement("img", { className: "profile-image", src: userIconUrl, alt: 'User Icon', onClick: toggleDropdown }),
                    dropdownOpen && (React.createElement("div", { className: "dropdown-wrapper" },
                        React.createElement("div", { className: "sub-dropdown" },
                            React.createElement("div", { className: "user-info" },
                                React.createElement("img", { src: userIconUrl, alt: 'User Icon' }),
                                React.createElement("div", { style: { color: 'darkgray', fontSize: '14px' } }, username)),
                            React.createElement("hr", null),
                            React.createElement("div", { className: 'dropdown-item-wrapper' },
                                themeName === 'dark' ? (React.createElement("div", { className: 'dropdown-row', onClick: toggleTheme },
                                    React.createElement("div", { className: 'icon-wrapper' },
                                        React.createElement("i", { className: "bi bi-sun", style: { fontSize: '20px' } })),
                                    React.createElement("div", { className: "dropdown-action" }, "Light Theme"))) : (React.createElement("div", { className: 'dropdown-row', onClick: toggleTheme },
                                    React.createElement("div", { className: 'icon-wrapper' },
                                        React.createElement("i", { className: "fa-regular fa-moon", style: { fontSize: '20px', padding: '0' } })),
                                    React.createElement("div", { className: "dropdown-action" }, "Dark Theme"))),
                                React.createElement("div", { className: 'dropdown-row', onClick: handleLogOut },
                                    React.createElement("div", { className: 'icon-wrapper' },
                                        React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", className: "logout-icon" },
                                            React.createElement("path", { d: "M6 4a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h4a1 1 0 1 1 0 2H6a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3h4a1 1 0 1 1 0 2zm9.293 3.293a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414-1.414L17.586 13H11a1 1 0 1 1 0-2h6.586l-2.293-2.293a1 1 0 0 1 0-1.414" }))),
                                    React.createElement("div", { className: "dropdown-action" }, "Log out")))))))) : (React.createElement("div", { className: "profile-content" },
                    React.createElement("div", { className: "profile-image" },
                        React.createElement("i", { className: "fa-regular fa-user", onClick: toggleDropdown, style: { color: 'var(--bs-usr-icon-color)', fontSize: '20px' } })),
                    dropdownOpen && (React.createElement("div", { className: "dropdown-wrapper" },
                        React.createElement("div", { className: "sub-dropdown" },
                            React.createElement("div", { className: "user-info" },
                                React.createElement("i", { className: "fa-regular fa-user", style: { color: 'var(--bs-usr-icon-color)', fontSize: '20px', paddingLeft: '12px' } }),
                                React.createElement("div", { style: { color: 'darkgray', fontSize: '14px', paddingLeft: '12px' } }, username)),
                            React.createElement("hr", null),
                            React.createElement("div", { className: 'dropdown-item-wrapper' },
                                themeName === 'dark' ? (React.createElement("div", { className: 'dropdown-row', onClick: toggleTheme },
                                    React.createElement("div", { className: 'icon-wrapper' },
                                        React.createElement("i", { className: "bi bi-sun", style: { fontSize: '18px', marginBottom: '-5px' } })),
                                    React.createElement("div", { className: "dropdown-action" }, "Light Theme"))) : (React.createElement("div", { className: 'dropdown-row', onClick: toggleTheme },
                                    React.createElement("div", { className: 'icon-wrapper' },
                                        React.createElement("i", { className: "fa-regular fa-moon", style: { fontSize: '20px' } })),
                                    React.createElement("div", { className: "dropdown-action" }, "Dark Theme"))),
                                React.createElement("div", { className: 'dropdown-row', onClick: handleLogOut },
                                    React.createElement("div", { className: 'icon-wrapper' },
                                        React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", className: "logout-icon" },
                                            React.createElement("path", { d: "M6 4a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h4a1 1 0 1 1 0 2H6a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3h4a1 1 0 1 1 0 2zm9.293 3.293a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414-1.414L17.586 13H11a1 1 0 1 1 0-2h6.586l-2.293-2.293a1 1 0 0 1 0-1.414" }))),
                                    React.createElement("div", { className: "dropdown-action" }, "Log out")))))))))),
        React.createElement("div", { className: "main-container" },
            React.createElement("aside", { className: "sidebar ".concat(isSidebarOpen ? 'open' : 'closed') },
                React.createElement(Conversation, null)),
            React.createElement("main", { className: "content" },
                React.createElement(SavvyBot, null)))));
};
export default SavvyService;
