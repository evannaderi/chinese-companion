import styles from './styles/ChatHeader.module.css';

const ChatHeader = () => {
    return (
        <div className={styles.chatHeader}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <img src="/LinguaFluent_AI.png" alt="LinguaFluent AI Logo" style={{ width: '50px', height: '50px', marginLeft: '10px', marginRight: '20px', borderRadius: '50%' }} />
            </div>
            {/* Additional info like model name, settings button, etc. */}
            <h3 style={{ fontWeight: 'bold', fontSize: '24px', fontFamily: 'Arial' }}>LinguaFluent AI</h3>
        </div>
    );
};

export default ChatHeader;