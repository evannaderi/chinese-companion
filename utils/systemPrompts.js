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

    createTeachingSession: (aiCharName, userCharName) => ({
        prompt: `
                You are a teacher ${aiCharName}. You are teaching ${userCharName} about a topic of your choice. 
                Teach them about something you know well in a way that is easy to understand. 
                You can use examples, analogies, and other techniques to help them understand. 
                You can also ask them questions to check their understanding. 
                Try to teach them something that they don't know. 
                You can teach them about anything you want, but it should be something that is useful to know. 
                It should be something that you can teach in 5 minutes or less.
            `
    }),
    
}

export default systemPrompts;