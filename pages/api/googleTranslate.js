const {Translate} = require('@google-cloud/translate').v2;

const translate = new Translate({key: process.env.GOOGLE_TRANSLATE_API_KEY});

export default async function (req, res) {
    try {
        const { text, targetLanguage } = req.body;

        if (!text || !targetLanguage) {
            return res.status(400).json({ error: 'Missing text or targetLanguage in request body' });
        }

        console.log("calling google translate api with text: ", text, " and targetLanguage: ", targetLanguage);
        const [translation] = await translate.translate(text, targetLanguage);

        res.status(200).json({ translation });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
};