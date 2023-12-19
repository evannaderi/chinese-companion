import React from 'react';
import { Button } from '@mui/material';
import styles from './styles/SrsCard.module.css'; // Adjust path as needed

const SrsCard = ({ currentReviewWord, isReviewWordKnown, handleFeedbackSelection }) => {
    if (!currentReviewWord) return null;

    return (
        <div className={styles.srsCard}>
            <p><b>Review Word: {currentReviewWord.Word}</b></p>
            <Button 
                onClick={() => handleFeedbackSelection(true)}
                className={isReviewWordKnown ? styles.selectedButton : ''}
            >
                I Knew This
            </Button>
            <Button 
                onClick={() => handleFeedbackSelection(false)}
                className={isReviewWordKnown === false ? styles.selectedButton : ''}
            >
                I Didn't Know This
            </Button>
        </div>
    );
};

export default SrsCard;