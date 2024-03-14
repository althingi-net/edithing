import { Descendant } from 'slate';
import { MetaType } from './Slate';
import { createEmptyDocumentMeta } from './transformations/createDocumentMeta';
import { createList } from './transformations/createList';
import { createListItem } from './transformations/createListItem';
import { validateDocument } from './validateDocument';

test('valid document', () => {
    const slate = [
        createEmptyDocumentMeta(),
        createList(MetaType.ART, {}, [
            createListItem(MetaType.ART, '1', { text: 'First item' }),   
        ])
    ];
    expect(validateDocument(slate)).toBe(true);
});

test('empty document', () => {
    const slate: Descendant[] = [];
    expect(validateDocument(slate)).toBe(true);
});

test('invalid nr attribute', () => {
    const slate = [
        createEmptyDocumentMeta(),
        createList(MetaType.ART, {}, [
            createListItem(MetaType.ART, 'Ákvæði til bráðabirgða', { text: 'First item' }),   
        ])
    ];

    expect(() => validateDocument(slate)).toThrow(/Element is not valid/);
});