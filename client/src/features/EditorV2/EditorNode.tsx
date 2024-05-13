/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { FC, useState } from 'react';
import { AutoTextArea } from 'react-textarea-auto-witdth-height';
import './EditorNode.css';
import { Button, Input } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

interface Node {
    id: string;
    type: string;
    text?: string;
    children?: Node[];
    attributes?: Record<string, string>;
}

interface Schema {
    [type: string]: {
        inline?: boolean;
        paragraph?: boolean;
        nestable?: boolean;
    };
}

interface Config {
    debug?: boolean;
    editable?: boolean;
    editMenu?: boolean;
}

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
            {Object.entries(attributes ?? []).map(([key, value]) => 
                <Input
                    addonBefore={key}
                    key={key}
                    value={value}
                    style={{ width: 'auto' }}
                />
            )}
            <Button size='small' onClick={() => console.log('Delete')}><DeleteOutlined /></Button>
        </div>
    );

    return (
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
    );
};

export default EditorNode;