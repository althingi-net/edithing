import { Descendant } from 'slate';
import { MetaType, ElementType } from '../Slate';

interface List {
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

export default List;