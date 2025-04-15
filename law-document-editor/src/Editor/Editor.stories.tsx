/* eslint-disable import/no-default-export */
import type { Meta, StoryObj } from '@storybook/react';
import { SlateFragment } from 'law-document';
import React, { FC, useEffect, useMemo } from 'react';
import { Descendant, Element, Text, createEditor } from 'slate';
import { withHistory } from 'slate-history';
import { Editable, RenderElementProps, RenderLeafProps, Slate } from 'slate-react';

/************
 * COPY & PASTE OF law-documents, because of issue with vite not bundling law-documents correctly
 ************/



interface Props {
    slate: SlateFragment;
    readOnly?: boolean;
}

const Editor: FC<Props> = ({
    slate,
    readOnly,
}) => {
    const editor = useMemo(() => withHistory(createEditor()), []);

    useEffect(() => {
        editor.children = slate;
        editor.onChange();
    }, [slate, editor]);

    const classNames = [
        'editor',
    ].join(' ');

    return (
        <Slate editor={editor} initialValue={slate}>
            <Editable
                className={classNames}
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                readOnly={readOnly}
            />
        </Slate>
    );
};
enum ElementType {
    DOCUMENT_META = 'document-meta',
    PARAGRAPH = 'paragraph',
    LIST = 'list',
    LIST_ITEM = 'list-item',
    LIST_ITEM_TEXT = 'list-item-text',
}

enum MetaType {
    CHAPTER = 'chapter',
    ART = 'art',
    SUBART = 'subart',
    PARAGRAPH = 'paragraph',
    NUMART = 'numart',
    SEN = 'sen',
}

interface ListItemText {
    type: ElementType.LIST_ITEM_TEXT;
    children: Text[];
}

interface List {
    type: ElementType.LIST;
    children: SlateFragment;
    meta?: ListMeta;
}

interface ListMeta {
    type: MetaType;
    nrType?: 'roman' | 'numeric' | 'alphabet'; // roman, numeric, alphabet, mixed
}

interface ListWithMeta extends List {
    meta: ListMeta;
}

const renderLeaf = ({ attributes, children, leaf }: RenderLeafProps) => {
    if (leaf.title) {
        return <span {...attributes} className="title">{children}</span>;
    }

    if (leaf.name) {
        return <span {...attributes} className="name">{children}</span>;
    }

    if (leaf.bold) {
        return <span {...attributes} className="bold">{children}</span>;
    }

    return <span {...attributes}>{children}</span>;
};

function renderElement({ element, attributes, children }: RenderElementProps) {
    const className = [
        element.type,
        hasMetaType(element) ? element.meta.type : '',
    ].join(' ');

    if (isListItem(element)) {
        const config = element.meta ? TAGS[element.meta.type] : null;

        if (config) {
            if (config.display === 'inline' || element.meta?.styleNote === 'inline-with-parent') {
                return <span className={className} {...attributes}>{children}</span>;
            }

            if (config.display === 'block') {
                return <div className={className} {...attributes}>{children}</div>;
            }
        }
    }

    switch (element.type as ElementType) {
    case ElementType.LIST:
        return <ul className={className} {...attributes}>{children}</ul>;
    case ElementType.LIST_ITEM:
        return <li className={className} {...attributes}>{children}</li>;
    case ElementType.LIST_ITEM_TEXT:
        return <span className={className} {...attributes}>{children}</span>;
    // case ElementType.PARAGRAPH:
    default:
        return <span className={className} {...attributes}>{children}</span>;
    }
}


interface TagConfig {
    type: string;
    isList: boolean;
    hasTitle?: boolean;
    hasName?: boolean;
    defaultTitle?: string;
    canHave: MetaType[];
    display?: 'list' | 'block' | 'inline';
}

const TAGS: { [key in MetaType]: TagConfig } = {
    [MetaType.CHAPTER]: {
        type: MetaType.CHAPTER,
        isList: true,
        hasTitle: true,
        hasName: true,
        defaultTitle: 'I. kafli. ',
        display: 'list',
        canHave: [MetaType.ART],
    },
    [MetaType.ART]: {
        type: MetaType.ART,
        isList: true,
        hasTitle: true,
        hasName: true,
        defaultTitle: '1. gr. ',
        display: 'list',
        canHave: [MetaType.SUBART, MetaType.NUMART],
    },
    [MetaType.SUBART]: {
        type: MetaType.SUBART,
        isList: true,
        display: 'list',
        canHave: [MetaType.PARAGRAPH],
    },
    [MetaType.NUMART]: {
        type: MetaType.NUMART,
        isList: true,
        display: 'list',
        canHave: [MetaType.PARAGRAPH, MetaType.SEN, MetaType.NUMART],
    },
    [MetaType.PARAGRAPH]: {
        type: MetaType.PARAGRAPH,
        isList: true,
        display: 'list',
        canHave: [MetaType.SEN, MetaType.NUMART],
    },
    [MetaType.SEN]: {
        type: MetaType.SEN,
        isList: false,
        display: 'inline',
        canHave: [],
    },
};

