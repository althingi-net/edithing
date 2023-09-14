
/**
 * Increase the number of a string containing digit+letter (e.g. 1a -> 2a)
 */
const increaseMixedNumber = (nr: string) => {
    const number = Number(nr.match(/\d+/)?.[0]);
    const letter = nr.match(/[a-z]/)?.[0];

    return `${number + 1}${letter ?? ''}`;
}

export default increaseMixedNumber;