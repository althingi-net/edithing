import romans from 'romans';

const convertRomanNumber = (value: any): string => {
    if (Number.isInteger(Number(value))) {
        return romans.romanize(Number(value));
    }

    return romans.deromanize(value).toString();
}

export default convertRomanNumber;