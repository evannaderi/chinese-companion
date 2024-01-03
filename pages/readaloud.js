// ReadAloudPage.js
import React, { useState, useRef, useEffect } from 'react';
import { Button, Slider } from '@mui/material';
import styles from '../styles/readaloud.module.css';
import { getGoogleTTS } from '../services/googleTtsService';

const ReadAloudPage = () => {
    const [inputText, setInputText] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentSegment, setCurrentSegment] = useState(0);
    const [textSegments, setTextSegments] = useState([]);
    const [playbackTime, setPlaybackTime] = useState(0);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const audioRef = useRef(null);

    const handleInputChange = (event) => {
        setInputText(event.target.value);
    };

    useEffect(() => {
        setTextSegments(splitTextIntoSegments(inputText));
    }, [inputText]);

    const splitTextIntoSegments = (text) => {
        return text.match(/(?:\S+\s*){1,100}/g) || [];
    };

    const playSegment = async (segmentIndex) => {
        if (segmentIndex < textSegments.length) {
            try {
                const ttsResponse = await getGoogleTTS({ text: textSegments[segmentIndex] });
                const audioBlob = new Blob([new Uint8Array(Buffer.from(ttsResponse.audioData, 'base64'))], { type: 'audio/mpeg' });
                const audioUrl = URL.createObjectURL(audioBlob);
                audioRef.current.src = audioUrl;
                audioRef.current.play();
                setIsPlaying(true);
                setCurrentSegment(segmentIndex);
            } catch (error) {
                console.error("Error in TTS:", error);
            }
        }
    };

    const handlePlay = () => {
        if (!isPlaying) {
            if (audioRef.current.src && playbackTime > 0) {
                // Resume the audio from the saved playback time
                audioRef.current.currentTime = playbackTime;
                audioRef.current.play();
            } else {
                // Play the current segment from the start if there's no ongoing playback
                playSegment(currentSegment);
            }
            setIsPlaying(true);
        }
    };

    const handlePause = () => {
        setPlaybackTime(audioRef.current.currentTime);
        audioRef.current.pause();
        setIsPlaying(false);
    };

    const handleAudioEnd = () => {
        setIsPlaying(false);
        setPlaybackTime(0);
        const nextSegment = currentSegment + 1;
        if (nextSegment < textSegments.length) {
            playSegment(nextSegment);
        }
    };

    const handleSpeedChange = (event, newValue) => {
        setPlaybackSpeed(newValue);
    };

    useEffect(() => {
        audioRef.current.playbackRate = playbackSpeed;
    }, [playbackSpeed]);

    useEffect(() => {
        const audioEl = audioRef.current;
        audioEl.addEventListener('ended', handleAudioEnd);

        return () => {
            audioEl.removeEventListener('ended', handleAudioEnd);
        };
    }, [currentSegment, textSegments]);

    return (
        <div className={styles.container}>
            <textarea 
                value={inputText}
                onChange={handleInputChange}
                className={styles.textArea}
                placeholder="Enter text here..."
            />
            <Button 
                variant="contained" 
                color="primary" 
                onClick={handlePlay}
                disabled={isPlaying}
            >
                Play
            </Button>
            <Button 
                variant="contained" 
                color="secondary" 
                onClick={handlePause}
                disabled={!isPlaying}
            >
                Pause
            </Button>
            <Slider
                value={playbackSpeed}
                min={0.5}
                max={2}
                step={0.1}
                onChange={handleSpeedChange}
                aria-labelledby="playback-speed-slider"
                valueLabelDisplay="auto"
            />
            <audio ref={audioRef} hidden />
        </div>
    );
};

export default ReadAloudPage;
