// SavedWordsModal.js
import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import SavedWordsDisplay from './SavedWordsDisplay';
import exportToCsv from '../utils/export';
import { getCustomCompletion } from '../services/openaiService';
import { getGeminiCompletion } from '../services/geminiService';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const textareaStyle = {
    width: '100%',
    margin: '10px 0',
    maxHeight: '150px', // Set a maximum height
    overflow: 'auto'    // Enable scrolling
};



const ImportWordsModal = ({ isOpen, onClose, onImport, language }) => {
    const [importText, setImportText] = useState('');
    const [validationText, setValidationText] = useState('');

    const convertPrompt = `
        Convert the following words to a CSV format.
        The CSV format should consit of two columns: 
        the first column should be the word in ${language} 
        and the second column should be the meaning in English.
        Do not include labels for the columns, just include the words themselves.
        Please do not include any extra text, just the words.
        Here is the text with the words for you to convert:
        ${importText}
    `;

    const handleConvert = async () => {
        const convertedWords = await getGeminiCompletion(convertPrompt);
        setValidationText(convertedWords);
    };

    return (
        <Modal open={isOpen} onClose={onClose}>
            <Box sx={style}>
                <Typography variant="h6">Import Words</Typography>
                <TextareaAutosize
                    aria-label="Text to import"
                    minRows={6}
                    placeholder="Copy and paste the new words you want to learn here, in any format. Then, click CONVERT TO CSV and AI will convert the words to CSV format."
                    style={textareaStyle}
                    value={importText}
                    onChange={(e) => setImportText(e.target.value)}
                />
                <Button onClick={handleConvert}>Convert to CSV</Button>
                <TextareaAutosize
                    aria-label="Validation result"
                    minRows={6}
                    placeholder='The converted CSV will appear here. You can also manually copy and paste your own CSV text with word, meaning seperated by new lines.'
                    style={textareaStyle}
                    value={validationText}
                    onChange={(e) => setValidationText(e.target.value)}
                />
                <Button onClick={() => onImport(validationText)}>Import</Button>
                <Button onClick={onClose}>Close</Button>
            </Box>
        </Modal>
    );
};

const SavedWordsModal = ({ isOpen, onClose, savedWords, onDeleteWord, onUpdateWord, onAddWord, language, onAddWords }) => {
    const [isImportModalOpen, setImportModalOpen] = useState(false);

    const handleOpenImportModal = () => {
        setImportModalOpen(true);
    };

    const handleCloseImportModal = () => {
        setImportModalOpen(false);
    };

    const handleImport = (importedText) => {
        const wordsToImport = importedText.split('\n').map(line => {
            try {
                const [word, meaning] = line.split(',').map(item => item.trim());
                return {
                    word,
                    meaning, 
                    language,
                    tags: [],
                    interval: 1,
                    repetition: 0,
                    easeFactor: 2.5,
                    nextReviewDate: new Date(),
                };
            } catch (error) {
                console.error("Error processing word:", line, error);
                return null;
            }
        }).filter(word => word !== null);
    
        onAddWords(wordsToImport);
        handleCloseImportModal();
    };

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
                <SavedWordsDisplay savedWords={savedWords} onDeleteWord={onDeleteWord} onUpdateWord={onUpdateWord} onAddWord={onAddWord} language={language} />
                <Button onClick={handleOpenImportModal}>Import from list</Button>
                <ImportWordsModal
                    isOpen={isImportModalOpen}
                    onClose={handleCloseImportModal}
                    onImport={handleImport}
                    language={language}
                />
                <Button onClick={() => exportToCsv(savedWords)}>Export to Anki</Button>
                <Button onClick={onClose}>Close</Button>
            </Box>
        </Modal>
    );
};

export default SavedWordsModal;
