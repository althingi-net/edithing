/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { FlattenedNode, EditorState } from '../EditorState';
import { Node } from '../Node';
import { findNode } from '../state/selectors/findNode';

const TYPE = 'SET_EDIT_MENU' as const;

export type SetEditMenuEditorAction = ReturnType<typeof createSetEditMenuAction>;

export const createSetEditMenuAction = (enabled: boolean) => {
    return {
        type: TYPE,
        payload: { enabled },
    };
};

export const matchSetEditMenu = (action: any): action is SetEditMenuEditorAction => {
    return action.type === TYPE;
};

export const applySetEditMenu = (state: EditorState, enabled: boolean) => {
    const { config } = state;

    const newState = {
        ...state,
        config: {
            ...config,
            editMenu: enabled,
        }
    };

    return newState;
};