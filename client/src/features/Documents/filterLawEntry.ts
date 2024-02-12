import { GithubFile } from 'client-sdk';

const filterLawEntry = (filter: string) => (item: GithubFile) => {
    const filterLower = filter.toLowerCase();
    const { name, identifier, date } = item;
    const reversedIdentifier = identifier.split('.').reverse().join('/');

    return name.toLowerCase().includes(filterLower) ||
        identifier.toLowerCase().includes(filterLower) ||
        date.toLowerCase().includes(filterLower) ||
        reversedIdentifier.toLowerCase().includes(filterLower);
};

export default filterLawEntry;