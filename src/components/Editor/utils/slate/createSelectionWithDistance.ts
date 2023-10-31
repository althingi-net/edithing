import { Editor, BaseSelection, Path } from 'slate';

interface Options {
    distance?: number;
    startOffset?: number;
}

const createSelectionWithDistance = (editor: Editor, path: Path, options: Options = {}) => {
    const { startOffset = 0, distance } = options;

    const selection: BaseSelection = {
        anchor: {
            path,
            offset: startOffset,
        },
        focus: {
            path,
            offset: startOffset,
        },
    };

    if (distance) {
        const focus = Editor.after(editor, selection.anchor, { distance });
        if (!focus) {
            throw new Error('focus is null');
        }
        selection.focus = focus;
    }

    return selection;
};

export default createSelectionWithDistance;