import { Node } from "slate";
import { ElementType, MetaType } from "../components/Editor/Slate";
import minify from "minify-xml";
import convertSlateToXml from "./convertSlateToXml";

test('convert chapters', () => {
    const input: Node = {
        type: ElementType.ORDERED_LIST,
        meta: {
            type: 'chapter',
            nrType: 'roman',
        },
        children: [{
            type: ElementType.LIST_ITEM,
            meta: {
                type: MetaType.CHAPTER,
                nr: '1',
                nrType: 'roman',
                romanNr: 'I',
            },
            children: [{
                type: ElementType.LIST_ITEM_TEXT,
                children: [{ text: 'I.' }],
            }],
        }, {
            type: ElementType.LIST_ITEM,
            meta: {
                type: MetaType.CHAPTER,
                nr: '2',
                nrType: 'roman',
                romanNr: 'II',
            },
            children: [{
                type: ElementType.LIST_ITEM_TEXT,
                children: [{ text: 'II.' }],
            }],
        }],
    };
    const output = `
        <chapter nr="1" nr-type="roman" roman-nr="I">
            <nr-title>I.</nr-title>
        </chapter>
        <chapter nr="2" nr-type="roman" roman-nr="II">
            <nr-title>II.</nr-title>
        </chapter>
    `

    expect(minify(convertSlateToXml(input))).toBe(minify(output));
});