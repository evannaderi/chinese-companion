import axios from 'axios';

const languageCodeMap = {
    "English": "en",
    "Spanish": "es",
    "French": "fr",
    "German": "de",
    "Italian": "it",
    "Portuguese": "pt",
    "Russian": "ru",
    "Japanese": "ja",
    "Korean": "ko",
    "Chinese": "zh",
    // Add more languages as needed
};

export const getGoogleTranslation = async(text, sourceLanguage, targetLanguage) => {
    const apiURL = "/api/googleTranslate";

    const sourceLanguageCode = languageCodeMap[sourceLanguage];
    const targetLanguageCode = languageCodeMap[targetLanguage];

    if (!targetLanguageCode || !sourceLanguageCode) {
        throw new Error(`Unsupported language: ${targetLanguageName} or ${sourceLanguageName}`);
    }

    try {
        const response = await axios.post(apiURL, {
            text: text,
            sourceLanguage: sourceLanguageCode,
            targetLanguage: targetLanguageCode
        });

        return response.data.translation;

    } catch (error) {
        throw new Error(`Request failed with status ${error.response.status}`);
    }
};

export const getRomanizedText = async (text, sourceLanguage) => {
    const apiURL = "/api/romanize";

    const sourceLanguageCode = languageCodeMap[sourceLanguage];

    if (!sourceLanguageCode) {
        throw new Error(`Unsupported language: ${sourceLanguage}`);
    }

    try {
        const response = await axios.post(apiURL, {
            text: text,
            sourceLanguage: sourceLanguageCode
        });

        return response.data.romanizedText;

    } catch (error) {
        const status = error.response ? error.response.status : 'Unknown';
        throw new Error(`Request failed with status ${status}`);
    }
};