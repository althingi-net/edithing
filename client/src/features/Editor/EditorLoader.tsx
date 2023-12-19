import { notification } from 'antd';
import { GithubFile, DocumentService } from 'client-sdk';
import { FC, useState, useEffect } from 'react';
import { Descendant } from 'slate';
import useLanguageContext from '../App/useLanguageContext';
import importXml from './utils/xml/importXml';
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
            .then((document) => setXml(document.content));
    }, [file]);

    useEffect(() => {
        if (xml) {
            try {
                setOriginalDocument(importXml(xml));
                setSlate(importXml(xml));
            } catch (error) {
                notification.error({
                    message: t('Invalid Law Document'),
                    description: t('At this time, only the Law Document XML format is supported.'),
                });
            }
        }
    }, [t, xml]);

    if (!slate || !originalDocument || !xml) {
        return null;
    }

    return (
        <Editor slate={slate} originalDocument={originalDocument} xml={xml} />
    );
};

export default EditorLoader;