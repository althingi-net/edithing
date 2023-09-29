
/**
 * Increment the letter of a string (e.g. a -> b, z -> aa, az -> ba)
 */
const incrementLetter = (nr: string): string => {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    const alphabetLength = alphabet.length;

    const lastLetter = nr[nr.length - 1];

    if (lastLetter === 'z') {
        if (nr.length === 1) {
            return 'aa';
        } else {
            const secondLastLetter = nr[nr.length - 2];
            const secondLastLetterIndex = alphabet.indexOf(secondLastLetter);

            if (secondLastLetterIndex === alphabetLength - 1) {
                return `${incrementLetter(nr.slice(0, nr.length - 2))}aa`;
            } else {
                return `${nr.slice(0, nr.length - 2)}${alphabet[secondLastLetterIndex + 1]}a`;
            }
        }
    } else {
        return `${nr.slice(0, nr.length - 1)}${alphabet[alphabet.indexOf(lastLetter) + 1]}`;
    }
}

export default incrementLetter;