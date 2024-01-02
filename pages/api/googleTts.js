const textToSpeech = require('@google-cloud/text-to-speech');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const ttsClient = new textToSpeech.TextToSpeechClient();

export default async function (req, res) {
    try {
        console.log("the key is: ", process.env.GOOGLE_TTS_API_KEY);
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

        const id = uuidv4();
        const isProduction = process.env.NODE_ENV === 'production';
        const baseDir = isProduction ? '/tmp' : './public/tts';

        if (!fs.existsSync(baseDir)) {
            fs.mkdirSync(baseDir, { recursive: true });
        }

        const speechFile = path.join(baseDir, `${id}.mp3`);
        console.log("The speech file is: ", speechFile);

        await fs.promises.writeFile(speechFile, response.audioContent, 'binary');
        console.log(`Audio content written to file: ${speechFile}`);

        const audioBase64 = response.audioContent.toString('base64');
        res.status(200).json({ audioData: audioBase64  });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
}
