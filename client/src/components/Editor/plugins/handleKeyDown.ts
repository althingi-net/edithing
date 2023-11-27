import isHotkey from 'is-hotkey';
import { KeyboardEvent } from 'react';
import { Editor } from 'slate';
import pressEnterKey from '../actions/pressEnterKey';

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