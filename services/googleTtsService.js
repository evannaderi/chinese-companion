import axios from 'axios';

// Extending the map to include voice names and additional parameters
const languageVoiceMap = {
    "English": { languageCode: "en-US", defaultVoice: "en-US-Wavenet-D", gender: "NEUTRAL" },
    "Spanish": { languageCode: "es-ES", defaultVoice: "es-ES-Wavenet-B", gender: "NEUTRAL" },
    "French": { languageCode: "fr-FR", defaultVoice: "fr-FR-Wavenet-E", gender: "NEUTRAL" },
    "German": { languageCode: "de-DE", defaultVoice: "de-DE-Wavenet-F", gender: "NEUTRAL" },
    "Italian": {languageCode: "it-IT", defaultVoice: "it-IT-Wavenet-A", gender: "NEUTRAL" },
    "Portugese": {languageCode: "pt-PT", defaultVoice: "pt-PT-Wavenet-A", gender: "NEUTRAL" },
    "Chinese": {languageCode: "cmn-CN", defaultVoice: "cmn-CN-Standard-B", gender: "NEUTRAL" },
};

export const getGoogleTTS = async (options) => {
    const apiURL = "/api/googleTts";

    // Extracting options with defaults
    const {
        text,
        language = "English",
        voiceName,
    } = options;

    const { languageCode, defaultVoice, gender } = languageVoiceMap[language] || {};

    if (!languageCode) {
        throw new Error(`Unsupported language: ${language}`);
    }

    // Using the provided voiceName or falling back to the default
    const voice = voiceName || defaultVoice;

    try {
        const response = await axios.post(apiURL, {
            text: text,
            languageCode: languageCode,
            voiceName: voice,
        });

        return response.data;

    } catch (error) {
        const status = error.response ? error.response.status : 'Unknown';
        throw new Error(`Google TTS request failed with status ${status}`);
    }
};
