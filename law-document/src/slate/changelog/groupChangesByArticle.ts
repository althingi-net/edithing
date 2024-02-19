import { Changelog } from './Changelog';

export const groupChangesByArticle = (changelog: Changelog[]) => {
    const changes: Record<string, Changelog[]> = {};

    changelog.forEach(change => {
        const articleId = change.id.split('.')[1] ?? change.id;

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (!changes[articleId]) {
            changes[articleId] = [];
        }

        changes[articleId].push(change);
    });

    return changes;
};