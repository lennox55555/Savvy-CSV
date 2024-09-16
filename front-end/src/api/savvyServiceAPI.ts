import { addDoc, collection, doc, getDocs, limit, orderBy, query, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase-init";
import pako from 'pako'

class SavvyServiceAPI {
    private static instance: SavvyServiceAPI;
    private webSocket: WebSocket | null = null;
    private objec: string = ""; // To accumulate WebSocket messages

    private constructor() { }

    public static getInstance(): SavvyServiceAPI {
        if (!SavvyServiceAPI.instance) {
            SavvyServiceAPI.instance = new SavvyServiceAPI();
        }
        return SavvyServiceAPI.instance;
    }

    public async saveMessage(userId: string, message: string, sentByUser: boolean) {
        try {
            const userMessageRef = collection(doc(db, 'users', userId), 'messages');
            const messageDoc = await addDoc(userMessageRef, {
                text: message,
                user: sentByUser,
                timestamp: new Date(),
            });
            console.log('Message saved:', messageDoc.id);
        } catch (error) {
            console.error("Error saving message:", error);
            throw error;
        }
    }

    public async updateLastMessage(userId: string, source: string, rank: number) {
        try {

          const userMessageRef = collection(doc(db, 'users', userId), 'messages');
          const q = query(userMessageRef, orderBy('timestamp', 'desc'), limit(1));
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
      

    public async getMessages(userId: string) {
        try {
            const userMessagesRef = collection(doc(db, "users", userId), "messages");
            const q = query(userMessagesRef, orderBy("timestamp", "desc"), limit(25));
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
        } catch (error) {
            console.error("Error getting messages:", error);
            throw error;
        }
    }

    public initializeWebSocket(onMessageReceived: (data: any) => void, userQuery: string, userId: string): void {
        const wsUrl = 'wss://9f2wyu1469.execute-api.us-east-1.amazonaws.com/production/';
        const queries = [userQuery]; // Query being sent to API
        this.webSocket = new WebSocket(wsUrl);

        this.webSocket.onopen = () => {
            console.log('WebSocket connection established');
            this.sendQueries(queries);
        };

        this.webSocket.onmessage = (event: MessageEvent) => {
            console.log(event.data);
            this.handleMessage(event.data, onMessageReceived, userId);
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

    private handleMessage(data: string, onMessageReceived: (data: any) => void, userId: string): void {
        try {
            // Step 1: Parse the incoming message to extract the 'compressed_data' field
            const parsedMessage = JSON.parse(data);
            const base64Data = parsedMessage.compressed_data;

            // Step 2: Decode the base64-encoded string
            const decodedData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

            // Step 3: Decompress the decoded data using pako
            const decompressedData = pako.ungzip(decodedData, { to: 'string' });

            // Step 4: Accumulate the decompressed data
            this.objec += decompressedData;

            let openBrackets = 0;
            let closeBrackets = 0;

            // Step 5: Check if the message is complete (i.e., number of open and close braces match)
            for (const char of this.objec) {
                if (char === '{') openBrackets++;
                if (char === '}') closeBrackets++;
            }

            // Step 6: Process the message if it is complete
            if (openBrackets > 0 && openBrackets === closeBrackets) {
                try {
                    // Parse the complete JSON message
                    const fullObject = JSON.parse(this.objec);

                    // Save the message and invoke the callback with the parsed data
                    this.saveMessage(userId, this.objec, false);
                    onMessageReceived(fullObject);

                    // Reset the accumulated string after processing
                    this.objec = "";
                } catch (error) {
                    console.error('Error processing the complete message:', error);
                    this.objec = ""; // Reset on error
                }
            }
        } catch (error) {
            console.error('Error decoding or decompressing the message:', error);
            this.objec = ""; // Reset on error
        }
    }
}

export default SavvyServiceAPI;
