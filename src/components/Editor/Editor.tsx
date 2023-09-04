import { FC, useState } from "react";
import ReactQuill from "react-quill";
import { GithubFile } from "../../utils/getGitFiles";

interface Props {
    file: GithubFile;
}

const Editor: FC<Props> = ({ file }) => {

  const [value, setValue] = useState('');

  return <ReactQuill theme="snow" value={value} onChange={setValue} />
}

export default Editor;