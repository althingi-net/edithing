import { ReactEditor } from 'slate-react';

declare module 'law-document' {
    interface LawEditor extends ReactEditor {}
}