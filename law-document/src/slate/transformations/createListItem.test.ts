import { ElementType, MetaType } from '../Slate';
import { ListItemWithMeta } from '../element/ListItem';
import { createListItem } from './createListItem';
import { createList } from './createList';

test('list item with title and 2 sentences', () => {
    const output: ListItemWithMeta = {
        type: ElementType.LIST_ITEM,
        meta: {
            type: MetaType.ART,
            nr: '1',
            originNr: '1',
            title: true,
        },
        children: [
            {
                type: ElementType.LIST_ITEM_TEXT,
                children: [
                    {
                        title: true,
                        text: 'a. ',
                    },
                    {
                        nr: '1',
                        text: 'Sendiráð skulu.',
                    },
                    {
                        nr: '2',
                        text: 'Sendiráðin í Genf.',
                    },
                ],
            },
        ],
    };

    expect(createListItem(MetaType.ART, '1', { title: 'a. ', text: ['Sendiráð skulu.', 'Sendiráðin í Genf.'] })).toStrictEqual(output);
});

test('list item without configured title/name should not have empty text node if it has other content', () => {
    const output: ListItemWithMeta = {
        type: ElementType.LIST_ITEM,
        meta: {
            type: MetaType.PARAGRAPH,
            nr: '1',
            originNr: '1',
        },
        children: [
            {
                type: ElementType.LIST,
                meta: {
                    type: MetaType.ART,
                },
                children: [
                    {
                        type: ElementType.LIST_ITEM,
                        meta: {
                            type: MetaType.ART,
                            nr: '1',
                            originNr: '1',
                        },
                        children: [
                            {
                                type: ElementType.LIST_ITEM_TEXT,
                                children: [
                                    {
                                        nr: '1',
                                        text: 'Sendiráð skulu.',
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    };

    expect(createListItem(MetaType.PARAGRAPH, '1', {}, [
        createList(MetaType.ART, {}, [
            createListItem(MetaType.ART, '1', { text: 'Sendiráð skulu.' })
        ])
    ])).toStrictEqual(output);
}); 