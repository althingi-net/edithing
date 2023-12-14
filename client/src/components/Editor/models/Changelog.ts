
interface Changelog {
    id: string;
    text?: string;
    type: 'added' | 'changed' | 'deleted';
    changes?: [type: number, text: string][];
}

export default Changelog;