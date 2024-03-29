import { Descendant } from 'slate';
import xmlFormat from 'xml-formatter';
import { MetaType } from '../Slate';
import { createEditorWithPlugins } from '../plugins/createEditorWithPlugins';
import { createDocumentMeta } from '../transformations/createDocumentMeta';
import { createList } from '../transformations/createList';
import { createListItem } from '../transformations/createListItem';
import { exportXml } from './exportXml';

const createEditor = (input: Descendant[]) => {
    const editor = createEditorWithPlugins();

    editor.children = input;

    return editor;
};

test('export chapters', () => {
    const input = createEditor([
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'I. ' }, [
                createList(MetaType.PARAGRAPH, {}, [
                    createListItem(MetaType.PARAGRAPH, '1', { text: 'one.' }),
                    createListItem(MetaType.PARAGRAPH, '2', { text: 'two.' }),
                ]),
            ]),
            createListItem(MetaType.CHAPTER, '2', { title: 'II. ' }),
        ]),
    ]);
    const output = `
        <law>
            <chapter nr="1" nr-type="roman" roman-nr="I">
                <nr-title>I.</nr-title>
                <paragraph nr="1">
                    <sen nr="1">
                        one.
                    </sen>
                </paragraph>
                <paragraph nr="2">
                    <sen nr="1">
                        two.
                    </sen>
                </paragraph>
            </chapter>
            <chapter nr="2" nr-type="roman" roman-nr="II">
                <nr-title>II.</nr-title>
            </chapter>
        </law>
    `;

    expect(exportXml(input)).toBe(xmlFormat(output));
});

test('export xml header', () => {
    const input = createEditor([]);
    const output = `
        <?xml version="1.0" encoding="utf-8"?>
        <law>
        </law>
    `;
    
    expect(exportXml(input, true)).toBe(xmlFormat(output));
});

test('export document meta data', () => {
    const input = createEditor([
        createDocumentMeta({
            nr: '33',
            year: '1944',
            name: 'Stjórnarskrá lýðveldisins Íslands',
            date: '1944-06-17',
            original: '1944 nr. 33 17. júní',
            ministerClause: '&lt;a href=&quot;http://www.althingi.is//dba-bin/fe&quot;&gt;',
        }),
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'I. ' }),
        ]),
    ]);
    const output = `
        <law nr="33" year="1944" law-type="law">
            <name>Stjórnarskrá lýðveldisins Íslands</name>
            <num-and-date>
                <date>1944-06-17</date>
                <num>33</num>
                <original>1944 nr. 33 17. júní</original>
            </num-and-date>
            <minister-clause>&lt;a href=&quot;http://www.althingi.is//dba-bin/fe&quot;&gt;</minister-clause>
            <chapter nr="1" nr-type="roman" roman-nr="I">
                <nr-title>I.</nr-title>
            </chapter>
        </law>
    `;

    expect(exportXml(input)).toBe(xmlFormat(output));
});

test('export no title if meta.title is undefined', () => {
    const input = createEditor([
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { text: 'some text' }),
        ]),
    ]);
    const output = `
        <law>
            <chapter nr="1" nr-type="roman" roman-nr="I">
                <sen nr="1">some text</sen>
            </chapter>
        </law>
    `;

    expect(exportXml(input)).toBe(xmlFormat(output));
});

test('export title from LIST_ITEM_TEXT', () => {
    const input = createEditor([
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'title ', text: ['text1', 'text2'] }),
        ]),
    ]);
    const output = `
        <law>
            <chapter nr="1" nr-type="roman" roman-nr="I">
                <nr-title>title</nr-title>
                <sen nr="1">text1</sen>
                <sen nr="2">text2</sen>
            </chapter>
        </law>
    `;

    expect(exportXml(input)).toBe(xmlFormat(output));
});

test('export name from LIST_ITEM_TEXT', () => {
    const input = createEditor([
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'title ', name: 'name ', text: ['text1', 'text2'] }),
        ]),
    ]);
    const output = `
        <law>
            <chapter nr="1" nr-type="roman" roman-nr="I">
                <nr-title>title</nr-title>
                <name>name</name>
                <sen nr="1">text1</sen>
                <sen nr="2">text2</sen>
            </chapter>
        </law>
    `;

    expect(exportXml(input)).toBe(xmlFormat(output));
});

test('sen being exported', () => {
    const input = createEditor([
        createList(MetaType.PARAGRAPH, {}, [
            createListItem(MetaType.PARAGRAPH, '1', { text: ['one.', 'two.'] }),
        ]),
    ]);
    const output = `
        <law>
            <paragraph nr="1">
                <sen nr="1">one.</sen>
                <sen nr="2">two.</sen>
            </paragraph>
        </law>
    `;

    expect(exportXml(input)).toBe(xmlFormat(output));
});

test('do not modify input', () => {
    const input = createEditor([
        createList(MetaType.PARAGRAPH, {}, [
            createListItem(MetaType.PARAGRAPH, '1', { title: '2. ', text: 'Umdæmi sendiráða skulu vera sem hér segir:' }, [
                createList(MetaType.NUMART, {}, [
                    createListItem(MetaType.NUMART, 'a', { nrType: 'alphabet' }, [
                        createList(MetaType.PARAGRAPH, {}, [
                            createListItem(MetaType.PARAGRAPH, '1', { title: 'a. ', text: 'Berlín.' }),
                        ]),
                    ]),
                ]),
            ]),
        ]),
    ]);

    const original = JSON.stringify(input);
    
    exportXml(input);
    
    expect(original).toBe(JSON.stringify(input));
});
