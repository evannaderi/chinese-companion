export const spaceSegment = (message) => {
    if (typeof message !== 'string') {
        throw new Error('Input must be a string');
    }

    return message.split(' ');
};