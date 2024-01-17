import axios from 'axios';

export const getGeminiCompletion = async (prompt) => {
    const apiURL = "/api/geminiCompletion";

    const response = await axios.post(apiURL, {
        prompt: prompt,
    });

    console.log("gemini response: ", response.data.result);
    return response.data.result;
};

export const getGeminiCompletionMultiTurn = async (history, message) => {
    const apiURL = "/api/geminiCompletionMultiTurn";

    const response = await axios.post(apiURL, {
        history: history,
        message: message,
    });

    console.log("gemini response: ", response.data.result);
    return response.data.result;
};


