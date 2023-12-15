import React, { useState, useEffect, useRef } from 'react';
import MessageDisplayArea from './MessageDisplayArea';
import ChatInputArea from './ChatInputArea';
import { getCustomCompletion } from '../services/openaiService';
import styles from './styles/ChatContainer.module.css';
import Modal from 'react-modal';

const HelpChatModal = ({ isOpen, onRequestClose, model, language, queryText }) => {
    const [userInput, setUserInput] = useState('');
    const [conversationLog, setConversationLog] = useState([]);
    const scrollRef = useRef(null);

    const systemPre = `Translate this text from ${language} into English: ${queryText}`;

    useEffect(() => {
        // When modal opens and if the conversation log is empty, add the queryText
        if (isOpen && conversationLog.length === 0) {
            setConversationLog([{ role: 'user', content: systemPre }]);
        }
    }, [isOpen, queryText]);

    const handleSubmit = async (input) => {
        // Update the conversation log with user input
        setConversationLog(prev => [...prev, { role: 'user', content: input }]);
    };

    useEffect(() => {
        const processMessage = async () => {
            if (conversationLog.length === 0) return;

            const lastMessage = conversationLog[conversationLog.length - 1];
            if (lastMessage.role === 'user') {
                const systemPrompt = systemPre;
                const openAIResponse = await getCustomCompletion(systemPrompt, conversationLog, model);
                setConversationLog(prev => [...prev, { role: 'assistant', content: openAIResponse }]);
            }
        };

        processMessage();
    }, [conversationLog]);

    useEffect(() => {
        // Scroll to the bottom every time messages change
        if (scrollRef.current) {
            const { scrollHeight, clientHeight } = scrollRef.current;
            scrollRef.current.scrollTop = scrollHeight - clientHeight;
        }
    }, [conversationLog]);

    if (!isOpen) {
        return null;
    }

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
            <div className={styles.simpleMessageDisplayArea} ref={scrollRef}>
                {conversationLog.map((message, index) => (
                    <div key={index} className={message.role === 'user' ? styles.userMessage : styles.assistantMessage}>
                        {message.content}
                    </div>
                ))}
            </div>
            <ChatInputArea onSendMessage={handleSubmit} />
            <button onClick={onRequestClose}>Close</button>
        </Modal>
    );
};

export default HelpChatModal;
