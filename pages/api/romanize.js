const { TranslationServiceClient } = require('@google-cloud/translate');
const fetch = require('node-fetch'); // You'll need 'node-fetch' to make HTTP requests

const client = new TranslationServiceClient();

export default async function (req, res) {
    try {
        const { text, sourceLanguage } = req.body;

        if (!text || !sourceLanguage) {
            return res.status(400).json({ error: 'Missing text or sourceLanguage in request body' });
        }

        console.log("Calling Google Translate API for romanization with text: ", text, " and sourceLanguage: ", sourceLanguage);

        const requestBody = {
            source_language_code: sourceLanguage,
            contents: [text]
        };

        const projectId = 'chinese-companion';
        const location = 'global'; // or your specific location
        const url = `https://translation.googleapis.com/v3/projects/${projectId}/locations/${location}:romanizeText`;

        const accessToken = process.env.GOOGLE_TRANSLATE_API_KEY; // Ensure you have a method to retrieve an access token

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(requestBody)
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(`API responded with status code ${response.status}`);
        }

        console.log("response: ", responseData);

        const romanizations = responseData.romanizations;
        const romanizedText = romanizations.length > 0 ? romanizations[0].romanizedText : "";

        res.status(200).json({ romanizedText });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
};
