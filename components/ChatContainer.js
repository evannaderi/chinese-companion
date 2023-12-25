import React, { useState, useEffect } from 'react';
import { Button, FormControlLabel, Switch } from '@mui/material';
import { FormControl, InputLabel, Select, MenuItem, Box, Modal } from '@mui/material';
import { getMandarinCompletion } from '../services/openaiService';
import { segmentTextJieba } from '../services/jiebaService';
import ChatHeader from './ChatHeader';
import MessageDisplayArea from './MessageDisplayArea';
import ChatInputArea from './ChatInputArea';
import SystemMessages from './SystemMessages';
import TranslationCard from './TranslationCard';
import SrsCard from './SrsCard';
import SituationCard from './SituationCard';
import { spaceSegment } from '../services/SegmentService';
import { getCustomCompletion } from '../services/openaiService';
import styles from './styles/ChatContainer.module.css';
import TranslatorModal from './TranslatorModal';
import HelpChatModal from './HelpChatModal';
import SavedWordsModal from './SavedWordsModal';
import SavedWordsDisplay from './SavedWordsDisplay';
import { initialWordState, selectWordForReview, handleUserFeedback } from '../utils/spacedRepetition';
import Badge from '@mui/material/Badge';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

const model = "gpt-4-1106-preview";
const firstMsgContent = "Say something just one thing to start the conversation. Do not surround your text with quotation marks or a name or anything. Do not ask for any more information on the situation, you should know everything.";
const difficulty = "extremely beginner";
const voice = "alloy";

