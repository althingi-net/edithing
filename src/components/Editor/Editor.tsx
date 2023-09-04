import { FC, useState } from "react";
import ReactQuill from "react-quill";

const Editor: FC = () => {

  const [value, setValue] = useState('');

  return <ReactQuill theme="snow" value={value} onChange={setValue} />
}

export default Editor;