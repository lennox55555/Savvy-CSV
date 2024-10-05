import React from "react";
import styles from './Message.module.css'
import { TableObject, UserMessage } from "../../../../utils/types";

interface MessageProps {
    message: UserMessage,
    index: number,
    downloadCSV: (table: TableObject | null | string, rank: number | null) => void;
}

const Message: React.FC<MessageProps> = ({ message, index, downloadCSV }) => {

    return (
        <>
            {message.user ? (
                <div>
                    <div className={styles.messageItemContainer}>
                        <div key={index} className={styles.userMessage}>
                            <div className={styles.messageBubble}>
                                {message.text}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    {message.table != null ? (
                        <div className={styles.messageItemContainer}>
                            <div>
                                {message.text}
                            </div>
                            {message.rank != null && (
                                <div className={styles.tableButtonGroup}>
                                    <span
                                        onClick={() => downloadCSV(message.table, message.rank)}
                                        className="material-symbols-outlined"
                                        title="Download CSV">download</span>
                                    <span className="material-symbols-outlined" title="Data Source">
                                        <a href={message.source} target="_blank" rel="noopener noreferrer">
                                            link
                                        </a>
                                    </span>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Try search again message (WSS Error) */
                        <div className={styles.messageItemContainer}>
                            <div className={styles.savvyResponse}>
                                <div className={styles.messageBubble}>
                                    <div>
                                        {message.text}
                                    </div>
                                </div>
                            </div>
                        </div>

                    )}
                </div>
            )}
        </>
    );
}

export default Message