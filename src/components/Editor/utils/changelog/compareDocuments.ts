import { Descendant, Node } from "slate";
import flattenSlateParagraphs from "./flattenSlateParagraphs";
import { ElementType } from "../../Slate";

const compareDocuments = (original: Descendant[], editor: Node, ) => {
    const originalTexts = flattenSlateParagraphs({
        type: ElementType.EDITOR,
        children: original,
    });
    const newTexts = flattenSlateParagraphs(editor);
    
    const output: string[] = [];
    const added = newTexts.filter(newText => !originalTexts.find(originalText => originalText.id === newText.id));
    const removed = originalTexts.filter(originalText => !newTexts.find(newText => newText.id === originalText.id));
    const changed = newTexts.filter(newText => originalTexts.find(originalText => originalText.id === newText.id && originalText.content !== newText.content));

    added.forEach(addedText => {
        output.push(`${parseIdToDisplay(addedText.id)} was added with "${addedText.content}"`);
    });

    removed.forEach(removedText => {
        output.push(`${parseIdToDisplay(removedText.id)} was removed`);
    });

    changed.forEach(changedText => {
        output.push(`${parseIdToDisplay(changedText.id)} was changed from "${originalTexts.find(originalText => originalText.id === changedText.id)?.content}" to "${changedText.content}"`);
    });

    return output;
}

const parseIdToDisplay = (id: string) => {
    return id.split('.')
        .map((level) => {
            const [type, nr] = level.split('-');
            return `${capitalizeWord(type)} ${nr}.`;
        })
        .join(' ');
}

const capitalizeWord = (word: string) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

export default compareDocuments;