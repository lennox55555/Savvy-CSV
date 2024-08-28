import { addDoc, collection, doc, getDocs, getFirestore, orderBy, query } from "firebase/firestore";
import UserServiceAPI from "./userServiceAPI"
import { db } from "../firebase/firebase-init";


class SavvyServiceAPI {
    private static instance: SavvyServiceAPI;

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
            console.log('Message saved:', messageDoc.id)
        } catch (error) {
            console.error("Error saving message:", error);
            throw error;
        }
    }

    public async getMessages(userId: string) {

        try {
            const userMessagesRef = collection(doc(db, "users", userId), "messages");
            const q = query(userMessagesRef, orderBy("timestamp"));
            const querySnapshot = await getDocs(q);

            const messages = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    text: data.text || '', 
                    user: data.user || false,
                };
            });

            return messages;
        } catch (error) {
            console.error("Error getting messages:", error);
            throw error;
        }

    }
}

export default SavvyServiceAPI;