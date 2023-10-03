import { Editor, Node, Path } from "slate";
import { List, isList, isListItem, MetaType } from "../../Slate";

const createListMeta = (editor: Editor, path: Path) => {
    if (path.length <= 2) {
        return createListMetaByParent();
    }

    const parent = Node.get(editor, path.slice(0, -2));
    return createListMetaByParent(parent);
}

const createListMetaByParent = (parent?: Node): List['meta'] => {
    if (parent && (isList(parent) || isListItem(parent))) {
        const meta: List['meta'] = {
            type: getChildMetaType(parent.meta?.type),
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

const getChildMetaType = (type?: MetaType) => {
    switch (type) {
        case MetaType.CHAPTER:
            return MetaType.ART;
        case MetaType.ART:
            case MetaType.SUBART:
            return MetaType.SUBART;
        default:
            return MetaType.CHAPTER;
    }
}

export default createListMeta;