// ReviewWordsModal.js
// Path: src/components/ReviewWordsModal.js
import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import { styled } from '@mui/system';

const ModalBox = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
}));

const ReviewWordsModal = ({ wordToReview, isOpen, onClose, onUserFeedback }) => {
    const [showMeaning, setShowMeaning] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setShowMeaning(false);
        }
    }, [isOpen, wordToReview]);

    const handleToggleShowMeaning = () => setShowMeaning(!showMeaning);

    return (
        <Modal open={isOpen} onClose={onClose}>
            <ModalBox>
                <Typography variant="h4" gutterBottom component="div" color="text.primary" textAlign="center">
                    Word Exploration
                </Typography>
                {wordToReview ? (
                    <>
                        <Typography variant="h5" color="text.secondary" gutterBottom>
                            {wordToReview.word}
                        </Typography>
                        {showMeaning && (
                            <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                                Meaning: {wordToReview.meaning}
                            </Typography>
                        )}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                            <Button variant="outlined" onClick={handleToggleShowMeaning}>
                                {showMeaning ? 'Conceal Meaning' : 'Reveal Meaning'}
                            </Button>
                            <Button variant="contained" color="success" onClick={() => onUserFeedback(true)}>
                                I Knew This
                            </Button>
                            <Button variant="contained" color="error" onClick={() => onUserFeedback(false)}>
                                Try That Again
                            </Button>
                        </Box>
                    </>
                ) : (
                    <Typography variant="subtitle1" color="text.secondary" textAlign="center">
                        Your journey of words awaits the next chapter.
                    </Typography>
                )}
            </ModalBox>
        </Modal>
    );
};

export default ReviewWordsModal;
