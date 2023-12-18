// spacedRepetition.js
export const initialWordState = {
    interval: 1,
    repetition: 0,
    easeFactor: 2.5,
    nextReviewDate: new Date(),
};

const updateWord = (word, performanceRating) => {
    const minuteInMilliseconds = 60 * 1000;

    if (performanceRating < 3) {
        word.repetition = 0;
        // Set interval to a small number of minutes for same-day review if the answer is incorrect
        word.interval = 1; // for example, 15 minutes
    } else {
        word.repetition += 1;
        if (word.repetition === 1) {
            word.interval = 10; // 1 day in minutes
        } else if (word.repetition === 2) {
            word.interval = 1440; // 6 days in minutes
        } else {
            word.interval *= word.easeFactor;
        }
        word.easeFactor = Math.max(1.3, word.easeFactor + 0.1 * (performanceRating - 3));
    }
    // Update the next review date using minutes
    word.nextReviewDate = new Date(new Date().getTime() + word.interval * minuteInMilliseconds);
    return word;
};


export const selectWordForReview = (savedWords) => {
    const today = new Date();
    return savedWords.filter(word => new Date(word.nextReviewDate) <= today)[0];
};

export const handleUserFeedback = (word, knewTheWord) => {
    const performanceRating = knewTheWord ? 4 : 2; // 4 for correct, 2 for incorrect
    return updateWord(word, performanceRating);
};
