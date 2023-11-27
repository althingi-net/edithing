import { Button, Tooltip } from 'antd';
import { FC, ReactNode } from 'react';
import { Editor, Text } from 'slate';
import { useSlate } from 'slate-react';
import setName from '../actions/setName';
import setSentence from '../actions/setSentence';
import setTitle from '../actions/setTitle';
import findTitleAndName from './utils/findTitleAndName';
import showNameFormatButton from './utils/showNameFormatButton';
import showSentenceFormatButton from './utils/showSentenceFormatButton';
import showTitleFormatButton from './utils/showTitleFormatButton';
import useLanguageContext, { Translator } from '../../App/useLanguageContext';

type Marks = keyof Omit<Text, 'text' | 'title' | 'name' | 'nr'> | 'title' | 'name' | 'nr';

interface Props {
    format: Marks;
    icon: ReactNode;
}

const FormatButton: FC<Props> = ({ format, icon }) => {
    const editor = useSlate();
    const { t } = useLanguageContext();

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
    
    // Hide bold formatting in title and name
    if (format === 'bold') {
        const { title, name } = findTitleAndName(editor);

        if (title || name) {
            return null;
        }
    }

    if (format === 'nr' && !showSentenceFormatButton(editor)) {
        return null;
    }

    if (format === 'title' && !showTitleFormatButton(editor)) {
        return null;
    }

    if (format === 'name' && !showNameFormatButton(editor)) {
        return null;
    }

    return (
        <Tooltip title={getTooltipText(t, format)}>
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

const getTooltipText = (t: Translator, format: Marks) => {
    switch (format) {
    case 'title':
        return t('Create a title for this paragraph. Needs to be first text of paragraph');
    case 'name':
        return t('Create a name for this paragraph. Needs to be first text of paragraph if there is no title or be right after the title');
    case 'nr':
        return t('Format the selected text as its own sentence.');
    case 'bold':
    default:
        return `${t('Format selected text with')} ${format}. ${t('Press again to remove formatting.')}`;
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