import isHotkey from 'is-hotkey';
import { pressEnterKey } from 'law-document';
import { KeyboardEvent } from 'react';
import { Editor } from 'slate';

const isEnterKey = isHotkey('enter');

const handleKeyDown = (editor: Editor, event: KeyboardEvent<HTMLDivElement>) => {
    if (isEnterKey(event)) {
        event.preventDefault();

        if (pressEnterKey(editor)) {
            return true;
        }
    }
};

export default handleKeyDown;