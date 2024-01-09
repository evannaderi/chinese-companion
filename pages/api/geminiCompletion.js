const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_TRANSLATE_API_KEY);

export default async function (req, res) {
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});

    const prompt = req.body.prompt;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ result: text });
};