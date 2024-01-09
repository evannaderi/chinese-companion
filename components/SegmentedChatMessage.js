import React from 'react';
import { useEffect, useState } from 'react';
import styles from './styles/SegmentedChatMessage.module.css';
import Button from '@mui/material/Button';
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

const regex = /\[([^\]]+)\]/;

const SegmentedChatMessage = ({ message, onClickWord, idx, openHelpChat, sourceLanguage, autoplay, voice }) => {
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [audioLoaded, setAudioLoaded] = React.useState(false);
    const [playbackSpeed, setPlaybackSpeed] = React.useState(1);
    const [translatedText, setTranslatedText] = useState("");
    const [feedbackText, setFeedbackText] = useState("");
    const audioRef = React.useRef(null);
    const messageBoxClass = message.role === 'user' ? styles.userMessage : styles.assistantMessage;

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


        onClickWord(segment, translation);
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
        const geminiCompletion = await getGeminiCompletion(`Give me feedback in one sentence of the strictly grammatical and spelling correctness of this text in the language ${sourceLanguage}: However, write your response in English please. Please do NOT wory about small mistakes like missing puncutation or accents. If the text is good, only reply with the message "Good" and nothing else. Otherwise, say it is not correct and give feedback on what the text should be. The text is: ` + message.content);
        setFeedbackText(geminiCompletion); p
    };

    const handleTranslateClick = async () => {
        const translation = await getGoogleTranslation(message.content.join(' '), sourceLanguage, "English");
        setTranslatedText(translation);
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
                    <p>{message.content}</p>
                }
                {translatedText && (
                    <div className={styles.translatedText}>
                        {translatedText}
                    </div>
                )}
                {feedbackText && (
                    feedbackText === "Good" ? (
                        <div className={styles.altFeedbackText}>
                            {feedbackText}
                        </div>
                    ) : (
                        <div className={styles.feedbackText}>
                            {feedbackText}
                        </div>
                    )
                    
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
            {message.role === 'user' && (
                <Tooltip title="Get feedback on correctness of your message">
                    <IconButton onClick={onClickFeedback}>
                        <HelpOutlineIcon />
                    </IconButton>
                </Tooltip>
            )}
            
        </div>
    );
};

export default SegmentedChatMessage;
