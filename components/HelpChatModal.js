import React, { useState, useEffect, useRef } from 'react';
import MessageDisplayArea from './MessageDisplayArea';
import ChatInputArea from './ChatInputArea';
import { getCustomCompletion } from '../services/openaiService';
import styles from './styles/ChatContainer.module.css';
import modalStyles from './styles/HelpChatModal.module.css'; 
import Modal from 'react-modal';
import Button from '@mui/material/Button';

const model="gpt-4-1106-preview"
const systemPrompt = "You are a language learning assistant. Keep responses brief.";

const HelpChatModal = ({ isOpen, onRequestClose, language, queryText, isSituationUsed, helpType }) => {
    const [userInput, setUserInput] = useState('');
    const [conversationLog, setConversationLog] = useState([]);
    const scrollRef = useRef(null);

    let prompt = '';
    if (helpType === 'translation') {
        prompt = `Translate this text from ${language} into English: ${queryText}`;
    } else if (helpType === 'feedback') {
        prompt = `Give feedback on the correctness of this text in ${language}: ${queryText}`;
    }

    useEffect(() => {
        // When modal opens and if the conversation log is empty, add the queryText
        if (isOpen) {
            setConversationLog([{ role: 'user', content: prompt }]);
        }
    }, [queryText]);

    const handleSubmit = async (input) => {
        // Update the conversation log with user input
        setConversationLog(prev => [...prev, { role: 'user', content: input }]);
        // Clear the userInput state to clear the chat input area
        setUserInput('');
    };

    useEffect(() => {
        const processMessage = async () => {
            if (conversationLog.length === 0) return;

            const lastMessage = conversationLog[conversationLog.length - 1];
            if (lastMessage.role === 'user') {
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
            <div className={modalStyles.simpleMessageDisplayArea} ref={scrollRef}>
                {conversationLog.map((message, index) => (
                    <div key={index} className={message.role === 'user' ? modalStyles.userMessage : modalStyles.assistantMessage}>
                        {message.content}
                    </div>
                ))}
            </div>
            <ChatInputArea onSendMessage={handleSubmit} userInput={userInput} setUserInput={setUserInput} isSituationUsed={isSituationUsed} />
            <Button onClick={onRequestClose}>Close</Button>
        </Modal>
    );
};

export default HelpChatModal;
