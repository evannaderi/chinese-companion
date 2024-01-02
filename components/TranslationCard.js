import styles from './styles/Cards.module.css';
import { Button } from '@mui/material';
import { initialWordState } from '../utils/spacedRepetition'; 
import { getGoogleTTS } from '../services/googleTtsService'; 
import { useRef } from 'react';

const TranslationCard = ({ title, content, handleSaveWord, language }) => {
    const audioRef = useRef(null);

    const handleSaveWordClick = () => {
        handleSaveWord(title,
                        content,
                        language,
                        [],
                        1,
                        0,
                        2.5,
                        new Date()
                    );
    };

    const handlePlayText = async () => {
        try {
            const googleResponse = await getGoogleTTS({ text: title, language });
            const audioBlob = new Blob([new Uint8Array(Buffer.from(googleResponse.audioData, 'base64'))], { type: 'audio/mpeg' });
            const audioUrl = URL.createObjectURL(audioBlob);
            audioRef.current.src = audioUrl;
            console.log("The audio src is: ", audioRef.current.src);
            audioRef.current.play();
        } catch (error) {
            console.error("Error playing text:", error.message);
        }
    };

    return (
        <div className={styles.translationCard}>
            <h3>{title}</h3>
            <p>{content}</p>
            <Button 
                variant="contained" 
                color="primary" 
                onClick={handleSaveWordClick}
                style={{ marginTop: '10px' }}
            >
                Save Word
            </Button>
            <Button 
                variant="contained" 
                color="secondary" 
                onClick={handlePlayText}
                style={{ marginTop: '10px', marginLeft: '10px' }}
            >
                Play Sound
            </Button>
            <audio ref={audioRef} hidden />
        </div>
    );
};

export default TranslationCard;