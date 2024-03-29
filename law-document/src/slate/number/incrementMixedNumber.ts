import { incrementLetter } from './incrementLetter';

/**
 * Increase the number of a string containing digit+letter (e.g. 1a -> 1b)
 */
export const incrementMixedNumber = (nr: string, incrementRoot = false) => {
    const number = Number(nr.match(/\d+/)?.[0]);
    const letter = nr.match(/[a-z]+/)?.[0];

    if (!number && letter) {
        return incrementLetter(letter);
    }

    if (letter) {
        if (incrementRoot) {
            return `${number + 1}${letter}`;
        } else {
            return `${number}${incrementLetter(letter)}`;
        }
    }
    
    return `${number + 1}`;
};