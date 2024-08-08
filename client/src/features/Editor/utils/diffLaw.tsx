/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { Descendant, Editor } from 'slate';
import Diff from 'text-diff';
import { FlattenedParagraph, flattenSlateParagraphs } from './flattenSlateParagraphs';

export interface Changelog {
    /** The id of the paragraph, Eg.: chapter-1.art-1 */
    id: string;
    text?: string;
    type: 'added' | 'changed' | 'deleted';
    changes?: [type: number, text: string][];
}

const diff = new Diff();

export const diffLaw = (editor: Editor, original: Descendant[]) => {
    const originalTexts = flattenSlateParagraphs(original);
    const newTexts = flattenSlateParagraphs(editor.children);

    let changelog = createChangelog(originalTexts, newTexts);
    changelog = sortChangelog(changelog);
    
    return changelog;
};

const createChangelog = (originalTexts: FlattenedParagraph[], newTexts: FlattenedParagraph[]) => {
    const changelog: Changelog[] = [];
    
    for (const text of newTexts) {
        const original = originalTexts.find(original => original.id === text.id);

        if (!original) {
            parseAdded(changelog, text);
        } else {
            parseChanged(changelog, text, original);
        }
    }

    for (const original of originalTexts) {
        const newText = newTexts.find(newText => newText.id === original.id);

        if (!newText) {
            parseRemoved(changelog, original);
        }
    }

    return changelog;
};

const parseAdded = (
    changelog: Changelog[],
    text: FlattenedParagraph,
) => {
    changelog.push({ id: text.id, type: 'added', text: text.content });
};

const parseRemoved = (
    changelog: Changelog[],
    text: FlattenedParagraph,
) => {
    changelog.push({ id: text.id, type: 'deleted', text: text.content });
};

const parseChanged = (
    changelog: Changelog[],
    newText: FlattenedParagraph,
    originalText: FlattenedParagraph,
) => {
    const changes = getTextDiff(originalText, newText);

    // Ignore when they are no changes
    if (changes.length === 1 && changes[0][0] === 0) {
        return;
    }
        
    if (changes.length === 1) {
        const type = changes[0][0] === 1 ? 'added' : 'deleted';
            
        changelog.push({ id: newText.id, type, text: newText.content, changes });
    } else {
        changelog.push({ id: newText.id, type: 'changed', text: newText.content, changes });
    }
};

const getTextDiff = (originalText: FlattenedParagraph, newText: FlattenedParagraph) => {
    const changes = diff.main(originalText.content, newText.content);
    diff.cleanupSemantic(changes);
    return changes;
};

/**
 * Sort changelog based on id, ascending
 * @param changelog 
 * @param events 
 * @returns 
 */
const sortChangelog = (changelog: Changelog[]) => {
    return [...changelog]
        .sort((a, b) => a.id < b.id ? -1 : a.id === b.id ? 0 : 1);
};