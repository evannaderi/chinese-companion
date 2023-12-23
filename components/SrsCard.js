import React, { useEffect } from 'react';
import { Button } from '@mui/material';
import styles from './styles/SrsCard.module.css'; // Adjust path as needed

const SrsCard = ({ currentReviewWord, isReviewWordKnown, handleFeedbackSelection }) => {
    if (!currentReviewWord) return null;

    useEffect(() => {
        console.log("component reload with isReviewWordKnown: ", isReviewWordKnown);
    });

    return (
        <div className={styles.srsCard}>
            <p><b>Review Word: {currentReviewWord.word}</b></p>
            <Button 
                onClick={() => handleFeedbackSelection(true)}
                className={isReviewWordKnown ? styles.selectedButton : styles.srsCardButton}
            >
                I Knew This
            </Button>
            <Button 
                onClick={() => handleFeedbackSelection(false)}
                className={isReviewWordKnown === false ? styles.selectedButton : styles.srsCardButton}
            >
                I Didn't Know This
            </Button>
        </div>
    );
};

export default SrsCard;
