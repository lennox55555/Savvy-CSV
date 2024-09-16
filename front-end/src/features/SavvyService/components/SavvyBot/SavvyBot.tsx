import React, { useState, useEffect, useRef } from 'react';
import styles from './SavvyBot.module.css';
import AutosizeTextArea from '../../../../utils/useAutosizeTextArea';
import { getAuth } from 'firebase/auth';
import SavvyServiceAPI from '../../../../api/savvyServiceAPI';
import { UserMessage } from '../../../../utils/types';
import { TableObject } from '../../../../utils/types';

const SavvyBot: React.FC = () => {
    const [textAreaValue, setTextAreaValue] = useState('');
    const [messages, setMessages] = useState<UserMessage[]>([]);
    const [tableData, setTableData] = useState<TableObject | null>(null);
    const [currentTableRank, setCurrentTableRank] = useState<number>(1);
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
                        return {
                            ...message,
                            text: displayTableForRank(JSON.parse(message.text), message.rank || 1),
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

                if (currentTabelSource != '') {
                    try {
                        await SavvyServiceAPI.getInstance().updateLastMessage(currentUser.uid, currentTabelSource, currentTableRank)

                        //  Updating the previous table with it's last currentRank & sourceURL
                        setMessages(prevMessages => {
                            if (prevMessages.length > 0) {
                                const lastIndex = prevMessages.length - 1;

                                // Check if the last message is a non-user message (table data)
                                if (!prevMessages[lastIndex].user) {
                                    // Directly modify the last message object
                                    prevMessages[lastIndex].rank = currentTableRank;
                                    prevMessages[lastIndex].source = currentTabelSource;
                                }
                            }

                            // Return the same array since we're modifying in place
                            return [...prevMessages];  // Spread to trigger re-render
                        });


                    } catch (error) {
                        console.error("Failed to update previous table object:", error);
                    }
                }

                try {
                    await SavvyServiceAPI.getInstance().saveMessage(currentUser.uid, textAreaValue, true);

                    // Add user message to the message list
                    setMessages(prevMessages =>
                        [...prevMessages, { id: '', text: textAreaValue, user: true, source: '', rank: null, table: null }]);

                    // Initialize WebSocket and listen for bot response
                    SavvyServiceAPI.getInstance().initializeWebSocket(handleWebSocketMessage, textAreaValue, currentUser.uid);

                    setIsLoading(true);
                    setTextAreaValue('');

                } catch (error) {
                    console.error("Failed to save message:", error);
                }
            }
        }
    };

    const handleWebSocketMessage = (data: TableObject) => {
        setTableData(data);
        setMessages(prevMessages => [...prevMessages, { id: '', text: displayTableForRank(data, 1), user: false, source: '', rank: null, table: data }])
        setIsLoading(false);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey && !isLoading) {
            event.preventDefault();
            handleSubmit();
        }
    };

    const displayTableForRank = (data: TableObject | null, rank: number): JSX.Element | null => {
        for (const key in data) {
            if (data[key].rankOfTable == rank) {
                setCurrentTableSource(data[key].website);
                return (
                    <div className={styles.tableWrapper}>
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
                    { id: '', text: displayTableForRank(tableData, nextRank), user: false, source: currentTabelSource, rank: null, table: tableData }
                ];
            });
        }
    };

    const downloadCSV = (table: TableObject | null | string, rank: number | null) => {
        if (!table || rank === null) return; 

        let parsedTable: TableObject;
    
        if (typeof table === 'string') {
            try {
                parsedTable = JSON.parse(table);
            } catch (error) {
                console.error("Invalid JSON string", error);
                return;
            }
        } else {
            parsedTable = table;
        }
    
        const currentData = Object.values(parsedTable).find((item: any) => item.rankOfTable === rank);

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
    }, []);

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
                                    <div className={styles.messageItemContainer}>
                                        <div key={index} className={styles.savvyResponse} tabIndex={0}>
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
                                </div>
                            )
                        ))}
                        <div ref={messageEndRef} />
                        {isLoading === true && (
                            <div>
                                <div className={styles.messageItemContainer}>
                                    <div className={styles.savvyResponse}>
                                        <div className={styles.messageBubbleLoading}>
                                            <div className={styles.typingIndicator}>
                                                <div className={styles.dot}></div>
                                                <div className={styles.dot}></div>
                                                <div className={styles.dot}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {tableData && isLoading === false && (
                            <div>
                                <div className={styles.messageItemContainer}>
                                    <div className={styles.savvyResponse}>
                                        <div className={styles.tableButtonGroup}>
                                            <span onClick={handleRefresh} className="material-symbols-outlined" title="New Table">
                                                cached
                                            </span>
                                            <span onClick={() => downloadCSV(tableData, currentTableRank)} className="material-symbols-outlined" title="Download CSV">
                                                download
                                            </span>
                                            <span className="material-symbols-outlined" title="Data Source">
                                                <a href={currentTabelSource} target="_blank" rel="noopener noreferrer">
                                                    link
                                                </a>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {/* Message Bar  */}

            <div className={styles.messageBar}>
                <div className={styles.messageBarWrapper}>
                    <AutosizeTextArea
                        value={textAreaValue}
                        onChange={setTextAreaValue}
                        onKeyDown={handleKeyDown}
                        maxHeight={150}
                        placeholder="Message SavvyCSV"
                    />
                    {textAreaValue === '' && !isLoading ? (
                        <button className={styles.messageButton}>
                            <i className="fa-solid fa-circle-up" style={{ fontSize: '36px', color: 'darkgray', cursor: 'default' }}></i>
                        </button>
                    ) : (
                        <button className={styles.messageButton} onClick={handleSubmit}>
                            <i className="fa-solid fa-circle-up" style={{ fontSize: '36px', color: 'var(--bs-active-btn-bg)', cursor: 'pointer' }}></i>
                        </button>
                    )}
                    {isLoading && (
                        <button className={styles.messageButton}>
                            <i className="fa-solid fa-circle-stop" style={{ fontSize: '38px', color: 'var(--bs-active-btn-bg)' }}></i>
                        </button>
                    )}
                </div>
                {/*
                        <div className={styles.userFeedback}>
                            Feedback? Contact us<Link to='/feedback' style={{ textDecorationLine: 'blink' }}> here.</Link>
                        </div>
                    */}
            </div>
        </>
    );
}

export default SavvyBot;
