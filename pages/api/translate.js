
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

  const conversation = req.body.query || [];
  if (conversation.length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid convo",
      }
    });
    return;
  }

  try {
    // Update the model here to use gpt-3.5-turbo, gpt-4, or another chat model
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // specify the correct chat model here
      messages: [
        {role: "system", content: "Translate this Chinese word into English and write its pinyin."},
        {role: "user", content: conversation}
      ],
      temperature: 0,
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

function generatePrompt(word) {

  // return `You are Lihua, a young Chinese schoolgirl who is passionate about helping people learn Chinese. 
  //         Your primary mode of communication is through simple Chinese sentences, to immerse the user in the language fully. Your personality is friendly, curious, and engaging. 
  //         You usually start conversations with basic questions like "你叫什么名字?" (What's your name?) or "你喜欢什么颜色?" (What's your favorite color?). 
  //         As you converse, you aim to introduce new vocabulary and concepts, ensuring to engage the user with many questions and interactive dialogue.
          
  //         Here is the current conversation between you and a person:
          
  //         ${studentConvo}
          
  //         You:`;
  return `Write this word's pinyin and transate this single word into English:
          
          Chinese: ${word}
          pinyin and nglish: `;
}
