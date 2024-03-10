import ChatMessage from "./ChatMessage";
import SegmentedChatMessage from "./SegmentedChatMessage";
import SituationCard from "./SituationCard";
import styles from './styles/MessageDisplayArea.module.css';
import { useEffect, useRef, useState } from "react";
import TeacherCard from "./TeacherCard";

const MessageDisplayArea = ({ messages, segmentedMessages, onClickWord, situation, setSituation, useSituation, showSituation, showTeacherCard, openHelpChat, customVocab, setCustomVocab, sourceLanguage, aiCharName, userCharName, autoplay, voice, model, handleSaveWord, language, isLoading }) => {
    const scrollRef = useRef(null);
    ;

    // const isWaitingForResponse = () => {
    //     const lastMessage = messages[messages.length - 1];
    //     return lastMessage && lastMessage.role === 'user' && messages.length % 2 === 1;
    // };

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
                <SituationCard content={situation} setSituation={setSituation} useSituation={useSituation} customVocab={customVocab} setCustomVocab={setCustomVocab} aiCharName={aiCharName} userCharName={userCharName} model={model} />
            )}
            {showTeacherCard && (
                <TeacherCard content={situation} setTeachingSession={setSituation} useTeachingSession={useSituation} customVocab={customVocab} setCustomVocab={setCustomVocab} aiCharName={aiCharName} userCharName={userCharName} model={model} language={language} />
            )}
            
            {!showSituation && (
                <p> Click on a word if you don't know its meaning! </p>
            )}
            {messages.map((message, index) => {
                if (index < segmentedMessages.length) {
                    return <SegmentedChatMessage key={index} message={segmentedMessages[index]} onClickWord={onClickWord} idx={index} openHelpChat={openHelpChat} sourceLanguage={sourceLanguage} autoplay={autoplay} voice={voice} handleSaveWord={handleSaveWord} />;
                } else {
                    return <div className={styles.loader} key={index}></div>;
                }
            }
            )}
            {isLoading && (<div className={styles.loader}></div>)}
            
        </div>
    );
};

export default MessageDisplayArea;