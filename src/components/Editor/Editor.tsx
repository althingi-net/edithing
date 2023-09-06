import { FC, useEffect, useState } from "react";
import GithubFile from "../../models/GithubFile";
import downloadGitFile from "../../utils/downloadGitFile";
import { BaseEditor, Element, Descendant, createEditor } from "slate";
import { Editable, ReactEditor, RenderElementProps, Slate, withReact } from "slate-react";
import { HistoryEditor, withHistory } from "slate-history";
import { ListType, ListsSchema, onKeyDown, withLists } from '@prezly/slate-lists';
import convertXmlToChtml from "../../utils/convertXmlToChtml";


type CustomElement = { type: Type; children: Descendant[] }
type CustomText = { text: string }

type ListItem = { type: Type.LIST_ITEM; children: Descendant[], value: number }
type OrderedList = { type: Type.ORDERED_LIST; children: Descendant[], listType?: 'I' }

declare module 'slate' {
    interface CustomTypes {
        Editor: BaseEditor & ReactEditor & HistoryEditor
        Element: CustomElement | ListItem | OrderedList
        Text: CustomText
    }
}

enum Type {
    PARAGRAPH = 'paragraph',
    ORDERED_LIST = 'ordered-list',
    UNORDERED_LIST = 'unordered-list',
    LIST_ITEM = 'list-item',
    LIST_ITEM_TEXT = 'list-item-text',
}

const initialValue: Descendant[] = [
    {
        type: Type.ORDERED_LIST,
        listType: 'I',
        children: [
            {
                type: Type.LIST_ITEM,
                value: 1,
                children: [
                    { type: Type.LIST_ITEM_TEXT, children: [{ text: ' ' }] },
                    {
                        type: Type.ORDERED_LIST,
                        children: [
                            {
                                type: Type.LIST_ITEM,
                                value: 1,
                                children: [
                                    { type: Type.LIST_ITEM_TEXT, children: [{ text: ' ' }] },
                                    {
                                        type: Type.ORDERED_LIST,
                                        children: [
                                            {
                                                type: Type.LIST_ITEM,
                                                value: 1,
                                                children: [
                                                    { type: Type.LIST_ITEM_TEXT, children: [{ text: ' ' }] },
                                                    {
                                                        type: Type.ORDERED_LIST,
                                                        children: [
                                                            {
                                                                type: Type.LIST_ITEM,
                                                                value: 1,
                                                                children: [{ type: Type.LIST_ITEM_TEXT, children: [{ text: 'Sentence one.' }, { text: 'Sentence two.' }] }],
                                                            },
                                                        ],
                                                    },
                                                    
                                                ],
                                            },
                                        ],
                                    },
                                    
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },
];

const schema: ListsSchema = {
    isConvertibleToListTextNode(node) {
        return Element.isElementType(node, Type.PARAGRAPH);
    },
    isDefaultTextNode(node) {
        return Element.isElementType(node, Type.PARAGRAPH);
    },
    isListNode(node, type) {
        if (type === ListType.ORDERED) {
            return Element.isElementType(node, Type.ORDERED_LIST);
        }
        if (type === ListType.UNORDERED) {
            return Element.isElementType(node, Type.UNORDERED_LIST);
        }
        return (
            Element.isElementType(node, Type.ORDERED_LIST) ||
            Element.isElementType(node, Type.UNORDERED_LIST)
        );
    },
    isListItemNode(node) {
        return Element.isElementType(node, Type.LIST_ITEM);
    },
    isListItemTextNode(node) {
        return Element.isElementType(node, Type.LIST_ITEM_TEXT);
    },
    createDefaultTextNode(props = {}) {
        return { children: [{ text: '' }], ...props, type: Type.PARAGRAPH };
    },
    createListNode(type = ListType.UNORDERED, props = {}) {
        console.log('createListNode', type, props)
        const nodeType = type === ListType.ORDERED ? Type.ORDERED_LIST : Type.UNORDERED_LIST;
        return { children: [{ text: '' }], ...props, type: nodeType };
    },
    createListItemNode(props = {}) {
        console.log('createListItemNode', props)
        return { children: [{ text: '' }], ...props, type: Type.LIST_ITEM };
    },
    createListItemTextNode(props = {}) {
        console.log('createListItemTextNode', props)
        return { children: [{ text: '' }], ...props, type: Type.LIST_ITEM_TEXT };
    },
};

function renderElement({ element, attributes, children }: RenderElementProps) {
    console.log('renderElement', { element, attributes, children })
    switch (element.type) {
        case Type.ORDERED_LIST:
            // @ts-ignore
            return <ol type={element.listType} {...attributes}>{children}</ol>;
        case Type.UNORDERED_LIST:
            return <ul {...attributes}>{children}</ul>;
        case Type.LIST_ITEM:
            // @ts-ignore
            return <li value={element.value} {...attributes}>{children}</li>;
        case Type.LIST_ITEM_TEXT:
            return <div {...attributes}>{children}</div>;
        case Type.PARAGRAPH:
        default:
            return <p {...attributes}>{children}</p>;
    }
}

interface Props {
    file: GithubFile;
}


const BLOCK_TAGS = {
    blockquote: 'quote',
    p: 'paragraph',
    pre: 'code',
}



const Editor: FC<Props> = ({ file }) => {
    console.log("Render Editor");
    const [editor] = useState(() => withLists(schema)(withHistory(withReact(createEditor()))))
    const [content, setContent] = useState('');
    const [value, setValue] = useState<Descendant[]>(initialValue);

    useEffect(() => {
        downloadGitFile(file).then(setContent);
    }, [file]);

    useEffect(() => {
        // console.log("content", content);
        // setValue(html.deserialize(convertXmlToChtml(content)));
    }, [content]);

    useEffect(() => {
        console.log("value", value);
    }, [value]);

    return (
        <div style={{ textAlign: 'left' }}>
            <Slate editor={editor} initialValue={value} onChange={setValue}>
                <Editable
                    onKeyDown={(event) => onKeyDown(editor, event)}
                    renderElement={renderElement}
                />
            </Slate>
        </div>
    )
}

export default Editor;
