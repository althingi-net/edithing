import { BoldOutlined } from '@ant-design/icons';
import { useEffect, useRef } from 'react';
import { Editor, Range } from 'slate';
import { useFocused, useSlate } from 'slate-react';
import Portal from '../../App/Portal';
import './HoverToolbar.css';
import FormatButton from './FormatButton';

const HoveringToolbar = () => {
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
            Range.isCollapsed(selection) ||
            Editor.string(editor, selection) === ''
        ) {
            el.removeAttribute('style');
            return;
        }

        const domRange = domSelection.getRangeAt(0);
        const rect = domRange.getBoundingClientRect();
        el.style.opacity = '1';
        el.style.top = `${rect.top + window.scrollY - el.offsetHeight}px`;
        el.style.left = `${rect.left +
            window.scrollX -
            el.offsetWidth / 2 +
            rect.width / 2}px`;
    });

    return (
        <Portal>
            <div
                className='hover-toolbar'
                ref={ref}
                onMouseDown={e => {
                    // prevent toolbar from taking focus away from editor
                    e.preventDefault();
                }}
                role='toolbar'
            >
                <FormatButton format="bold" icon={<BoldOutlined />} />
                <FormatButton format="title" icon="T" />
                <FormatButton format="name" icon="N" />
                <FormatButton format="nr" icon="S" />
            </div>
        </Portal>
    );
};


export default HoveringToolbar;