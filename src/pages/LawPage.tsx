import { Button, Flex, Radio } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { FC } from 'react';
import ReactCountryFlag from 'react-country-flag';
import { useNavigate, useParams } from 'react-router-dom';
import useLawListContext from '../components/DocumentSelector/useLawListContext';
import Editor from '../components/Editor/Editor';
import useLanguageContext from '../components/App/useLanguageContext';

const LawPage: FC = () => {
    const { t, language, setLanguage } = useLanguageContext();
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
        <Content style={{ padding: '50px' }}>
            <Flex align='center' gap='20px'>
                <Button onClick={() => navigate('/')}>{t('Back')}</Button>
                <h3 style={{ flexGrow: 1 }}>{identifier} {name}</h3>

                <Radio.Group value={language} onChange={(event) => setLanguage(event.target.value)}>
                    <Radio.Button value="en"><ReactCountryFlag countryCode="GB" /></Radio.Button>
                    <Radio.Button value="is"><ReactCountryFlag countryCode="IS" /></Radio.Button>
                </Radio.Group>
            </Flex>
            <Editor file={lawListEntry} />
        </Content>
    );
};

export default LawPage;