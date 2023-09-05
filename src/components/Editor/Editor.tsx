import { FC, createRef, useEffect, useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import downloadGitFile from "../../utils/downloadGitFile";
import GithubFile from "../../models/GithubFile";
import { Button } from "antd";

interface Props {
    file: GithubFile;
}

interface ParagraphValue {
    nr: string;
}

const Block = Quill.import('blots/block');
class Paragraph extends Block {
    static create(value: ParagraphValue) {
        console.log("Paragraph.create", value)
        let node = super.create();
        node.setAttribute('nr', value.nr);
        return node;
    }

    static value(node: { getAttribute: (arg0: string) => any; }) {
        return {
            nr: node.getAttribute('nr'),
        };
    }
}
Paragraph.blotName = 'pdaf';
Paragraph.tagName = 'pdaf';
Quill.register(Paragraph);

const Editor: FC<Props> = ({ file }) => {
    console.log("Render Editor");
    const editorRef = createRef<ReactQuill>();
    const [content, setContent] = useState('');
    const [value, setValue] = useState('<pdaf nr="1">test</pdaf>');

    useEffect(() => {
        downloadGitFile(file).then(setContent);
    }, [file]);

    useEffect(() => {
        // console.log("content", content);
        // setValue(convertXmlToHtml(content));
    }, [content]);

    useEffect(() => {
        console.log("value", value);
    }, [value]);

    return (
        <>
            <Button onClick={() => editorRef.current?.editor?.format('pdaf', { nr: '1' })}>Add Paragraph</Button>
            <ReactQuill
                ref={editorRef}
                theme="snow"
                value={value}
                onChange={setValue}
            />
        </>
    )
}

export default Editor;