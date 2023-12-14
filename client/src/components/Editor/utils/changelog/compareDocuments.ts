import { Descendant, Editor } from 'slate';
import Diff from 'text-diff';
import Changelog from '../../models/Changelog';
import { Event } from '../../plugins/withEvents';
import flattenSlateParagraphs, { FlattenedParagraph } from './flattenSlateParagraphs';

const diff = new Diff();

const compareDocuments = (editor: Editor, original: Descendant[]) => {
    const originalTexts = flattenSlateParagraphs(original);
    const newTexts = flattenSlateParagraphs(editor.children);

    let changelog = createChangelog(editor, originalTexts, newTexts, editor.events);
    changelog = sortChangelog(changelog);
    changelog = filterUnique(changelog);
    
    return changelog;
};

const createChangelog = (editor: Editor, originalTexts: FlattenedParagraph[], newTexts: FlattenedParagraph[], events: Event[]) => {
    const changelog: Changelog[] = [];
    
    for (const event of events) {
        switch (event.type) {
        case 'added': 
            parseAdded(changelog, event, newTexts);
            break;
        case 'removed':
            parseRemoved(changelog, event, originalTexts);
            break;
        case 'changed': 
            parseChanged(changelog, event, originalTexts, newTexts);
            break;
        }
    }

    return changelog;
};

const parseAdded = (
    changelog: Changelog[],
    event: Event,
    newTexts: FlattenedParagraph[],
) => {
    const { id } = event;
    const newText = newTexts.find(text => text.id === id);
    changelog.push({ id, type: 'added', text: newText?.content });
};

const parseRemoved = (
    changelog: Changelog[],
    event: Event,
    originalTexts: FlattenedParagraph[],
) => {
    const { originId } = event;

    if (!originId) {
        return;
    }

    originalTexts
        .filter(text => text.id.includes(originId))
        .forEach(text => {
            changelog.push({ id: text.id, type: 'deleted', text: text.content });
        });
};

const parseChanged = (
    changelog: Changelog[],
    event: Event,
    originalTexts: FlattenedParagraph[],
    newTexts: FlattenedParagraph[],
) => {
    const { originId } = event;
    let { id } = event;
    const originalText = originalTexts.find(text => text.id === originId);
    const newText = newTexts.find(text => text.id === id || text.originId === id);

    // Re-assigned new id if the events target was moved later in the document
    if (newText && newText.originId === id) {
        id = newText.id;
    }

    if (originalText && !newText) {
        parseRemoved(changelog, event, originalTexts);
    }

    if (!originalText && newText) {
        parseAdded(changelog, event, newTexts);
    }

    if (originalText && newText) {
        const changes = getTextDiff(originalText, newText);

        // Ignore when they are no changes
        if (changes.length === 1 && changes[0][0] === 0) {
            return;
        }

        
        
        if (changes.length === 1) {
            const type = changes[0][0] === 1 ? 'added' : 'deleted';
            
            // Ignore when an added item was removed
            if (newText.originId !== originId && newText.content === '' && type === 'deleted') {
                return;
            }
            
            changelog.push({ id, type, text: newText.content, changes });
        } else {
            changelog.push({ id, type: 'changed', text: newText.content, changes });
        }
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
        .sort((a, b) => a.id < b.id ? -1 : a.id === b.id ? 0 : 1) as Changelog[];
};

const filterUnique = (changelog: Changelog[]) => {
    return changelog.filter((changelog, index, self) => {
        return !index || changelog.id !== self[index - 1].id;
    });
};

export default compareDocuments;