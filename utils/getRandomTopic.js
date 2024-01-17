
import nouns from '../public/nounsArray.js';

function getRandomTopic() {
    const randomIndex = Math.floor(Math.random() * nouns.length);
    return nouns[randomIndex];
}

export default getRandomTopic;
