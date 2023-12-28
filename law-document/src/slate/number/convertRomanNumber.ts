import romans from 'romans';

export const convertRomanNumber = (value: string | number): string => {
    if (isInteger(value)) {
        return romans.romanize(Number(value));
    }

    return romans.deromanize(value).toString();
};

const isInteger = (value: string | number): value is number => {
    return Number.isInteger(Number(value));
};