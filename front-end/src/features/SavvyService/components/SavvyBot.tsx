import styles from './SavvyBot.module.css';
import './SavvyTable'
import SavvyTable from './SavvyTable';
import AutosizeTextArea from '../../../utils/useAutosizeTextArea';
import { useState } from 'react';

const SavvyBot: React.FC = () => {

    const [textAreaValue, setTextAreaValue] = useState('')

    const handleSubmit = () => {
        //connect to websocket here
    }

    const buildTable = (jsonTableObject: any) => {
        //add build table code here
    }

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
                </div>
                <div className={styles.messageBar}>
                    <div className={styles.messageBarWrapper}>
                        <AutosizeTextArea
                            value={textAreaValue}
                            onChange={setTextAreaValue}
                            maxHeight={150}
                            placeholder="Message SavvyCSV"
                        />
                        <button className={styles.messageButton} onClick={handleSubmit}>
                            <i className="bi bi-arrow-return-left" style={{ color: '#1D6F42', textShadow: '0 0 1px #1D6F42' }}></i>
                        </button>
                    </div>
                    <div className={styles.userFeedback}>
                        Feedback? Contact us here.
                    </div>
                </div>
            </div>
        </>
    );
}

export default SavvyBot