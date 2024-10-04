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
import { addDoc, collection, doc, getDoc, getDocs, limit, orderBy, query, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase-init";
import pako from 'pako';
import { v4 as uuidv4 } from 'uuid';
var SavvyServiceAPI = /** @class */ (function () {
    function SavvyServiceAPI() {
        this.webSocket = null;
        this.tableObject = "";
    }
    SavvyServiceAPI.getInstance = function () {
        if (!SavvyServiceAPI.instance) {
            SavvyServiceAPI.instance = new SavvyServiceAPI();
        }
        return SavvyServiceAPI.instance;
    };
    SavvyServiceAPI.prototype.saveMessage = function (userId, message, sentByUser, conversationId) {
        return __awaiter(this, void 0, void 0, function () {
            var conversationRef, messagesRef, messageDoc, conversationSnapshot, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        conversationRef = doc(collection(doc(db, 'users', userId), 'conversations'), conversationId);
                        messagesRef = collection(conversationRef, 'messages');
                        return [4 /*yield*/, addDoc(messagesRef, {
                                text: message,
                                user: sentByUser,
                                timestamp: new Date(),
                            })];
                    case 1:
                        messageDoc = _a.sent();
                        return [4 /*yield*/, getDoc(conversationRef)];
                    case 2:
                        conversationSnapshot = _a.sent();
                        if (!(conversationSnapshot.exists() && !conversationSnapshot.data().title)) return [3 /*break*/, 4];
                        return [4 /*yield*/, updateDoc(conversationRef, {
                                title: message,
                                display: true
                            })];
                    case 3:
                        _a.sent();
                        console.log('Conversation title updated with first message:', message);
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, updateDoc(conversationRef, {
                            display: true
                        })];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        console.log('Message saved:', messageDoc.id);
                        return [3 /*break*/, 8];
                    case 7:
                        error_1 = _a.sent();
                        console.error("Error saving message:", error_1);
                        throw error_1;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    SavvyServiceAPI.prototype.updateLastMessage = function (userId, source, rank, conversationId) {
        return __awaiter(this, void 0, void 0, function () {
            var conversationRef, messagesRef, q, lastMessageSnapshot, lastMessageDoc, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        conversationRef = doc(collection(doc(db, 'users', userId), 'conversations'), conversationId);
                        messagesRef = collection(conversationRef, 'messages');
                        q = query(messagesRef, orderBy('timestamp', 'desc'), limit(1));
                        return [4 /*yield*/, getDocs(q)];
                    case 1:
                        lastMessageSnapshot = _a.sent();
                        if (!lastMessageSnapshot.empty) return [3 /*break*/, 2];
                        return [2 /*return*/];
                    case 2:
                        lastMessageDoc = lastMessageSnapshot.docs[0];
                        return [4 /*yield*/, updateDoc(lastMessageDoc.ref, {
                                source: source,
                                rank: rank
                            })];
                    case 3:
                        _a.sent();
                        console.log('Message updated:', lastMessageDoc.id);
                        _a.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_2 = _a.sent();
                        console.error("Error updating last message:", error_2);
                        throw error_2;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    SavvyServiceAPI.prototype.getMessages = function (userId, conversationId) {
        return __awaiter(this, void 0, void 0, function () {
            var conversationRef, messagesRef, q, querySnapshot, messages, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!conversationId) return [3 /*break*/, 2];
                        conversationRef = doc(collection(doc(db, 'users', userId), 'conversations'), conversationId);
                        messagesRef = collection(conversationRef, 'messages');
                        q = query(messagesRef, orderBy("timestamp", "desc"), limit(10));
                        return [4 /*yield*/, getDocs(q)];
                    case 1:
                        querySnapshot = _a.sent();
                        messages = querySnapshot.docs.map(function (doc) {
                            var data = doc.data();
                            return {
                                id: doc.id,
                                text: data.text || '',
                                user: data.user || false,
                                source: data.source || '',
                                rank: data.rank || '',
                                table: data.text
                            };
                        });
                        messages.reverse();
                        return [2 /*return*/, messages];
                    case 2:
                        // Handle the case where conversationId is undefined
                        console.warn("Conversation ID is undefined. Returning an empty array.");
                        return [2 /*return*/, []];
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_3 = _a.sent();
                        console.error("Error getting messages:", error_3);
                        throw error_3;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    SavvyServiceAPI.prototype.createNewConversation = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var conversationId, conversationRef, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        conversationId = uuidv4();
                        conversationRef = doc(doc(db, 'users', userId), 'conversations', conversationId);
                        return [4 /*yield*/, setDoc(conversationRef, {
                                title: '',
                                timestamp: new Date(),
                                display: false
                            })];
                    case 1:
                        _a.sent();
                        console.log('New conversation created:', conversationId);
                        return [2 /*return*/, conversationId]; // Return the conversation ID for routing
                    case 2:
                        error_4 = _a.sent();
                        console.error("Error creating a new conversation:", error_4);
                        throw error_4;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SavvyServiceAPI.prototype.initializeWebSocket = function (onMessageReceived, userQuery, userId, conversationId) {
        var _this = this;
        var wsUrl = 'wss://9f2wyu1469.execute-api.us-east-1.amazonaws.com/production/';
        var queries = [userQuery]; // Query being sent to API
        this.webSocket = new WebSocket(wsUrl);
        this.webSocket.onopen = function () {
            console.log('WebSocket connection established');
            _this.sendQueries(queries);
        };
        this.webSocket.onmessage = function (event) {
            console.log(event.data);
            if (conversationId) {
                _this.handleMessage(event.data, onMessageReceived, userId, conversationId);
            }
        };
        this.webSocket.onerror = function (event) {
            console.error('WebSocket error observed:', event);
        };
        this.webSocket.onclose = function (event) {
            console.log('WebSocket connection closed:', event);
        };
    };
    SavvyServiceAPI.prototype.sendQueries = function (queries) {
        if (this.webSocket && this.webSocket.readyState === WebSocket.OPEN) {
            var message = { action: "sendQueries", columnNames: queries };
            this.webSocket.send(JSON.stringify(message));
            console.log('Queries sent to the server:', queries);
        }
        else {
            console.error('WebSocket is not open. Cannot send queries.');
        }
    };
    SavvyServiceAPI.prototype.handleMessage = function (data, onMessageReceived, userId, conversationId) {
        try {
            // Step 1: Parse the incoming message to extract the 'compressed_data' field
            console.log(data);
            var parsedMessage = JSON.parse(data);
            console.log(parsedMessage);
            var base64Data = parsedMessage.compressed_data;
            // Step 2: Decode the base64-encoded string
            var decodedData = Uint8Array.from(atob(base64Data), function (c) { return c.charCodeAt(0); });
            // Step 3: Decompress the decoded data using pako
            var decompressedData = pako.ungzip(decodedData, { to: 'string' });
            // Step 4: Accumulate the decompressed data
            this.tableObject += decompressedData;
            var openBrackets = 0;
            var closeBrackets = 0;
            // Step 5: Check if the message is complete (i.e., number of open and close braces match)
            for (var _i = 0, _a = this.tableObject; _i < _a.length; _i++) {
                var char = _a[_i];
                if (char === '{')
                    openBrackets++;
                if (char === '}')
                    closeBrackets++;
            }
            // Step 6: Process the message if it is complete
            if (openBrackets > 0 && openBrackets === closeBrackets) {
                try {
                    // Parse the complete JSON message
                    var fullObject = JSON.parse(this.tableObject);
                    // Save the message and invoke the callback with the parsed data
                    this.saveMessage(userId, this.tableObject, false, conversationId);
                    onMessageReceived(fullObject);
                    // Reset the accumulated string after processing
                    this.tableObject = "";
                }
                catch (error) {
                    console.error('Error processing the complete message:', error);
                    this.tableObject = ""; // Reset on error
                }
            }
        }
        catch (error) {
            console.error('Error decoding or decompressing the message:', error);
            this.tableObject = ""; // Reset on error
        }
    };
    return SavvyServiceAPI;
}());
export default SavvyServiceAPI;
