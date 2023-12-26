import { Descendant, Element, Node } from 'slate';
import { ElementType, MetaType } from '../../old/Slate';

export interface List {
    type: ElementType.LIST;
    children: Descendant[];
    meta?: ListMeta;
}

export interface ListMeta {
    type: MetaType;
    nrType?: 'roman' | 'numeric' | 'alphabet'; // roman, numeric, alphabet, mixed
}

export interface ListWithMeta extends List {
    meta: ListMeta;
}

export const isList = (node?: Node | null): node is List => {
    return Element.isElementType(node, ElementType.LIST);
};

