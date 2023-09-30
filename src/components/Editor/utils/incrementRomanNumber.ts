import romans from 'romans';

const incrementRomanNumber = (nr: string) => {
    const value = romans.deromanize(nr) + 1;

    return romans.romanize(value);
}

export default incrementRomanNumber;