import { Descendant } from "slate";
import { MetaType, OrderedList, ElementType } from "../../Slate";

interface Options {
    nrType?: 'roman' | 'numeric' | 'alphabet';
}

const createList = (type: MetaType, options: Options = {}, children: Descendant[] = []): Descendant => {
    const { nrType } = options;

    const list: OrderedList = {
        type: ElementType.ORDERED_LIST,
        meta: {
            type: type,
        },
        children,
    }

    if (type === MetaType.CHAPTER) {
        list.meta.nrType = 'roman';
    }

    if (nrType) {
        list.meta.nrType = nrType;
    }

    return list;
};

export default createList;