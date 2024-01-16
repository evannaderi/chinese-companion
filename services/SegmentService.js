import { getGeminiCompletion } from "./geminiService";

export const spaceSegment = (message) => {
    if (typeof message !== 'string') {
        throw new Error('Input must be a string');
    }

    return message.split(' ');
};

export const chineseSegment = async (message) => {
    if (typeof message !== 'string') {
        throw new Error('Input must be a string');
    }

    const geminiResponse = await getGeminiCompletion(`Segment the following Chinese sentence by words seperated 
        by semicolins. Only return the segmentation, 
        do not return any other text.
        For example: 
        input: 我的家人都非常高兴, output: 我的;家人;都;非常;高兴
        input: 你好, output: 你好
        input: 你好吗, output: 你好;吗
        input: 我最喜欢踢足球, output: 我;最;喜欢;踢;足球
        input: 我们可以买一袋苹果, output: 我们;可以;买;一;袋;苹果
        input: 我也是，我去了一个美丽的汉滩度假, output: 我;也;是;，;我;去;了;一个;美丽;的;汉滩;度假
        input: ${message}, output: `);

    console.log("gemini response for segmenting: ", geminiResponse);
    console.log("splitting gemini response: ", geminiResponse.split(';'));

    return geminiResponse.split(';');
};