const getDefaultTopics = (aiCharName, userCharName, language) => {
    const languageLearningTopics = [
        {
            title: `Basic Greetings and Phrases in ${language}`,
            content: `${aiCharName} teaches ${userCharName} essential greetings and everyday phrases in ${language}.`
        },
        {
            title: `Food and Restaurant Vocabulary in ${language}`,
            content: `${aiCharName} helps ${userCharName} learn vocabulary related to food, dining, and ordering in a restaurant in ${language}.`
        },
        {
            title: `Travel and Directions in ${language}`,
            content: `${aiCharName} instructs ${userCharName} on useful words and phrases for travel, including asking for and understanding directions in ${language}.`
        },
        {
            title: `Shopping and Negotiation in ${language}`,
            content: `${aiCharName} guides ${userCharName} through vocabulary used in shopping scenarios, including prices, sizes, and bargaining in ${language}.`
        },
        {
            title: `Family and Relationships in ${language}`,
            content: `${aiCharName} discusses with ${userCharName} words and phrases related to family, friends, and relationships in ${language}.`
        },
        {
            title: `Workplace and Business Terms in ${language}`,
            content: `${aiCharName} educates ${userCharName} on common vocabulary used in a workplace or business environment in ${language}.`
        },
        {
            title: `Numbers and Time in ${language}`,
            content: `${aiCharName} teaches ${userCharName} how to express numbers, dates, and time, including how to tell time and discuss schedules in ${language}.`
        },
        {
            title: `Weather and Seasons in ${language}`,
            content: `${aiCharName} explains various terms related to weather conditions and seasons, including how to discuss the weather forecast in ${language}.`
        },
        {
            title: `Health and Medical Vocabulary in ${language}`,
            content: `${aiCharName} covers essential vocabulary for discussing health, symptoms, and medical situations in ${language}.`
        },
        {
            title: `Cultural Expressions and Idioms in ${language}`,
            content: `${aiCharName} introduces ${userCharName} to common idioms and expressions unique to the culture of ${language}.`
        },
        {
            title: `Sports and Hobbies in ${language}`,
            content: `${aiCharName} and ${userCharName} explore words and phrases related to popular sports and hobbies in ${language}.`
        },
        {
            title: `Animals and Nature in ${language}`,
            content: `${aiCharName} educates ${userCharName} about vocabulary related to animals, plants, and natural landscapes in ${language}.`
        },
        {
            title: `Music and Arts in ${language}`,
            content: `${aiCharName} discusses terms associated with music, art, and cultural events in ${language}.`
        },
        {
            title: `Holidays and Festivals in ${language}`,
            content: `${aiCharName} teaches ${userCharName} about words and phrases related to major holidays and cultural festivals in ${language}.`
        },
        {
            title: `Educational Terms in ${language}`,
            content: `${aiCharName} explains academic vocabulary, including words commonly used in schools and educational contexts in ${language}.`
        },
        {
            title: `Technology and Social Media in ${language}`,
            content: `${aiCharName} introduces ${userCharName} to vocabulary related to modern technology, gadgets, and social media platforms in ${language}.`
        },
        {
            title: `Emergency Situations in ${language}`,
            content: `${aiCharName} teaches ${userCharName} important phrases for emergency situations in ${language}.`
        }
    ];

    return languageLearningTopics;
}

export default getDefaultTopics;
