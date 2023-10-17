import { Descendant } from "slate";
import Diff from 'text-diff';
import Changelog from "../../../../models/Changelog";
import { Event } from "../../plugins/withEvents";
import flattenSlateParagraphs, { FlattenedParagraph } from "./flattenSlateParagraphs";

const diff = new Diff();

const compareDocuments = (original: Descendant[], current: Descendant[], events: Event[]) => {
    const originalTexts = flattenSlateParagraphs(original);
    const newTexts = flattenSlateParagraphs(current);

    const changelog = createChangelog(originalTexts, newTexts);
    return sortChangelog(changelog, events)
}

const createChangelog = (originalTexts: FlattenedParagraph[], newTexts: FlattenedParagraph[]) => {
    const changelog: Changelog[] = [];

    for (const newText of newTexts) {
        // Find added texts
        const originalText = originalTexts.find(text => text.id === newText.id || text.content === newText.content);
        if (!originalText) {
            changelog.push({ id: newText.id, type: 'add', text: newText.content });
            continue;
        }

        // Find changed texts
        if (originalText.content !== newText.content) {
            const changes = diff.main(originalText.content, newText.content);
            diff.cleanupSemantic(changes);
            changelog.push({ id: newText.id, type: 'change', text: newText.content, changes });
        }
    }

    // Find deleted texts
    for (const originalText of originalTexts) {
        const newText = newTexts.find(text => text.id === originalText.id || text.content === originalText.content);
        if (!newText) {
            changelog.push({ id: originalText.id, type: 'delete' });
        }
    }

    return changelog;
}

/**
 * Sort Changelog based on events. Events are processed in reverse order to ignore events that are undone.
 */
const sortChangelog = (changelog: Changelog[], events: Event[]) => {
    const appliedEvents: string[] = [];

    return [...events]
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
}

export default compareDocuments;