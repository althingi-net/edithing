import xmlFormat from 'xml-formatter';
import { Changelog } from '../changelog/Changelog';

export const exportChangelogXml = (changelog: Changelog[]): string => {
    const changes = changelog.map((change, index) => {
        return `
            <change id="${change.id}" type="${change.type}" nr="${index+1}">
                ${parseChange(change)}
            </change>
        `;
    });

    return xmlFormat(`
        <changes>
            ${changes.join('\n')}
        </changes>
    `);
};

const parseChange = (change: Changelog) => {
    return change.text;
};