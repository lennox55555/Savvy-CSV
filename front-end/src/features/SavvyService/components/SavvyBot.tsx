import React, { useState, useEffect } from 'react';
import styles from './SavvyBot.module.css';
import AutosizeTextArea from '../../../utils/useAutosizeTextArea';
import { getAuth } from 'firebase/auth';
import SavvyServiceAPI from '../../../services/savvyServiceAPI';
import { Link } from 'react-router-dom';
import { UserMessage } from '../../../utils/types';


const SavvyBot: React.FC = () => {
    const [textAreaValue, setTextAreaValue] = useState('');
    const [messages, setMessages] = useState<UserMessage[]>([]);

    const fetchMessages = async () => {
        const currentUser = getAuth().currentUser;

        if (currentUser) {
            try {
                const fetchedMessages = await SavvyServiceAPI.getInstance().getMessages(currentUser.uid);

                const processedMessages = fetchedMessages.map(message => {
                    if (!message.user) {
                        return {
                            ...message,
                            text: displayTableForRank1(JSON.parse(message.text)) // Assuming message.text contains JSON data for the table
                        };
                    }
                    return message;
                });

                setMessages(processedMessages);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    console.log(err.message);
                } else {
                    console.log('An error has occurred!');
                }
            }
        }
    };


    const handleSubmit = async () => {
        if (textAreaValue.trim() !== '') {
            const currentUser = getAuth().currentUser;

            if (currentUser) {
                try {
                    // User message
                    await SavvyServiceAPI.getInstance().saveMessage(currentUser.uid, textAreaValue, true);

                    // Add user message to the message list
                    setMessages([...messages, { id: '', text: textAreaValue, user: true }]);

                    // Initialize WebSocket and listen for bot response
                    SavvyServiceAPI.getInstance().initializeWebSocket(handleWebSocketMessage, textAreaValue, currentUser.uid);

                    setTextAreaValue('');

                } catch (error) {
                    console.error("Failed to save message:", error);
                }
            }
        }
    };

    const handleWebSocketMessage = (data: any) => {
        setMessages(prevMessages => [
            ...prevMessages,
            { id: '', text: 'SavvyCSV generated a table:', user: false },
            { id: '', text: displayTableForRank1(data), user: false },
        ]);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSubmit();
        }
    };

    const displayTableForRank1 = (data: any): JSX.Element | null => {
        for (const key in data) {
            if (data[key].rankOfTable === 1) {
                return (
                    <div>
                        <table className={styles.tableContainer}>
                            <thead className={styles.tableHeader}>
                                <tr>
                                    {data[key].SampleTableData.split('\n')[0].split(',').map((cell: string, cellIndex: React.Key | null | undefined) => (
                                        <th key={cellIndex} className={styles.tableHeaderData}>
                                            {cell.trim()}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className={styles.tableBody}>
                                {data[key].SampleTableData.split('\n').slice(1).map((row: string, index: React.Key | null | undefined) => (
                                    <tr key={index}>
                                        {row.split(',').map((cell: string, cellIndex: React.Key | null | undefined) => (
                                            <td key={cellIndex} className={styles.tableBodyData}>
                                                {cell.trim()}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
            }
        }
        return null;
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    return (
        <>
            <div className={styles.savvybotContainer}>
                <div className={styles.messageBox}>
                    {messages.map((message, index) => (
                        message.user ? (
                            <div className={styles.messageItemContainer}>
                                <div key={index} className={styles.userMessage}>
                                    <div className={styles.messageBubble}>
                                        {message.text}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className={styles.messageItemContainer}>
                                <div key={index} className={styles.savvyResponse}>
                                    {message.text}
                                </div>
                            </div>
                        )
                    ))}
                </div>
                <div className={styles.messageBar}>
                    <div className={styles.messageBarWrapper}>
                        <AutosizeTextArea
                            value={textAreaValue}
                            onChange={setTextAreaValue}
                            onKeyDown={handleKeyDown}
                            maxHeight={150}
                            placeholder="Message SavvyCSV"
                        />
                        <button className={styles.messageButton} onClick={handleSubmit}>
                            <i className="bi bi-arrow-return-left" style={{ color: '#1D6F42', textShadow: '0 0 1px #1D6F42' }}></i>
                        </button>
                    </div>
                    {/*
                        <div className={styles.userFeedback}>
                            Feedback? Contact us<Link to='/feedback' style={{ textDecorationLine: 'blink' }}> here.</Link>
                        </div>
                    */}
                </div>
            </div>
        </>
    );
}

export default SavvyBot;
