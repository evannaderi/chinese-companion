import ChatMessage from "./ChatMessage";
import SegmentedChatMessage from "./SegmentedChatMessage";
import SituationCard from "./SituationCard";
import styles from './styles/MessageDisplayArea.module.css';
import { useEffect, useRef } from "react";

const MessageDisplayArea = ({ messages, segmentedMessages, onClickWord, situation, setSituation, useSituation }) => {
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
            <SituationCard content={situation} setSituation={setSituation} useSituation={useSituation}/>
            {messages.map((message, index) => {
                if (index < segmentedMessages.length) {
                    return <SegmentedChatMessage key={index} message={segmentedMessages[index]} onClickWord={onClickWord} idx={index} />;
                } else {
                    return <ChatMessage key={index} message={message} />;
                }
            }
            )}
        </div>
    );
};

export default MessageDisplayArea;