import { Content } from 'antd/es/layout/layout';
import { DocumentService } from 'client-sdk';
import { FC, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { formatIdentifier } from 'law-document';
import { Editor } from 'law-document-editor';
import Loader from '../features/App/Loader';
import NotFoundError from '../features/App/NotFoundError';
import useDocument from '../features/Documents/useDocument';
import 'law-document-editor/src/Editor/Editor.css';
import { useStore } from '../features/App/store/useStore';

const LawPage: FC = () => {
    const { identifier } = useParams();
    const { isNavigationBlocked, setNavigationBlocked } = useStore();
    const { setDocument, xml, slate, originalDocument, importError } = useDocument();
    const [hasError, setError] = useState(false);
    const navigate = useNavigate();
    const t = useStore((state) => state.t);
    // TODO: simplify this by creating a store slice
    const navigationBlocker = {
        blockNavigation: () => setNavigationBlocked(true),
        unblockNavigation: () => setNavigationBlocked(false),
        isNavigationBlocked,
        goTo: navigate,
    };

    // reset error when url changes
    useEffect(() => {
        setError(false);
    }, [identifier]);

    if (!identifier) {
        throw new Error('Missing identifier');
    }

    useEffect(() => {
        DocumentService.documentControllerGet(identifier)
            .then(setDocument)
            .catch((error) => {
                setError(true);
                console.error(error);
            });
    }, [identifier, setDocument]);

    if (hasError) {
        return <NotFoundError />;
    }

    if (!slate || !originalDocument || !xml) {
        return <Loader />;
    }

    if (importError) {
        return (
            <Content style={{ padding: '20px', height: 'calc(100% - 64px)' }}>
                <h3>{formatIdentifier(identifier)}</h3>
                <p><b>{t('Document not available')}</b></p>
                <p>{importError}</p>
            </Content>
        );
    }

    return (
        <Content style={{ padding: '20px', height: 'calc(100% - 64px)' }}>
            <Editor
                readOnly={true}
                slate={slate}
                originalDocument={originalDocument}
                xml={xml}
                t={t}
                navigationBlocker={navigationBlocker}
            />
        </Content>
    );
};

export default LawPage;