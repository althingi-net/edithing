import { Content } from 'antd/es/layout/layout';
import { DocumentService } from 'client-sdk';
import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Loader from '../features/App/Loader';
import NotFoundError from '../features/App/NotFoundError';
import useDocument from '../features/Documents/useDocument';
import Editor from '../features/Editor/Editor';

const LawPage: FC = () => {
    const { identifier } = useParams();
    const { setDocument, xml, slate, originalDocument } = useDocument();
    const [hasError, setError] = useState(false);

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
    });

    if (hasError) {
        return <NotFoundError />;
    }

    if (!slate || !originalDocument || !xml) {
        return <Loader />;
    }

    return (
        <Content style={{ padding: '20px', height: 'calc(100% - 64px)' }}>
            <Editor readOnly={true} slate={slate} originalDocument={originalDocument} xml={xml} />
        </Content>
    );
};

export default LawPage;