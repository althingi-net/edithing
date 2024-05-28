/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';
import { ChangeEvent, FC, useCallback, useEffect, useMemo, useState } from 'react';
import { AutoTextArea } from 'react-textarea-auto-witdth-height';
import { useStore } from 'zustand';
import './EditorNode.css';
import { FlattenedNode } from './EditorState';
import { useEditorState } from './EditorStateContext';

interface Props {
    nodeId: FlattenedNode['id'];
}

const FlatEditorNode: FC<Props> = ({ nodeId }) => {
    const { store, addSibling, updateNodeText } = useEditorState();
    const config = useStore(store, (state) => state.config);
    const schema = useStore(store, (state) => state.schema);
    const node = useStore(store, (state) => state.nodes.byId[nodeId]);
    const { id, type, text, descendants, attributes } = node;
    const [autoFocus, setAutoFocus] = useState(false);
    
    const cssClasses = ['node', type];
    const [inputRef, setInputRef] = useState<HTMLTextAreaElement | null>(null);
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
    const nested = useMemo(() => hasDescendants && (
        <div className='children' onClick={(event) => event.stopPropagation()}>
            {descendants.map((childId) => <FlatEditorNode
                key={childId}
                nodeId={childId}
            />)}
        </div>
    ), [descendants, hasDescendants]);

    // Render text field
    const handleInputChange = useCallback((event: ChangeEvent<HTMLTextAreaElement>) => { 
        const text = event.target.value;
        updateNodeText(nodeId, text);
    }, [nodeId, updateNodeText]);


    let textField = text && !hasDescendants && <div className='text'>{text}</div>;
    if (config.editable && !hasDescendants) {
        textField = (
            <AutoTextArea
                className="text"
                placeholder={type}
                value={text}
                onChange={handleInputChange}
                ref={setInputRef}
            />
        );
    }

    useEffect(() => {
        if (inputRef) {
            if (autoFocus) {
                inputRef.focus();
            }

            if (text && !autoFocus) {
                setAutoFocus(true);
            }
        }
    // ignore change of autoFocus
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputRef, text]);

    // Render edit menu
    const menu = useMemo(() => config.editable && config.editMenu && (
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
    ), [attributes, config.editMenu, config.editable, type]);

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