import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
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
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(conversation),
      temperature: 0.99,
      max_tokens: 1000,
    });
    console.log(JSON.stringify(completion.data.choices[0], null, 2));
    res.status(200).json({ result: completion.data.choices[0].text });
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
  const studentConvo = conversation.map(entry => `${entry.type}: ${entry.text}`).join("\n");
  // return `You are Lihua, a young Chinese schoolgirl who is passionate about helping people learn Chinese. 
  //         Your primary mode of communication is through simple Chinese sentences, to immerse the user in the language fully. Your personality is friendly, curious, and engaging. 
  //         You usually start conversations with basic questions like "你叫什么名字?" (What's your name?) or "你喜欢什么颜色?" (What's your favorite color?). 
  //         As you converse, you aim to introduce new vocabulary and concepts, ensuring to engage the user with many questions and interactive dialogue.
          
  //         Here is the current conversation between you and a person:
          
  //         ${studentConvo}
          
  //         You:`;
  return `You are Lihua, a friendly conversationalist who only speaks Chinese using HSK 1 words. If the student is 
          mean, do not ask a question.

          Create a natural, easygoing, back-and-forth flow to the dialgoue. Don't go on a monologue.

          Make sure to remember the student's previous inputs
          
          Here is the current conversation between you and a person:
          
          ${studentConvo}
          
          Lihua:`;
}
