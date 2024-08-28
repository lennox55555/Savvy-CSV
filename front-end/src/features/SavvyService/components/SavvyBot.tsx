import styles from './SavvyBot.module.css';
import './SavvyTable'
import SavvyTable from './SavvyTable';
import AutosizeTextArea from '../../../utils/useAutosizeTextArea';
import { useEffect, useState } from 'react';
import SavvyServiceAPI from '../../../services/savvyServiceAPI';
import { getAuth } from 'firebase/auth';
import { Link } from 'react-router-dom';

const SavvyBot: React.FC = () => {

    const [textAreaValue, setTextAreaValue] = useState('');
    const [messages, setMessages] = useState<{ id: string; text: string; user: boolean }[]>([]);
    const [isUser, setIsUser] = useState(true);

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
                    console.log('An error has occured!');
                }
            }
        }
    }

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
                } catch (error) {
                    console.error("Failed to save message:", error);
                }
            }
        }
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSubmit();
        }
    }

    const buildTable = (jsonTableObject: any) => {
        //add build table code here
    }

    useEffect(() => {
        fetchMessages();
    }, []);

    return (
        <>
            <div className={styles.savvybotContainer}>
                <div className={styles.messageBox}>
                    <div className={styles.savvyResponse}>
                        <div className={styles.messageBubble}>
                            Hello there!
                        </div>
                    </div>
                    <div className={styles.userMessage}>
                        <div className={styles.messageBubble}>
                            Show me NVIDIA's daily stock price in 2024
                        </div>
                    </div>
                    <div className={styles.savvyResponse}>
                        <div className={styles.messageBubble}>
                            Here's a table of NVIDIA's daily stock price performance in 2024.
                        </div>
                    </div>
                    <div className={styles.savvyResponse}>
                        <SavvyTable />
                    </div>
                    <div className={styles.userMessage}>
                        <div className={styles.messageBubble}>
                            Show me NVIDIA's daily stock price in 2024
                        </div>
                    </div>
                    <div className={styles.savvyResponse}>
                        <div className={styles.messageBubble}>
                            Here's a table of NVIDIA's daily stock price performance in 2024.
                        </div>
                    </div>
                    <div className={styles.savvyResponse}>
                        <SavvyTable />
                    </div>
                    {/* Add more messages here as needed */}
                    {messages.map((msg, index) => (
                        <div key={index} className={msg.user ? styles.userMessage : styles.savvyResponse}>
                        <div className={styles.messageBubble}>{msg.text}</div>
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

export default SavvyBot