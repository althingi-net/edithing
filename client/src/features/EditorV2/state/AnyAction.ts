/**
 * Represents an action with any type and payload for the EditorState reducer.
 */
export interface AnyAction {
    type: string;
    payload: any;
}
