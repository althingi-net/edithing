import romans from 'romans';

const convertRomanNumber = (value: string | number): string => {
    if (isInteger(value)) {
        return romans.romanize(Number(value));
    }

    return romans.deromanize(value).toString();
};

const isInteger = (value: string | number): value is number => {
    return Number.isInteger(Number(value));
};

export default convertRomanNumber;