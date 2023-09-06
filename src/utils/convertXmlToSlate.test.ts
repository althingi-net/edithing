import convertXmlToSlate from "./convertXmlToSlate";
import { Type } from '../components/Editor/Slate';
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
        type: Type.ORDERED_LIST,
        listType: 'I',
        children: [{
            type: Type.LIST_ITEM,
            children: [{
                type: Type.LIST_ITEM_TEXT,
                children: [{ text: '' }],
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
        type: Type.ORDERED_LIST,
        listType: 'I',
        children: [{
            type: Type.LIST_ITEM,
            children: [{
                type: Type.LIST_ITEM_TEXT,
                children: [{ text: '' }],
            }],
        }],
    }];

    expect(convertXmlToSlate(input)).toStrictEqual(output);
});

test('<art> to <ol><li>', () => {
    const input = `
        <art>
            <nr-title>I.</nr-title>
        </art>
    `;
    const output: Descendant[] = [{
        type: Type.ORDERED_LIST,
        children: [{
            type: Type.LIST_ITEM,
            children: [{
                type: Type.LIST_ITEM_TEXT,
                children: [{ text: '' }],
            }],
        }],
    }];

    expect(convertXmlToSlate(input)).toStrictEqual(output);
});

test('<subart> to <ol><li>', () => {
    const input = `
        <subart></subart>
    `;
    const output: Descendant[] = [{
        type: Type.ORDERED_LIST,
        children: [{
            type: Type.LIST_ITEM,
            children: [{
                type: Type.LIST_ITEM_TEXT,
                children: [{ text: '' }],
            }],
        }],
    }];

    expect(convertXmlToSlate(input)).toStrictEqual(output);
});

test('<paragraph> to <ol><li>', () => {
    const input = `
        <paragraph></paragraph>
    `;
    const output: Descendant[] = [{
        type: Type.ORDERED_LIST,
        children: [{
            type: Type.LIST_ITEM,
            children: [{
                type: Type.LIST_ITEM_TEXT,
                children: [{ text: '' }],
            }],
        }],
    }];

    expect(convertXmlToSlate(input)).toStrictEqual(output);
});

test('<paragraph><sen><sen> to <ol><li><p>', () => {
    const input = `
        <paragraph>
            <sen>one.</sen>
            <sen>two.</sen>
        </paragraph>
    `;
    const output: Descendant[] = [{
        type: Type.ORDERED_LIST,
        children: [{
            type: Type.LIST_ITEM,
            children: [{
                type: Type.LIST_ITEM_TEXT,
                children: [{ text: 'one. two.' }],
            }],
        }],
    }];

    expect(convertXmlToSlate(input)).toStrictEqual(output);
});

test('full structure', () => {
    const input = `
        <law>
            <chapter nr="1" nr-type="roman" roman-nr="I">
                <nr-title>I.</nr-title>
                <art>
                    <nr-title>1. gr.</nr-title>
                    <subart>
                        <paragraph>
                            <sen>one.</sen>
                            <sen>two.</sen>
                        </paragraph>
                    </subart>
                </art>
                <art>
                    <nr-title>2. gr.</nr-title>
                    <subart>
                        <paragraph>
                            <sen>one.</sen>
                            <sen>two.</sen>
                        </paragraph>
                    </subart>
                </art>
            </chapter>
        </law>
    `;
    const output: Descendant[] = [{
        type: Type.ORDERED_LIST,
        listType: 'I',
        children: [{
            type: Type.LIST_ITEM,
            children: [{
                type: Type.LIST_ITEM_TEXT,
                children: [{ text: '' }],
            }, {
                type: Type.ORDERED_LIST,
                children: [{
                    type: Type.LIST_ITEM,
                    children: [{
                        type: Type.LIST_ITEM_TEXT,
                        children: [{ text: '' }],
                    }, {
                        type: Type.ORDERED_LIST,
                        children: [{
                            type: Type.LIST_ITEM,
                            children: [{
                                type: Type.LIST_ITEM_TEXT,
                                children: [{ text: '' }],
                            }, {
                                type: Type.ORDERED_LIST,
                                children: [{
                                    type: Type.LIST_ITEM,
                                    children: [{
                                        type: Type.LIST_ITEM_TEXT,
                                        children: [{ text: 'one. two.' }],
                                    }],
                                }],
                            }],
                        }],
                    }],
                }, {
                    type: Type.LIST_ITEM,
                    children: [{
                        type: Type.LIST_ITEM_TEXT,
                        children: [{ text: '' }],
                    }, {
                        type: Type.ORDERED_LIST,
                        children: [{
                            type: Type.LIST_ITEM,
                            children: [{
                                type: Type.LIST_ITEM_TEXT,
                                children: [{ text: '' }],
                            }, {
                                type: Type.ORDERED_LIST,
                                children: [{
                                    type: Type.LIST_ITEM,
                                    children: [{
                                        type: Type.LIST_ITEM_TEXT,
                                        children: [{ text: 'one. two.' }],
                                    }],
                                }],
                            }],
                        }],
                    }],
                }],
            }],
        }],
    }]

    expect(convertXmlToSlate(input)).toStrictEqual(output);
});
