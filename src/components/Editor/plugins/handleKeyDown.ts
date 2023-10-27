import isHotkey from 'is-hotkey';
import { KeyboardEvent } from 'react';
import { Editor } from 'slate';
import splitListItem from '../actions/splitListItem';

const isEnterKey = isHotkey('enter');

const handleKeyDown = (editor: Editor, event: KeyboardEvent<HTMLDivElement>) => {
    if (isEnterKey(event)) {
        event.preventDefault();
        console.log('enter key pressed');

        if (splitListItem(editor)) {
            return true;
        }
    }
};

export default handleKeyDown;