import axios from 'axios';

const languageCodeMap = {
    "English": "en",
    "Spanish": "es",
    "French": "fr",
    "German": "de",
    "Italian": "it",
    "Portuguese": "pt"
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