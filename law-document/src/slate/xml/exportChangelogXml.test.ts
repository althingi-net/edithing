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
            <art nr="1">
                <subart nr="1">
                    <sen nr="1" change-type="added" origin-id="Chapter-1.Art-2">
                        New Paragraph
                    </sen>
                </subart>
            </art>
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
            <art nr="1">
                <subart nr="1">
                    <sen nr="1" change-type="deleted" origin-id="Chapter-1.Art-2">
                        New Paragraph
                    </sen>
                </subart>
            </art>
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
            <art nr="1">
                <subart nr="1">
                    <sen nr="1" change-type="changed" origin-id="Chapter-1.Art-2">
                        New Paragraph
                    </sen>
                </subart>
            </art>
        </changes>
    `));
});
    