const ChatContainer = () => {
    const [userInput, setUserInput] = useState('');
    const [conversationLog, setConversationLog] = useState([]);
    const [segmentedConversation, setSegmentedConversation] = useState([]);
    const [cardTitle, setCardTitle] = useState('');
    const [cardContent, setCardContent] = useState('');
    const [situation, setSituation] = useState('');
    const [isTranslatorOpen, setIsTranslatorOpen] = useState(false);
    const [isHelpChatOpen, setIsHelpChatOpen] = useState(false);
    const [isSavedWordsModalOpen, setIsSavedWordsModalOpen] = useState(false);
    const [queryText, setQueryText] = useState('Hola amigo');
    const [language, setLanguage] = useState('Spanish'); // default language
    const [voice, setVoice] = useState('alloy'); // default voice
    const [isSituationUsed, setIsSituationUsed] = useState(false);
    const [difficulty, setDifficulty] = useState('extremely beginner');
    const [savedWords, setSavedWords] = useState([]);
    const [customVocab, setCustomVocab] = useState("");
    const [aiCharName, setAiCharName] = useState("Lihua");
    const [userCharName, setUserCharName] = useState("Frenkie");
    const difficultyLevels = ['extremely beginner', 'beginner', 'low medium', 'medium', 'high medium', 'advanced', 'extremely advanced'];
    const languages = ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Chinese'];
    const voices = ['alloy', 'echo', 'fable', 'nova', 'onyx', 'shimmer'];
    const systemPre = `You are the character ${aiCharName} in this situation and the er is ${userCharName}. Only speak in ${language} at a ${difficulty} difficulty, using ${difficulty} sentences and words. Keep your responses to 1-2 sentences: `;
    const [systemPrompt, setSystemPrompt] = useState('');
    const [currentModel, setCurrentModel] = useState(model);
    const [streak, setStreak] = useState(0);
    const [lastCompletedDate, setLastCompletedDate] = useState(null);
    const [consecutiveUserMessages, setConsecutiveUserMessages] = useState(0);
    const [isSrsModeActive, setIsSrsModeActive] = useState(false);
    const [currentReviewWord, setCurrentReviewWord] = useState(null);
    const [isReviewWordKnown, setIsReviewWordKnown] = useState(null);
    const [feedbackSelected, setFeedbackSelected] = useState(false);
    const [autoplay, setAutoplay] = useState(false);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

    const openSettingsModal = () => setIsSettingsModalOpen(true);
    const closeSettingsModal = () => setIsSettingsModalOpen(false);

    const openTranslator = () => setIsTranslatorOpen(true);
    const closeTranslator = () => setIsTranslatorOpen(false);

    const openSavedWordsModal = () => setIsSavedWordsModalOpen(true);
    const closeSavedWordsModal = () => setIsSavedWordsModalOpen(false);

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

        let modifiedFirstMsgContent = firstMsgContent;

        if (isSrsModeActive) {
            const wordForReview = selectWordForReview(savedWords, language);
            if (wordForReview && wordForReview.word) {
                modifiedFirstMsgContent = firstMsgContent + ` Please use the word '${wordForReview.word}' in your response.`;
            }
            setCurrentReviewWord(wordForReview);
        }

        const messages = [{role: 'user', content: modifiedFirstMsgContent}];
        console.log("Messages: ", messages);
        const openAIResponse = await getCustomCompletion(newSystemPrompt, messages, currentModel);
        setConversationLog([{ role: 'assistant', content: openAIResponse }]); // resets convo
        setIsSituationUsed(true);
    };

    useEffect(() => {
        const savedLanguage = localStorage.getItem('language');
        const savedDifficulty = localStorage.getItem('difficulty');
        const savedCustomVocab = localStorage.getItem('customVocab');
        const savedAiCharName = localStorage.getItem('aiCharName');
        const savedUserCharName = localStorage.getItem('userCharName');
        const savedCurrentModel = localStorage.getItem('currentModel');
        // Set these values if they exist in localStorage
        if (savedLanguage) setLanguage(savedLanguage);
        if (savedDifficulty) setDifficulty(savedDifficulty);
        if (savedCustomVocab) setCustomVocab(savedCustomVocab);
        if (savedAiCharName) setAiCharName(savedAiCharName);
        if (savedUserCharName) setUserCharName(savedUserCharName);
        if (savedCurrentModel) setCurrentModel(savedCurrentModel);
        // Add other settings as needed
      }, []);

    useEffect(() => {
        localStorage.setItem('language', language);
        localStorage.setItem('difficulty', difficulty);
        localStorage.setItem('customVocab', customVocab);
        localStorage.setItem('aiCharName', aiCharName);
        localStorage.setItem('userCharName', userCharName);
        localStorage.setItem('currentModel', currentModel);
        // Add other settings as needed
      }, [language, difficulty, customVocab, aiCharName, userCharName, currentModel]);

    // Since state updates are asyncronous, we need to use useEffect to wait for the conversationLog state to update
    useEffect(() => {
        const processLatestMessage = async () => {
            if (conversationLog.length == 0) {
                return;
            }

            const lastMessage = conversationLog[conversationLog.length - 1];

            if (lastMessage.role === 'user') {
                // If the last message is from the user, send it to the API
                let userMessage = lastMessage.content;

                let modifiedConversationLog = conversationLog;
                // Append specific text for SRS mode before sending to OpenAI
                if (isSrsModeActive && currentReviewWord) {
                    userMessage += ` Please use the word '${currentReviewWord.word}' in your response.`;
                    modifiedConversationLog = [...conversationLog];
                    modifiedConversationLog[modifiedConversationLog.length - 1] = { ...lastMessage, content: userMessage };
                }
                console.log("The system prompt is: ", systemPrompt);
                const openAIResponse = await getCustomCompletion(systemPrompt, modifiedConversationLog, currentModel);
                setConversationLog(prev => [...prev, { role: 'assistant', content: openAIResponse }]);
                console.log("Just set conversationLog to: ", modifiedConversationLog);
            } else if (lastMessage.role === 'assistant') {
                // If the last message is from the bot, segment the text
                console.log("lastMessage.content: ", lastMessage.content)
                let segmentedResponse = [];
                if (language === "Chinese") {
                    segmentedResponse = await segmentTextJieba(lastMessage.content);
                }
                else {
                    segmentedResponse = spaceSegment(lastMessage.content);
                }
                console.log("segmentedResponse: ", segmentedResponse)

                setSegmentedConversation(prev => [...prev, { role: 'assistant', content: segmentedResponse }]);
                console.log("conversationLog: ", conversationLog);
                console.log("segmentedConversation: ", segmentedConversation);
                //const openAIResponse = await getTTS('tts-1', 'alloy', lastMessage.content, 'thisid');
            }
        };

        processLatestMessage();
    }, [conversationLog]);

    // Load saved words from localStorage when the component mounts
    useEffect(() => {
        const loadedWords = JSON.parse(localStorage.getItem('savedWords')) || [];
        setSavedWords(loadedWords);
    }, []);

    // Load streak from localStorage when the component mounts
    useEffect(() => {
        const savedStreak = localStorage.getItem('streak');
        const savedLastCompletedDate = localStorage.getItem('lastCompletedDate');

        if (savedStreak) {
            setStreak(parseInt(savedStreak, 10));
        }
        if (savedLastCompletedDate) {
            setLastCompletedDate(savedLastCompletedDate);
        }
    }, []);

    // Save updated savedWords to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('savedWords', JSON.stringify(savedWords));
    }, [savedWords]);

    // Save streak to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('streak', streak.toString());
        localStorage.setItem('lastCompletedDate', lastCompletedDate);
    }, [streak, lastCompletedDate]);

    const handleUserWordFeedback = (knewTheWord) => {
        if (currentReviewWord) {
            const updatedWord = handleUserFeedback(currentReviewWord, knewTheWord);
            const updatedWords = savedWords.map(word => 
                word.word === updatedWord.word ? updatedWord : word
            );
            setSavedWords(updatedWords);
    
            const nextWordForReview = selectWordForReview(updatedWords, language);
            setCurrentReviewWord(nextWordForReview);
        } else {
            const nextWordForReview = selectWordForReview(savedWords, language);
            setCurrentReviewWord(nextWordForReview);
        }
    };

    const incrementStreakIfNewDay = () => {
        const today = new Date().toDateString();
        if (lastCompletedDate !== today) {
            setStreak(prevStreak => prevStreak + 1);
            setLastCompletedDate(today);
        }
    };

    // When the user submits a message
    const handleSubmit = async (input) => {
        if (isSrsModeActive &&  currentReviewWord && !feedbackSelected) {
            alert("Please select whether you knew the word or not.");
            return;
        }

        // Update the conversation log immediately with user input
        console.log("HERE HI")
        setSegmentedConversation(prev => [...prev, { role: 'user', content: input }]);
        setConversationLog(prev => [...prev, { role: 'user', content: input }]);

        if (isSrsModeActive) {
            handleUserWordFeedback(isReviewWordKnown);
        }

        setConsecutiveUserMessages(consecutiveUserMessages + 1);
        if (consecutiveUserMessages + 1 === 7) {
            incrementStreakIfNewDay();
            setConsecutiveUserMessages(0);
            alert("You've completed 7 messages in a row! Keep it up!");
        }

        setFeedbackSelected(false);
        setIsReviewWordKnown(null);

        setUserInput('');
    };

    const handleSaveWord = (word, meaning, language, tags, interval, repetition, easeFactor, nextReviewDate) => {
        const newWord = {
            word: word,
            meaning: meaning, // Assign default meaning or get from user
            language: language,
            tags: tags, // Tags should be an array of strings
            interval: interval,
            repetition: repetition,
            easeFactor: easeFactor,
            nextReviewDate: nextReviewDate,
        };

        console.log("Saved word hahaha: ", newWord);

        // Check if the word is already saved
        if (!savedWords.some(savedWord => savedWord.word === word)) {
            const newSavedWords = [...savedWords, newWord];
            setSavedWords(newSavedWords);
            localStorage.setItem('savedWords', JSON.stringify(newSavedWords));
        } else {
            console.log("Word already saved: ", word);
        }
    };

    const handleDeleteWord = (wordToDelete) => {
        const updatedWords = savedWords.filter(word => word.word !== wordToDelete);
        setSavedWords(updatedWords);
        localStorage.setItem('savedWords', JSON.stringify(updatedWords));
    };

    const handleUpdateWord = (originalWord, newWord, newMeaning, newLanguage, newTags) => {
        const updatedWords = savedWords.map(word => 
            word.word === originalWord ? { ...word, word: newWord, eaning: newMeaning, Language: newLanguage, tags: newTags } : word
        );
        setSavedWords(updatedWords);
        localStorage.setItem('savedWords', JSON.stringify(updatedWords));
    };
    const handleLanguageChange = (event) => {
        setLanguage(event.target.value);
    };

    const handleVoiceChange = (event) => {
        setVoice(event.target.value);
    };

    const handleFeedbackSelection = (knewTheWord) => {
        setIsReviewWordKnown(knewTheWord);
        setFeedbackSelected(true);
        console.log("Feedback selected: ", knewTheWord);
    };

    const toggleModel = () => {
        setCurrentModel(prevModel => prevModel === 'gpt-3.5-turbo' ? 'gpt-4-1106-preview' : 'gpt-3.5-turbo');
    };

    const toggleAutoplay = () => {
        setAutoplay(!autoplay);
    };

    const toggleSrsMode = () => {
        setIsSrsModeActive(!isSrsModeActive);
    };

    return (
        <div className={styles.chatContainer}>
            <ChatHeader className={styles.chatHeader}/>

            <Button variant="contained" color="primary" onClick={openSettingsModal}>
                Settings
            </Button>
            
            
            <FormControlLabel
                control={<Switch checked={isSrsModeActive} onChange={toggleSrsMode} />}
                label="SRS Mode"
                disabled={isSituationUsed}
            />
            <MessageDisplayArea messages={conversationLog} segmentedMessages={segmentedConversation} onClickWord={updateCard} situation={situation} setSituation={setSituation} useSituation={useSituation} showSituation={true} openHelpChat={openHelpChat} customVocab={customVocab} setCustomVocab={setCustomVocab} sourceLanguage={language} aiCharName={aiCharName} userCharName={userCharName} autoplay={autoplay} voice={voice} />
            <ChatInputArea onSendMessage={handleSubmit} userInput={userInput} setUserInput={setUserInput} isSituationUsed={isSituationUsed} />
            {isSrsModeActive && (
                <SrsCard 
                    currentReviewWord={currentReviewWord} 
                    isReviewWordKnown={isReviewWordKnown} 
                    handleFeedbackSelection={handleFeedbackSelection} 
                />
            )}
            <SystemMessages />
            <TranslationCard title={cardTitle} content={cardContent} onClickWord={updateCard} handleSaveWord={handleSaveWord} language={language} />
            <Button variant="contained" color="primary" onClick={openTranslator}>
                Open Translator
            </Button>
            <Button variant="contained" color="primary" onClick={openSavedWordsModal}>
                View Saved Words
            </Button>
            <SavedWordsModal
                isOpen={isSavedWordsModalOpen}
                onClose={closeSavedWordsModal}
                savedWords={savedWords}
                onDeleteWord={handleDeleteWord}
                onUpdateWord={handleUpdateWord}
                onAddWord={handleSaveWord}
                language={language}
            />
            <TranslatorModal isOpen={isTranslatorOpen} onRequestClose={closeTranslator} sourceLanguage={"English"} targetLanguage={language} />
            <HelpChatModal 
                isOpen={isHelpChatOpen} 
                onRequestClose={closeHelpChat}
                language={language}
                queryText={queryText}
            />
            <div className={styles.streakDisplay}>
                <Badge badgeContent={streak} color="primary">
                    <EmojiEventsIcon /> {/* Replace with your preferred icon */}
                </Badge>
                <p>Your current streak: {streak}</p>
            </div>
            <Modal
                open={isSettingsModalOpen}
                onClose={closeSettingsModal}
                aria-labelledby="settings-modal-title"
                aria-describedby="settings-modal-description"
            >
                <Box sx={style}>
                    <h2 id="settings-modal-title">Settings</h2>
                    <Button variant="contained" color="primary" onClick={toggleModel}>
                        Switch to {currentModel === 'gpt-3.5-turbo' ? 'GPT-4-1106-preview' : 'GPT-3.5-turbo'}
                    </Button>
                    <Button variant="contained" color="primary" onClick={toggleAutoplay}>
                            Turn autoplay {autoplay ? 'off' : 'on'}
                    </Button>
                    <FormControl variant="outlined" style={{ minWidth: 120, margin: '10px' }}>
                        <InputLabel htmlFor="language-select">Language</InputLabel>
                        <Select
                            label="Language"
                            id="language-select"
                            value={language}
                            onChange={handleLanguageChange}
                            disabled={isSituationUsed}
                        >
                            {languages.map(lang => (
                                <MenuItem key={lang} value={lang}>{lang}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl variant="outlined" style={{ minWidth: 120, margin: '10px' }}>
                        <InputLabel htmlFor="voice-select">Voice</InputLabel>
                        <Select
                            label="Voice"
                            id="voice-select"
                            value={voice}
                            onChange={handleVoiceChange}
                            disabled={isSituationUsed}
                        >
                            {voices.map(voice => (
                                <MenuItem key={voice} value={voice}>{voice}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl variant="outlined" style={{ minWidth: 120, margin: '10px' }}>
                        <InputLabel htmlFor="difficulty-select">Difficulty</InputLabel>
                        <Select
                            label="Difficulty"
                            id="difficulty-select"
                            value={difficulty}
                            onChange={handleDifficultyChange}
                            disabled={isSituationUsed}
                        >
                            {difficultyLevels.map(level => (
                                <MenuItem key={level} value={level}>{level}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            </Modal>
            
        </div>
    );
};

export default ChatContainer;