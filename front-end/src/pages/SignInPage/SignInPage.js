var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
import React, { useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import './SignInPage.css';
import { Link, useNavigate } from 'react-router-dom';
import googleLogo from '../../assets/Google_G_logo.svg.png';
import UserServiceAPI from '../../api/userServiceAPI';
import SignInLottie from './SignInLottie';
var SignInPage = function () {
    var _a = useState({
        email: '',
        password: ''
    }), formData = _a[0], setFormData = _a[1];
    var _b = useState(''), error = _b[0], setError = _b[1];
    var navigate = useNavigate();
    var handleChange = function (e) {
        var _a = e.target, name = _a.name, value = _a.value;
        setFormData(function (prevState) {
            var _a;
            return (__assign(__assign({}, prevState), (_a = {}, _a[name] = value, _a)));
        });
    };
    var handleSubmit = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, UserServiceAPI.getInstance().signInUser(formData)];
                case 2:
                    _a.sent();
                    navigate('/savvycsv');
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    if (err_1 instanceof Error) {
                        setError('Incorrect email address or password.');
                    }
                    else {
                        console.log('An error has occured.');
                    }
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var signInWithGoogle = function () { return __awaiter(void 0, void 0, void 0, function () {
        var err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, UserServiceAPI.getInstance().signInWithGoogle()];
                case 1:
                    _a.sent();
                    navigate('/savvycsv');
                    return [3 /*break*/, 3];
                case 2:
                    err_2 = _a.sent();
                    if (err_2 instanceof Error) {
                        setError('Trouble signing in with Google. Please try again later.');
                    }
                    else {
                        console.log('An error has occured.');
                    }
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    return (React.createElement(Container, { fluid: true },
        React.createElement(Row, null,
            React.createElement(Col, { md: 7, className: 'form-column' },
                React.createElement("div", { className: 'form-container' },
                    React.createElement("div", { className: 'title' }, "Welcome to SavvyCSV"),
                    React.createElement(Form, { className: 'sign-in-form', onSubmit: handleSubmit },
                        React.createElement(Form.Group, { className: 'form-group' },
                            React.createElement(Form.Control, { className: 'email-input', type: 'text', name: 'email', onChange: handleChange, required: true }),
                            React.createElement("div", { className: 'label' }, "Email address")),
                        React.createElement(Form.Group, { className: 'form-group' },
                            React.createElement(Form.Control, { className: 'password-input', type: 'password', name: 'password', onChange: handleChange, required: true }),
                            React.createElement("div", { className: 'label' }, "Password")),
                        error &&
                            React.createElement("p", { className: "error-message" }, error),
                        React.createElement("button", { type: 'submit' }, "Continue")),
                    React.createElement("div", { className: 'sign-up-link-container' },
                        React.createElement("div", { className: 'sign-up-link' },
                            "Don't have an account? ",
                            React.createElement(Link, { style: { textDecoration: 'none' }, to: '/register' }, "Sign up"))),
                    React.createElement("hr", { className: 'divider' }),
                    React.createElement("button", { className: 'google-button', onClick: signInWithGoogle },
                        React.createElement("img", { src: googleLogo, alt: "Google logo", className: 'google-logo' }),
                        "Continue with Google"))),
            React.createElement(Col, { md: 5, className: 'blank-column' },
                React.createElement("div", { style: { marginTop: '120px' } },
                    React.createElement(SignInLottie, null))))));
};
export default SignInPage;
