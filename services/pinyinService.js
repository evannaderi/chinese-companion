import axios from 'axios';

export const getPinyin = async (text) => {
    try {
        // Replace with the actual API URL and any necessary headers or parameters
        const apiUrl = 'api/lookup';
        const response = await axios.post(apiUrl, { query: text });

        // Assuming the API returns the Pinyin in a property named 'pinyin'
        return response.data.result;
    } catch (error) {
        console.error('Error fetching Pinyin:', error);
        return null; // Return null or an appropriate error response
    }
};

export const convertPinyinToneNumbers = (pinyinWithNumbers) => {
    const toneMarks = {
        'a': ['ā', 'á', 'ǎ', 'à'],
        'e': ['ē', 'é', 'ě', 'è'],
        'i': ['ī', 'í', 'ǐ', 'ì'],
        'o': ['ō', 'ó', 'ǒ', 'ò'],
        'u': ['ū', 'ú', 'ǔ', 'ù'],
        'ü': ['ǖ', 'ǘ', 'ǚ', 'ǜ'],
        'v': ['ǖ', 'ǘ', 'ǚ', 'ǜ']
    };

    return pinyinWithNumbers.replace(/([a-zA-ZüÜ]+)(\d)/g, (match, pinyin, tone) => {
        tone = parseInt(tone) - 1;
        if (tone < 0) return pinyin; // No tone

        const vowelOrder = 'aoeiuvü';
        for (let i of vowelOrder) {
            if (pinyin.includes(i)) {
                return pinyin.replace(i, toneMarks[i][tone]);
            }
        }

        return pinyin; // Fallback, should not happen
    });
}
