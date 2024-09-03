import React, { useState, useEffect } from 'react';
import styles from './SavvyBot.module.css';
import AutosizeTextArea from '../../../utils/useAutosizeTextArea';
import { getAuth } from 'firebase/auth';
import SavvyServiceAPI from '../../../services/savvyServiceAPI';
import { Link } from 'react-router-dom';

const SavvyBot: React.FC = () => {
    const [textAreaValue, setTextAreaValue] = useState('');
    const [messages, setMessages] = useState<{ id: string; text: string; user: boolean }[]>([]);
    const [isUser, setIsUser] = useState(true);
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
                    await SavvyServiceAPI.getInstance().saveMessage(currentUser.uid, textAreaValue, isUser);

                    setMessages([...messages, { id: '', text: textAreaValue, user: isUser }]);
                    setTextAreaValue('');
                    setIsUser(prevState => !prevState);
                    fetchMessages();

                    // Initialize WebSocket and listen for data
                    SavvyServiceAPI.getInstance().initializeWebSocket(handleWebSocketMessage);

                } catch (error) {
                    console.error("Failed to save message:", error);
                }
            }
        }
    };

    const handleWebSocketMessage = (data: any) => {
        setTableData(data);
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
                            <div className={styles.messageBubble}>{msg.text}</div>
                        </div>
                    ))}

                    {tableData && (
                        <div className={styles.savvyResponse}>
                            {displayTableForRank1(tableData)}
                        </div>
                    )}
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
