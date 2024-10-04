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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import React, { useState, useEffect, useRef } from 'react';
import styles from './SavvyBot.module.css';
import AutosizeTextArea from '../../../../utils/useAutosizeTextArea';
import { getAuth } from 'firebase/auth';
import SavvyServiceAPI from '../../../../api/savvyServiceAPI';
import Message from '../Message/Message';
import SavvyTable from '../SavvyTable/SavvyTable';
import { useNavigate, useParams } from 'react-router-dom';
var SavvyBot = function () {
    var conversationId = useParams().conversationId;
    var _a = useState(''), textAreaValue = _a[0], setTextAreaValue = _a[1];
    var _b = useState([]), messages = _b[0], setMessages = _b[1];
    var _c = useState(null), tableData = _c[0], setTableData = _c[1];
    var _d = useState(1), currentTableRank = _d[0], setCurrentTableRank = _d[1];
    var _e = useState(false), isLoading = _e[0], setIsLoading = _e[1];
    var _f = useState(''), currentTableSource = _f[0], setCurrentTableSource = _f[1];
    var _g = useState(false), isNavigating = _g[0], setIsNavigating = _g[1];
    var messageEndRef = useRef(null);
    var navigate = useNavigate();
    var fetchMessages = function () { return __awaiter(void 0, void 0, void 0, function () {
        var currentUser, fetchedMessages, processedMessages, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    currentUser = getAuth().currentUser;
                    if (!currentUser) return [3 /*break*/, 4];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, SavvyServiceAPI.getInstance().getMessages(currentUser.uid, conversationId)];
                case 2:
                    fetchedMessages = _a.sent();
                    processedMessages = fetchedMessages.map(function (message) {
                        if (!message.user) {
                            return __assign(__assign({}, message), { text: displayTableForRank(JSON.parse(message.text), message.rank || 1) });
                        }
                        return message;
                    });
                    setMessages(processedMessages);
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    if (err_1 instanceof Error) {
                        console.log(err_1.message);
                    }
                    else {
                        console.log('An error has occurred!');
                    }
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleSubmit = function () { return __awaiter(void 0, void 0, void 0, function () {
        var currentUser, currentConversationId, err_2, error_1, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(textAreaValue.trim() !== '')) return [3 /*break*/, 11];
                    currentUser = getAuth().currentUser;
                    if (!currentUser) return [3 /*break*/, 11];
                    currentConversationId = conversationId;
                    if (!!conversationId) return [3 /*break*/, 4];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, SavvyServiceAPI.getInstance().createNewConversation(currentUser.uid)];
                case 2:
                    currentConversationId = _a.sent();
                    setIsNavigating(true);
                    navigate("/savvycsv/".concat(currentConversationId), { replace: true });
                    return [3 /*break*/, 4];
                case 3:
                    err_2 = _a.sent();
                    console.error("An error occurred while creating a new conversation:", err_2);
                    return [2 /*return*/];
                case 4:
                    if (!(currentTableSource != '' && conversationId)) return [3 /*break*/, 8];
                    _a.label = 5;
                case 5:
                    _a.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, SavvyServiceAPI.getInstance().updateLastMessage(currentUser.uid, currentTableSource, currentTableRank, conversationId)];
                case 6:
                    _a.sent();
                    setMessages(function (prevMessages) {
                        if (prevMessages.length > 0) {
                            var lastIndex = prevMessages.length - 1;
                            if (!prevMessages[lastIndex].user) {
                                prevMessages[lastIndex].rank = currentTableRank;
                                prevMessages[lastIndex].source = currentTableSource;
                            }
                        }
                        return __spreadArray([], prevMessages, true);
                    });
                    return [3 /*break*/, 8];
                case 7:
                    error_1 = _a.sent();
                    console.error("Failed to update previous table object:", error_1);
                    return [3 /*break*/, 8];
                case 8:
                    _a.trys.push([8, 10, , 11]);
                    return [4 /*yield*/, SavvyServiceAPI.getInstance().saveMessage(currentUser.uid, textAreaValue, true, currentConversationId)];
                case 9:
                    _a.sent();
                    setMessages(function (prevMessages) {
                        return __spreadArray(__spreadArray([], prevMessages, true), [{ id: '', text: textAreaValue, user: true, source: '', rank: null, table: null }], false);
                    });
                    // Initialize WebSocket and listen for bot response
                    SavvyServiceAPI.getInstance().initializeWebSocket(handleWebSocketMessage, textAreaValue, currentUser.uid, currentConversationId);
                    setIsLoading(true);
                    setTextAreaValue('');
                    return [3 /*break*/, 11];
                case 10:
                    error_2 = _a.sent();
                    console.error("Failed to save message:", error_2);
                    return [3 /*break*/, 11];
                case 11: return [2 /*return*/];
            }
        });
    }); };
    var handleWebSocketMessage = function (data) {
        setTableData(data);
        setMessages(function (prevMessages) { return __spreadArray(__spreadArray([], prevMessages, true), [{ id: '', text: displayTableForRank(data, 1), user: false, source: '', rank: null, table: data }], false); });
        setIsLoading(false);
    };
    var handleKeyDown = function (event) {
        if (event.key === 'Enter' && !event.shiftKey && !isLoading) {
            event.preventDefault();
            handleSubmit();
        }
    };
    var displayTableForRank = function (data, rank) {
        for (var key in data) {
            if (data[key].rankOfTable == rank) {
                setCurrentTableSource(data[key].website);
                var currentTableKey = key;
                return (React.createElement(SavvyTable, { data: data, tableKey: currentTableKey }));
            }
        }
        return null;
    };
    var handleRefresh = function () {
        if (tableData) {
            // Update table rank in a cycle: 1 -> 2 -> 3 -> 1
            var nextRank_1 = currentTableRank === 3 ? 1 : currentTableRank + 1;
            setCurrentTableRank(nextRank_1);
            setMessages(function (prevMessages) {
                // Remove the most recent message and add the new one
                var messages = prevMessages.length > 0
                    ? prevMessages.slice(0, prevMessages.length - 1)
                    : prevMessages;
                return __spreadArray(__spreadArray([], messages, true), [
                    { id: '', text: displayTableForRank(tableData, nextRank_1), user: false, source: currentTableSource, rank: null, table: tableData }
                ], false);
            });
        }
    };
    var downloadCSV = function (table, rank) {
        if (!table || rank === null)
            return;
        var parsedTable;
        if (typeof table === 'string') {
            try {
                parsedTable = JSON.parse(table);
            }
            catch (error) {
                console.error("Invalid JSON string", error);
                return;
            }
        }
        else {
            parsedTable = table;
        }
        var currentData = Object.values(parsedTable).find(function (item) { return item.rankOfTable === rank; });
        if (!currentData)
            return;
        // Convert the table data to CSV format
        var csvContent = "data:text/csv;charset=utf-8,".concat(currentData.SampleTableData.replace(/\n/g, '\r\n'));
        // Create a download link
        var link = document.createElement('a');
        link.setAttribute('href', encodeURI(csvContent));
        link.setAttribute('download', "table_rank_".concat(currentTableRank, ".csv"));
        // Append to the DOM, click, and remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    useEffect(function () {
        setTableData(null);
        setCurrentTableRank(1);
        setMessages([]);
        setCurrentTableSource('');
        if (!isNavigating && conversationId) {
            fetchMessages();
        }
        setIsNavigating(false);
    }, [conversationId]);
    useEffect(function () {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: styles.savvybotContainer },
            React.createElement("div", { className: styles.messageBoxContainer },
                React.createElement("div", { className: styles.messageBoxWrapper },
                    messages.map(function (message, index) { return (React.createElement(Message, { message: message, index: index, downloadCSV: downloadCSV })); }),
                    React.createElement("div", { ref: messageEndRef }),
                    isLoading === true && (React.createElement("div", null,
                        React.createElement("div", { className: styles.messageItemContainer },
                            React.createElement("div", { className: styles.savvyResponse },
                                React.createElement("div", { className: styles.messageBubbleLoading },
                                    React.createElement("div", { className: styles.typingIndicator },
                                        React.createElement("div", { className: styles.dot }),
                                        React.createElement("div", { className: styles.dot }),
                                        React.createElement("div", { className: styles.dot }))))))),
                    tableData && isLoading === false && (React.createElement("div", null,
                        React.createElement("div", { className: styles.messageItemContainer },
                            React.createElement("div", { className: styles.savvyResponse },
                                React.createElement("div", { className: styles.tableButtonGroup },
                                    React.createElement("span", { onClick: handleRefresh, className: "material-symbols-outlined", title: "New Table" }, "cached"),
                                    React.createElement("span", { onClick: function () { return downloadCSV(tableData, currentTableRank); }, className: "material-symbols-outlined", title: "Download CSV" }, "download"),
                                    React.createElement("span", { className: "material-symbols-outlined", title: "Data Source" },
                                        React.createElement("a", { href: currentTableSource, target: "_blank", rel: "noopener noreferrer" }, "link")))))))))),
        React.createElement("div", { className: styles.messageBar },
            React.createElement("div", { className: styles.messageBarWrapper },
                React.createElement(AutosizeTextArea, { value: textAreaValue, onChange: setTextAreaValue, onKeyDown: handleKeyDown, maxHeight: 150, placeholder: "Message SavvyCSV" }),
                textAreaValue === '' && !isLoading ? (React.createElement("button", { className: styles.messageButton },
                    React.createElement("i", { className: "fa-solid fa-circle-up", style: { fontSize: '36px', color: 'var(--bs-inactive-btn-bg)', cursor: 'default' } }))) : (React.createElement("button", { className: styles.messageButton, onClick: handleSubmit },
                    React.createElement("i", { className: "fa-solid fa-circle-up", style: { fontSize: '36px', color: 'var(--bs-active-btn-bg)', cursor: 'pointer' } }))),
                isLoading && (React.createElement("button", { className: styles.messageButton },
                    React.createElement("i", { className: "fa-solid fa-circle-stop", style: { fontSize: '38px', color: 'var(--bs-active-btn-bg)' } })))))));
};
export default SavvyBot;
