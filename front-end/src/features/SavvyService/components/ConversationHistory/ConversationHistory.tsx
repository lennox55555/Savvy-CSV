import React, { useEffect, useState } from "react";
import styles from './ConversationHistory.module.css'
import { getAuth } from "firebase/auth";
import SavvyServiceAPI from "../../../../api/savvyServiceAPI";
import { UserConversation } from "../../../../utils/types";
import { useNavigate } from "react-router-dom";
import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../../../firebase/firebase-init";

const ConversationHistory: React.FC = () => {
    const [conversations, setConversations] = useState<UserConversation[]>([]);
    const [conversationId, setSelectedConversationId] = useState<string | null>(null);

    const navigate = useNavigate();

    const fetchConversations = async () => {
        const currentUser = getAuth().currentUser;

        if (currentUser) {
            const fetchedConversations = await SavvyServiceAPI.getInstance().getConversations(currentUser.uid);
            setConversations(fetchedConversations);
        }
    }

    const createNewConversation = async () => {
        const currentUser = getAuth().currentUser;

        if (currentUser) {
            try {
                const newConversationId = await SavvyServiceAPI.getInstance().createNewConversation(currentUser.uid);

                setSelectedConversationId(newConversationId);
                navigate(`/savvycsv/${conversationId}`)
            } catch (err: unknown) {
                console.log("An error has occured while creating a new conversation", err)
            }
        }
    };

    const handleConversationSelect = (conversationId: string) => {
        setSelectedConversationId(conversationId);
        navigate(`/savvycsv/${conversationId}`);
    };

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        const currentUser = getAuth().currentUser;

        if (currentUser) {
            const conversationsRef = collection(doc(db, 'users', currentUser.uid), 'conversations');
            const conversationsQuery = query(conversationsRef, where('display', '==', true));

            const unsubscribe = onSnapshot(conversationsQuery, (querySnapshot) => {
                const fetchedConversations = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    title: doc.data().title,
                    timestamp: doc.data().timestamp || new Date(),
                    display: doc.data().display,
                }));

                setConversations(fetchedConversations);
            });
            return () => unsubscribe();
        }
    }, []);

    return (
        <>
            <div className={styles.sidebarContainer} style={{ background: '' }}>
                <div className={styles.newConversationButton} onClick={createNewConversation}>
                    <div>
                        New Conversation
                    </div>
                    <div>
                        <i className="fa-solid fa-pencil"></i>
                    </div>
                </div>
                <div className={styles.conversationListContainer}>
                    {conversations.map((conversation) => (
                        <div
                            key={conversation.id}
                            className={styles.conversationItemContainer}
                            onClick={() => handleConversationSelect(conversation.id)}
                        >
                            <div className={styles.conversationItem}>
                                {conversation.title}
                            </div>
                            <div>
                                {/* Display last message or timestamp */}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default ConversationHistory