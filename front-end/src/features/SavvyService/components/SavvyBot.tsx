import React, { useState, useEffect } from 'react';
import styles from './SavvyBot.module.css';
import AutosizeTextArea from '../../../utils/useAutosizeTextArea';
import { getAuth } from 'firebase/auth';
import SavvyServiceAPI from '../../../services/savvyServiceAPI';
import { Link } from 'react-router-dom';

const SavvyBot: React.FC = () => {
    const [textAreaValue, setTextAreaValue] = useState('');
    const [messages, setMessages] = useState<{ id: string; text: string; user: boolean }[]>([]);
    const [tableData, setTableData] = useState<NestedObject | null>(null);

    const fetchMessages = async () => {
        const currentUser = getAuth().currentUser;

        if (currentUser) {
            try {
                const fetchedMessages = await SavvyServiceAPI.getInstance().getMessages(currentUser.uid);
                setMessages(fetchedMessages);
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
                    setTextAreaValue('');

                    // Initialize WebSocket and listen for bot response
                    SavvyServiceAPI.getInstance().initializeWebSocket(handleWebSocketMessage);

                } catch (error) {
                    console.error("Failed to save message:", error);
                }
            }
        }
    };

    const handleWebSocketMessage = (data: any) => {
        setTableData(data);

        // Add bot response (text and table) to the message list
        setMessages(prevMessages => [
            ...prevMessages,
            { id: '', text: 'SavvyCSV generated a table:', user: false },
            { id: '', text: displayTableForRank1(data), user: false }, // Adding the table as a new message
        ]);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSubmit();
        }
    };

    const displayTableForRank1 = (data: NestedObject): JSX.Element | null => {
        for (const key in data) {
            if (data[key].rankOfTable === 1) {
                return (
                    <div>
                        <h3>Website: <a href={data[key].website} target="_blank" rel="noopener noreferrer">{data[key].website}</a></h3>
                        <table className={styles.csvTable}>
                            <tbody>
                            {data[key].SampleTableData.split('\n').map((row, index) => (
                                <tr key={index}>
                                    {row.split(',').map((cell, cellIndex) => (
                                        <td key={cellIndex} className={styles.customTableCell}>{cell.trim()}</td>
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
                    {messages.map((msg, index) => (
                        <div key={index} className={msg.user ? styles.userMessage : styles.savvyResponse}>
                            <div className={styles.messageBubble}>
                                {typeof msg.text === 'string' ? msg.text : msg.text}
                            </div>
                        </div>
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
                    <div className={styles.userFeedback}>
                        Feedback? Contact us<Link to='/feedback' style={{ textDecorationLine: 'blink' }}> here.</Link>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SavvyBot;
