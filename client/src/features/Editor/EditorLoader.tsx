import { DocumentService } from 'client-sdk';
import { FC, useEffect, useState } from 'react';
import { Descendant } from 'slate';
import Loader from '../App/Loader';
import { handleErrorWithTranslations } from '../App/handleError';
import useLanguageContext from '../App/useLanguageContext';
import Editor from './Editor';

interface EditorLoaderProps {
    identifier: string;
}

const EditorLoader: FC<EditorLoaderProps> = ({ identifier }) => {
    const [xml, setXml] = useState<string>();
    const { t } = useLanguageContext();
    const [slate, setSlate] = useState<Descendant[] | null>(null);
    const [originalDocument, setOriginalDocument] = useState<Descendant[]>();

    useEffect(() => {
        DocumentService.documentControllerGet(identifier)
            .then((document) => {
                setXml(document.originalXml);
                setOriginalDocument(JSON.parse(document.content) as Descendant[]);
                setSlate(JSON.parse(document.content) as Descendant[]);
            })
            .catch(handleErrorWithTranslations(t));
    }, [identifier, t]);

    if (!slate || !originalDocument || !xml) {
        return <Loader />;
    }

    return (
        <Editor slate={slate} originalDocument={originalDocument} xml={xml} />
    );
};

export default EditorLoader;