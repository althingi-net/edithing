/* eslint-disable jest/no-disabled-tests */
import { GitJsonMerger } from './GitJsonMerger';

describe('GitJsonMerger', () => {
    test('merge simple update', async () => {
        const originalDocument = {
            children: [
                {
                    id: '1',
                    name: 'first',
                },
                {
                    id: '2',
                    name: 'second',
                },
            ],
        };
        const updatedDocument = {
            children: [
                {
                    id: '1',
                    name: 'first',
                },
                {
                    id: '2',
                    name: 'second updated',
                },
            ],
        };


        const merger = new GitJsonMerger('merge simple update');
        await merger.git.destroy();
        await merger.init(originalDocument);
        const result = await merger.merge(updatedDocument);

        expect(result.error).toBeUndefined();
        expect(result.document).toEqual(updatedDocument);
    });

    test('merge parallel updates', async () => {
        const originalDocument = {
            children: [
                {
                    id: '1',
                    name: 'first',
                },
                {
                    id: '2',
                    name: 'second',
                },
            ],
        };
        const updatedDocument1 = {
            children: [
                {
                    id: '1',
                    name: 'first',
                },
                {
                    id: '2',
                    name: 'second updated',
                },
            ],
        };
        const updatedDocument2 = {
            children: [
                {
                    id: '1',
                    name: 'first updated',
                },
                {
                    id: '2',
                    name: 'second',
                },
            ],
        };


        const merger = new GitJsonMerger('merge parallel updates');
        await merger.git.destroy();
        await merger.init(originalDocument);
        const hash = await merger.git.getCurrentHash();

        await merger.merge(updatedDocument1, hash);
        const result = await merger.merge(updatedDocument2, hash);

        expect(result.error).toBeUndefined();
        expect(result.document).toEqual({
            children: [
                {
                    id: '1',
                    name: 'first updated',
                },
                {
                    id: '2',
                    name: 'second updated',
                },
            ],
        });
    });

    test('merge parallel updates, changes are next to each other', async () => {
        const originalDocument = {
            a: 1,
        };
        const updatedDocument1 = {
            a: 2,
        };
        const updatedDocument2 = {
            a: 1,
            b: 1,
        };

        const merger = new GitJsonMerger('changes side by side');
        await merger.git.destroy();
        await merger.init(originalDocument);
        const hash = await merger.git.getCurrentHash();

        await merger.merge(updatedDocument1, hash);
        const result = await merger.merge(updatedDocument2, hash);

        expect(result.error).toBeUndefined();
        expect(result.document).toEqual({
            a: 2,
            b: 1,
        });
    });

    test('return merge error', async () => {
        const originalDocument = {
            children: [
                {
                    id: '1',
                    name: 'first',
                },
                {
                    id: '2',
                    name: 'second',
                },
            ],
        };
        const updatedDocument1 = {
            children: [
                {
                    id: '1',
                    name: 'first',
                },
                {
                    id: '2',
                    name: 'second updated',
                },
            ],
        };
        const updatedDocument2 = {
            children: [
                {
                    id: '1',
                    name: 'first',
                },
                {
                    id: '2',
                    name: 'updated second',
                },
            ],
        };


        const merger = new GitJsonMerger('merge same line changes');
        await merger.git.destroy();
        await merger.init(originalDocument);
        const hash = await merger.git.getCurrentHash();

        await merger.merge(updatedDocument1, hash);
        const result = await merger.merge(updatedDocument2, hash);

        expect(result.error).toEqual('Merge conflict');
    });

    test.skip('merge same line changes', async () => {
        const originalDocument = {
            children: [
                {
                    id: '1',
                    name: 'first',
                },
                {
                    id: '2',
                    name: 'second',
                },
            ],
        };
        const updatedDocument1 = {
            children: [
                {
                    id: '1',
                    name: 'first',
                },
                {
                    id: '2',
                    name: 'second updated',
                },
            ],
        };
        const updatedDocument2 = {
            children: [
                {
                    id: '1',
                    name: 'first',
                },
                {
                    id: '2',
                    name: 'updated second',
                },
            ],
        };


        const merger = new GitJsonMerger('merge same line changes');
        await merger.git.destroy();
        await merger.init(originalDocument);
        await merger.merge(updatedDocument1);
        const result = await merger.merge(updatedDocument2);

        expect(result.error).toBeUndefined();
        expect(result.document).toEqual({
            children: [
                {
                    id: '1',
                    name: 'first',
                },
                {
                    id: '2',
                    name: 'updated second updated',
                },
            ],
        });
    });

    test.skip('merge same line addition', async () => {
        const originalDocument = {
            children: [
                {
                    id: '1',
                    name: 'first',
                },
                {
                    id: '2',
                    name: 'second',
                },
            ],
        };
        const updatedDocument1 = {
            children: [
                {
                    id: '1',
                    name: 'first',
                },
                {
                    id: '2',
                    x: true,
                    name: 'second',
                },
            ],
        };
        const updatedDocument2 = {
            children: [
                {
                    id: '1',
                    name: 'first',
                },
                {
                    id: '2',
                    y: true,
                    name: 'second',
                },
            ],
        };


        const merger = new GitJsonMerger('merge same line addition');
        await merger.init(originalDocument);
        await merger.merge(updatedDocument1);
        const result = await merger.merge(updatedDocument2);

        expect(result.error).toBeUndefined();
        expect(result.document).toEqual({
            children: [
                {
                    id: '1',
                    name: 'first',
                },
                {
                    id: '2',
                    x: true,
                    y: true,
                    name: 'second',
                },
            ],
        });
    });

    test('merge complex', async () => {
        const originalDocument = {
            children: [
                {
                    id: '1',
                    name: 'first',
                },
                {
                    id: '2',
                    name: 'second',
                },
            ],
        };
        const updatedDocument1 = {
            children: [
                {
                    id: '1',
                    name: 'first',
                },
                {
                    id: '2',
                    name: 'second updated',
                },
            ],
        };
        const updatedDocument2 = {
            children: [
                {
                    id: '1',
                    name: 'first',
                },
                {
                    id: '2',
                    y: true,
                    name: 'second updated',
                },
            ],
        };
        const updatedDocument3 = {
            children: [
                {
                    id: '1',
                    name: 'first updated',
                },
                {
                    id: '2',
                    name: 'second updated',
                },
            ],
        };
        const updatedDocument4 = {
            children: [
                {
                    id: '1',
                    name: 'first',
                },
                {
                    id: '2',
                    name: 'second',
                },
                {
                    id: '3',
                    name: 'three',
                },
            ],
        };

        const merger = new GitJsonMerger('merge complex');
        await merger.init(originalDocument);

        // Do simple update
        const { hash } = await merger.merge(updatedDocument1);

        // Do parallel updates
        await merger.merge(updatedDocument2, hash);
        await merger.merge(updatedDocument3, hash);

        // Do last commit based on first commit
        const result = await merger.merge(updatedDocument4);

        expect(result.error).toBeUndefined();
        expect(result.document).toEqual({
            children: [
                {
                    id: '1',
                    name: 'first updated',
                },
                {
                    id: '2',
                    y: true,
                    name: 'second updated',
                },
                {
                    id: '3',
                    name: 'three',
                },
            ],
        });
    });
});