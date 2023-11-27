import Changelog from '../../../../models/Changelog';
import beautify from 'xml-beautifier';

const exportChangelogXml = (changelog: Changelog[]): string => {
    const changes = changelog.map((change, index) => {
        return `
            <change id="${change.id}" type="${change.type}" nr="${index+1}">
                ${parseChange(change)}
            </change>
        `;
    });

    return beautify(`
        <changes>
            ${changes.join('\n')}
        </changes>
    `);
};

const parseChange = (change: Changelog) => {
    return change.text;
};

export default exportChangelogXml;