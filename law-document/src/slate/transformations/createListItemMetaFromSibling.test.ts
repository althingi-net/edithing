import { MetaType } from '../Slate';
import { createListItem } from './createListItem';
import { createListItemMetaFromSibling } from './createListItemMetaFromSibling';

test('copy and increase nr', () => {
    const sibling = createListItem(MetaType.CHAPTER, '1');
    const node = createListItem(MetaType.CHAPTER, '2');

    expect(createListItemMetaFromSibling(sibling)).toEqual(node.meta);
});

test('copy and increase roman title', () => {
    const sibling = createListItem(MetaType.CHAPTER, '1', { title: 'I. kafli.' });
    const node = createListItem(MetaType.CHAPTER, '2', { title: 'II. kafli.' });

    expect(createListItemMetaFromSibling(sibling)).toEqual(node.meta);
});

test('copy and increase number title', () => {
    const sibling = createListItem(MetaType.ART, '1', { title: '1. gr.', nrType: 'numeric' });
    const node = createListItem(MetaType.ART, '2', { title: '2. gr.', nrType: 'numeric' });

    expect(createListItemMetaFromSibling(sibling)).toEqual(node.meta);
});

test('copy and increase alphabet title', () => {
    const sibling = createListItem(MetaType.NUMART, 'a', { title: 'a. gr.', nrType: 'alphabet' });
    const node = createListItem(MetaType.NUMART, 'b', { title: 'b. gr.', nrType: 'alphabet' });

    expect(createListItemMetaFromSibling(sibling)).toEqual(node.meta);
});

test('copy and increase mixed number title', () => {
    const sibling = createListItem(MetaType.ART, '1a', { title: '1a. gr.' });
    const node = createListItem(MetaType.ART, '1b', { title: '1b. gr.' });

    expect(createListItemMetaFromSibling(sibling)).toEqual(node.meta);
});

test('copy styleNote', () => {
    const sibling = createListItem(MetaType.NUMART, '1', { styleNote: 'inline-with-parent' });
    const node = createListItem(MetaType.NUMART, '2', { styleNote: 'inline-with-parent' });

    expect(createListItemMetaFromSibling(sibling)).toEqual(node.meta);
});
