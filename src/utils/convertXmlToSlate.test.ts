import convertXmlToSlate from "./convertXmlToSlate";
import { ElementType } from '../components/Editor/Slate';
import { Descendant } from 'slate';


test('<law><chapter> to <ol><li>', () => {
    const input = `
        <law>
            <chapter nr="1" nr-type="roman" roman-nr="I">
                <nr-title>I.</nr-title>
            </chapter>
        </law>
    `;
    const output: Descendant[] = [{
        type: ElementType.ORDERED_LIST,
        meta: {
            type: 'chapter',
            nrType: 'roman',
        },
        children: [{
            type: ElementType.LIST_ITEM,
            meta: {
                type: 'chapter',
                nr: '1',
                nrType: 'roman',
                romanNr: 'I',
                title: 'I.',
            },
            children: [{
                type: ElementType.LIST_ITEM_TEXT,
                children: [{ text: 'I.' }],
            }],
        }],
    }];

    expect(convertXmlToSlate(input)).toStrictEqual(output);
});

test('<chapter> to <ol><li>', () => {
    const input = `
        <chapter nr="1" nr-type="roman" roman-nr="I">
            <nr-title>I.</nr-title>
        </chapter>
    `;
    const output: Descendant[] = [{
        type: ElementType.ORDERED_LIST,
        meta: {
            type: 'chapter',
            nrType: 'roman',
        },
        children: [{
            type: ElementType.LIST_ITEM,
            meta: {
                type: 'chapter',
                nr: '1',
                nrType: 'roman',
                romanNr: 'I',
                title: 'I.',
            },
            children: [{
                type: ElementType.LIST_ITEM_TEXT,
                children: [{ text: 'I.' }],
            }],
        }],
    }];

    expect(convertXmlToSlate(input)).toStrictEqual(output);
});

test('<art> to <ol><li>', () => {
    const input = `
        <art nr="1">
            <nr-title>1. gr.</nr-title>
        </art>
    `;
    const output: Descendant[] = [{
        type: ElementType.ORDERED_LIST,
        meta: {
            type: 'art',
        },
        children: [{
            type: ElementType.LIST_ITEM,
            meta: {
                type: 'art',
                nr: '1',
                title: '1. gr.',
            },
            children: [{
                type: ElementType.LIST_ITEM_TEXT,
                children: [{ text: '1. gr.' }],
            }],
        }],
    }];

    expect(convertXmlToSlate(input)).toStrictEqual(output);
});

test('<subart> to <ol><li>', () => {
    const input = `
        <subart nr="1"></subart>
    `;
    const output: Descendant[] = [{
        type: ElementType.ORDERED_LIST,
        meta: {
            type: 'subart',
        },
        children: [{
            type: ElementType.LIST_ITEM,
            meta: {
                type: 'subart',
                nr: '1',
            },
            children: [{
                type: ElementType.LIST_ITEM_TEXT,
                children: [{ text: '' }],
            }],
        }],
    }];

    expect(convertXmlToSlate(input)).toStrictEqual(output);
});

test('<paragraph> to <ol><li>', () => {
    const input = `
        <paragraph nr="1"></paragraph>
    `;
    const output: Descendant[] = [{
        type: ElementType.ORDERED_LIST,
        meta: {
            type: 'paragraph',
        },
        children: [{
            type: ElementType.LIST_ITEM,
            meta: {
                type: 'paragraph',
                nr: '1',
            },
            children: [{
                type: ElementType.LIST_ITEM_TEXT,
                children: [{ text: '' }],
            }],
        }],
    }];

    expect(convertXmlToSlate(input)).toStrictEqual(output);
});

test('<paragraph><sen><sen> to <ol><li><p>', () => {
    const input = `
        <paragraph nr="1">
            <sen>one.</sen>
            <sen>two.</sen>
        </paragraph>
    `;
    const output: Descendant[] = [{
        type: ElementType.ORDERED_LIST,
        meta: {
            type: 'paragraph',
        },
        children: [{
            type: ElementType.LIST_ITEM,
            meta: {
                type: 'paragraph',
                nr: '1',
            },
            children: [{
                type: ElementType.LIST_ITEM_TEXT,
                children: [{ text: 'one. two.' }],
            }],
        }],
    }];

    expect(convertXmlToSlate(input)).toStrictEqual(output);
});

