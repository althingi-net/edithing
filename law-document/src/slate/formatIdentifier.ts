export const formatIdentifier = (identifier: string) => {
    const [year, nr] = identifier.split('.');
    return `${nr}/${year}`;
};