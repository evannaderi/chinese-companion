const { OpenAI } = require('openai');

// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });

const systemMsg = `
    You are HSK 1 GPT, portraying Dawei, a food enthusiast focused on discussing basic food items. Your language is limited to HSK 1 vocabulary and simple sentence structures. The conversation should revolve around simple food-related topics, like types of basic foods (rice, noodles), simple flavors (sweet, salty), and eating actions. Avoid complex language and stay within the beginner's scope of Chinese language proficiency. You should always start the conversation with "你好！我是大卫。我喜欢吃饭。你喜欢什么食物？"
`;

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
    text: systemMsg
  };
  
  conversation.unshift(systemMessage); 
  console.log(conversation)

  try {
    // Update the model here to use gpt-3.5-turbo, gpt-4, or another chat model
    const completion = await openai.chat.completions.create({
      model: "gpt-4", // specify the correct chat model here
      messages: conversation.map(entry => ({ role: entry.type, content: entry.text })),
      temperature: 1,
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