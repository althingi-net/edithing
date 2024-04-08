/* eslint-disable jest/no-disabled-tests */
import { GitJsonMerger } from './GitJsonMerger';

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


    const gitJsonMerger = new GitJsonMerger('merge simple update');
    await gitJsonMerger.init(originalDocument);
    const result = await gitJsonMerger.merge(updatedDocument);

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


    const gitJsonMerger = new GitJsonMerger('merge parallel updates');
    await gitJsonMerger.init(originalDocument);
    await gitJsonMerger.merge(updatedDocument1);
    const result = await gitJsonMerger.merge(updatedDocument2);

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


    const gitJsonMerger = new GitJsonMerger('merge same line changes');
    await gitJsonMerger.init(originalDocument);
    await gitJsonMerger.merge(updatedDocument1);
    const result = await gitJsonMerger.merge(updatedDocument2);

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


    const gitJsonMerger = new GitJsonMerger('merge same line changes');
    await gitJsonMerger.init(originalDocument);
    await gitJsonMerger.merge(updatedDocument1);
    const result = await gitJsonMerger.merge(updatedDocument2);

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


    const gitJsonMerger = new GitJsonMerger('merge same line addition');
    await gitJsonMerger.init(originalDocument);
    await gitJsonMerger.merge(updatedDocument1);
    const result = await gitJsonMerger.merge(updatedDocument2);

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

test.skip('merge complex', async () => {
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

    const gitJsonMerger = new GitJsonMerger('merge complex');
    await gitJsonMerger.init(originalDocument);

    // Do simple update
    const { hash } = await gitJsonMerger.merge(updatedDocument1);

    // Do parallel updates
    await gitJsonMerger.merge(updatedDocument2, hash);
    await gitJsonMerger.merge(updatedDocument3, hash);

    // Do last commit based on first commit
    const result = await gitJsonMerger.merge(updatedDocument4);

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