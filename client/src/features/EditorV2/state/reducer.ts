import { EditorState } from '../EditorState';
import { applyAddSibling, matchAddSibling } from '../actions/addSibling';
import { applyUpdateNode, matchUpdateNode } from '../actions/updateNode';
import { matchUpdateNodeText, applyUpdateNodeText } from '../actions/updateNodeText';
import { AnyAction } from './AnyAction';

/**
 * Reducer function for the editor state.
 * @param state - The current editor state.
 * @param action - The action to be applied to the state.
 * @returns The new editor state after applying the action.
 */
function reducer(state: EditorState, action: AnyAction) {
    if (matchAddSibling(action)) {
        return applyAddSibling(state, action.payload.id);
    }

    if (matchUpdateNode(action)) {
        return applyUpdateNode(state, action.payload.id, action.payload.node);
    }

    if (matchUpdateNodeText(action)) {
        return applyUpdateNodeText(state, action.payload.id, action.payload.text);
    }

    console.warn('Unknown action', action);

    return state;
}

/**
 * Middleware wrapper to measure the time taken by each action.
 * @param originalReducer reducer function to be wrapped.
 * @returns reducer function with performance measurement.
 */
const measureReducer = (originalReducer: typeof reducer) => (state: EditorState, action: AnyAction) => {
    console.log( '%c Dispatching ', 'background: #222; color: #bada55', action );
    const start = performance.now();
    
    const newState = originalReducer(state, action);

    const end = performance.now();
    console.log( `%c Action with type "${action.type}" took ${( end-start ).toFixed( 2 )} milliseconds.`, 'background: #bada55; color: #222' );

    return newState;
};

export default measureReducer(reducer);