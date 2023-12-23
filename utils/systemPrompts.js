const systemPrompts = {
    spanishTranslate: (word) => ({
        prompt: `
                Use English to explain the definition of this Spanish word: ${word}
                Respond in this format:
                word definition in English\\n
                --------------\\n
                1. Spanish sentence 1 (English translation 1)\\n
                2. Spanish sentence 2 (English translation 2)\\n
                3. Spanish sentence 3 (English translation 3)\\n
            `
    }),

    createSituation: (word, aiCharName, userCharName) => ({
        prompt: `
                Create a description of a situation that two people 
                (${aiCharName} and ${userCharName}) 
                are in that leads to conversation in one sentence. Make sure
                it is a simple, real-world, practical scenario. 
                It should be no longer than one sentence.
                The scenario should be related to this word: ${word}
            `

    }),
}

export default systemPrompts;