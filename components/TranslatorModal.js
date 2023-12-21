import React, { useState } from 'react';
import Modal from 'react-modal';
import { Button, TextField, Typography, Box } from '@mui/material';
import { getGoogleTranslation } from '../services/googleTranslateService';

// Custom styles for React Modal
const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        width: '50vw', // 50% of the viewport width
        height: '50vh', // 50% of the viewport height
        maxWidth: '800px', // Maximum width
        maxHeight: '600px', // Maximum height
    },
};

const TranslatorModal = ({ isOpen, onRequestClose, sourceLanguage, targetLanguage }) => {
    const [text, setText] = useState('');
    const [translatedText, setTranslatedText] = useState('');

    const handleTranslate = async () => {
        try {
            const translation = await getGoogleTranslation(text, sourceLanguage, targetLanguage);
            setTranslatedText(translation);
        } catch (error) {
            console.error("Translation error: ", error.message);
            setTranslatedText("Error in translation");
        }
    };

    const handleClearText = () => {
        setText('');
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles}>
            <Typography variant="h5" gutterBottom>
                Translator
            </Typography>
            <TextField
                fullWidth
                multiline
                rows={4}
                value={text}
                onChange={(e) => setText(e.target.value)}
                margin="normal"
                variant="outlined"
            />
            <Box mt={2}>
                <Button variant="contained" color="primary" onClick={handleTranslate} style={{ marginRight: '10px' }}>
                    Translate
                </Button>
                <Button variant="outlined" color="secondary" onClick={onRequestClose}>
                    Close
                </Button>
                <Button variant="outlined" color="secondary" onClick={handleClearText}>
                    Clear
                </Button>
            </Box>
            <Typography variant="subtitle1" gutterBottom style={{ marginTop: '20px', color: '#ff7700' }}>
                Translated Text:
            </Typography>
            <Typography variant="body1" style={{ color: '#004777' }}>
                {translatedText}
            </Typography>
        </Modal>
    );
};

export default TranslatorModal;
