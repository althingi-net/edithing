/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { FC, useState } from 'react';
import { AutoTextArea } from 'react-textarea-auto-witdth-height';
import './EditorNode.css';
import { Button, Input } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Node } from './Node';
import { Schema } from './Schema';
import { Config } from './Config';

interface Props {
    /** Content node representing an XML node */
    node: Node;
    /** Optional schema to restrict structure & content, modify display and control other features */
    schema?: Schema;
    /** Optional global configuration to control editor options */
    config?: Config;
}

const EditorNode: FC<Props> = ({ node, config, schema }) => {
    const { id, type, text, children, attributes } = node;
    const cssClasses = ['node', type];
    const [inputRef, setInputRef] = useState<HTMLTextAreaElement | null>(null);
    const [value, setValue] = useState<string>(text || '');

    // Set schema config for node type
    if (schema && type in schema) {
        Object.entries(schema[type]).forEach(([key, value]) => {
            if (typeof value === 'boolean' && value) {
                cssClasses.push(key);
            } 
    
            else {
                cssClasses.push(`${key}-${value}`);
            }
        });
    }

    // Set global config for node
    if (config) {
        Object.entries(config).forEach(([key, value]) => {
            if (typeof value === 'boolean' && value) {
                cssClasses.push(key);
            }
        });
    }

    const nested = children && (
        <div className='children' onClick={(event) => event.stopPropagation()}>
            {children.map((child) => <EditorNode
                key={child.id}
                node={child}
                schema={schema}
                config={config}
            />)}
        </div>
    );
    let textField = text && !children && <div className='text'>{text}</div>;

    if (config?.editable && !children) {
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

    const menu = config?.editable && config.editMenu && (
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

    const addButton = config?.editable && config.editMenu && (
        <Button
            size='small'
            className='add-button'
            onClick={() => console.log('Add')}
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

export default EditorNode;