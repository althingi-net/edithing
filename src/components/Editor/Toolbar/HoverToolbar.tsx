import { BoldOutlined } from "@ant-design/icons"
import { Button, Tooltip } from "antd"
import { FC, useEffect, useRef } from "react"
import { Editor, Node, Path, Range, Text, Transforms } from "slate"
import { useFocused, useSlate } from "slate-react"
import Portal from "../../Portal"
import styles from './HoverToolbar.module.css'
import setTitle from "../actions/setTitle"
import setName from "../actions/setName"
import findListItemAtSelection from "../utils/slate/findListItemAtSelection"

type Marks = keyof Omit<Text, 'text' | 'title' | 'name' | 'nr'> | 'title' | 'name' | 'nr';

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
                className={styles.toolbar}
                ref={ref}
                onMouseDown={e => {
                    // prevent toolbar from taking focus away from editor
                    e.preventDefault()
                }}
            >
                <FormatButton format="bold" icon={<BoldOutlined />} />
                <FormatButton format="title" icon="T" />
                <FormatButton format="name" icon="N" />
                <FormatButton format="nr" icon="S" />
            </div>
        </Portal>
    );
}

const FormatButton: FC<{ format: Marks, icon: any }> = ({ format, icon }) => {
    const editor = useSlate()

    const handleClick = () => {
        if (format === 'title') {
            setTitle(editor);
            return;
        }

        if (format === 'name') {
            setName(editor);
            return;
        }

        if (format === 'nr') {
            // split existing sentence and let normalization correct the number across all sentences
            Transforms.setNodes<Text>(editor, { nr: '' }, { match: Text.isText, split: true });
            return;
        }

        toggleMark(editor, format);
    }

    if (!editor.selection) {
        return null;
    }

    const { anchor, focus } = editor.selection;
    const titleAndNameNodes = Array.from(editor.nodes<Text>({
        mode: 'lowest',
        match: node => Text.isText(node) && (node.title === true || node.name === true),
    }));

    // Hide bold & sentence formatting in title and name
    if (format === 'bold' || format === 'nr') {
        if (titleAndNameNodes.length > 0) {
            return null;
        }
    }

    if (format === 'title') {
        const [listItem, path] = findListItemAtSelection(editor) ?? [];

        if (!listItem || !path) {
            return null;
        }

        const isBackward = Range.isBackward(editor.selection);
        const start = isBackward ? focus : anchor;
        const listItemTextStart = [...path, 0, 0];
        const listItemTextSecond = [...path, 0, 1];

        const startText = Node.get(editor, listItemTextStart);
        const isTitle = Text.isText(startText) && startText.title;
        
        const isCursorAtStart = Path.equals(start.path, listItemTextStart) && start.offset === 0;
        const isCursorNextToTitle = Path.equals(start.path, listItemTextSecond) && start.offset === 0;
        const isCursorInTitle = isTitle && Path.equals(start.path, listItemTextStart);

        if (!isCursorAtStart && !(isTitle && isCursorNextToTitle) && !isCursorInTitle) {
            return null;
        }
    }

    if (format === 'name') {
        const [listItem, path] = findListItemAtSelection(editor) ?? [];

        if (!listItem || !path) {
            return null;
        }

        const isBackward = Range.isBackward(editor.selection);
        const start = isBackward ? focus : anchor;
        const listItemTextStart = [...path, 0, 0];
        const isCursorAtStart = Path.equals(start.path, listItemTextStart) && start.offset === 0;

        if (!((titleAndNameNodes.length === 0 && isCursorAtStart) || titleAndNameNodes.filter(n => n[0].name).length > 0)) {
            return null;
        }
    }

    return (
        <Tooltip title={getTooltipText(format)}>
            <Button
                size="small"
                className={isMarkActive(editor, format) ? styles.active : undefined}
                onClick={handleClick}
            >
                {icon}
            </Button>
        </Tooltip>
    );
}

const getTooltipText = (format: Marks) => {
    switch (format) {
        case 'title':
            return `Create a title for this paragraph. Needs to be first text of paragraph`;
        case 'name':
            return `Create a name for this paragraph. Needs to be first text of paragraph if there is no title or be right after the title`;
        case 'nr':
            return `Format the selected text as its own sentence.`;
        case 'bold':
        default:
            return `Format selected text with ${format}. Press again to remove formatting.`;
    }
}

const toggleMark = (editor: Editor, format: Marks) => {
    const isActive = isMarkActive(editor, format);

    if (isActive) {
        Editor.removeMark(editor, format);
    } else {
        Editor.addMark(editor, format, true);
    }
}

const isMarkActive = (editor: Editor, format: Marks) => {
    const marks = Editor.marks(editor);
    return marks ? marks[format] === true : false;
}


export default HoveringToolbar;