import { Descendant } from 'slate';
import { List, ListWithMeta } from '../../slate/element/List';
import { MetaType, ElementType } from '../Slate';

interface Options {
    nrType?: 'roman' | 'numeric' | 'alphabet';
}

export const createList = (type: MetaType, options: Options = {}, children: Descendant[] = []): List => {
    const { nrType } = options;

    const list: ListWithMeta = {
        type: ElementType.LIST,
        meta: {
            type: type,
        },
        children,
    };

    if (type === MetaType.CHAPTER) {
        list.meta.nrType = 'roman';
    }

    if (nrType) {
        list.meta.nrType = nrType;
    }

    return list;
};