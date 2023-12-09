const systemPrompts = {
    spanishTranslate: (word) => ({
        prompt: `
                Translate this word from Spanish to English and give Spanish example sentences in this format:
                (word meaning in English)
                --------------
                1. Spanish sentence 1 (English translation 1)
                2. Spanish sentence 2 (English translation 2)
                3. Spanish sentence 3 (English translation 3)
                Here is the Spanish word: ${word}
            `
    }),

    createSituation: () => ({
        prompt: `
                Create a description of a situation that two people 
                (Sam and Bob) 
                are in that leads to conversation in one sentence. Make it
                a simple, real-world, practical scenario.
            `

    }),
}

export default systemPrompts;