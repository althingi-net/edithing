import { decrementLetter } from './decrementLetter';

/**
 * Decrease the number of a string containing digit+letter (e.g. 1b -> 1a)
 */
export const decrementMixedNumber = (nr: string, incrementRoot = false) => {
    const number = Number(nr.match(/\d+/)?.[0]);
    const letter = nr.match(/[a-z]+/)?.[0];

    if (!number && letter) {
        return decrementLetter(letter);
    }

    if (letter) {
        if (incrementRoot) {
            return `${number - 1}${letter}`;
        } else {
            return `${number}${decrementLetter(letter)}`;
        }
    }
    
    return `${number - 1}`;
};