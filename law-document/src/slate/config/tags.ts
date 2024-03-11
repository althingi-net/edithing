import { MetaType } from '../Slate';

interface TagConfig {
    type: string;
    isList: boolean;
    hasTitle?: boolean;
    hasName?: boolean;
    defaultTitle?: string;
    canHave: MetaType[];
    display?: 'list' | 'block' | 'inline' | 'virtual';
}

export const TAGS: { [key in MetaType]: TagConfig } = {
    [MetaType.CHAPTER]: {
        type: MetaType.CHAPTER,
        isList: true,
        hasTitle: true,
        hasName: true,
        defaultTitle: 'I. kafli. ',
        display: 'list',
        canHave: [MetaType.ART],
    },
    [MetaType.ART]: {
        type: MetaType.ART,
        isList: true,
        hasTitle: true,
        hasName: true,
        defaultTitle: '1. gr. ',
        display: 'list',
        canHave: [MetaType.SUBART, MetaType.NUMART],
    },
    [MetaType.SUBART]: {
        type: MetaType.SUBART,
        isList: true,
        display: 'list',
        canHave: [MetaType.PARAGRAPH],
    },
    [MetaType.NUMART]: {
        type: MetaType.NUMART,
        isList: true,
        display: 'list',
        canHave: [MetaType.PARAGRAPH, MetaType.SEN, MetaType.NUMART],
    },
    [MetaType.PARAGRAPH]: {
        type: MetaType.PARAGRAPH,
        isList: true,
        display: 'list',
        canHave: [MetaType.SEN, MetaType.NUMART],
    },
    [MetaType.SEN]: {
        type: MetaType.SEN,
        isList: false,
        display: 'inline',
        canHave: [],
    },
};

export const getAllowedTagChildren = (type: MetaType) => {
    return TAGS[type].canHave
        .filter(type => TAGS[type].display !== 'virtual' && TAGS[type].isList)  ;
};
