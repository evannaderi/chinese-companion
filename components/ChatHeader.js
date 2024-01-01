import styles from './styles/ChatHeader.module.css';

const ChatHeader = () => {
    return (
        <div className={styles.chatHeader}>
            <h3>LinguaFluent AI</h3>
            {/* Additional info like model name, settings button, etc. */}
        </div>
    );
};

export default ChatHeader;