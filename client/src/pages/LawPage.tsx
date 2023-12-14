import { Button, Flex } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../features/App/Header';
import useLanguageContext from '../features/App/useLanguageContext';
import useLawListContext from '../features/DocumentSelector/useLawListContext';
import Editor from '../features/Editor/Editor';

const LawPage: FC = () => {
    const { t } = useLanguageContext();
    const navigate = useNavigate();
    const { nr, year } = useParams();
    const { lawList } = useLawListContext();
    const lawListEntry = lawList.find(law => law.identifier === `${nr}/${year}`);
    
    if (!lawListEntry) {
        if (lawList.length === 0) {
            return <h1>{t('Loading...')}</h1>;
        }

        return <h1>{t('Not found!')}</h1>;
    }

    const { identifier, name } = lawListEntry;

    return (
        <>
            <Header />
            <Content style={{ padding: '50px' }}>
                <Flex align='center' gap='20px'>
                    <Button onClick={() => navigate('/')}>{t('Back')}</Button>
                    <h3 style={{ flexGrow: 1 }}>{identifier} {name}</h3>
                </Flex>
                <Editor file={lawListEntry} />
            </Content>
        </>
    );
};

export default LawPage;