const textToSpeech = require('@google-cloud/text-to-speech');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const serviceAccount = JSON.parse(Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS_ENCODED, 'base64').toString());

const ttsClient = new textToSpeech.TextToSpeechClient({
    credentials: serviceAccount
});

export default async function (req, res) {
    try {
        const { text, languageCode, voiceName, audioEncoding = 'MP3' } = req.body;

        if (!text || !languageCode || !voiceName) {
            return res.status(400).json({ error: 'Missing text, languageCode, or voiceName in request body' });
        }

        console.log("Calling Google Text-to-Speech API with text:", text, "languageCode:", languageCode, "voiceName:", voiceName);
        
        const request = {
            input: { text: text },
            voice: { languageCode: languageCode, name: voiceName },
            audioConfig: { audioEncoding: audioEncoding },
        };

        const [response] = await ttsClient.synthesizeSpeech(request);

        console.log("type of response is: ", typeof response);
        console.log("response is: ", response);

        const audioBase64 = response.audioContent.toString('base64');
        res.status(200).json({ audioData: audioBase64  });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
}
