/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';
import { FC, useState } from 'react';
import { AutoTextArea } from 'react-textarea-auto-witdth-height';
import './EditorNode.css';
import { FlattenedNode } from './EditorState';
import { useEditorState } from './EditorStateContext';

interface Props {
    nodeId: FlattenedNode['id'];
}

const FlatEditorNode: FC<Props> = ({ nodeId }) => {
    const { schema, config, nodes, addSibling } = useEditorState();
    const node = nodes.byId[nodeId];
    console.log('FlatEditorNode', node);

    const { id, type, text, descendants, attributes } = node;
    const cssClasses = ['node', type];
    const [inputRef, setInputRef] = useState<HTMLTextAreaElement | null>(null);
    const [value, setValue] = useState<string>(text || '');
    const hasDescendants = descendants && descendants.length > 0;

    // Set schema config for node type
    if (type in schema) {
        Object.entries(schema[type]).forEach(([key, value]) => {
            if (typeof value === 'boolean' && value) {
                cssClasses.push(key);
            } else {
                cssClasses.push(`${key}-${value}`);
            }
        });
    }

    // Set global config for node
    Object.entries(config).forEach(([key, value]) => {
        if (typeof value === 'boolean' && value) {
            cssClasses.push(key);
        }
    });

    // Render child nodes
    const nested = hasDescendants && (
        <div className='children' onClick={(event) => event.stopPropagation()}>
            {descendants.map((childId) => <FlatEditorNode
                key={childId}
                nodeId={childId}
            />)}
        </div>
    );

    // Render text field
    let textField = text && !hasDescendants && <div className='text'>{text}</div>;
    if (config.editable && !hasDescendants) {
        textField = (
            <AutoTextArea
                className="text"
                placeholder={type}
                value={value}
                onChange={(event) => setValue(event.target.value)}
                ref={setInputRef}
            />
        );
    }

    // Render edit menu
    const menu = config.editable && config.editMenu && (
        <div className='menu' onClick={(event) => event.stopPropagation()}>
            <span className='node-type'>{type}</span>
            <Button size='small' onClick={() => console.log('Delete')}><DeleteOutlined /></Button>
            {Object.entries(attributes ?? []).map(([key, value]) => 
                <Input
                    size='small'
                    addonBefore={key}
                    key={key}
                    value={value}
                    style={{ width: 'auto' }}
                />
            )}
            <Button
                className='add-attribute-button'
                size='small'
                onClick={() => console.log('Add')}
            >
                <PlusOutlined />
            </Button>
        </div>
    );

    // Render add sibling button
    const addButton = config.editable && config.editMenu && (
        <Button
            size='small'
            className='add-button'
            onClick={() => addSibling(nodeId)}
        >
            <PlusOutlined />
        </Button>
    );

    return (
        <>
            <div
                className={cssClasses.join(' ')}
                data-id={id}
                data-type={type}
                onClick={() => inputRef?.focus()}
            >
                {menu}
                {textField}
                {nested}
            </div>
            {addButton}
        </>
    );
};

export default FlatEditorNode;