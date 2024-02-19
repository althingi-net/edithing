export interface Changelog {
    /** The id of the paragraph, Eg.: chapter-1.art-1 */
    id: string;
    text?: string;
    type: 'added' | 'changed' | 'deleted';
    changes?: [type: number, text: string][];
}