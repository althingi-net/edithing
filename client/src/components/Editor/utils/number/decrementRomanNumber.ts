import romans from 'romans';

const decrementRomanNumber = (nr: string) => {
    const value = romans.deromanize(nr) - 1;

    return romans.romanize(value);
};

export default decrementRomanNumber;