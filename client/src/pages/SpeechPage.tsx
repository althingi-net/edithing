import { Col, Row } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { FC } from 'react';
// import useLanguageContext from '../features/App/useLanguageContext';
import { ElementType } from 'law-document';
import SpeechEditor from '../features/Editor/SpeechEditor';

const SpeechPage: FC = () => {
    // const { t } = useLanguageContext();

    return (
        <Content style={{ textAlign: 'left', padding: '20px', height: 'calc(100% - 64px)' }}>
            <Row gutter={16} style={{ height: '100%' }}>
                <Col span={20} style={{ height: '100%' }}>
                    <Content style={{ paddingLeft: '20px', height: '100%', overflow: 'hidden'  }}>
                        <SpeechEditor
                            slate={[{ type: ElementType.PARAGRAPH, children: [{ text: '' }] }]}
                        />
                    </Content>
                </Col>
            </Row>
        </Content>
    );
};

export default SpeechPage;