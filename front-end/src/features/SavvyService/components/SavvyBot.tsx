import './SavvyBot.css'
import './SavvyTable'
import SavvyTable from './SavvyTable';

const SavvyBot: React.FC = () => {

    const handleSubmit = () => {
        //connect to websocket here
    }

    const buildTable = (jsonTableObject: any) => {
        //add build table code here
    }

    return (
        <>
            <div style={{ background: '' }} className="savvybot-container">
                <div className="message-box">
                    <div className="savvy-response">
                        <div className='message-bubble'>
                            Hello there!
                        </div>
                    </div>
                    <div className="user-message">
                        <div className='message-bubble'>
                            Show me NVIDIA's daily stock price in 2024
                        </div>
                    </div>
                    <div className="savvy-response">
                        <div className='message-bubble'>
                            Here's a table of NVIDIA's daily stock price performance in 2024.
                        </div>
                    </div>
                    <div className="savvy-response">
                        <SavvyTable />
                    </div>
                    <div className="user-message">
                        <div className='message-bubble'>
                            Show me NVIDIA's daily stock price in 2024
                        </div>
                    </div>
                    <div className="savvy-response">
                        <div className='message-bubble'>
                            Here's a table of NVIDIA's daily stock price performance in 2024.
                        </div>
                    </div>
                    <div className="savvy-response">
                        <SavvyTable />
                    </div>
                </div>
                <div style={{ background: '' }} className="message-bar">
                    <div className="message-bar-wrapper">
                        <input type='text' placeholder='Enter message' />
                        <button className='message-button' onClick={handleSubmit}>
                            <i className="bi bi-arrow-return-left"></i>
                        </button>
                    </div>
                    <div className='user-feedback'>
                        Feedback? Contact us here.
                </div>
                </div>
            </div>
        </>
    );
}

export default SavvyBot