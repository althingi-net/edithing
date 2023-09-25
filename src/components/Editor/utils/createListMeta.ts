import { Node } from "slate";
import { MetaType, OrderedList, isList, isListItem } from "../Slate";

const createListMeta = (parent?: Node): OrderedList['meta'] => {
    if (parent && (isList(parent) || isListItem(parent))) {
        const meta: OrderedList['meta'] = {
            type: getChildMetaType(parent.meta.type),
        }

        if (meta.type === MetaType.CHAPTER) {
            meta.nrType = 'roman';
        }

        return meta;
    }

    return {
        type: MetaType.CHAPTER,
        nrType: 'roman',
    };
}

const getChildMetaType = (type: MetaType) => {
    switch (type) {
        case MetaType.CHAPTER:
            return MetaType.ART;
        case MetaType.ART:
            return MetaType.SUBART;
        case MetaType.SUBART:
            return MetaType.PARAGRAPH;
    }

    throw new Error(`Can not derive sub type from: ${type}`);
}


export default createListMeta;