// ReviewWordsModal.js
import React, { useEffect, useState } from 'react';
import { Modal, Box, Button, Typography } from '@mui/material';

const ReviewWordsModal = ({ wordToReview, isOpen, onClose, onUserFeedback }) => {
    const [showMeaning, setShowMeaning] = useState(false);

    const toggleShowMeaning = () => {
        setShowMeaning(!showMeaning);
    };

    useEffect(() => {
        if (isOpen) {
            setShowMeaning(false);
        }
    }, [isOpen]);

    return (
        <Modal open={isOpen} onClose={onClose}>
            <Box style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, backgroundColor: 'white', padding: 20, boxShadow: 24 }}>
                {wordToReview ? (
                    <>
                        <Typography variant="h5">Review Word</Typography>
                        <Typography variant="h6">{wordToReview.word}</Typography>
                        {showMeaning && (
                            <Typography variant="subtitle1" style={{ marginTop: '10px' }}>
                                Meaning: {wordToReview.meaning}
                            </Typography>
                        )}
                        <Button variant="outlined" onClick={toggleShowMeaning}>{showMeaning ? 'Hide Meaning' : 'Show Meaning'}</Button>
                        <Button variant="contained" color="primary" onClick={() => onUserFeedback(true)}>Knew</Button>
                        <Button variant="contained" color="secondary" onClick={() => onUserFeedback(false)}>Didn't Know</Button>
                    </>
                ) : (
                    <Typography variant="h6" style={{ textAlign: 'center' }}>
                        There are no review words left!
                    </Typography>
                )}
            </Box>
        </Modal>
    );
};

export default ReviewWordsModal;
