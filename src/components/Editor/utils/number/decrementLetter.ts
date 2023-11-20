
/**
 * Decrement the letter of a string (e.g. b -> a, aa -> z, ba -> az)
 */
const decrementLetter = (nr: string): string => {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    const lastLetter = nr[nr.length - 1];

    if (lastLetter === 'a') {
        if (nr.length === 1) {
            return 'z';
        } else {
            const secondLastLetter = nr[nr.length - 2];
            const secondLastLetterIndex = alphabet.indexOf(secondLastLetter);

            if (secondLastLetterIndex === 0) {
                return `${decrementLetter(nr.slice(0, nr.length - 2))}z`;
            } else {
                return `${nr.slice(0, nr.length - 2)}${alphabet[secondLastLetterIndex - 1]}z`;
            }
        }
    } else {
        return `${nr.slice(0, nr.length - 1)}${alphabet[alphabet.indexOf(lastLetter) - 1]}`;
    }
};

export default decrementLetter;