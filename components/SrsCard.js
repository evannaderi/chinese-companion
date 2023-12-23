import React, { useEffect } from 'react';
import { Button } from '@mui/material';
import CustomButton from './CustomButton';
import styles from './styles/SrsCard.module.css'; // Adjust path as needed

const SrsCard = ({ currentReviewWord, isReviewWordKnown, handleFeedbackSelection }) => {
    if (!currentReviewWord) return null;

    useEffect(() => {
        console.log("component reload with isReviewWordKnown: ", isReviewWordKnown);
    });

    return (
        <div className={styles.srsCard}>
            <p><b>Review Word: {currentReviewWord.word}</b></p>
            <CustomButton 
                selected={isReviewWordKnown}
                onClick={() => handleFeedbackSelection(true)}
            >
                I Knew This
            </CustomButton>
            <CustomButton 
                selected={isReviewWordKnown == false}
                onClick={() => handleFeedbackSelection(false)}
            >
                I Didn't Know This
            </CustomButton>
        </div>
    );
};

export default SrsCard;
