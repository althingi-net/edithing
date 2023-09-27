
interface Changelog {
    id: string;
    text?: string;
    type: 'add' | 'change' | 'delete';
    changes?: [type: number, text: string][];
}

export default Changelog;