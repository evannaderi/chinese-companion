import React, { useState, useEffect, useRef } from 'react';
import MessageDisplayArea from './MessageDisplayArea';
import ChatInputArea from './ChatInputArea';
import { getCustomCompletion } from '../services/openaiService';
import styles from './styles/ChatContainer.module.css';
import inputStyles from './styles/ChatInputArea.module.css';
import modalStyles from './styles/HelpChatModal.module.css'; 
import Modal from 'react-modal';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import { IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import LightbulbIcon from '@mui/icons-material/Lightbulb';

const model="gpt-3.5-turbo"

const HelpChatModal = ({ isOpen, onRequestClose, language, queryText, isSituationUsed, helpType, model }) => {
    const [userInput, setUserInput] = useState('');
    const [conversationLog, setConversationLog] = useState([]);
    const scrollRef = useRef(null);
    const [isFirstResponse, setIsFirstReponse] = useState(true);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // Prevent the default action to avoid line break in TextField
            handleSubmit();
        }
    };

    const isWaitingForResponse = () => {
        const lastMessage = conversationLog[conversationLog.length - 1];
        return lastMessage && lastMessage.role === 'user' && conversationLog.length % 2 === 1;
    };

    let systemPrompt = '';
    if (helpType === 'translation') {
        systemPrompt = `You are a language learning assistant. Keep responses brief. On the first prompt you explain in this format: 1. phrase: short meaning \n 2. phrase: short meaning \n 3. phrase: short meaning ...`;
    } else if (helpType === 'feedback') {
        systemPrompt = `You are a language learning assistant. Keep responses brief. On the first prompt you give feedback on the correctness of the text in ${language}.`;
    }

    let prompt = '';
    if (helpType === 'translation') {
        prompt = `Briefly explain how each short phrase (of 1-4 words) in this ${language} text contributes to the overall meaning. Explain in English in a concise bullet-point numbered list (1. phrase: concise meaning) format seperated by a new line: ${queryText}`;
    } else if (helpType === 'feedback') {
        prompt = `Give feedback on the correctness of this text in ${language}: ${queryText}`;
    }

    useEffect(() => {
        // When modal opens and if the conversation log is empty, add the queryText
        if (isOpen) {
            setIsFirstReponse(true);
            setConversationLog([{ role: 'user', content: prompt }]);
        }
    }, [queryText]);

    const handleSubmit = async () => {
        // Update the conversation log with user input
        setConversationLog(prev => [...prev, { role: 'user', content: userInput }]);
        // Clear the userInput state to clear the chat input area
        setUserInput('');
    };

    const handleLightbulbSubmit = async () => {
        setConversationLog(prev => [...prev, { role: 'user', content: "Give me a detailed explanation of what this means, including any grammatical structures." }]);
        setUserInput('');
    };

    useEffect(() => {
        const processMessage = async () => {
            if (conversationLog.length === 0) return;
            console.log("processinga nd first response is: ", isFirstResponse);

            const lastMessage = conversationLog[conversationLog.length - 1];
            if (lastMessage.role === 'user') {
                const openAIResponse = await getCustomCompletion(systemPrompt, conversationLog, model);
                if (isFirstResponse && helpType === 'translation') {
                    const modifiedResponse = openAIResponse + '\n\nEnter a number (1, 2, ...) to get a numbered list of how each individual word adds meaning to this phrase in the form (1. word: significance). Or, ask any other question you may have.'
                    setConversationLog(prev => [...prev, { role: 'assistant', content: modifiedResponse }]);
                    setIsFirstReponse(false)
                } else {
                    console.log("Is not first response")
                    setConversationLog(prev => [...prev, { role: 'assistant', content: openAIResponse }]);
                }    
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

    function replaceNewlinesWithBreaks(text) {
        return text.split('\n').map((line, index) => (
            <React.Fragment key={index}>
                {line}
                <br />
            </React.Fragment>
        ));
    }

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
            <div className={modalStyles.simpleMessageDisplayArea} ref={scrollRef}>
                {conversationLog.map((message, index) => (
                    <div key={index} className={message.role === 'user' ? modalStyles.userMessage : modalStyles.assistantMessage}>
                        {replaceNewlinesWithBreaks(message.content)}
                    </div>
                ))}
                {isWaitingForResponse() && <div className={modalStyles.loader}></div>}
            </div>
            <div className={inputStyles.chatInputArea}>
                    <TextField
                        fullWidth
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Type any question you may have..."
                        variant="outlined"
                        margin="normal"
                        onKeyPress={handleKeyPress}
                    />
                    <Tooltip title={`Explain what this means in further detail!`}>
                        <IconButton 
                            onClick={handleLightbulbSubmit}
                            style={{ margin: '5px' }}
                            
                        >
                            <LightbulbIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={`Translate English text into ${language}`}>
                        <IconButton 
                            onClick={handleSubmit}
                            style={{ margin: '5px' }}
                            disabled={!userInput.trim()} // Disable if there's no input
                        >
                            <SendIcon />
                        </IconButton>
                    </Tooltip>
                    
            </div>
            <Button onClick={onRequestClose}>Close</Button>
        </Modal>
    );
};

export default HelpChatModal;
