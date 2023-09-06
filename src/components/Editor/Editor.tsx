import { onKeyDown, withLists } from '@prezly/slate-lists';
import { FC, useEffect, useState } from "react";
import { Descendant, createEditor } from "slate";
import { withHistory } from "slate-history";
import { Editable, Slate, withReact } from "slate-react";
import GithubFile from "../../models/GithubFile";
import downloadGitFile from "../../utils/downloadGitFile";
import { Type, renderElement, schema } from "./Slate";
import convertXmlToSlate from '../../utils/convertXmlToSlate';

const initialValue: Descendant[] = [
    {
        type: Type.ORDERED_LIST,
        listType: 'I',
        children: [
            {
                type: Type.LIST_ITEM,
                listItemValue: 1,
                children: [
                    { type: Type.LIST_ITEM_TEXT, children: [{ text: ' ' }] },
                    {
                        type: Type.ORDERED_LIST,
                        children: [
                            {
                                type: Type.LIST_ITEM,
                                listItemValue: 1,
                                children: [
                                    { type: Type.LIST_ITEM_TEXT, children: [{ text: ' ' }] },
                                    {
                                        type: Type.ORDERED_LIST,
                                        children: [
                                            {
                                                type: Type.LIST_ITEM,
                                                listItemValue: 1,
                                                children: [
                                                    { type: Type.LIST_ITEM_TEXT, children: [{ text: ' ' }] },
                                                    {
                                                        type: Type.ORDERED_LIST,
                                                        children: [
                                                            {
                                                                type: Type.LIST_ITEM,
                                                                listItemValue: 1,
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

interface Props {
    file: GithubFile;
}

const Editor: FC<Props> = ({ file }) => {
    console.log("Render Editor");
    const [editor] = useState(() => withLists(schema)(withHistory(withReact(createEditor()))))
    const [value, setValue] = useState<Descendant[] | null>(null);

    useEffect(() => {
        downloadGitFile(file).then((file) => {
            console.log("file", file)
            setValue(convertXmlToSlate(file))
        });
    }, [file]);

    useEffect(() => {
        console.log("value", value);
    }, [value]);

    if (!value) {
        return null;
    }

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
