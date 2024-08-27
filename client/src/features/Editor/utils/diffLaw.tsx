/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { diffAsXml } from 'diff-js-xml';
import { exportXml } from 'law-document';
import { Descendant, Editor } from 'slate';
import Diff from 'text-diff';

const diff = new Diff();

type XmlDiffResult = {
    path: string; // Example: "law.art[1].subart.sen"
    resultType: string; // Example: "difference in element value"
    message: string; 
};

export type LawDiffResult = {
    id: string;
    texts: string[];
    originalTexts: string[];
    type: 'added' | 'changed' | 'deleted';
    changes?: [type: number, text: string][];
};

export const diffLaw = async (editor: Editor, original: Descendant[]) => {
    const newXml = exportXml(editor);
    const oldXml = exportXml({ children: original } as Editor);

    const results = await new Promise<XmlDiffResult[]>(resolve => 
        diffAsXml(oldXml, newXml, undefined, undefined, resolve)
    );

    return parseResults(results);
};

const parseResults = (results: XmlDiffResult[]) => {
    const mergedResults: LawDiffResult[] = [];

    for (const result of results) {
        const { path, message } = result;
        const id = convertPathToId(path);
        const { lhs, rhs } = convertMessage(path, message);
        const texts = deepExtractText(rhs);
        const originalTexts = deepExtractText(lhs);

        const parsedResult: LawDiffResult = {
            id,
            texts,
            originalTexts,
            type: 'changed' as const,
            changes: getTextDiff(originalTexts.join(' '), texts.join(' ')),
        };

        const existingResult = mergedResults.find(existingResult => existingResult.id === id);

        if (existingResult) {
            existingResult.texts = existingResult.texts.concat(texts);
            existingResult.originalTexts = existingResult.originalTexts.concat(originalTexts);
            existingResult.changes = existingResult.changes ? existingResult.changes.concat(parsedResult.changes ?? []) : parsedResult.changes;
        } else {
            mergedResults.push(parsedResult);
        }
    }

    return mergedResults;
};

/**
 * Converts the path from the xml diff to the id of the paragraph for display
 */
const convertPathToId = (path: string) => {
    let newPath = path.split('.')
        .filter(level => !['law', 'name', 'nr-title'].includes(level))
        .map(level => {
            return level
                .replace(/\[/g, '-')
                .replace(/\]/g, '')
                .split('-');
        });

    // Remove the last element because for the paragraphId it should point at the enclosing node, 
    // and the xml-diff returns the siblings of the targeted path
    if (newPath.length > 1) {
        newPath = newPath.slice(0, -1);
    }
        
    return newPath
        .map(([type, nr]) => `${type}-${parseInt(nr ?? 0) + 1}`)
        .join('.');
};

/**
 * Converts the message from the xml diff to json for easier handling
 */
const convertMessage = (path: string, message: string) => {
    const [lhs, rhs] = message
        .replace(`field ${path} has lhs value`, '')
        .split(' and rhs value ')
        .map<unknown>(value => JSON.parse(value));

    return {
        lhs,
        rhs,
    };
};

/**
 * Extracts text from deep json and returns it as a array of strings
 **/
const deepExtractText = (json: unknown): string[] => {
    if (!json) {
        return [];
    }

    if (typeof json === 'string') {
        return [json.trim()];
    }

    if (Array.isArray(json)) {
        // TODO: Why?
        if (json.length > 1 && typeof json[0] === 'string') {
            return [json.map(s => s.trim()).join(' ')];
        }

        return json.flatMap(deepExtractText);
    }

    if (typeof json === 'object') {
        return Object.values(json).flatMap(deepExtractText);
    }

    return [];
};

/**
 * Returns the diff between two strings as an array of changes
 * - 0: no change
 * - 1: added
 * - -1: removed
 */
const getTextDiff = (originalText: string, newText: string) => {
    const changes = diff.main(originalText, newText);
    diff.cleanupSemantic(changes);
    return changes;
};
