import styles from './styles/Cards.module.css';
import { Button } from '@mui/material';
import { initialWordState } from '../utils/spacedRepetition'; 
import { getGoogleTTS } from '../services/googleTtsService'; 
import { useRef, useState, useEffect } from 'react';
import { getGeminiCompletion } from '../services/geminiService';

const TranslationCard = ({ title, content, cardDef, handleSaveWord, language }) => {
    const [gotExampleSentences, setGotExampleSentences] = useState(false);
    const [exampleSentences, setExampleSentences] = useState([]);
    const audioRef = useRef(null);

    useEffect(() => {
        setExampleSentences([]);
    }, [title]);

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

    const handleGetExampleSentences = async () => {
        const geminiResponse = await getGeminiCompletion(`Give me a list of 3 example sentences for the word "${title}" in ${language}. For each sentence, give a translation in English. Keep in mind that the specific word here means: ${cardDef}`);
        setExampleSentences(geminiResponse.split('\n'));
    }

    return (
        <div className={styles.translationCard}>
            <h3>{title}</h3>
            <p>{content}</p>
            <p>{cardDef}</p>
            {exampleSentences.map((sentence, index) => (
                <p key={index}>{sentence}</p>
            ))}
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
            <Button 
                variant="contained" 
                color="secondary" 
                onClick={handleGetExampleSentences}
                style={{ marginTop: '10px', marginLeft: '10px' }}
            >
                Get Example Sentences
            </Button>
            <audio ref={audioRef} hidden />
        </div>
    );
};

export default TranslationCard;