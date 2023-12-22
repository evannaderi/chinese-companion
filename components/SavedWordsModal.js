// SavedWordsModal.js
import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import SavedWordsDisplay from './SavedWordsDisplay';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const SavedWordsModal = ({ isOpen, onClose, savedWords, onDeleteWord, onUpdateWord }) => {
    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            aria-labelledby="saved-words-modal-title"
            aria-describedby="saved-words-modal-description"
        >
            <Box sx={style}>
                <Typography id="saved-words-modal-title" variant="h6" component="h2">
                    Saved Words
                </Typography>
                <SavedWordsDisplay savedWords={savedWords} onDeleteWord={onDeleteWord} onUpdateWord={onUpdateWord} />
                <Button onClick={onClose}>Close</Button>
            </Box>
        </Modal>
    );
};

export default SavedWordsModal;
