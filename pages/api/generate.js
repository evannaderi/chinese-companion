import { Configuration, OpenAIApi } from "openai";
const { OpenAI } = require('openai');

// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });

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

  const conversation = req.body.query || [];
  if (conversation.length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid conversation",
      }
    });
    return;
  }

  const systemMessage = {
    type: "system",
    text: "You are a helpful Chinese assistant who only speaks Chinese."
  };
  
  conversation.unshift(systemMessage); 
  console.log(conversation)

  try {
    // Update the model here to use gpt-3.5-turbo, gpt-4, or another chat model
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // specify the correct chat model here
      messages: conversation.map(entry => ({ role: entry.type, content: entry.text })),
      temperature: 0.99,
      max_tokens: 1000,
    });
    
    console.log(JSON.stringify(completion.choices[0], null, 2));
    res.status(200).json({ result: completion.choices[0].message.content });
  } catch(error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
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
}

function generatePrompt(conversation) {
  // Adjusted to comply with the chat model's requirements
  return conversation.map(entry => ({ role: entry.type, content: entry.text }));
}
