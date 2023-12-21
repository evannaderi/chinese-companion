const { Translate } = require('@google-cloud/translate').v2;

const translate = new Translate({ key: process.env.GOOGLE_TRANSLATE_API_KEY });

export default async function (req, res) {
    try {
        const { text, sourceLanguage, targetLanguage } = req.body;

        if (!text || !sourceLanguage || !targetLanguage) {
            return res.status(400).json({ error: 'Missing text, sourceLanguage, or targetLanguage in request body' });
        }

        console.log("Calling Google Translate API with text: ", text, " from sourceLanguage: ", sourceLanguage, " to targetLanguage: ", targetLanguage);
        const [translation] = await translate.translate(text, { from: sourceLanguage, to: targetLanguage });

        res.status(200).json({ translation });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
};
