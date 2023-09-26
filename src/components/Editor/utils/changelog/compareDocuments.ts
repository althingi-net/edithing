import { Descendant } from "slate";
import { ElementType } from "../../Slate";
import flattenSlateParagraphs from "./flattenSlateParagraphs";
import { Event } from "./useEvents";

const TEXTS: { [key: string]: string } = {
    chapter: 'chapter',
    art: 'gr',
    subart: 'mgr',
    numart: 'mgr',
    sen: 'málsl',
}

interface Changelog {
    id: string;
    text?: string;
    type: 'add' | 'change' | 'delete';
}

const compareDocuments = (original: Descendant[], current: Descendant[], events: Event[]) => {
    const originalTexts = flattenSlateParagraphs({
        type: ElementType.EDITOR,
        children: original,
    });
    const newTexts = flattenSlateParagraphs({
        type: ElementType.EDITOR,
        children: current,
    });

    
    const added = newTexts.filter(newText => !originalTexts.find(originalText => originalText.id === newText.id));
    const removed = originalTexts.filter(originalText => !newTexts.find(newText => newText.id === originalText.id));
    const changed = newTexts.filter(newText => originalTexts.find(originalText => originalText.id === newText.id && originalText.content !== newText.content));


    const changelog: Changelog[] = [
        ...added.map<Changelog>(text => ({ id: text.id, type: 'add', text: text.content })),
        ...removed.map<Changelog>(text => ({ id: text.id, type: 'delete', text: text.content })),
        ...changed.map<Changelog>(text => ({ id: text.id, type: 'change', text: text.content })),
    ];

    const appliedEvents: string[] = [];

    // sort changelog based on order in events in reverse to ignore events that were deleted
    const sortedChangelog = [...events]
        .reverse()
        .map(event => {
            const changelogEntry = changelog.find(entry => entry.id === event.id);
            if (!changelogEntry) {
                return null;
            }

            if (appliedEvents.find(appliedEvent => appliedEvent.includes(event.id))) {
                return null;
            }

            appliedEvents.push(event.id);
            return changelogEntry;
        })
        .filter((entry): entry is Changelog => entry !== null)
        // Sort changelog based on id, ascending
        .sort((a, b) => a.id < b.id ? -1 : a.id === b.id ? 0 : 1) as Changelog[];

    return sortedChangelog.map(entry => {
        if (entry.type === 'add') {
            return `${parseIdToDisplay(entry.id)} of the law was added: ${entry.text}`;
        }

        if (entry.type === 'delete') {
            return `${parseIdToDisplay(entry.id)} of the law was removed.`;
        }

        if (entry.type === 'change') {
            return `${parseIdToDisplay(entry.id)} of the law shall be: ${entry.text}`;
        }

        return '';
    });
}

const parseIdToDisplay = (id: string) => {
    return id.split('.')
        .map(level => level.split('-'))
        .filter(([type, nr]) => type !== 'paragraph')
        .map(([type, nr]) => `${nr}. ${translate(type)}.`)
        .reverse()
        .join(' ');
}

const translate = (word: string) => {
    if (TEXTS[word]) {
        return TEXTS[word];
    }

    return word;
}

export default compareDocuments;