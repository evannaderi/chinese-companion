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

export const getGoogleTranslation = async(text, targetLanguage) => {
    const apiURL = "/api/googleTranslate";

    const targetLanguageCode = languageCodeMap[targetLanguage];

    if (!targetLanguageCode) {
        throw new Error(`Unsupported language: ${targetLanguageName}`);
    }

    try {
        const response = await axios.post(apiURL, {
            text: text,
            targetLanguage: targetLanguageCode
        });

        return response.data.translation;

    } catch (error) {
        throw new Error(`Request failed with status ${error.response.status}`);
    }
};