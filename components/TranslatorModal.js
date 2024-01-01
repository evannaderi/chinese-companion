import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { Button, TextField, Typography, Box, Select, MenuItem } from '@mui/material';
import { getGoogleTranslation } from '../services/googleTranslateService';
import { getPinyin } from '../services/pinyinService';
import { convertPinyinToneNumbers } from '../services/pinyinService';
import { segmentTextJieba } from '../services/jiebaService';

const regex = /\[([^\]]+)\]/;

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
        width: '70vw', // 50% of the viewport width
        height: '70vh', // 50% of the viewport height
        maxWidth: '800px', // Maximum width
        maxHeight: '800px', // Maximum height
    },
};

const TranslatorModal = ({ isOpen, onRequestClose, sourceLanguage, targetLanguage }) => {
    const [text, setText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [srcLanguage, setSrcLanguage] = useState(sourceLanguage);
    const [trgtLanguage, setTrgtLanguage] = useState(targetLanguage);

    const languages = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Russian', 'Italian', 'Portuguese', 'Korean'];

    const handleTranslate = async () => {
        try {
            let translation = await getGoogleTranslation(text, srcLanguage, trgtLanguage);

            if (targetLanguage === 'Chinese') {
                const segments = await segmentTextJieba(translation);
                console.log("here is segments", segments);
                for (const segment of segments) {
                    const pinyin = await getPinyin(segment);
                    const match = pinyin.match(regex);
                    if (!match) {
                        translation += ` No pinyin found`;
                        continue;
                    }
                    const pinyinWithToneNumbers = convertPinyinToneNumbers(match[1]);
                    translation += ` ${pinyinWithToneNumbers}`;;
                }
            }
            setTranslatedText(translation);
        } catch (error) {
            console.error("Translation error: ", error.message);
            setTranslatedText("Error in translation");
        }
    };

    const handleClearText = () => {
        setText('');
    };

    const handleSwitchLanguages = () => {
        setSrcLanguage(trgtLanguage);
        setTrgtLanguage(srcLanguage);
    };

    useEffect(() => {
        setSrcLanguage(sourceLanguage || 'English');
        setTrgtLanguage(targetLanguage || 'Spanish');
    }, [sourceLanguage, targetLanguage]);

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
            <Box display="flex" justifyContent="space-between" mb={2}>
                <Select
                    value={srcLanguage}
                    onChange={(e) => setSrcLanguage(e.target.value)}
                >
                    {languages.map((lang) => (
                        <MenuItem key={lang} value={lang}>
                            {lang}
                        </MenuItem>
                    ))}
                </Select>
                <Select
                    value={trgtLanguage}
                    onChange={(e) => setTrgtLanguage(e.target.value)}
                >
                    {languages.map((lang) => (
                        <MenuItem key={lang} value={lang}>
                            {lang}
                        </MenuItem>
                    ))}
                </Select>
            </Box>
            <Box mt={2}>
                <Button variant="contained" color="primary" onClick={handleTranslate} style={{ marginRight: '10px' }}>
                    Translate
                </Button>
                <Button variant="outlined" color="secondary" onClick={handleSwitchLanguages} style={{ marginRight: '10px' }}>
                    Switch Languages
                </Button>
                <Button variant="outlined" color="secondary" onClick={handleClearText}>
                    Clear
                </Button>
                <Button variant="outlined" color="secondary" onClick={onRequestClose}>
                    Close
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
