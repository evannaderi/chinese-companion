const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_TRANSLATE_API_KEY);

export default async function (req, res) {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Extract chat history and current message from request
    const { history, message } = req.body;

    console.log("history: ", history, "message: ", message);

    // Start a new chat session with the provided history
    const chat = model.startChat({
        history: history,
        generationConfig: {
            maxOutputTokens: 100
        }
    });

    // Send the current message and get the response
    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();
    console.log("text: ", text);

    // Send the response back to the client
    res.status(200).json({ result: text });
}