interface ListItem {
    type: ElementType.LIST_ITEM;
    children: SlateFragment;
    meta?: ListItemMeta;
}

interface ListItemWithMeta extends ListItem {
    meta: ListItemMeta;
}

interface ListItemMeta extends ListMeta {
    /** LawParagraph tag */
    type: MetaType;

    /** List Item Number. See nrType */
    nr: string;

    /** Nr at import or when first created, used by compareDocuments() to find the original paragraphId */
    originNr: string;

    nrType?: 'roman' | 'numeric' | 'alphabet'; // roman, numeric, alphabet, mixed. By default empty (which means numeric)

    /** Only set when nrType=roman, should always have the numeric value of nr */
    romanNr?: string;

    /** Determines if the listItemText node should contain a title node */
    title?: boolean;

    /** Determines if the listItemText node should contain a name node */
    name?: boolean;

    /** Defines display style of this node */
    styleNote?: string; // inline-with-parent
}

const isListItem = (node?: any): node is ListItem => {
    return Element.isElementType(node, ElementType.LIST_ITEM);
};

const hasMetaType = (element: any): element is { meta: { type: string } } => {
    return 'meta' in element && element.meta && 'type' in element.meta;
};


interface createListOptions {
    nrType?: 'roman' | 'numeric' | 'alphabet';
}

const createList = (type: MetaType, options: createListOptions = {}, children: SlateFragment = []): List => {
    const { nrType } = options;

    const list: ListWithMeta = {
        type: ElementType.LIST,
        meta: {
            type: type,
        },
        children,
    };

    if (type === MetaType.CHAPTER) {
        list.meta.nrType = 'roman';
    }

    if (nrType) {
        list.meta.nrType = nrType;
    }

    return list;
};


interface createListItemOptions extends Omit<ListItemMeta, 'nr' | 'originNr' | 'type' | 'title' | 'name'> {
    text?: string | string[];
    title?: string | boolean;
    name?: string | boolean;
    originNr?: string;
}

const convertRomanNumber = (value: string | number): string => {
    return String(value);
};

/**
 * Create a list item with the given meta type, number and text.
 * 
 * @param type The meta type of the list item.
 * @param nr The number of the list item. (starts at 1, can be digit, letter, roman number, digit+letter)
 */
const createListItem = (type: MetaType, nr: string, options: createListItemOptions = {}, children: SlateFragment = []): ListItemWithMeta => {
    const { title, name, text, nrType, styleNote, romanNr, originNr } = options;

    const textElement: ListItemText = createListItemText();
    
    const listItem: ListItemWithMeta = {
        type: ElementType.LIST_ITEM,
        meta: {
            type: type,
            nr,
            originNr: originNr ?? nr,
        },
        children: [
            textElement,
            ...children
        ],
    };

    if (name != null && name !== false) {
        listItem.meta.name = true;

        if (typeof name === 'string') {
            textElement.children.unshift({ text: name, name: true });
        }
    }

    if (title != null && title !== false) {
        listItem.meta.title = true;

        if (typeof title === 'string') {
            textElement.children.unshift({ text: title, title: true });
        }
    }

    if (nrType) {
        listItem.meta.nrType = nrType;
    }

    if (styleNote) {
        listItem.meta.styleNote = styleNote;
    }

    if (text != null) {
        if (Array.isArray(text)) {
            textElement.children.push(...text.map((text, index) => ({ text, nr: `${index + 1}` })));
        } else {
            textElement.children.push({ text, nr: '1' });
        }
    } else {
        textElement.children.push({ text: '' });
    }

    // remove empty text nodes but keep at least one 
    textElement.children = textElement.children.filter((item => item.text !== ''));

    if (textElement.children.length === 0) {
        textElement.children.push({ text: '', nr: '1' });
    }

    if (type === MetaType.CHAPTER) {
        listItem.meta.nrType = 'roman';
        listItem.meta.romanNr = romanNr ?? convertRomanNumber(nr);
    }

    if (type === MetaType.NUMART && !nrType) {
        listItem.meta.nrType = 'numeric';
    }

    return listItem;
};

