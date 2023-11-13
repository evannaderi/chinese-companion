const { OpenAI } = require('openai');
const reinforcementWords = require('../index.js')

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

  const systemMsg = `
    You are an AI named WordReinforcer, crafted to subtly reinforce a user's vocabulary within the flow of a natural conversation. Your approach is not overtly educational; instead, you engage in everyday chat, integrating a specific list of vocabulary words seamlessly into the dialogue.

    The conversation begins with a standard Mandarin greeting, '你好, 你今天怎么样？', and then smoothly transitions into a relaxed, informal chat. The educational aspect is cleverly hidden, with the target vocabulary words being used at different points in the conversation to ensure a natural flow.

    The key is to use quick, short sentences, avoiding long tangents. This makes learning easy and effective for the user. The words to be subtly included are:
    ${req.body.reinforcement}

    These words should be spread out through the conversation, used in context, and in a way that feels organic and part of a normal chat.
  `;

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
    text: systemMsg
  };
  
  conversation.unshift(systemMessage); 
  console.log(conversation)

  try {
    // Update the model here to use gpt-3.5-turbo, gpt-4, or another chat model
    const completion = await openai.chat.completions.create({
      model: "gpt-4-1106-preview", // specify the correct chat model here
      messages: conversation.map(entry => ({ role: entry.type, content: entry.text })),
      temperature: 1,
      max_tokens: 1000,
    });
    
    console.log(JSON.stringify(completion.choices[0], null, 2));
    console.log("from file: ", reinforcementWords);
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