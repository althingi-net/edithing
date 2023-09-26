import { Descendant } from "slate";
import flattenSlateParagraphs from "./flattenSlateParagraphs";
import { ElementType } from "../../Slate";
import { Event } from "./useEvents";
import { type } from "os";

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
    console.log('events', events);
    console.log('changelog', changelog);

    const appliedEvents: string[] = [];

    // sort changelog based on order in events, in reverse to ignore events that were deleted
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
        .filter(Boolean)
        .reverse() as Changelog[];
    
    console.log('sortedChangelog', sortedChangelog);

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