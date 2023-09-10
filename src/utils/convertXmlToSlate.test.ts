import convertXmlToSlate from "./convertXmlToSlate";
import { ElementType, MetaType, createList, createListItem, createSlateRoot } from '../components/Editor/Slate';
import { Descendant, Node } from 'slate';

test('<law><chapter> to <ol><li>', () => {
    const input = `
        <law>
            <chapter nr="1" nr-type="roman" roman-nr="I">
                <nr-title>I.</nr-title>
            </chapter>
        </law>
    `;
    const output: Descendant[] = [
        createList(MetaType.CHAPTER, [
            createListItem(MetaType.CHAPTER, '1', 'I.'),
        ]),
    ];

    expect(convertXmlToSlate(input)).toStrictEqual(output);
});

test('<chapter> to <ol><li>', () => {
    const input = `
        <chapter nr="1" nr-type="roman" roman-nr="I">
            <nr-title>I.</nr-title>
        </chapter>
    `;
    const output: Descendant[] = [
        createList(MetaType.CHAPTER, [
            createListItem(MetaType.CHAPTER, '1', 'I.'),
        ]),
    ];

    expect(convertXmlToSlate(input)).toStrictEqual(output);
});

test('<art> to <ol><li>', () => {
    const input = `
        <art nr="1">
            <nr-title>1. gr.</nr-title>
        </art>
    `;
    const output: Descendant[] = [
        createList(MetaType.ART, [
            createListItem(MetaType.ART, '1', '1. gr.'),
        ]),
    ];

    expect(convertXmlToSlate(input)).toStrictEqual(output);
});

test('<subart> to <ol><li>', () => {
    const input = `
        <subart nr="1"></subart>
    `;
    const output: Descendant[] = [
        createList(MetaType.SUBART, [
            createListItem(MetaType.SUBART, '1', ''),
        ]),
    ];

    expect(convertXmlToSlate(input)).toStrictEqual(output);
});

test('<paragraph> to <ol><li>', () => {
    const input = `
        <paragraph nr="1"></paragraph>
    `;
    const output: Descendant[] = [
        createList(MetaType.PARAGRAPH, [
            createListItem(MetaType.PARAGRAPH, '1', ''),
        ]),
    ];

    expect(convertXmlToSlate(input)).toStrictEqual(output);
});

test('<paragraph><sen><sen> to <ol><li><p>', () => {
    const input = `
        <paragraph nr="1">
            <sen>one.</sen>
            <sen>two.</sen>
        </paragraph>
    `;
    const output: Descendant[] = [
        createList(MetaType.PARAGRAPH, [
            createListItem(MetaType.PARAGRAPH, '1', 'one. two.'),
        ]),
    ];

    expect(convertXmlToSlate(input)).toStrictEqual(output);
});

