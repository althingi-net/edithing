import { BoldOutlined } from '@ant-design/icons';
import React, { FC, useEffect, useRef } from 'react';
import { Editor, Range } from 'slate';
import { useFocused, useSlate } from 'slate-react';
import { Translator } from '../../translations';
import { Portal } from '../../utils/Portal';
import { FormatButton } from './FormatButton';
import './HoverToolbar.css';

interface Props {
    t: Translator;
}

export const HoveringToolbar: FC<Props> = ({ t }) => {
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
                <FormatButton t={t} format="bold" icon={<BoldOutlined />} />
                <FormatButton t={t} format="title" icon="T" />
                <FormatButton t={t} format="name" icon="N" />
                <FormatButton t={t} format="nr" icon="S" />
            </div>
        </Portal>
    );
};