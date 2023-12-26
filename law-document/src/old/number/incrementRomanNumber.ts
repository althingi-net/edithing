import romans from 'romans';

export const incrementRomanNumber = (nr: string) => {
    const value = romans.deromanize(nr) + 1;

    return romans.romanize(value);
};