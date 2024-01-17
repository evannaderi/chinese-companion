    import React, { useState, useEffect } from 'react';
    import { Button, FormControlLabel, Switch, Tooltip, TextField } from '@mui/material';
    import { FormControl, InputLabel, Select, MenuItem, Box, Modal, IconButton, Divider } from '@mui/material';
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
    import SettingsIcon from '@mui/icons-material/Settings';
    import BookIcon from '@mui/icons-material/Book';
    import ReviewWordsModal from './ReviewWordsModal';
    import TranslateIcon from '@mui/icons-material/Translate';
    import SaveIcon from '@mui/icons-material/Save';
    import ReviewIcon from '@mui/icons-material/RateReview';
    import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
    import HelpInstructionsModal from './HelpInstructionsModal';
    import { chineseSegment } from '../services/SegmentService';
    import TeacherCard from './TeacherCard';

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400, // Adjusted for better fit
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: '10px', // Rounded corners
        display: 'flex',
        flexDirection: 'column', // Organize content vertically
        gap: '20px', // Space between rows
    };

    // Custom styles for the modal and its elements
const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'auto',
    minWidth: '40%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: '8px',
};

const customSelectStyle = {
    minWidth: 150,
    margin: '10px',
};

const customTextFieldStyle = {
    margin: '10px',
    minWidth: 150,
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
        const [cardDef, setCardDef] = useState('');
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
        const languages = ['Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Chinese'];
        const voices = ['alloy', 'echo', 'fable', 'nova', 'onyx', 'shimmer', 'google', 'cmn-CN-Standard-A', 'cmn-CN-Standard-B', 'es-ES-Neural2-A', 'es-ES-Neural2-B'];
        const systemPre = `You are the character ${aiCharName} in this situation and the er is ${userCharName}. Only speak in ${language} at a ${difficulty} difficulty, using ${difficulty} sentences and words. Keep your responses to 1-2 sentences: `;
        const [systemPrompt, setSystemPrompt] = useState('');
        const [completionModel, setCompletionModel] = useState('gpt-3.5-turbo');
        const [helpChatModel, setHelpChatModel] = useState('gpt-3.5-turbo');
        const [translationModel, setTranslationModel] = useState('gpt-3.5-turbo');
        const availableModels = ["gpt-3.5-turbo", "gpt-3.5-turbo-1106", "gpt-3.5-turbo-16k", "gpt-4-1106-preview", "gpt-4", "gpt-4-0613", "gpt-4-32k"];
        const [streak, setStreak] = useState(0);
        const [lastCompletedDate, setLastCompletedDate] = useState(null);
        const [consecutiveUserMessages, setConsecutiveUserMessages] = useState(0);
        const [isSrsModeActive, setIsSrsModeActive] = useState(false);
        const [currentReviewWord, setCurrentReviewWord] = useState(null);
        const [isReviewWordKnown, setIsReviewWordKnown] = useState(null);
        const [feedbackSelected, setFeedbackSelected] = useState(false);
        const [autoplay, setAutoplay] = useState(true);
        const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
        const [helpType, setHelpType] = useState('');
        const [wordsLearntToday, setWordsLearntToday] = useState(0);
        const [isReviewWordsModalOpen, setIsReviewWordsModalOpen] = useState(false);
        const [editableAiCharName, setEditableAiCharName] = useState(aiCharName);
        const [editableUserCharName, setEditableUserCharName] = useState(userCharName);
        const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
        const [showSituation, setShowSituation] = useState(true);
        const [showTeacherCard, setShowTeacherCard] = useState(false);



        const openSettingsModal = () => setIsSettingsModalOpen(true);
        const closeSettingsModal = () => setIsSettingsModalOpen(false);

        const openTranslator = () => setIsTranslatorOpen(true);
        const closeTranslator = () => setIsTranslatorOpen(false);

        const openHelpModal = () => setIsHelpModalOpen(true);
        const closeHelpModal = () => setIsHelpModalOpen(false);


        const openSavedWordsModal = () => setIsSavedWordsModalOpen(true);
        const closeSavedWordsModal = () => setIsSavedWordsModalOpen(false);

        const openReviewWordsModal = () => {
            const wordForReview = selectWordForReview(savedWords, language);
            setCurrentReviewWord(wordForReview);
            setIsReviewWordsModalOpen(true);
        };
    
        const closeReviewWordsModal = () => {
            setIsReviewWordsModalOpen(false);
            setCurrentReviewWord(null);
        };

        const openHelpChat = (queryText, type) => {
            setQueryText(queryText);
            setHelpType(type);
            setIsHelpChatOpen(true);
        }
        const closeHelpChat = () => setIsHelpChatOpen(false);

        const handleDifficultyChange = (event) => {
            setDifficulty(event.target.value);
        };

        const updateCard = (title, content, betterDef) => {
            setCardTitle(title);
            setCardContent(content);
            setCardDef(betterDef);
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

        const saveCharacterNames = () => {
            setAiCharName(editableAiCharName);
            setUserCharName(editableUserCharName);
            localStorage.setItem('aiCharName', editableAiCharName);
            localStorage.setItem('userCharName', editableUserCharName);
            closeSettingsModal();
        };

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
            const openAIResponse = await getCustomCompletion(newSystemPrompt, messages, completionModel);
            setConversationLog([{ role: 'assistant', content: openAIResponse }]); // resets convo
            setIsSituationUsed(true);
        };

        useEffect(() => {
            let newSystemPrompt = `You are the character ${aiCharName} in this situation and the other is ${userCharName}. Only speak in ${language} at a ${difficulty} difficulty, using ${difficulty} sentences and words. Keep your responses to 1-2 sentences: `;
        
            if (customVocab !== "") {
                newSystemPrompt += `Directly use these words while you talk in the conversation: ${customVocab}`;
            }
        
            setSystemPrompt(newSystemPrompt);
        }, [aiCharName, userCharName, language, difficulty, customVocab]);

        useEffect(() => {
            const savedLanguage = localStorage.getItem('language');
            const savedDifficulty = localStorage.getItem('difficulty');
            const savedCustomVocab = localStorage.getItem('customVocab');
            const savedCompletionModel = localStorage.getItem('completionModel');
            const savedHelpChatModel = localStorage.getItem('helpChatModel');
            const savedTranslationModel = localStorage.getItem('translationModel');
            const aiCharName = localStorage.getItem('aiCharName');
            const userCharName = localStorage.getItem('userCharName');
            // Set these values if they exist in localStorage
            if (savedLanguage) setLanguage(savedLanguage);
            if (savedDifficulty) setDifficulty(savedDifficulty);
            if (savedCustomVocab) setCustomVocab(savedCustomVocab);
            if (savedCompletionModel) setCompletionModel(savedCompletionModel);
            if (savedHelpChatModel) setHelpChatModel(savedHelpChatModel);
            if (savedTranslationModel) setTranslationModel(savedTranslationModel);
            if (aiCharName) setAiCharName(aiCharName);
            if (userCharName) setUserCharName(userCharName);
            // Add other settings as needed
        }, []);

        useEffect(() => {
            localStorage.setItem('language', language);
            localStorage.setItem('difficulty', difficulty);
            localStorage.setItem('customVocab', customVocab);
            localStorage.setItem('aiCharName', aiCharName);
            localStorage.setItem('userCharName', userCharName);
            localStorage.setItem('completionModel', completionModel);
            localStorage.setItem('helpChatModel', helpChatModel);
            localStorage.setItem('translationModel', translationModel);
            // Add other settings as needed
        }, [language, difficulty, customVocab, aiCharName, userCharName, completionModel, helpChatModel, translationModel]);

        useEffect(() => {
            const savedAiCharName = localStorage.getItem('aiCharName');
            const savedUserCharName = localStorage.getItem('userCharName');
            if (savedAiCharName) setEditableAiCharName(savedAiCharName);
            if (savedUserCharName) setEditableUserCharName(savedUserCharName);
        }, [aiCharName, userCharName]);

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
                    const openAIResponse = await getCustomCompletion(systemPrompt, modifiedConversationLog, completionModel);
                    setConversationLog(prev => [...prev, { role: 'assistant', content: openAIResponse }]);
                    console.log("Just set conversationLog to: ", modifiedConversationLog);
                } else if (lastMessage.role === 'assistant') {
                    // If the last message is from the bot, segment the text
                    console.log("lastMessage.content: ", lastMessage.content)
                    let segmentedResponse = [];
                    if (language === "Chinese") {
                        //segmentedResponse = await segmentTextJieba(lastMessage.content);
                        segmentedResponse = await chineseSegment(lastMessage.content);
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

        useEffect(() => {
            const lastCompletedDate = localStorage.getItem('lastCompletedDate');
            const today = new Date().toDateString();
    
            if (lastCompletedDate === today) {
                const savedWordsLearntToday = parseInt(localStorage.getItem('wordsLearntToday'), 10) || 0;
                setWordsLearntToday(savedWordsLearntToday);
            } else {
                setWordsLearntToday(0);
                localStorage.setItem('wordsLearntToday', '0');
                localStorage.setItem('lastCompletedDate', today);
            }
        }, []);

        const addWordLearntToday = () => {
            setWordsLearntToday(prev => {
                const newCount = prev + 1;
                localStorage.setItem('wordsLearntToday', newCount.toString());
                return newCount;
            });
        };

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
                addWordLearntToday();
            } else {
                console.log("Word already saved: ", word);
            }
        };

        const handleSaveWords = (wordsArray) => {
            // Filter out any words that are already saved
            const newWords = wordsArray.filter(newWord => 
                !savedWords.some(savedWord => savedWord.word === newWord.word)
            );
        
            if (newWords.length === 0) {
                console.log("No new words to add.");
                return;
            }
        
            console.log("Adding new words: ", newWords);
        
            // Combine the existing words with the new words
            const updatedSavedWords = [...savedWords, ...newWords];
        
            // Update the state and local storage
            setSavedWords(updatedSavedWords);
            localStorage.setItem('savedWords', JSON.stringify(updatedSavedWords));
        
            // Update any other relevant state, e.g., count of words learnt today
            addWordLearntToday(newWords.length);
        };

        const handleDeleteWord = (wordToDelete) => {
            const updatedWords = savedWords.filter(word => word.word !== wordToDelete);
            setSavedWords(updatedWords);
            localStorage.setItem('savedWords', JSON.stringify(updatedWords));
        };

        const handleUpdateWord = (originalWord, newWord, newMeaning, newLanguage, newTags) => {
            const updatedWords = savedWords.map(word => 
                word.word === originalWord ? { ...word, word: newWord, meaning: newMeaning, Language: newLanguage, tags: newTags } : word
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

        const handleCompletionModelChange = (event) => {
            setCompletionModel(event.target.value);
        };
    
        const handleHelpChatModelChange = (event) => {
            setHelpChatModel(event.target.value);
        };
    
        const handleTranslationModelChange = (event) => {
            setTranslationModel(event.target.value);
        };

        const toggleAutoplay = () => {
            setAutoplay(!autoplay);
        };

        const toggleSrsMode = () => {
            setIsSrsModeActive(!isSrsModeActive);
        };

        const toggleMode = () => {
            setShowTeacherCard(!showTeacherCard);
            setShowSituation(!showSituation);
        };

        return (
            <div className={styles.chatContainer}>
                <div className={styles.header}>
                    <ChatHeader className={styles.chatHeader}/>
                    <div>
                    <Tooltip title="Help">
                        <IconButton onClick={openHelpModal} style={{ color: '#FFFFFF' }}>
                            <HelpOutlineIcon /> {/* Import HelpOutlineIcon from @mui/icons-material */}
                        </IconButton>
                    </Tooltip>
                        <Tooltip title="Open Translator">
                            <IconButton 
                                style={{ color: '#FFFFFF' }} 
                                onClick={openTranslator}
                            >
                                <TranslateIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Manage Saved Words">
                            <IconButton 
                                style={{ color: '#FFFFFF' }}  
                                onClick={openSavedWordsModal}
                            >
                                <SaveIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Manually Review Words">
                            <IconButton 
                                style={{ color: '#FFFFFF' }} 
                                onClick={openReviewWordsModal}
                            >
                                <ReviewIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Open Settings">
                            <IconButton 
                                style={{ color: '#FFFFFF' }} 
                                onClick={openSettingsModal}
                            >
                                <SettingsIcon />
                            </IconButton>
                        </Tooltip>
                    </div>
                    
                </div>
                

                
                
                <div className={styles.horizontalSettings}>
                    <Tooltip title="Review your saved words during your conversation using a sophisticated spaced repetition algorithm">
                        <FormControlLabel
                            control={<Switch checked={isSrsModeActive} onChange={toggleSrsMode} />}
                            label= "Spaced Repetition Conversation Mode"
                            disabled={isSituationUsed}
                        />
                    </Tooltip>
                    <Tooltip title="Teacher mode">
                        <FormControlLabel
                            control={<Switch checked={showTeacherCard} onChange={toggleMode} />}
                            label= "Switch to Teacher Mode"
                            disabled={isSituationUsed}
                        />
                    </Tooltip>
                    <div className={styles.horizontalSettings}>
                        
                        <FormControl variant="outlined" style={{ minWidth: 120, margin: '10px' }}>
                                <InputLabel 
                                    htmlFor="language-select"
                                    
                                >
                                    Language
                                </InputLabel>
                                <Select
                                    label="Language"
                                    id="language-select"
                                    value={language}
                                    onChange={handleLanguageChange}
                                    disabled={isSituationUsed}
                                    style={{ 
                                        height: '40px', // Adjust height as needed
                                        fontSize: '12px' // Smaller font size
                                    }}
                                >
                                    {languages.map(lang => (
                                        <MenuItem key={lang} value={lang}>{lang}</MenuItem>
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
                                            style={{ 
                                                height: '40px', // Adjust height as needed
                                                fontSize: '12px' // Smaller font size
                                            }}
                                        >
                                            {difficultyLevels.map(level => (
                                                <MenuItem key={level} value={level}>{level}</MenuItem>
                                            ))}
                                        </Select>
                            </FormControl>
                        <div className={styles.wordsLearntToday}>
                            <Tooltip title={`Words saved today: ${wordsLearntToday}`}>
                                <Badge badgeContent={wordsLearntToday} color="secondary">
                                    <BookIcon /> {/* Replace with your preferred icon */}
                                </Badge>
                            </Tooltip>
                        </div>
                        <div className={styles.streakDisplay}>
                            <Tooltip title={`Your current streak : ${streak}`}>
                                <Badge badgeContent={streak} color="primary">
                                    <EmojiEventsIcon /> {/* Replace with your preferred icon */}
                                </Badge>
                            </Tooltip>
                        </div>
                    </div>
                    
                </div>
                
                <MessageDisplayArea messages={conversationLog} segmentedMessages={segmentedConversation} onClickWord={updateCard} situation={situation} setSituation={setSituation} useSituation={useSituation} showSituation={showSituation} showTeacherCard={showTeacherCard} openHelpChat={openHelpChat} customVocab={customVocab} setCustomVocab={setCustomVocab} sourceLanguage={language} aiCharName={aiCharName} userCharName={userCharName} autoplay={autoplay} voice={voice} model={completionModel} handleSaveWord={handleSaveWord} language={language} />
                <ChatInputArea 
                    onSendMessage={handleSubmit} 
                    userInput={userInput} 
                    setUserInput={setUserInput} 
                    isSituationUsed={isSituationUsed} 
                    openHelpChat={openHelpChat}
                    language={language}
                    onClickWord={updateCard}
                    voice={voice}
                    handleSaveWord={handleSaveWord}
                />
                {isSrsModeActive && (
                    <SrsCard 
                        currentReviewWord={currentReviewWord} 
                        isReviewWordKnown={isReviewWordKnown} 
                        handleFeedbackSelection={handleFeedbackSelection} 
                    />
                )}
                <SystemMessages />
                {   cardTitle != '' &&
                    <TranslationCard title={cardTitle} content={cardContent} cardDef={cardDef} onClickWord={updateCard} handleSaveWord={handleSaveWord} language={language} addWordLearntToday={addWordLearntToday} />
                }
                <SavedWordsModal
                    isOpen={isSavedWordsModalOpen}
                    onClose={closeSavedWordsModal}
                    savedWords={savedWords}
                    onDeleteWord={handleDeleteWord}
                    onUpdateWord={handleUpdateWord}
                    onAddWord={handleSaveWord}
                    onAddWords={handleSaveWords}
                    language={language}
                />
                <TranslatorModal isOpen={isTranslatorOpen} onRequestClose={closeTranslator} sourceLanguage={"English"} targetLanguage={language} />
                <HelpChatModal 
                    isOpen={isHelpChatOpen} 
                    onRequestClose={closeHelpChat}
                    language={language}
                    queryText={queryText}
                    isSituationUsed={isSituationUsed}
                    helpType={helpType}
                    model={helpChatModel}
                />
                
                <Modal
                    open={isSettingsModalOpen}
                    onClose={closeSettingsModal}
                    aria-labelledby="settings-modal-title"
                    aria-describedby="settings-modal-description"
                >
                    <Box sx={style}>
                        <h2 id="settings-modal-title" style={{fontFamily: 'Arial', textAlign: 'center'}}>Settings</h2>
                        <Divider style={{ marginBottom: '20px' }} />

                        <Box style={{ marginBottom: '20px' }}>
                            
                            <FormControl variant="outlined" sx={customSelectStyle}>
                                <InputLabel id="completion-model-label">Completion Model</InputLabel>
        
                                <Select
                                    labelId="completion-model-label"
                                    id="completion-model-select"
                                    value={completionModel}
                                    onChange={handleCompletionModelChange}
                                    label="Completion Model"
                                >
                                    {availableModels.map(model => (
                                        <MenuItem key={model} value={model}>{model}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl variant="outlined" style={{ minWidth: 120, margin: '10px' }}>
                                <InputLabel id="help-chat-model-label">Help Chat Model</InputLabel>
                                <Select
                                    labelId="help-chat-model-label"
                                    id="help-chat-model-select"
                                    value={helpChatModel}
                                    onChange={handleHelpChatModelChange}
                                    label="Help Chat Model"
                                >
                                    {availableModels.map(model => (
                                        <MenuItem key={model} value={model}>{model}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            {/* Model Selection for Translation */}
                            <FormControl variant="outlined" style={{ minWidth: 120, margin: '10px' }}>
                                <InputLabel id="translation-model-label">Translation Model</InputLabel>
                                <Select
                                    labelId="translation-model-label"
                                    id="translation-model-select"
                                    value={translationModel}
                                    onChange={handleTranslationModelChange}
                                    label="Translation Model"
                                >
                                    {availableModels.map(model => (
                                        <MenuItem key={model} value={model}>{model}</MenuItem>
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
                
                                >
                                    {voices.map(voice => (
                                        <MenuItem key={voice} value={voice}>{voice}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>

                        <Box style={{ marginBottom: '20px' }}>
                            <TextField
                                label="AI Character Name"
                                value={editableAiCharName}
                                onChange={(e) => setEditableAiCharName(e.target.value)}
                                style={{ margin: '10px', minWidth: 120 }}
                                disabled={isSituationUsed}
                            />
                            <TextField
                                label="User Character Name"
                                value={editableUserCharName}
                                onChange={(e) => setEditableUserCharName(e.target.value)}
                                style={{ margin: '10px', minWidth: 120 }}
                                disabled={isSituationUsed}
                            />
                        </Box>
                        

                       
                        

                        
                        <Button variant="contained" color="primary" onClick={toggleAutoplay}>
                                Turn autoplay {autoplay ? 'off' : 'on'}
                        </Button>
                        
                        
                        
                        <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={saveCharacterNames}
                            style={{ margin: '10px' }}
                            
                        >
                            Save Changes
                        </Button>
                    </Box>
                </Modal>
                

                <ReviewWordsModal 
                    wordToReview={currentReviewWord}
                    isOpen={isReviewWordsModalOpen}
                    onClose={closeReviewWordsModal}
                    onUserFeedback={handleUserWordFeedback}
                />

                <HelpInstructionsModal 
                    isOpen={isHelpModalOpen}
                    onClose={closeHelpModal}
                />

                
            </div>
        );
    };

    export default ChatContainer;