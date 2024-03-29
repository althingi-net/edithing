import { useEffect, useRef } from 'react';
import { Range } from 'slate';
import { ReactEditor, useFocused, useSlate } from 'slate-react';
import { findListItemAtSelection } from 'law-document';
import Portal from '../../App/Portal';
import AddEntryButton from './AddEntryButton';
import * as styles from './SideToolbar.module.css';

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
                role='toolbar'
            >
                <AddEntryButton />
            </div>
        </Portal>
    );
};

export default SideToolbar;