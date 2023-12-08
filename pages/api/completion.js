const { OpenAI } = require('openai');

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

    console.log("in completion@!");
    const conversation = req.body.messages || [];
    const systemMsg = req.body.systemMsg;
    const model = req.body.model;
    if (conversation.length === 0) {
        console.log("conversation is empty");
        res.status(400).json({
        error: {
            message: "Please enter a valid conversation",
        }
        });
        return;
    }

    const systemMessage = {
        role: "system",
        content: systemMsg
    };
    
    
    conversation.unshift(systemMessage);
    console.log("conversation: ", conversation);

    try {
        const completion = await openai.chat.completions.create({
          model: model, // specify the correct chat model here
          messages: conversation,
          temperature: 1,
          max_tokens: 1000,
        });
        console.log("completion: ", completion);
        
        res.status(200).json({ result: completion.choices[0].message.content });
      } catch(error) {
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