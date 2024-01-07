import { ReactEditor } from 'slate-react';
import { YjsEditor } from './withYjs';

declare module 'law-document' {
    interface LawEditor extends ReactEditor, YjsEditor {}
}