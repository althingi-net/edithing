export interface Node {
    id: string;
    type: string;
    text?: string;
    children?: Node[];
    attributes?: Record<string, string>;
}
