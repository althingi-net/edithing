import { FC, useMemo } from 'react';
import EditorV2 from './EditorV2';
import { EditorStateContextProvider } from './EditorStateContext';
import parseXml from './parseXml';
import { Schema } from './Schema';

interface Props {
    xml: string;
}

const XmlEditor: FC<Props> = (props) => {
    const { xml } = props;
    const initialState = useMemo(() => ({
        nodes: parseXml(xml),
        config: {
            editable: true,
            editMenu: false,
            reduxDevTools: true,
            undoable: true,
        },
        schema: {
            title: {
                inline: true,
            },
            name: {
                inline: true,
            },
            sen: {
                inline: true,
            },
        } as Schema,
    }), [xml]);

    return (
        <EditorStateContextProvider initialState={initialState}>
            <EditorV2 />
        </EditorStateContextProvider>
    );
};


export default XmlEditor;