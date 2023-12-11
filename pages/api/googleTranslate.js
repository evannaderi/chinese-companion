const {Translate} = require('@google-cloud/translate').v2;

const translate = new Translate({key: process.env.GOOGLE_TRANSLATE_API_KEY});

export default async function (req, res) {
    
};