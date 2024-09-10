import React, { useState, useEffect, useRef } from 'react';
import styles from './SavvyBot.module.css';
import AutosizeTextArea from '../../../utils/useAutosizeTextArea';
import { getAuth } from 'firebase/auth';
import SavvyServiceAPI from '../../../services/savvyServiceAPI';
import { Link } from 'react-router-dom';
import { UserMessage } from '../../../utils/types';

type NestedObject = {
    [key: string]: {
        rankOfTable: number;
        SampleTableData: string;
        website: string;
    };
};

const SavvyBot: React.FC = () => {
    const [textAreaValue, setTextAreaValue] = useState('');
    const [messages, setMessages] = useState<UserMessage[]>([]);
    const [tableData, setTableData] = useState<NestedObject | null>(null);
    const [currentTableRank, setCurrentTableRank] = useState<number>(1); // State to track the current table rank
    const [isLoading, setIsLoading] = useState(false);
    const [currentTabelSource, setCurrentTableSource] = useState('');

    const messageEndRef = useRef<HTMLDivElement | null>(null);

    const fetchMessages = async () => {
        const currentUser = getAuth().currentUser;

        if (currentUser) {
            try {
                const fetchedMessages = await SavvyServiceAPI.getInstance().getMessages(currentUser.uid);

                const processedMessages = fetchedMessages.map(message => {
                    if (!message.user) {
                        console.log(message)
                        return {
                            ...message,
                            text: displayTableForRank(JSON.parse(message.text), 1) // Assuming message.text contains JSON data for the table
                        };
                    }
                    return message;
                });
                console.log(processedMessages)
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
        setIsLoading(true);

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

    const handleWebSocketMessage = (data: NestedObject) => {
        setTableData(data);
        setMessages([...messages, { id: '', text: displayTableForRank(data, 1), user: false }])
        setIsLoading(false);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSubmit();
        }
    };

    const displayTableForRank = (data: NestedObject | null, rank: number): JSX.Element | null => {
        for (const key in data) {
            if (data[key].rankOfTable == rank) {
                setCurrentTableSource(data[key].website);
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
                                    <tr key={index} className={styles.tableRow}>
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
        return null
    };

    const handleRefresh = () => {
        if (tableData) {
            // Update table rank in a cycle: 1 -> 2 -> 3 -> 1
            const nextRank = currentTableRank === 3 ? 1 : currentTableRank + 1;
            setCurrentTableRank(nextRank);

            setMessages(prevMessages => {
                // Remove the most recent message and add the new one
                const messages = prevMessages.length > 0
                    ? prevMessages.slice(0, prevMessages.length - 1)
                    : prevMessages;

                return [
                    ...messages,
                    { id: '', text: displayTableForRank(tableData, nextRank), user: false }
                ];
            });
        }
    };

    const downloadCSV = () => {
        if (!tableData) return;

        const currentData = Object.values(tableData).find(item => item.rankOfTable === currentTableRank);

        if (!currentData) return;

        // Convert the table data to CSV format
        const csvContent = `data:text/csv;charset=utf-8,${currentData.SampleTableData.replace(/\n/g, '\r\n')}`;

        // Create a download link
        const link = document.createElement('a');
        link.setAttribute('href', encodeURI(csvContent));
        link.setAttribute('download', `table_rank_${currentTableRank}.csv`);

        // Append to the DOM, click, and remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    useEffect(() => {
        fetchMessages();
    }, [tableData]);

    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    return (
        <>
            <div className={styles.savvybotContainer}>
                <div className={styles.messageBoxContainer}>
                    <div className={styles.messageBoxWrapper}>
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
                        {tableData && isLoading === false && (
                            <div className={styles.tableButtonGroup}>
                                <span onClick={handleRefresh} className="material-symbols-outlined" title="New Table">
                                    cached
                                </span>
                                <span onClick={downloadCSV} className="material-symbols-outlined" title="Download CSV">
                                    download
                                </span>
                                <span className="material-symbols-outlined" title="Data Source">
                                <a href={currentTabelSource} target="_blank" rel="noopener noreferrer">
                                    link
                                    </a>
                                </span>
                            </div>
                        )}
                        <div ref={messageEndRef} />
                    </div>
                </div>
                {/* MOVE CODE SOMEWHERE ELSE */}

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
