import { createEditorWithPlugins, createList, createListItem, MetaType } from 'law-document';
import { Descendant } from 'slate';
import { getNodeByParagraphId } from './getNodeByParagraphId';


/**
 * Create empty root node, for testing purposes only. This would usually be an instance of Editor.
 * @param children 
 * @returns root node
 */
const wrapEditor = (children: Descendant[]) => {
    const editor = createEditorWithPlugins();
    editor.children = children;
    return editor;
};

test('chapter-2', () => {
    const id = `${MetaType.CHAPTER}-2`;
    const editor = wrapEditor([
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title:  'I.' }),
            createListItem(MetaType.CHAPTER, '2', { title:  'II.' }),
        ]),
    ]);

    expect(getNodeByParagraphId(editor, id)).toBe(editor.node([0, 1])[0]);
});

test('chapter-2.art-1', () => {
    const id = `${MetaType.CHAPTER}-2.${MetaType.ART}-1`;
    const editor = wrapEditor([
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title:  'I.' }),
            createListItem(MetaType.CHAPTER, '2', { title:  'II.' }, [
                createList(MetaType.ART, {}, [
                    createListItem(MetaType.ART, '1', { title:  '1.' }),
                ]),
            ]),
        ]),
    ]);

    const result = getNodeByParagraphId(editor, id);
    const expectedNode = editor.node([0, 1, 1, 0])[0];
    expect(result).toBe(expectedNode);
});