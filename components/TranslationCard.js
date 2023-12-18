import styles from './styles/Cards.module.css';
import { Button } from '@mui/material';
import { initialWordState } from '../utils/spacedRepetition'; 

const TranslationCard = ({ title, content, handleSaveWord }) => {
    const handleSaveWordClick = () => {
        handleSaveWord({"Word": title, 
                        "Meaning": content,
                        ...initialWordState
                    });
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
        </div>
    );
};

export default TranslationCard;