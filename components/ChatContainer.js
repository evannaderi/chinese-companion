import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import { getMandarinCompletion } from '../services/openaiService';
import { segmentTextJieba } from '../services/jiebaService';
import ChatHeader from './ChatHeader';
import MessageDisplayArea from './MessageDisplayArea';
import ChatInputArea from './ChatInputArea';
import SystemMessages from './SystemMessages';
import TranslationCard from './TranslationCard';
import SituationCard from './SituationCard';
import { spaceSegment } from '../services/SegmentService';
import { getCustomCompletion } from '../services/openaiService';
import styles from './styles/ChatContainer.module.css';
import TranslatorModal from './TranslatorModal';
import HelpChatModal from './HelpChatModal';
import SavedWordsDisplay from './SavedWordsDisplay';

const model = "gpt-4-1106-preview";
const firstMsgContent = "Say something just one thing to start the conversation. Do not surround your text with quotation marks or a name or anything. Do not ask for any more information on the situation, you should know everything.";
const difficulty = "extremely beginner";

const ChatContainer = () => {
    const [userInput, setUserInput] = useState('');
    const [conversationLog, setConversationLog] = useState([]);
    const [segmentedConversation, setSegmentedConversation] = useState([]);
    const [cardTitle, setCardTitle] = useState('');
    const [cardContent, setCardContent] = useState('');
    const [situation, setSituation] = useState('');
    const [isTranslatorOpen, setIsTranslatorOpen] = useState(false);
    const [isHelpChatOpen, setIsHelpChatOpen] = useState(false);
    const [queryText, setQueryText] = useState('Hola amigo');
    const [language, setLanguage] = useState('Spanish'); // default language
    const [isSituationUsed, setIsSituationUsed] = useState(false);
    const [difficulty, setDifficulty] = useState('extremely beginner');
    const [savedWords, setSavedWords] = useState([]);
    const [customVocab, setCustomVocab] = useState("");
    const difficultyLevels = ['extremely beginner', 'beginner', 'low medium', 'medium', 'high medium', 'advanced', 'extremely advanced'];
    const languages = ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese'];
    const systemPre = `You are the character Sam in this situation and the user is Bob. Only speak in ${language} at a ${difficulty} difficulty, using ${difficulty} sentences and words. Keep your responses to 1-2 sentences: `;
    const [systemPrompt, setSystemPrompt] = useState('');
    const [currentModel, setCurrentModel] = useState(model);
    const [streak, setStreak] = useState(0);
    const [lastCompletedDate, setLastCompletedDate] = useState(null);
    const [consecutiveUserMessages, setConsecutiveUserMessages] = useState(0);

    const openTranslator = () => setIsTranslatorOpen(true);
    const closeTranslator = () => setIsTranslatorOpen(false);

    const openHelpChat = (queryText) => {
        setQueryText(queryText);
        setIsHelpChatOpen(true);
    }
    const closeHelpChat = () => setIsHelpChatOpen(false);

    const handleDifficultyChange = (event) => {
        setDifficulty(event.target.value);
    };


    const updateCard = (title, content) => {
        setCardTitle(title);
        setCardContent(content);
    };

    // // When situation changes
    // useEffect(() => {
    //     console.log("situation changed: ", situation);
    //     const processSituation = async () => {
    //         if (situation === '') {
    //             return;
    //         }

    //         const systemPrompt = systemPre + situation;
    //         const messages = [{role: 'user', content: firstMsgContent}];
    //         const openAIResponse = await getCustomCompletion(systemPrompt, messages, model);
    //         setConversationLog( [{ role: 'assistant', content: openAIResponse }]); // resets convo
    //     };

    //     processSituation();
    // }, [situation]);

    const useSituation = async () => {
        if (situation === '') {
            return;
        }

        console.log("Custom vocab is: ", customVocab);

        let newSystemPrompt = systemPre + situation;
        if (customVocab !== "") {
            console.log("integrating customVocab: ", customVocab);
            newSystemPrompt += `Directly use these words while you talk in the conversation: ${customVocab}`;
        }

        setSystemPrompt(newSystemPrompt);
        console.log("new systemPrompt: ", newSystemPrompt);

        const messages = [{role: 'user', content: firstMsgContent}];
        const openAIResponse = await getCustomCompletion(newSystemPrompt, messages, currentModel);
        setConversationLog([{ role: 'assistant', content: openAIResponse }]); // resets convo
        setIsSituationUsed(true);
    };

    // Since state updates are asyncronous, we need to use useEffect to wait for the conversationLog state to update
    useEffect(() => {
        const processLatestMessage = async () => {
            if (conversationLog.length == 0) {
                return;
            }

            const lastMessage = conversationLog[conversationLog.length - 1];

            if (lastMessage.role === 'user') {
                // If the last message is from the user, send it to the API
                console.log("The system prompt is: ", systemPrompt);
                const openAIResponse = await getCustomCompletion(systemPrompt, conversationLog, currentModel);
                setConversationLog(prev => [...prev, { role: 'assistant', content: openAIResponse }]);
            } else if (lastMessage.role === 'assistant') {
                // If the last message is from the bot, segment the text
                console.log("lastMessage.content: ", lastMessage.content)
                const segmentedResponse = spaceSegment(lastMessage.content);
                console.log("segmentedResponse: ", segmentedResponse)

                setSegmentedConversation(prev => [...prev, { role: 'assistant', content: segmentedResponse }]);
                console.log("conversationLog: ", conversationLog);
                console.log("segmentedConversation: ", segmentedConversation);
                //const openAIResponse = await getTTS('tts-1', 'alloy', lastMessage.content, 'thisid');
            }
        };

        processLatestMessage();
    }, [conversationLog]);

    useEffect(() => {
        // Load saved words from localStorage when the component mounts
        const loadedWords = JSON.parse(localStorage.getItem('savedWords')) || [];
        setSavedWords(loadedWords);
    }, []);

    // Load streak from localStorage when the component mounts
    useEffect(() => {
        const savedStreak = localStorage.getItem('streak');
        if (savedStreak) {
            setStreak(parseInt(savedStreak, 10));
        }
    }, []);

    // Save streak to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('streak', streak.toString());
    }, [streak]);

    const incrementStreakIfNewDay = () => {
        const today = new Date().toDateString();
        if (lastCompletedDate !== today) {
            setStreak(prevStreak => prevStreak + 1);
            setLastCompletedDate(today);
        }
    };

    // When the user submits a message
    const handleSubmit = async (input) => {
        // Update the conversation log immediately with user input
        console.log("HERE HI")
        setSegmentedConversation(prev => [...prev, { role: 'user', content: input }]);
        setConversationLog(prev => [...prev, { role: 'user', content: input }]);

        setConsecutiveUserMessages(consecutiveUserMessages + 1);
        if (consecutiveUserMessages + 1 === 7) {
            incrementStreakIfNewDay();
            setConsecutiveUserMessages(0);
            alert("You've completed 7 messages in a row! Keep it up!");
        }
    };

    const handleSaveWord = (word) => {
        // Check if the word is already saved
        if (!savedWords.includes(word)) {
            const newSavedWords = [...savedWords, word];
            setSavedWords(newSavedWords);
            localStorage.setItem('savedWords', JSON.stringify(newSavedWords));
            console.log("Saved word: ", word);
        } else {
            console.log("Word already saved: ", word);
        }
    };

    const handleDeleteWord = (wordToDelete) => {
        const updatedWords = savedWords.filter(word => word.Word !== wordToDelete);
        setSavedWords(updatedWords);
        localStorage.setItem('savedWords', JSON.stringify(updatedWords));
    };

    const handleUpdateWord = (wordToUpdate, newMeaning) => {
        const updatedWords = savedWords.map(word => 
            word.Word === wordToUpdate ? { ...word, Meaning: newMeaning } : word
        );
        setSavedWords(updatedWords);
        localStorage.setItem('savedWords', JSON.stringify(updatedWords));
    };

    const handleLanguageChange = (event) => {
        setLanguage(event.target.value);
    };

    const toggleModel = () => {
        setCurrentModel(prevModel => prevModel === 'gpt-3.5-turbo' ? 'gpt-4-1106-preview' : 'gpt-3.5-turbo');
    };

    return (
        <div className={styles.chatContainer}>
            <ChatHeader className={styles.chatHeader}/>
            <Button variant="contained" color="primary" onClick={toggleModel}>
                    Switch to {currentModel === 'gpt-3.5-turbo' ? 'GPT-4-1106-preview' : 'GPT-3.5-turbo'}
                </Button>
            <div>
                <label htmlFor="language-select">Choose a language to learn:</label>
                <select id="language-select" value={language} onChange={handleLanguageChange} disabled={isSituationUsed}>
                    {languages.map(lang => (
                        <option key={lang} value={lang}>{lang}</option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="difficulty-select">Select Difficulty:</label>
                <select id="difficulty-select" value={difficulty} onChange={handleDifficultyChange} disabled={isSituationUsed}>
                    {difficultyLevels.map(level => (
                        <option key={level} value={level}>{level}</option>
                    ))}
                </select>
            </div>
            <MessageDisplayArea messages={conversationLog} segmentedMessages={segmentedConversation} onClickWord={updateCard} situation={situation} setSituation={setSituation} useSituation={useSituation} showSituation={true} openHelpChat={openHelpChat} customVocab={customVocab} setCustomVocab={setCustomVocab}/>
            <ChatInputArea onSendMessage={handleSubmit} />
            <SystemMessages />
            <TranslationCard title={cardTitle} content={cardContent} onClickWord={updateCard} handleSaveWord={handleSaveWord}/>
            <Button variant="contained" color="primary" onClick={openTranslator}>
                Open Translator
            </Button>
            <SavedWordsDisplay 
                savedWords={savedWords} 
                onDeleteWord={handleDeleteWord} 
                onUpdateWord={handleUpdateWord}
            />
            <TranslatorModal isOpen={isTranslatorOpen} onRequestClose={closeTranslator} targetLanguage={language} />
            <HelpChatModal 
                isOpen={isHelpChatOpen} 
                onRequestClose={closeHelpChat}
                language={language}
                queryText={queryText}
            />
            <div>
                Your current streak: {streak}
            </div>
            
        </div>
    );
};

export default ChatContainer;