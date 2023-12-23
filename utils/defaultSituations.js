const getDefaultSituations = (aiCharName, userCharName) => {
    const defaultSituations = [
        {
            title: `Normal conversation`,
            dialogue: `${aiCharName} and ${userCharName} are having a normal conversation.`
        },
        {
            title: `Ordering Food at a Restaurant`,
            dialogue: `${aiCharName} and ${userCharName} are at a restaurant deciding what to order.`
        },
        {
            title: `Planning a Weekend Trip`,
            dialogue: `${aiCharName} and ${userCharName} are discussing their plans for a weekend getaway.`
        },
        {
            title: `Going to the Movies`,
            dialogue: `${aiCharName} and ${userCharName} are choosing a movie to watch and deciding on the showtime.`
        },
        {
            title: `Discussing a Book`,
            dialogue: `${aiCharName} has just finished reading a book and is sharing his thoughts with ${userCharName}.`
        },
        {
            title: `Shopping for Groceries`,
            dialogue: `${aiCharName} and ${userCharName} are at a grocery store, making decisions about what to buy.`
        },
        {
            title: `Asking for Directions`,
            dialogue: `${userCharName} is lost and asks ${aiCharName} for directions to the nearest subway station.`
        },
        {
            title: `Sharing Holiday Experiences`,
            dialogue: `${aiCharName} and ${userCharName} are talking about how they spent their recent holidays.`
        },
        {
            title: `Exchanging Cultural Experiences`,
            dialogue: `${aiCharName}, who is from a different country, is sharing his cultural experiences with ${userCharName}.`
        },
        {
            title: `Planning a Birthday Party`,
            dialogue: `${aiCharName} and ${userCharName} are planning a surprise birthday party for their friend.`
        },
        {
            title: `Discussing Current Events`,
            dialogue: `${aiCharName} and ${userCharName} are discussing a recent news event that interests them.`
        },
        {
            title: `Talking about the Weather`,
            dialogue: `${aiCharName} and ${userCharName} are talking about the weather and how it affects their plans.`
        },
        {
            title: `Discussing a Movie`,
            dialogue: `${aiCharName} and ${userCharName} are discussing a movie they just watched.`
        },
        {
            title: `Visiting the Doctor's Office`,
            dialogue: `${aiCharName} is at the doctor's office for a check-up and discussing his health concerns with Dr. ${userCharName}.`
        },
        {
            title: `Attending a Job Interview`,
            dialogue: `${aiCharName} is at a job interview, confidently answering questions posed by interviewer ${userCharName} about his skills and experience.`
        },
        {
            title: `Debating a Social Issue`,
            dialogue: `${aiCharName} and ${userCharName} are engaged in a friendly yet passionate debate about a current social issue, exchanging different viewpoints and arguments.`
        },
        {
            title: `Exploring a Museum`,
            dialogue: `${aiCharName} and ${userCharName} are at a museum, admiring different exhibits and discussing their interpretations and historical significance.`
        },
        {
            title: `Volunteering at a Community Event`,
            dialogue: `${aiCharName} and ${userCharName} are volunteering at a local community event, discussing their tasks and the importance of community service.`
        },
        {
            title: `Experiencing a Tech Workshop`,
            dialogue: `${aiCharName} is attending a technology workshop led by ${userCharName}, where they're exploring new software tools and discussing their applications and benefits.`
        },
    ];

    return defaultSituations;
}



export default getDefaultSituations;
