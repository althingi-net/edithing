import { createList, createListItem, MetaType } from 'law-document';
import { Descendant, Editor } from 'slate';
import { diffLaw } from './diffLaw';

describe('diffLaw', () => {
    const original = [
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, 'I', {}, [
                createList(MetaType.SUBART, {}, [
                    createListItem(MetaType.SUBART, '1', {}, [
                        createList(MetaType.SEN, {}, [
                            createListItem(MetaType.SEN, '1', { text: 'old1' }),
                        ])
                    ]),
                    createListItem(MetaType.SUBART, '2', {}, [
                        createList(MetaType.SEN, {}, [
                            createListItem(MetaType.SEN, '1', { text: 'old2' }),
                        ])
                    ])
                ])
            ])
        ])
    ] as Descendant[];

    it('empty array if there are no differences', async () => {
        const editor = { children: original } as unknown as Editor;

        const results = await diffLaw(editor, original);

        expect(results).toEqual([]);
    });

    it('adding most inner leaf at the end', async () => {
        const editor = { children: [
            createList(MetaType.CHAPTER, {}, [
                createListItem(MetaType.CHAPTER, 'I', {}, [
                    createList(MetaType.SUBART, {}, [
                        createListItem(MetaType.SUBART, '1', {}, [
                            createList(MetaType.SEN, {}, [
                                createListItem(MetaType.SEN, '1', { text: 'old1' }),
                            ])
                        ]),
                        createListItem(MetaType.SUBART, '2', {}, [
                            createList(MetaType.SEN, {}, [
                                createListItem(MetaType.SEN, '1', { text: 'old2' }),
                                createListItem(MetaType.SEN, '2', { text: 'new' }),
                            ])
                        ])
                    ])
                ])
            ])
        ] } as unknown as Editor;

        const results = await diffLaw(editor, original);

        expect(results).toEqual([{
            id: 'chapter-1.subart-2',
            type: 'changed',
            texts: ['old2', 'new'],
            originalTexts: ['old2'],
            changes: [
                [0, 'old2'],
                [1, ' new'],
            ],
        }]);
    });

    it('adding most inner leaf inbetween', async () => {
        const editor = { children: [
            createList(MetaType.CHAPTER, {}, [
                createListItem(MetaType.CHAPTER, 'I', {}, [
                    createList(MetaType.SUBART, {}, [
                        createListItem(MetaType.SUBART, '1', {}, [
                            createList(MetaType.SEN, {}, [
                                createListItem(MetaType.SEN, '1', { text: 'old1' }),
                            ])
                        ]),
                        createListItem(MetaType.SUBART, '2', {}, [
                            createList(MetaType.SEN, {}, [
                                createListItem(MetaType.SEN, '1', { text: 'new' }),
                                createListItem(MetaType.SEN, '2', { text: 'old2' }),
                            ])
                        ])
                    ])
                ])
            ])
        ] } as unknown as Editor;

        const results = await diffLaw(editor, original);

        expect(results).toEqual([{
            id: 'chapter-1.subart-2',
            type: 'changed',
            texts: ['new', 'old2'],
            originalTexts: ['old2'],
            changes: [
                [1, 'new '],
                [0, 'old2'],
            ],
        }]);
    });

    it('add new subart', async () => {
        const editor = { children: [
            createList(MetaType.CHAPTER, {}, [
                createListItem(MetaType.CHAPTER, 'I', {}, [
                    createList(MetaType.SUBART, {}, [
                        createListItem(MetaType.SUBART, '1', {}, [
                            createList(MetaType.SEN, {}, [
                                createListItem(MetaType.SEN, '1', { text: 'old1' }),
                            ])
                        ]),
                        createListItem(MetaType.SUBART, '2', {}, [
                            createList(MetaType.SEN, {}, [
                                createListItem(MetaType.SEN, '1', { text: 'old2' }),
                            ])
                        ]),
                        createListItem(MetaType.SUBART, '3', {}, [
                            createList(MetaType.SEN, {}, [
                                createListItem(MetaType.SEN, '1', { text: 'new' }),
                            ])
                        ])
                    ])
                ])
            ])
        ] } as unknown as Editor;

        const results = await diffLaw(editor, original);

        expect(results).toEqual([{
            id: 'chapter-1',
            type: 'changed',
            texts: ['old1', 'old2', 'new'],
            originalTexts: ['old1', 'old2'],
            changes: [
                [0, 'old1 old2'],
                [1, ' new'],
            ],
        }]);
    });

    it('remove subart', async () => {
        const editor = { children: [
            createList(MetaType.CHAPTER, {}, [
                createListItem(MetaType.CHAPTER, 'I', {}, [
                    createList(MetaType.SUBART, {}, [
                        createListItem(MetaType.SUBART, '1', {}, [
                            createList(MetaType.SEN, {}, [
                                createListItem(MetaType.SEN, '1', { text: 'old1' }),
                            ])
                        ]),
                    ])
                ])
            ])
        ] } as unknown as Editor;

        const results = await diffLaw(editor, original);

        expect(results).toEqual([{
            id: 'chapter-1',
            type: 'changed',
            texts: ['old1'],
            originalTexts: ['old1', 'old2'],
            changes: [
                [0, 'old1'],
                [-1, ' old2'],
            ],
        }]);
    });
});