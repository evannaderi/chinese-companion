const { OpenAI } = require('openai');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const openai = new OpenAI({
    api_key: process.env.OPENAI_API_KEY,
});

export default async function (req, res) {
    console.log("in tts@!");
    if (!openai.apiKey) {
        console.log("Error here at openai.apiKey");
        res.status(500).json({
          error: {
            message: "OpenAI API key not configured, please follow instructions in README.md",
          }
        });
        return;
    }

    const model = req.body.model;
    const voice = req.body.voice;
    const input = req.body.input;

    const id = uuidv4();
    const speechFile = path.resolve(`./public/tts/${id}.mp3`);

    try {
        const mp3 = await openai.audio.speech.create({
            model: model,
            voice: voice,
            input: input,
        });

        const buffer = Buffer.from(await mp3.arrayBuffer());
        await fs.promises.writeFile(speechFile, buffer);

        res.status(200).json({
            message: 'Audio file created successfully',
            file: `/tts/${id}.mp3`,
            id: id
        });
    } catch (error) {
        console.log("the error is mwahahahahaha", error);
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
    }
    
};