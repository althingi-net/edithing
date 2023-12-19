import { Descendant, Element, Node } from 'slate';
import { ElementType, MetaType } from '../Slate';
import { ListMeta } from './List';

interface ListItem {
    type: ElementType.LIST_ITEM;
    children: Descendant[];
    meta?: ListItemMeta;
}

export interface ListItemWithMeta extends ListItem {
    meta: ListItemMeta;
}

export interface ListItemMeta extends ListMeta {
    /** LawParagraph tag */
    type: MetaType;

    /** List Item Number. See nrType */
    nr: string;

    /** Nr at import or when first created, used by compareDocuments() to find the original paragraphId */
    originNr: string;

    nrType?: 'roman' | 'numeric' | 'alphabet'; // roman, numeric, alphabet, mixed. By default empty (which means numeric)


    /** Only set when nrType=roman, should always have the numeric value of nr */
    romanNr?: string;

    /** Determines if the listItemText node should contain a title node */
    title?: boolean;

    /** Determines if the listItemText node should contain a name node */
    name?: boolean;

    /** Defines display style of this node */
    styleNote?: string; // inline-with-parent
}

export const isListItem = (node?: Partial<Node> | null): node is ListItem => {
    return Element.isElementType(node, ElementType.LIST_ITEM);
};

export const isListItemMeta = (meta: object): meta is ListItemMeta => {
    return 'nr' in meta && 'type' in meta;
};

export default ListItem;

