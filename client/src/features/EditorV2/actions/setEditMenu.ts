import { EditorState } from '../EditorState';

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

export const applySetEditMenu = (state: EditorState, enabled: boolean): Partial<EditorState> => {
    const { config } = state;

    const newState = {
        config: {
            ...config,
            editMenu: enabled,
        }
    };

    return newState;
};