import { Content } from 'antd/es/layout/layout';
import { FC } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../features/App/Header';
import EditorLoader from '../features/Editor/EditorLoader';

const LawPage: FC = () => {
    const { identifier } = useParams();

    if (!identifier) {
        throw new Error('Missing identifier');
    }

    return (
        <>
            <Header />
            <Content style={{ padding: '50px' }}>
                <EditorLoader identifier={identifier} />
            </Content>
        </>
    );
};

export default LawPage;