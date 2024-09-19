import React, { useEffect, useState } from "react";
import styles from './ConversationHistory.module.css'
import { getAuth } from "firebase/auth";
import SavvyServiceAPI from "../../../../api/savvyServiceAPI";
import { UserConversation } from "../../../../utils/types";
import { useNavigate } from "react-router-dom";

const ConversationHistory: React.FC = () => {
    const [conversations, setConversations] = useState<UserConversation[]>([]);
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

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

                fetchConversations();
                setSelectedConversationId(newConversationId);
            } catch (err: unknown) {
            }
        }
    };

    const handleConversationSelect = (conversationId: string) => {
        setSelectedConversationId(conversationId);
        console.log(conversationId)
        navigate(`/savvycsv/${conversationId}`);
    };

    useEffect(() => {
        fetchConversations();
    }, []);

    return (
        <>
            <div className={styles.sidebarContainer} style={{ background: '' }}>
                <div className={styles.newConversationButton} onClick={createNewConversation}>
                    New Conversation
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