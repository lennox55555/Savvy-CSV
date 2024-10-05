import { addDoc, collection, doc, getDoc, getDocs, limit, orderBy, query, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase-init";
import pako from 'pako'
import { v4 as uuidv4 } from 'uuid';

class SavvyServiceAPI {
    private static instance: SavvyServiceAPI;
    private webSocket: WebSocket | null = null;
    private tableObject: string = "";

    private constructor() { }

    public static getInstance(): SavvyServiceAPI {
        if (!SavvyServiceAPI.instance) {
            SavvyServiceAPI.instance = new SavvyServiceAPI();
        }
        return SavvyServiceAPI.instance;
    }

    public async saveMessage(userId: string, message: string, sentByUser: boolean, conversationId: string | undefined) {
        try {
            const conversationRef = doc(collection(doc(db, 'users', userId), 'conversations'), conversationId);
            const messagesRef = collection(conversationRef, 'messages'); 

            const messageDoc = await addDoc(messagesRef, {
                text: message,
                user: sentByUser,
                timestamp: new Date(),
            });

            const conversationSnapshot = await getDoc(conversationRef);

            // If the conversation doesn't already have a title, set the first message as the title
            if (conversationSnapshot.exists() && !conversationSnapshot.data().title) {
                await updateDoc(conversationRef, {
                    title: message,
                    display: true 
                });
                console.log('Conversation title updated with first message:', message);
            } else {
                await updateDoc(conversationRef, {
                    display: true 
                });
            }
    
            console.log('Message saved:', messageDoc.id);
        } catch (error) {
            console.error("Error saving message:", error);
            throw error;
        }
    }

    public async updateLastMessage(userId: string, source: string, rank: number, conversationId: string) {
        try {

            const conversationRef = doc(collection(doc(db, 'users', userId), 'conversations'), conversationId);
            const messagesRef = collection(conversationRef, 'messages'); 
    
            const q = query(messagesRef, orderBy('timestamp', 'desc'), limit(1)); 
            const lastMessageSnapshot = await getDocs(q);

            if (lastMessageSnapshot.empty) {
                return
            } else {
                const lastMessageDoc = lastMessageSnapshot.docs[0];
                await updateDoc(lastMessageDoc.ref, {
                    source: source,
                    rank: rank
                });
                console.log('Message updated:', lastMessageDoc.id);
            }
        } catch (error) {
            console.error("Error updating last message:", error);
            throw error;
        }
    }


    public async getMessages(userId: string, conversationId: string | undefined) {
        try {
            if (conversationId) { 
                const conversationRef = doc(collection(doc(db, 'users', userId), 'conversations'), conversationId);
                const messagesRef = collection(conversationRef, 'messages');
                const q = query(messagesRef, orderBy("timestamp", "desc"), limit(10));
                const querySnapshot = await getDocs(q);

                const messages = querySnapshot.docs.map(doc => {
                    const data = doc.data();
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
                return messages;
            } else {
                // Handle the case where conversationId is undefined
                console.warn("Conversation ID is undefined. Returning an empty array.");
                return [];
            }
        } catch (error) {
            console.error("Error getting messages:", error);
            throw error;
        }
    }

    public async createNewConversation(userId: string) {
        try {
            const conversationId = uuidv4();
            const conversationRef = doc(doc(db, 'users', userId), 'conversations', conversationId);

            await setDoc(conversationRef, {
                title: '',
                timestamp: new Date(),
                display: false 
            });

            console.log('New conversation created:', conversationId);
            return conversationId; // Return the conversation ID for routing
        } catch (error) {
            console.error("Error creating a new conversation:", error);
            throw error;
        }
    }


    public initializeWebSocket(onMessageReceived: (data: any) => void, userQuery: string, userId: string, conversationId: string | undefined) {
        const wsUrl = 'wss://9f2wyu1469.execute-api.us-east-1.amazonaws.com/production/';
        const queries = [userQuery]; // Query being sent to API
        this.webSocket = new WebSocket(wsUrl);

        this.webSocket.onopen = () => {
            console.log('WebSocket connection established');
            this.sendQueries(queries);
        };

        this.webSocket.onmessage = (event: MessageEvent) => {
            console.log(event.data);
            if (conversationId) {
                this.handleMessage(event.data, onMessageReceived, userId, conversationId);
            }
        };

        this.webSocket.onerror = (event: Event) => {
            console.error('WebSocket error observed:', event);
        };

        this.webSocket.onclose = (event: CloseEvent) => {
            console.log('WebSocket connection closed:', event);
        };
    }

    private sendQueries(queries: string[]): void {
        if (this.webSocket && this.webSocket.readyState === WebSocket.OPEN) {
            const message = { action: "sendQueries", columnNames: queries };
            this.webSocket.send(JSON.stringify(message));
            console.log('Queries sent to the server:', queries);
        } else {
            console.error('WebSocket is not open. Cannot send queries.');
        }
    }

    private handleMessage(data: string, onMessageReceived: (data: any) => void, userId: string, conversationId: string) {
        try {
            // Step 1: Parse the incoming message to extract the 'compressed_data' field
            const parsedMessage = JSON.parse(data);
            const base64Data = parsedMessage.compressed_data;

            // Step 2: Decode the base64-encoded string
            const decodedData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

            // Step 3: Decompress the decoded data using pako
            const decompressedData = pako.ungzip(decodedData, { to: 'string' });

            // Step 4: Accumulate the decompressed data
            this.tableObject += decompressedData;

            let openBrackets = 0;
            let closeBrackets = 0;

            // Step 5: Check if the message is complete (i.e., number of open and close braces match)
            for (const char of this.tableObject) {
                if (char === '{') openBrackets++;
                if (char === '}') closeBrackets++;
            }

            // Step 6: Process the message if it is complete
            if (openBrackets > 0 && openBrackets === closeBrackets) {
                try {
                    // Parse the complete JSON message
                    const fullObject = JSON.parse(this.tableObject);

                    // Save the message and invoke the callback with the parsed data
                    this.saveMessage(userId, this.tableObject, false, conversationId);
                    onMessageReceived(fullObject);

                    this.tableObject = "";
                } catch (error) {
                    console.error('Error processing the complete message:', error);
                    this.tableObject = ""; // Reset on error
                }
            }
        } catch (error) {
            // Catch the error and return null inside the call-back function
            onMessageReceived(null)
            console.error('Error decoding or decompressing the message:', error);
            this.tableObject = ""; // Reset on error
        }
    }
}

export default SavvyServiceAPI;
