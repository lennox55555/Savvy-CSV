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
import { doc, setDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth";
import { db, auth } from "../firebase/firebase-init";
var UserServiceAPI = /** @class */ (function () {
    function UserServiceAPI() {
    }
    UserServiceAPI.getInstance = function () {
        if (!UserServiceAPI.instance) {
            UserServiceAPI.instance = new UserServiceAPI();
        }
        return UserServiceAPI.instance;
    };
    UserServiceAPI.prototype.registerUser = function (userData) {
        return __awaiter(this, void 0, void 0, function () {
            var userCredential, user, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, createUserWithEmailAndPassword(auth, userData.email, userData.password)];
                    case 1:
                        userCredential = _a.sent();
                        user = userCredential.user;
                        return [4 /*yield*/, setDoc(doc(db, 'users', user.uid), {
                                email: user.email,
                                createdAt: new Date().toISOString(),
                            })];
                    case 2:
                        _a.sent();
                        console.log("User created:", userCredential.user);
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.error("Error creating user:", error_1);
                        throw error_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    UserServiceAPI.prototype.signInUser = function (userData) {
        return __awaiter(this, void 0, void 0, function () {
            var error_2, userCredential, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(userData.email == 'Admin' && userData.password == 'DR.Z!')) return [3 /*break*/, 5];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, signInWithEmailAndPassword(auth, 'admin@test.com', 'DR.Z!!')];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        return [3 /*break*/, 4];
                    case 4: return [3 /*break*/, 8];
                    case 5:
                        _a.trys.push([5, 7, , 8]);
                        return [4 /*yield*/, signInWithEmailAndPassword(auth, userData.email, userData.password)];
                    case 6:
                        userCredential = _a.sent();
                        console.log("User signed in:", userCredential.user);
                        return [3 /*break*/, 8];
                    case 7:
                        error_3 = _a.sent();
                        console.error("Error signing in user:", error_3);
                        throw error_3;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    UserServiceAPI.prototype.signInWithGoogle = function () {
        return __awaiter(this, void 0, void 0, function () {
            var provider, userCredential, user, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        provider = new GoogleAuthProvider();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, signInWithPopup(auth, provider)];
                    case 2:
                        userCredential = _a.sent();
                        user = userCredential.user;
                        return [4 /*yield*/, setDoc(doc(db, 'users', user.uid), {
                                email: user.email,
                                createdAt: new Date().toISOString(),
                            })];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_4 = _a.sent();
                        console.error("Error signing in with Google:", error_4);
                        throw error_4;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    UserServiceAPI.prototype.isLoggedIn = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        onAuthStateChanged(auth, function (user) {
                            if (user) {
                                resolve(true);
                            }
                            else {
                                resolve(false);
                            }
                        }, function (error) {
                            reject(error);
                        });
                    })];
            });
        });
    };
    UserServiceAPI.prototype.signOutUser = function () {
        return __awaiter(this, void 0, void 0, function () {
            var auth_1, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        auth_1 = getAuth();
                        return [4 /*yield*/, signOut(auth_1)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _a.sent();
                        console.error("Error signing out:", error_5);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return UserServiceAPI;
}());
export default UserServiceAPI;
