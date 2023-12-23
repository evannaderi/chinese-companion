export const initialWordState = {
    interval: 1, // 1 minute for the very first interval
    repetition: 0,
    easeFactor: 2.5,
    nextReviewDate: new Date(),
};

const updateWord = (word, performanceRating) => {
    const minuteInMilliseconds = 60 * 1000;
    const dayInMilliseconds = 24 * 60 * minuteInMilliseconds; // One day in milliseconds

    if (performanceRating < 3) {
        word.repetition = 0;
        word.interval = 1; // 1 minute for same-day review if the answer is incorrect
    } else {
        word.repetition += 1;

        if (word.repetition === 1) {
            word.interval = 10; // 10 minutes
        } else if (word.repetition === 2) {
            word.interval = 1; // 1 day, counting in days now
        } else {
            // Switch to counting in days after the second repetition
            word.interval = word.interval * word.easeFactor; // Days
        }

        word.easeFactor = Math.max(1.3, word.easeFactor + 0.1 * (performanceRating - 3));
    }

    // Update the next review date
    const intervalInMilliseconds = word.repetition < 2 ? word.interval * minuteInMilliseconds : word.interval * dayInMilliseconds;
    word.nextReviewDate = new Date(new Date().getTime() + intervalInMilliseconds);

    return word;
};

export const selectWordForReview = (savedWords, currentLanguage) => {
    const today = new Date();
    return savedWords.filter(word => new Date(word.nextReviewDate) <= today && word.language === currentLanguage)[0];
};

export const handleUserFeedback = (word, knewTheWord) => {
    const performanceRating = knewTheWord ? 4 : 2; // 4 for correct, 2 for incorrect
    return updateWord(word, performanceRating);
};
