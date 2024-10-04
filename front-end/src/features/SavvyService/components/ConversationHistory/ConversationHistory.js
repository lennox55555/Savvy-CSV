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
import React, { useEffect, useState } from "react";
import styles from './ConversationHistory.module.css';
import { getAuth } from "firebase/auth";
import SavvyServiceAPI from "../../../../api/savvyServiceAPI";
import { useNavigate } from "react-router-dom";
import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import { isToday, subDays } from 'date-fns';
import { db } from "../../../../firebase/firebase-init";
var ConversationHistory = function () {
    var _a = useState([]), conversations = _a[0], setConversations = _a[1];
    var navigate = useNavigate();
    var createNewConversation = function () { return __awaiter(void 0, void 0, void 0, function () {
        var currentUser, newConversationId, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    currentUser = getAuth().currentUser;
                    if (!currentUser) return [3 /*break*/, 4];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, SavvyServiceAPI.getInstance().createNewConversation(currentUser.uid)];
                case 2:
                    newConversationId = _a.sent();
                    navigate("/savvycsv/".concat(newConversationId));
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    console.log("An error has occured while creating a new conversation", err_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleConversationSelect = function (conversationId) {
        navigate("/savvycsv/".concat(conversationId));
    };
    var groupConversationsByTimestamp = function (conversations) {
        var groups = {
            Today: [],
            'Last 7 Days': [],
            'Last 30 Days': []
        };
        var now = new Date();
        var startOfToday = new Date(now.setHours(0, 0, 0, 0)); // Midnight today
        var sevenDaysAgo = subDays(startOfToday, 7); // 7 days ago, inclusive
        conversations.forEach(function (conversation) {
            var conversationDate = conversation.timestamp.toDate();
            if (isToday(conversationDate)) {
                groups['Today'].push(conversation);
            }
            else if (conversationDate >= sevenDaysAgo) {
                groups['Last 7 Days'].push(conversation);
            }
            else {
                groups['Last 30 Days'].push(conversation);
            }
        });
        return groups;
    };
    useEffect(function () {
        var currentUser = getAuth().currentUser;
        if (currentUser) {
            var conversationsRef = collection(doc(db, 'users', currentUser.uid), 'conversations');
            var conversationsQuery = query(conversationsRef, where('display', '==', true));
            var unsubscribe_1 = onSnapshot(conversationsQuery, function (querySnapshot) {
                var fetchedConversations = querySnapshot.docs.map(function (doc) { return ({
                    id: doc.id,
                    title: doc.data().title,
                    timestamp: doc.data().timestamp || new Date(),
                    display: doc.data().display,
                }); });
                setConversations(fetchedConversations);
            });
            return function () { return unsubscribe_1(); };
        }
    }, []);
    var groupedConversations = groupConversationsByTimestamp(conversations);
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: styles.sidebarContainer, style: { background: '' } },
            React.createElement("div", { className: styles.newConversationButton, onClick: createNewConversation },
                React.createElement("div", null, "START NEW CONVERSATION")),
            React.createElement("div", { className: styles.conversationListContainer }, Object.keys(groupedConversations)
                .filter(function (group) { return groupedConversations[group].length > 0; })
                .map(function (group) { return (React.createElement("div", { key: group },
                React.createElement("div", { className: styles.dateRangeTitle }, group),
                groupedConversations[group].map(function (conversation) { return (React.createElement("div", { key: conversation.id, className: styles.conversationItemContainer, onClick: function () { return handleConversationSelect(conversation.id); } },
                    React.createElement("div", { className: styles.conversationItem }, conversation.title))); }))); })))));
};
export default ConversationHistory;
