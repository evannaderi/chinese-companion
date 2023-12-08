import React from 'react';
import styles from './styles/SegmentedChatMessage.module.css';
import { getSpanishTranslation } from '../services/openaiService';
import { getTTS } from '../services/openaiService';

const SegmentedChatMessage = ({ message, onClickWord, idx }) => {
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [audioLoaded, setAudioLoaded] = React.useState(false);
    const [playbackSpeed, setPlaybackSpeed] = React.useState(1);
    const audioRef = React.useRef(null);

    const fetchAndSetAudio = async () => {
        const messageText = Array.isArray(message.content) ? message.content.join(' ') : message;
        const openAIResponse = await getTTS('tts-1', 'alloy', messageText);
        if (openAIResponse && openAIResponse.file) {
            audioRef.current.src = openAIResponse.file; // Directly set the audio source
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
        const translation = await getSpanishTranslation(segment, 'gpt-3.5-turbo');
        onClickWord(segment, translation);
    };

    const handleSpeedChange = (event) => {
        const newSpeed = parseFloat(event.target.value);
        setPlaybackSpeed(newSpeed);
        if (audioRef.current) {
            audioRef.current.playbackRate = newSpeed;
        }
    };

    return (
        <div className={`message ${message.role}`}>
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
            </div>
            {message.role === 'assistant' && ( // Conditional rendering based on role
                <div>
                    <button onClick={isPlaying ? handlePause : handlePlay}>
                        {isPlaying ? 'Pause' : 'Play'}
                    </button>
                    <audio ref={audioRef} onEnded={() => setIsPlaying(false)}/>
                    <div>
                        <label htmlFor="speed-slider">Speed: {typeof playbackSpeed === 'number' ? playbackSpeed.toFixed(1) : playbackSpeed}x</label>
                        <input 
                            type="range" 
                            id="speed-slider" 
                            min="0.5" 
                            max="2" 
                            step="0.1" 
                            value={playbackSpeed} 
                            onChange={handleSpeedChange}
                        />
                    </div>
                </div>
            )}
            
        </div>
    );
};

export default SegmentedChatMessage;