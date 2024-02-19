import xmlFormat from 'xml-formatter';
import { Changelog } from '../changelog/Changelog';
import { groupChangesByArticle } from '../changelog/groupChangesByArticle';
import { MetaType } from '../Slate';

export const exportChangelogXml = (changelog: Changelog[]): string => {

    const groupedChanges = groupChangesByArticle(changelog);
    const articles = Object.entries(groupedChanges).map(([, changes], index) => {
        return `
            <${MetaType.ART} nr="${index + 1}">
                ${changes.map((change, index) => `
                    <${MetaType.SUBART} nr="${index + 1}">
                        <${MetaType.SEN} nr="1" change-type="${change.type}" origin-id="${change.id}">
                            ${parseChange(change)}
                        </${MetaType.SEN}>
                    </${MetaType.SUBART}>
                `).join('\n')}
            </${MetaType.ART}>
        `;
    });

    return xmlFormat(`
        <changes>
            ${articles.join('\n')}
        </changes>
    `);
};

const parseChange = (change: Changelog) => {
    return change.text;
};