import React from 'react';
import { useEffect, useState } from 'react';
import styles from './styles/SegmentedChatMessage.module.css';
import { IconButton, Slider, Tooltip } from '@mui/material';
import { getSpanishTranslation } from '../services/openaiService';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { getTTS } from '../services/openaiService';
import { getGoogleTranslation } from '../services/googleTranslateService';
import Box from '@mui/material/Box';
import { getRomanizedText } from '../services/googleTranslateService';
import { getPinyin } from '../services/pinyinService';
import TranslateIcon from '@mui/icons-material/Translate';
import { convertPinyinToneNumbers } from '../services/pinyinService';
import { getGeminiCompletion } from '../services/geminiService';
import { handleUserFeedback } from '../utils/spacedRepetition';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Import for the green checkmark
import ErrorIcon from '@mui/icons-material/Error'; // Import for the red exclamation mark
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const regex = /\[([^\]]+)\]/;

const SegmentedChatMessage = ({ message, onClickWord, idx, openHelpChat, sourceLanguage, autoplay, voice }) => {
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [audioLoaded, setAudioLoaded] = React.useState(false);
    const [playbackSpeed, setPlaybackSpeed] = React.useState(1);
    const [translatedText, setTranslatedText] = useState("");
    const [feedbackText, setFeedbackText] = useState("");
    const audioRef = React.useRef(null);
    const messageBoxClass = message.role === 'user' ? styles.userMessage : styles.assistantMessage;
    const [isFeedbackGood, setIsFeedbackGood] = useState(null); // New state to track feedback status
    const [showFeedback, setShowFeedback] = useState(false);

    const fetchAndSetAudio = async () => {
        const messageText = Array.isArray(message.content) ? message.content.join(' ') : message;
        console.log("About to get response from openAI");
        const openAIResponse = await getTTS('tts-1', voice, messageText);
        console.log("Got response from openAI");

        if (openAIResponse && openAIResponse.audioData) {
            const audioBlob = new Blob([new Uint8Array(Buffer.from(openAIResponse.audioData, 'base64'))], { type: 'audio/mpeg' });
            const audioUrl = URL.createObjectURL(audioBlob);
            audioRef.current.src = audioUrl;
        }
        setAudioLoaded(true);
        console.log("Just loaded audio");
    };

    const handlePlay = async () => {
        if (!audioLoaded) {
            await fetchAndSetAudio();
        }
        setIsPlaying(true);
        console.log("Just set is playing to true");
        console.log("The audio src is: ", audioRef.current.src);
        audioRef.current.play();
        audioRef.current.playbackRate = playbackSpeed;
    };

    const handlePause = () => {
        setIsPlaying(false);
        audioRef.current.pause();
    };

    const handleSegmentClick = async (segment) => {
        // Handle the click event, such as displaying more information or triggering an action
        console.log("Clicked segment:", segment);
        
        let translation = await getGoogleTranslation(segment, sourceLanguage, "English");
        

        // if (sourceLanguage === "Chinese") {
        //     const pinyinText = pinyin(segment, { style: pinyin.STYLE_NORMAL }).join(' ');
        //     translation += ` (${pinyinText})`;
        // }

        if (sourceLanguage === "Chinese") {
            const text = await getPinyin(segment);
            const match = text.match(regex);

            if (match) {
                const pinyin = convertPinyinToneNumbers(match[1]); // 'qu4'
                console.log(pinyin);
                translation += ` (${pinyin})`;
            }
            
        }

        // if (sourceLanguage === "Chinese") {
        //     const text = await getRomanizedText(segment, sourceLanguage);
        //     translation += ` (${text})`;
            
        // }


        onClickWord(segment, translation, "\nContextual definition: loading...");

        console.log("About to get contextual definition with segment: ", segment, " and message content: ", message.content.join(' '));
        let contextualDefinition = await getGeminiCompletion(`Tell me the meaning of "${segment}" in this context: ${message.content.join(' ')}. Specifically, start with "In this context, the word ${segment} means" and then give a definition.`);
        onClickWord(segment, translation, "\nContextual definition: " + contextualDefinition);
    };

    const handleSpeedChange = (event) => {
        const newSpeed = parseFloat(event.target.value);
        setPlaybackSpeed(newSpeed);
        if (audioRef.current) {
            audioRef.current.playbackRate = newSpeed;
        }
    };

    const onClickHelp = () => {
        const messageText = Array.isArray(message.content) ? message.content.join(' ') : message.content;
        openHelpChat(messageText, "translation");
    };

    const onClickFeedback = async () => {
        console.log("sendingq feedback of: ", message.content);
        const geminiCompletion = await getGeminiCompletion(`
        ###Instruction###
        Evaluate the grammatical and spelling accuracy of the following text in ${sourceLanguage}, responding in English. Focus on identifying significant grammatical and spelling errors that might alter the meaning or readability of the text. Please specifically overlook minor details like punctuation, accent marks, or capitalization, unless they critically change the sentence's meaning. If the text is overall correct with clear meaning, respond with "Good." For major errors, approach with a friendly tone, perhaps saying, "It seems there might be a slight mix-up with..." and then suggest an alternative version for these significant errors only.
        ###Text###
        ` + message.content);



            if (geminiCompletion.substring(0, 4) === "Good") {
            setIsFeedbackGood(true);
        } else {
            setIsFeedbackGood(false);
            setFeedbackText(geminiCompletion);
        }
    };

    const handleTranslateClick = async () => {
        const translation = await getGoogleTranslation(message.content.join(' '), sourceLanguage, "English");
        setTranslatedText(translation);
    };

    const handleDialogOpen = () => {
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
    };

    const toggleFeedbackVisibility = () => {
        setShowFeedback(!showFeedback);
    };

    useEffect(() => {
        console.log("In this useEffect and autoplay is: ", autoplay);
        if (autoplay) {
            handlePlay();
        }
        if (message.role === 'user')
            onClickFeedback();
    }, []);

    return (
        <div className={messageBoxClass}>
            <div className="message-content">
                {message.role === 'assistant' && Array.isArray(message.content) ?
                    message.content.map((segment, index) => (
                        <button key={index} onClick={() => handleSegmentClick(segment)} className={styles.segmentedButton}>
                            {segment}
                        </button>
                    ))
                    :
                    <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                        <p>{message.content}</p>
                    </div>
                }
                {translatedText && (
                    <div className={styles.translatedText}>
                        {translatedText}
                    </div>
                )}
                

            </div>
            {message.role === 'assistant' && (
                <div className={styles.controlRow}>
                    <IconButton onClick={isPlaying ? handlePause : handlePlay}>
                        {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                    </IconButton>
                    <audio ref={audioRef} onEnded={() => setIsPlaying(false)}/>
                    <div>
                        <label htmlFor="speed-slider">Speed: {typeof playbackSpeed === 'number' ? playbackSpeed.toFixed(1) : playbackSpeed}x</label>
                        <Slider 
                            id="speed-slider" 
                            min={0.5} 
                            max={2} 
                            step={0.1} 
                            value={playbackSpeed} 
                            onChange={handleSpeedChange} 
                            style={{ width: '200px', marginLeft: '10px' }}
                        />
                    </div>
                    <Tooltip title="Translate">
                        <IconButton onClick={handleTranslateClick}>
                            <TranslateIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Get AI Help">
                        <IconButton onClick={onClickHelp}>
                            <HelpOutlineIcon />
                        </IconButton>
                    </Tooltip>
                    
                </div>
            )}
            {message.role === 'user' && isFeedbackGood !== null && (
                <div style={{ display: 'flex' }}>
                    {showFeedback && !isFeedbackGood && (
                        <div className={styles.feedbackText}>
                            {feedbackText}
                        </div>
                    )}
                    <div style={{ marginLeft: 'auto' }}>
                        {isFeedbackGood ? (
                            <CheckCircleIcon style={{ color: 'green' }} />
                        ) : (
                            <Tooltip title="See feedback">
                                <IconButton onClick={toggleFeedbackVisibility}>
                                    <ErrorIcon style={{ color: 'red' }} />
                                </IconButton>
                            </Tooltip>
                        )}
                    </div>
                </div>
            )}

            

            {/* <Dialog open={openDialog} onClose={handleDialogClose}>
                <DialogTitle>{"Feedback"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {feedbackText}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
             */}
        </div>
    );
};

export default SegmentedChatMessage;
