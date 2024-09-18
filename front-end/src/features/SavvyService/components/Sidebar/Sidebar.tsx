import React from "react";
import styles from './Sidebar.module.css'

const Sidebar: React.FC = () => {
    return (
        <>
            <div className={styles.sidebarContainer} style={{ background: '' }}>
                <div className={styles.newConversationButton}>
                    New Conversation
                </div>
                <div className={styles.conversationListContainer}>
                    <div className={styles.conversationItemContainer}>
                        <div className={styles.conversationItem}>
                            Conversation
                        </div>
                        <div>
                            --
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Sidebar