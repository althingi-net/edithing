import { Descendant } from "slate";
import { ElementType, MetaType, List } from "../../Slate";

interface Options {
    nrType?: 'roman' | 'numeric' | 'alphabet';
}

const createList = (type: MetaType, options: Options = {}, children: Descendant[] = []): List => {
    const { nrType } = options;

    const list: List = {
        type: ElementType.LIST,
        meta: {
            type: type,
        },
        children,
    }

    if (type === MetaType.CHAPTER) {
        list.meta!.nrType = 'roman';
    }

    if (nrType) {
        list.meta!.nrType = nrType;
    }

    return list;
};

export default createList;