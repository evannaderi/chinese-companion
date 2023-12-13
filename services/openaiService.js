import axios from 'axios';
import aiCharacters from "../utils/aiCharacters";
import systemPrompts from "../utils/systemPrompts";

export const getMandarinCompletion = async (messages, model) => {
    const apiURL = "/api/completion";
    const reinforcementWords = ['天气', '怎么样']; // TODO: get from user input
    const systemMsg = aiCharacters.wordReinforcer('Mandarin', reinforcementWords).description;
    
    try {
        const response = await axios.post(apiURL, {
            query: messages,
            systemMsg: systemMsg,
            model: model
        });

        return response.data;

    } catch (error) {
        throw new Error(`Request failed with status ${error.response.status}`);
    }
};

export const getEnglishCompletion = async (messages, model) => {
    const apiURL = "/api/completion";
    const reinforcementWords = ['weather', 'how']; // TODO: get from user input
    const systemMsg = aiCharacters.wordReinforcer('English', reinforcementWords).description;
    
    try {
        const response = await axios.post(apiURL, {
            query: messages,
            systemMsg: systemMsg,
            model: model
        });

        return response.data;

    } catch (error) {
        throw new Error(`Request failed with status ${error.response.status}`);
    }
}

export const getSimpleCompletion = async (messages, model) => {
    const apiURL = "/api/completion";
    const systemMsg = aiCharacters.helpfulAssistant().description;
    
    try {
        const response = await axios.post(apiURL, {
            messages: messages,
            systemMsg: systemMsg,
            model: model
        });

        console.log("response: ", response.data.result);

        return response.data.result;

    } catch (error) {
        console.log(error.response.status);
        throw new Error(`Request failed with status ${error.response.status}`);
    }
}

export const getCustomCompletion = async (systemMsg, messages, model) => {
    const apiURL = "/api/completion";
    
    try {
        const response = await axios.post(apiURL, {
            messages: messages,
            systemMsg: systemMsg,
            model: model
        });

        console.log("response: ", response.data.result);

        return response.data.result;

    } catch (error) {
        console.log(error.response.status);
        throw new Error(`Request failed with status ${error.response.status}`);
    }
}

export const createSituation = async (model) => {
    const apiURL = "/api/completion";
    const systemMsg = "You are a situation creator.";
    
    try {
        const response = await axios.post(apiURL, {
            messages: [{
                role: "user",
                content: systemPrompts.createSituation().prompt,
            }],
            systemMsg: systemMsg,
            model: model
        });

        console.log("response: ", response.data.result);

        return response.data.result;

    } catch (error) {
        console.log(error);
        console.log("The error is: ", error.response.data);
        throw new Error(`Request failed with status ${error.response.status}`);
    }
}

export const getSpanishTranslation = async (word, model) => {
    const apiURL = "/api/completion";
    const translateMsg = systemPrompts.spanishTranslate(word).prompt;
    
    try {
        const response = await axios.post(apiURL, {
            messages: [
                {
                    role: "user",
                    content: translateMsg
                }
            ],
            systemMsg: "You are a Spanish to English translator",
            model: model
        });

        console.log("response: ", response.data.result);

        return response.data.result;

    } catch (error) {
        console.log(error.response.status);
        throw new Error(`Request failed with status ${error.response.status}`);
    }
}

export const getTTS = async (model, voice, input, id) => {
    const apiURL = "/api/tts";
    
    try {
        const response = await axios.post(apiURL, {
            model: model,
            voice: voice,
            input: input
        });

        return response.data;

    } catch (error) {
        throw new Error(`Request failed with status ${error.response.status}`);
    }
}

export const getTranscription = async (base64Audio, audioId, model) => {
    const apiURL = "/api/transcription";
    
    try {
        const response = await axios.post(apiURL, {
            file: base64Audio,
            filename: audioId,
            model: model
        });

        return response.data.result;

    } catch (error) {
        throw new Error(`Request failed with error ${error}`);
    }
};

export const getSpanishSentenceTranslation = async (sentence, model) => {
    const apiURL = "/api/completion";
    const translateMsg = systemPrompts.sentenceTranslate(sentence).prompt;
    
    try {
        const response = await axios.post(apiURL, {
            messages: [
                {
                    role: "user",
                    content: translateMsg
                }
            ],
            systemMsg: "You are a Spanish to English translator",
            model: model
        });

        console.log("response: ", response.data.result);

        return response.data.result;

    } catch (error) {
        console.log(error.response.status);
        throw new Error(`Request failed with status ${error.response.status}`);
    }
}
