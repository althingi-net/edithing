import xmlFormat from 'xml-formatter';
import { Changelog } from '../changelog/Changelog';
import { exportChangelogXml } from './exportChangelogXml';

test('export added', () => {
    const changelog: Changelog[] = [{
        type: 'added',
        id: 'Chapter-1.Art-2',
        text: 'New Paragraph',
    }];

    expect(exportChangelogXml(changelog)).toBe(xmlFormat(`
        <changes>
            <change id="Chapter-1.Art-2" type="added" nr="1">
                New Paragraph
            </change>
        </changes>
    `));
});

test('export removed', () => {
    const changelog: Changelog[] = [{
        type: 'deleted',
        id: 'Chapter-1.Art-2',
        text: 'New Paragraph',
    }];

    expect(exportChangelogXml(changelog)).toBe(xmlFormat(`
        <changes>
            <change id="Chapter-1.Art-2" type="deleted" nr="1">
                New Paragraph
            </change>
        </changes>
    `));
});

test('export changed', () => {
    const changelog: Changelog[] = [{
        type: 'changed',
        id: 'Chapter-1.Art-2',
        text: 'New Paragraph',
    }];

    expect(exportChangelogXml(changelog)).toBe(xmlFormat(`
        <changes>
            <change id="Chapter-1.Art-2" type="changed" nr="1">
                New Paragraph
            </change>
        </changes>
    `));
});
    