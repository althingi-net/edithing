import { onKeyDown, withLists } from '@prezly/slate-lists';
import { Button } from 'antd';
import { FC, useEffect, useState } from "react";
import { Descendant, createEditor } from "slate";
import { withHistory } from "slate-history";
import { Editable, Slate, withReact } from "slate-react";
import GithubFile from "../../models/GithubFile";
import convertSlateToXml from '../../utils/convertSlateToXml';
import convertXmlToSlate from '../../utils/convertXmlToSlate';
import downloadGitFile from "../../utils/downloadGitFile";
import { renderElement, schema } from "./Slate";
// import compareDocuments from '../../utils/compareDocuments';

interface Props {
    file: GithubFile;
}

const Editor: FC<Props> = ({ file }) => {
    console.log("Render Editor");
    const [editor] = useState(() => withLists(schema)(withHistory(withReact(createEditor()))))
    // const [originalDocument, setOriginalDocument] = useState<string>('');
    const [value, setValue] = useState<Descendant[] | null>(null);

    useEffect(() => {
        downloadGitFile(file.path).then((content) => {
            console.log("file", content)
            // setOriginalDocument(content)
            setValue(convertXmlToSlate(content))
        });
    }, [file]);

    useEffect(() => {
        console.log("value", value);
    }, [value]);

    if (!value) {
        return null;
    }

    return (
        <>
            <Button onClick={() => console.log('new xml', convertSlateToXml(editor))}>Print XML</Button>
            {/* <Button onClick={() => console.log('changes', compareDocuments(editor, originalDocument))}>Compare XML</Button> */}
            <div style={{ textAlign: 'left' }}>
                <Slate editor={editor} initialValue={value} onChange={setValue}>
                    <Editable
                        onKeyDown={(event) => onKeyDown(editor, event)}
                        renderElement={renderElement}
                    />
                </Slate>
            </div>
        </>
    )
}

export default Editor;
