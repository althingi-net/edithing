import { createEditorWithPlugins, createList, createListItem, LawEditor, LawElement, MetaType, SlateFragment, TextNode } from 'law-document';
import React, { FC, useMemo, useState } from 'react';
import { Editable, Slate, withReact } from 'slate-react';


declare module 'slate' {
    interface CustomTypes {
        Editor: LawEditor;
        Element: LawElement;
        Text: TextNode;
    }
}

const createEditor = () => {
    const editor = withReact(createEditorWithPlugins());

    return editor;
};

interface Props {
    slate: SlateFragment;
    originalDocument: SlateFragment;
    xml: string;
    readOnly?: boolean;
    // saveDocument?: (editor: LawEditor) => void;
    // bill?: Bill;
}

export const Editor: FC<Props> = (props) => {
    const editor = useMemo(() => createEditor(), []);
    const [value, setValue] = useState<SlateFragment>([
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'I. kafli.', text: 'the first chapter' }),
            createListItem(MetaType.CHAPTER, '2', { title: 'II. kafli.', text: 'the second chapter', originNr: '3' }),
        ]),
    ]);

    return (
        <Slate editor={editor} initialValue={value} onChange={newValue => setValue(newValue as SlateFragment)}>
            <div>
                <Editable />
            </div>
        </Slate>
    );
};