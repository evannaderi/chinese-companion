
import nouns from '../public/nounsArray.js';

function getRandomNoun() {
    const randomIndex = Math.floor(Math.random() * nouns.length);
    return nouns[randomIndex];
}

export default getRandomNoun;
