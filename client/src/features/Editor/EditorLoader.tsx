import { DocumentService, GithubFile } from 'client-sdk';
import { FC, useEffect, useState } from 'react';
import { Descendant } from 'slate';
import Loader from '../App/Loader';
import { handleErrorWithTranslations } from '../App/handleError';
import useLanguageContext from '../App/useLanguageContext';
import Editor from './Editor';

interface EditorLoaderProps {
    file: GithubFile;
}

const EditorLoader: FC<EditorLoaderProps> = ({ file }) => {
    const [xml, setXml] = useState<string>();
    const { t } = useLanguageContext();
    const [slate, setSlate] = useState<Descendant[] | null>(null);
    const [originalDocument, setOriginalDocument] = useState<Descendant[]>();

    useEffect(() => {
        const [nr, year] = file.identifier.split('/');
        DocumentService.documentControllerGet(nr, year)
            .then((document) => {
                setXml(document.xml);
                setOriginalDocument(JSON.parse(document.content) as Descendant[]);
                setSlate(JSON.parse(document.content) as Descendant[]);
            })
            .catch(handleErrorWithTranslations(t));
    }, [file, t]);

    if (!slate || !originalDocument || !xml) {
        return <Loader />;
    }

    return (
        <Editor slate={slate} originalDocument={originalDocument} xml={xml} />
    );
};

export default EditorLoader;