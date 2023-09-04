import { FC, SetStateAction, useEffect, useState } from "react";
import ReactQuill from "react-quill";
import { GithubFile } from "../../utils/getGitFiles";
import downloadGitFile from "../../utils/downloadGitFile";

interface Props {
    file: GithubFile;
}

const Editor: FC<Props> = ({ file }) => {
    console.log("Render Editor");
    const [content, setContent] = useState('');
    const [value, setValue] = useState('');

    // const handleChange = (value: SetStateAction<{ ops: never[]; }>, delta: any, source: any, editor: any) => {
    //     console.log("handleChange", value, delta, source, editor)
    //     setValue(editor.getContents());
    // }

    useEffect(() => {
        downloadGitFile(file).then(setContent);
    }, [file]);

    useEffect(() => {
        console.log("content", content);

    }, [content]);

    useEffect(() => {
        console.log("value", value);
    }, [value]);

    // @ts-ignore
    return <ReactQuill theme="snow" value={value} onChange={setValue} />
}

export default Editor;