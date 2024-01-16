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

    const geminiResponse = await getGeminiCompletion(`
        ###Instruction###
        - Segment the provided Chinese sentence into words.
        - Use semicolons to separate each word in the output.
        - Avoid segmenting by individual characters; focus on complete words.
        - Return only the segmented sentence without extra commentary or explanation.

        ###Example###
        - Input: "我的家人都非常高兴" → Output: "我;的;家人;都;非常;高兴"
        - Input: "你好" → Output: "你好"
        - Input: "你好吗" → Output: "你好;吗"
        - Input: "我最喜欢踢足球" → Output: "我;最;喜欢;踢;足球"
        - Input: "我们可以买一袋苹果" → Output: "我们;可以;买;一;袋;苹果"
        - Input: "我也是，我去了一个美丽的汉滩度假" → Output: "我;也;是;，;我;去;了;一个;美丽;的;汉滩;度假"

        ###Input###
        ${message}

        ###Output###`)

    console.log("gemini response for segmenting: ", geminiResponse);
    console.log("splitting gemini response: ", geminiResponse.split(';'));

    return geminiResponse.split(';');
};