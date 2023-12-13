import styles from './styles/ChatHeader.module.css';

const ChatHeader = () => {
    return (
        <div className={styles.chatHeader}>
            <h1>LinguaFluent AI</h1>
            {/* Additional info like model name, settings button, etc. */}
        </div>
    );
};

export default ChatHeader;