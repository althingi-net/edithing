import { Button, Tooltip } from 'antd';
import { FC, ReactNode } from 'react';
import { Editor, Node, Path, Range, Text } from 'slate';
import { useSlate } from 'slate-react';
import setName from '../actions/setName';
import setSentence from '../actions/setSentence';
import setTitle from '../actions/setTitle';
import findListItemAtSelection from '../utils/slate/findListItemAtSelection';

type Marks = keyof Omit<Text, 'text' | 'title' | 'name' | 'nr'> | 'title' | 'name' | 'nr';

interface Props {
    format: Marks;
    icon: ReactNode;
}

const FormatButton: FC<Props> = ({ format, icon }) => {
    const editor = useSlate();

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
            setSentence(editor);
            return;
        }

        toggleMark(editor, format);
    };

    if (!editor.selection) {
        return null;
    }

    const { anchor, focus } = editor.selection;
    const titleAndNameNodes = Array.from(editor.nodes<Text>({
        mode: 'lowest',
        match: node => Text.isText(node) && (node.title === true || node.name === true),
    }));

    // Hide bold & sentence formatting in title and name
    if (format === 'bold') {
        if (titleAndNameNodes.length > 0) {
            return null;
        }
    }

    if (format === 'nr') {
        const isBackward = Range.isBackward(editor.selection);
        const end = isBackward ? anchor : focus;
        const endNode = Node.get(editor, end.path);

        if (!Text.isText(endNode)) {
            return null;
        }

        const next = editor.next({ at: end.path });

        const isNextSiblingASentence = next && Text.isText(next[0]) && next[0].nr;
        const isEndNextToSentence = end.offset === endNode.text.length && isNextSiblingASentence;

        if (!(isEndNextToSentence || endNode.nr)) {
            return null;
        }
    }

    if (format === 'title') {
        const [listItem, path] = findListItemAtSelection(editor) ?? [];

        if (!listItem || !path) {
            return null;
        }

        const start = Editor.start(editor, editor.selection);
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

        const [start, end] = Editor.edges(editor, editor.selection);
        const listItemTextStart = [...path, 0, 0];
        const isCursorAtStart = Path.equals(start.path, listItemTextStart) && start.offset === 0;
        const titleNode = Node.get(editor, listItemTextStart);
        const isTitle = Text.isText(titleNode) && titleNode.title;
        const isAtEndOfTitle = isTitle && Path.equals(end.path, listItemTextStart) && end.offset === titleNode.text.length;
        const isAfterEndOfTitle = isTitle && Path.equals(start.path, listItemTextStart) && !Path.equals(end.path, listItemTextStart);

        if (!(
            (titleAndNameNodes.length === 0 && isCursorAtStart)
            || titleAndNameNodes.filter(n => n[0].name).length > 0
            || isAtEndOfTitle
            || isAfterEndOfTitle
        )) {
            return null;
        }
    }

    return (
        <Tooltip title={getTooltipText(format)}>
            <Button
                size="small"
                className={isMarkActive(editor, format) ? 'active' : undefined}
                onClick={handleClick}
            >
                {icon}
            </Button>
        </Tooltip>
    );
};

const getTooltipText = (format: Marks) => {
    switch (format) {
    case 'title':
        return 'Create a title for this paragraph. Needs to be first text of paragraph';
    case 'name':
        return 'Create a name for this paragraph. Needs to be first text of paragraph if there is no title or be right after the title';
    case 'nr':
        return 'Format the selected text as its own sentence.';
    case 'bold':
    default:
        return `Format selected text with ${format}. Press again to remove formatting.`;
    }
};

const toggleMark = (editor: Editor, format: Marks) => {
    const isActive = isMarkActive(editor, format);

    if (isActive) {
        Editor.removeMark(editor, format);
    } else {
        Editor.addMark(editor, format, true);
    }
};

const isMarkActive = (editor: Editor, format: Marks) => {
    const marks = Editor.marks(editor);
    return marks ? marks[format] === true : false;
};

export default FormatButton;