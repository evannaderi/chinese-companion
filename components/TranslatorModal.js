import React, { useState } from 'react';
import Modal from 'react-modal';
import { getGoogleTranslation } from '../services/googleTranslateService';

const TranslatorModal = ({ isOpen, onRequestClose, targetLanguage }) => {
    const [text, setText] = useState('');
    const [translatedText, setTranslatedText] = useState('');

    const handleTranslate = async () => {
        try {
            const translation = await getGoogleTranslation(text, targetLanguage);
            setTranslatedText(translation);
        } catch (error) {
            console.error("Translation error: ", error.message);
            setTranslatedText("Error in translation");
        }
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
            <h2>Translator</h2>
            <textarea value={text} onChange={(e) => setText(e.target.value)} />
            <button onClick={handleTranslate}>Translate</button>
            <div>Translated Text: {translatedText}</div>
            <button onClick={onRequestClose}>Close</button>
        </Modal>
    );
};

export default TranslatorModal;