const createListItemText = (children: Text[] = [{ text: '' }]) => {
    const textElement: ListItemText = {
        type: ElementType.LIST_ITEM_TEXT,
        children,
    };

    return textElement;
};

/************
 * COPY & PASTE --- END
 ************/


const createV1BenchmarkSample = (): SlateFragment => {
    const nodes: SlateFragment = [];
    const count = 5;

    for (let c = 0; c < count; c++) {
        nodes.push(
            createList(MetaType.CHAPTER, {}, [
                createListItem(MetaType.CHAPTER, `${c + 1}`, {}, [
                    ...Array.from<SlateFragment, Descendant>({ length: count }, (_, art) => (
                        createList(MetaType.ART, {}, [
                            createListItem(MetaType.ART, `${art + 1}`, {}, [
                                ...Array.from<SlateFragment, Descendant>({ length: count }, (_, subart) => (
                                    createList(MetaType.SUBART, {}, [
                                        createListItem(MetaType.SUBART, `${subart + 1}`, {}, [
                                            ...Array.from<SlateFragment, Descendant>({ length: count }, (_, sen) => (
                                                createList(MetaType.SEN, {}, [
                                                    createListItem(MetaType.SEN, `${sen + 1}`, { text: 'Lög þessi gilda um uppbyggingu og rekstur flugvalla í eigu íslenska ríkisins og þá rekstrarstjórnun flugumferðar/flugleiðsöguþjónustu sem veitt er af hálfu íslenska ríkisins á íslensku yfirráðasvæði eða á grundvelli alþjóðlegra skuldbindinga' }),
                                                ])
                                            ))
                                        ]),
                                    ])
                                ))
                            ]),
                        ])
                    ))
                ]),
            ]),
        );
    }

    return nodes;
};


const meta: Meta<typeof Editor> = {
    title: 'Editor/Editor',
    component: Editor,
    parameters: {
        deepControls: { enabled: true },
    },
};
    
export default meta;
type Story = StoryObj<typeof Editor>;
  
export const ReadOnly: Story = {
    args: {
        readOnly: true,
        slate: [
            createList(MetaType.CHAPTER, {}, [
                createListItem(MetaType.CHAPTER, '1', { title: 'I. kafli.', name: 'Markmið, gildissvið og orðskýringar.' }, [
                    createList(MetaType.SEN, {}, [
                        createListItem(MetaType.SEN, '1', { text: 'Lög þessi gilda um uppbyggingu og rekstur flugvalla í eigu íslenska ríkisins og þá rekstrarstjórnun flugumferðar/flugleiðsöguþjónustu sem veitt er af hálfu íslenska ríkisins á íslensku yfirráðasvæði eða á grundvelli alþjóðlegra skuldbindinga' }),
                        createListItem(MetaType.SEN, '2', { text: 'Opinbert hlutafélag, Isavia ohf. eða dótturfélög, annast fyrir hönd íslenska ríkisins rekstur flugvalla í eigu ríkisins og rekstrarstjórnun flugumferðar og flugleiðsöguþjónustu sem veitt er af hálfu ríkisins á íslensku yfirráðasvæði eða á grundvelli alþjóðlegra skuldbindinga eftir því sem kveðið er á um í lögum þessum.' }),
                    ])
                ]),
            ]),
        ],
    }
};
  
export const EditableEditor: Story = {
    args: {
        slate: [
            createList(MetaType.CHAPTER, {}, [
                createListItem(MetaType.CHAPTER, '1', { title: 'I. kafli.', name: 'Markmið, gildissvið og orðskýringar.' }, [
                    createList(MetaType.SEN, {}, [
                        createListItem(MetaType.SEN, '1', { text: 'Lög þessi gilda um uppbyggingu og rekstur flugvalla í eigu íslenska ríkisins og þá rekstrarstjórnun flugumferðar/flugleiðsöguþjónustu sem veitt er af hálfu íslenska ríkisins á íslensku yfirráðasvæði eða á grundvelli alþjóðlegra skuldbindinga' }),
                        createListItem(MetaType.SEN, '2', { text: 'Opinbert hlutafélag, Isavia ohf. eða dótturfélög, annast fyrir hönd íslenska ríkisins rekstur flugvalla í eigu ríkisins og rekstrarstjórnun flugumferðar og flugleiðsöguþjónustu sem veitt er af hálfu ríkisins á íslensku yfirráðasvæði eða á grundvelli alþjóðlegra skuldbindinga eftir því sem kveðið er á um í lögum þessum.' }),
                    ])
                ]),
            ]),
        ],
    }
};

export const BenchmarkEditor: Story = {
    tags: ['!autodocs'],
    args: {
        slate: createV1BenchmarkSample(),
    }
};
