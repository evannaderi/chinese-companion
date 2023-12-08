const { OpenAI } = require('openai');
const fs = require('fs');
const path = require('path');
const os = require('os');

const openai = new OpenAI({
    api_key: process.env.OPENAI_API_KEY,
});

export default async function (req, res) {
    if (!openai.apiKey) {
        res.status(500).json({
          error: {
            message: "OpenAI API key not configured, please follow instructions in README.md",
          }
        });
        return;
    }

    const { file: base64Audio, filename, model } = req.body;
    const buffer = Buffer.from(base64Audio.split(",")[1], 'base64');

    // Create a temporary file path
    const tmpDir = os.tmpdir();
    const filePath = path.join(tmpDir, filename + '.webm');
    fs.writeFileSync(filePath, buffer);
    console.log("wrote to: ", filePath);

    try {
        const transcription = await openai.audio.transcriptions.create({
            file: fs.createReadStream(filePath),
            model: model,
        });

        res.status(200).json({
            message: 'Transcription created successfully',
            result: transcription.text,
        });

        fs.unlinkSync(filePath);
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            console.error(`Error with OpenAI API request: ${error.message}`);
            res.status(500).json({
                error: {
                    message: 'An error occurred during your request.',
                }
            });
        }
        fs.unlinkSync(filePath);
    }
};