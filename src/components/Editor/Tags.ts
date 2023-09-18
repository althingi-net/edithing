interface TagConfig {
    type: string;
    isList: boolean;
    canHave: string[];
    display?: 'list' | 'block' | 'inline';
}

export const TAGS: { [key: string]: TagConfig } = {
    'chapter': {
        type: 'chapter',
        isList: true,
        display: 'list',
        canHave: ['art'],
    },
    'art': {
        type: 'art',
        isList: true,
        display: 'list',
        canHave: ['subart', 'numart'],
    },
    'subart': {
        type: 'subart',
        isList: true,
        display: 'list',
        canHave: ['paragraph'],
    },
    'numart': {
        type: 'numart',
        isList: true,
        display: 'list',
        canHave: ['paragraph', 'sen', 'numart'],
    },
    'paragraph': {
        type: 'paragraph',
        isList: true,
        display: 'inline',
        canHave: ['sen', 'numart'],
    },
    'sen': {
        type: 'sen',
        isList: false,
        display: 'inline',
        canHave: [],
    },
}