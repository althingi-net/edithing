import { Button, Tooltip } from 'antd';
import { FC, useEffect, useRef, useState } from 'react';
import { Range } from 'slate';
import { ReactEditor, useFocused, useSlate } from 'slate-react';
import Portal from '../../Portal';
import findListItemAtSelection from '../utils/slate/findListItemAtSelection';
import styles from './SideToolbar.module.css';
import { PlusOutlined } from '@ant-design/icons';
import AddEntryModal from './AddEntryModal';
import getMetaKey from '../utils/getMetaKey';
import isHotkey from 'is-hotkey';

const SideToolbar = () => {
    const ref = useRef<HTMLDivElement>(null);
    const editor = useSlate();
    const inFocus = useFocused();

    useEffect(() => {
        const el = ref.current;
        const { selection } = editor;
        const domSelection = window.getSelection();

        if (!el) {
            return;
        }

        if (
            !domSelection ||
            !selection ||
            !inFocus ||
            !Range.isCollapsed(selection)
        ) {
            el.removeAttribute('style');
            return;
        }

        const [listItem] = findListItemAtSelection(editor) ?? [];

        if (!listItem) {
            el.removeAttribute('style');
            return;
        }

        try {
            const domNode = ReactEditor.toDOMNode(editor, listItem);
            const rect = domNode.getBoundingClientRect();
    
            el.style.opacity = '1';
            el.style.top = `${rect.top + window.scrollY}px`;
            el.style.left = `${rect.left + window.scrollX - el.offsetWidth - 5}px`;
            el.style.height = `${rect.height}px`;
        } catch (error) {
            el.removeAttribute('style');
            return;
        }
    });

    return (
        <Portal>
            <div
                className={styles.toolbar}
                ref={ref}
                onMouseDown={e => {
                    // prevent toolbar from taking focus away from editor
                    e.preventDefault();
                }}
            >
                <AddEntryButton />
            </div>
        </Portal>
    );
};

const AddEntryButton: FC = () => {
    const [isOpen, setOpen] = useState(false);
    const metaKey = getMetaKey();

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (isHotkey(`${metaKey}+enter`)(event)) {
                setOpen(true);
            }
        };
    
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [metaKey]);

    return (
        <>
            <AddEntryModal isOpen={isOpen} onClose={() => setOpen(false)} />
            <Tooltip title={<small><i>{metaKey.toUpperCase()} + ENTER</i></small>}>
                <Button
                    style={{ width: '100%', height: '100%' }}
                    size="small"
                    onClick={() => setOpen(true)}
                >
                    <PlusOutlined />
                </Button>
            </Tooltip>
        </>
    );
};



export default SideToolbar;