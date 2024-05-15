export interface Schema {
    [type: string]: {
        inline?: boolean;
        paragraph?: boolean;
        nestable?: boolean;
    };
}
