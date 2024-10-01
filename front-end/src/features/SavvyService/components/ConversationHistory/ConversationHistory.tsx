import React, { useEffect, useState } from "react";
import styles from './ConversationHistory.module.css'
import { getAuth } from "firebase/auth";
import SavvyServiceAPI from "../../../../api/savvyServiceAPI";
import { UserConversation } from "../../../../utils/types";
import { useNavigate } from "react-router-dom";
import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import { format, isToday, isThisWeek, subDays } from 'date-fns';
import { db } from "../../../../firebase/firebase-init";

const ConversationHistory: React.FC = () => {
    const [conversations, setConversations] = useState<UserConversation[]>([]);
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

    const navigate = useNavigate();

    const createNewConversation = async () => {
        const currentUser = getAuth().currentUser;

        if (currentUser) {
            try {
                const newConversationId = await SavvyServiceAPI.getInstance().createNewConversation(currentUser.uid);

                setSelectedConversationId(newConversationId);
                navigate(`/savvycsv/${newConversationId}`)
            } catch (err: unknown) {
                console.log("An error has occured while creating a new conversation", err)
            }
        }
    };

    const handleConversationSelect = (conversationId: string) => {
        setSelectedConversationId(conversationId);
        navigate(`/savvycsv/${conversationId}`);
    };

    const groupConversationsByTimestamp = (conversations: UserConversation[]) => {
        const groups: { [key: string]: UserConversation[] } = {
            Today: [],
            'Last 7 Days': [],
            'Last 30 Days': []
        };

        const now = new Date();
        const startOfToday = new Date(now.setHours(0, 0, 0, 0)); // Midnight today
        const sevenDaysAgo = subDays(startOfToday, 7); // 7 days ago, inclusive

        conversations.forEach((conversation) => {
            const conversationDate = conversation.timestamp.toDate();

            if (isToday(conversationDate)) {
                groups['Today'].push(conversation);
            } else if (conversationDate >= sevenDaysAgo) {
                groups['Last 7 Days'].push(conversation);
            } else {
                groups['Last 30 Days'].push(conversation);
            }
        });

        return groups;
    }

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

    const groupedConversations = groupConversationsByTimestamp(conversations);

    return (
        <>
            <div className={styles.sidebarContainer} style={{ background: '' }}>
                <div className={styles.newConversationButton} onClick={createNewConversation}>
                    <div>
                       START NEW CONVERSATION
                    </div>
                </div>
                <div className={styles.conversationListContainer}>
                    {Object.keys(groupedConversations)
                        .filter(group => groupedConversations[group].length > 0)
                        .map((group) => (
                            <div key={group}>
                                <div className={styles.dateRangeTitle}>{group}</div>
                                {groupedConversations[group].map((conversation) => (
                                    <div
                                        key={conversation.id}
                                        className={styles.conversationItemContainer}
                                        onClick={() => handleConversationSelect(conversation.id)}
                                    >
                                        <div className={styles.conversationItem}>
                                            {conversation.title}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                </div>
            </div>
        </>
    );
}

export default ConversationHistory