import React, { useMemo, useState } from 'react';
import { createEditor, Descendant } from 'slate';
import { Editable, Slate, withReact } from 'slate-react';


export const Editor = () => {
    const editor = useMemo(() => withReact(createEditor()), []);
    const [value, setValue] = useState<Descendant[]>([
        {
            // type: 'paragraph',
            children: [{ text: 'A line of text in a paragraph.' }],
        },
    ]);

    return (
        <Slate editor={editor} initialValue={value} onChange={newValue => setValue(newValue)}>
            <div>
                <Editable />
            </div>
        </Slate>
    );
};