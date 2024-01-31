import { Content } from 'antd/es/layout/layout';
import { DocumentService } from 'client-sdk';
import { FC, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../features/App/Header';
import Loader from '../features/App/Loader';
import { handleErrorWithTranslations } from '../features/App/handleError';
import useLanguageContext from '../features/App/useLanguageContext';
import useDocument from '../features/Documents/useDocument';
import Editor from '../features/Editor/Editor';

const LawPage: FC = () => {
    const { identifier } = useParams();
    const { t } = useLanguageContext();
    const { setDocument, xml, slate, originalDocument } = useDocument();

    if (!identifier) {
        throw new Error('Missing identifier');
    }

    useEffect(() => {
        DocumentService.documentControllerGet(identifier)
            .then(setDocument)
            .catch(handleErrorWithTranslations(t));
    });

    if (!slate || !originalDocument || !xml) {
        return <Loader />;
    }

    return (
        <>
            <Header />
            <Content style={{ padding: '20px', height: 'calc(100% - 64px)' }}>
                <Editor readOnly={true} slate={slate} originalDocument={originalDocument} xml={xml} />
            </Content>
        </>
    );
};

export default LawPage;