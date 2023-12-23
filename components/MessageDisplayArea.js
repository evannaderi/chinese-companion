import ChatMessage from "./ChatMessage";
import SegmentedChatMessage from "./SegmentedChatMessage";
import SituationCard from "./SituationCard";
import styles from './styles/MessageDisplayArea.module.css';
import { useEffect, useRef } from "react";

const MessageDisplayArea = ({ messages, segmentedMessages, onClickWord, situation, setSituation, useSituation, showSituation, openHelpChat, customVocab, setCustomVocab, sourceLanguage, aiCharName, userCharName }) => {
    const scrollRef = useRef(null);

    useEffect(() => {
        // Scroll to the bottom every time messages change
        if (scrollRef.current) {
            const { scrollHeight, clientHeight } = scrollRef.current;
            scrollRef.current.scrollTop = scrollHeight - clientHeight;
        }
    }, [messages, segmentedMessages]);

    return (
        <div className={styles.messageDisplayArea} ref={scrollRef}>
            {showSituation && (
                <SituationCard content={situation} setSituation={setSituation} useSituation={useSituation} customVocab={customVocab} setCustomVocab={setCustomVocab} aiCharName={aiCharName} userCharName={userCharName}/>
            )}
            {messages.map((message, index) => {
                if (index < segmentedMessages.length) {
                    return <SegmentedChatMessage key={index} message={segmentedMessages[index]} onClickWord={onClickWord} idx={index} openHelpChat={openHelpChat} sourceLanguage={sourceLanguage} />;
                } else {
                    return <ChatMessage key={index} message={message} />;
                }
            }
            )}
        </div>
    );
};

export default MessageDisplayArea;