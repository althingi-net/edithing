
import { Switch } from 'antd';
import { Bill, BillDocument, BillDocumentService } from 'client-sdk';
import { FC, useEffect, useState } from 'react';
import { useNavigation } from 'react-router-dom';
import { exportBillXml } from 'law-document';
import { CodeBlock } from 'react-code-blocks';
import Loader from '../App/Loader';
import { handleErrorWithTranslations } from '../App/handleError';
import useLanguageContext from '../App/useLanguageContext';
import BillDocumentPreview from './BillDocumentPreview';
import './BillPreview.css';

interface Props {
    bill: Bill;
}

const useBillDocuments = (bill: Bill) => {
    const { t } = useLanguageContext();
    const [documents, setDocuments] = useState<BillDocument[]>([]);
    const navigation = useNavigation();

    useEffect(() => {
        if (bill.id) {
            BillDocumentService.billDocumentControllerGetAll(bill.id)
                .then(setDocuments)
                .catch(handleErrorWithTranslations(t));
        }
    }, [bill.id, navigation, t, navigation]);

    return documents;
};

const BillPreview: FC<Props> = ({ bill }) => {
    const { title } = bill;
    const { t } = useLanguageContext();
    const documents = useBillDocuments(bill);
    const [display, setDisplay] = useState<'live' | 'xml'>('live');

    return (
        <div className='bill-preview'>
            <div className='actions'>
                <Switch
                    checkedChildren={t('Live')}
                    unCheckedChildren={t('XML')}
                    checked={display === 'live'}
                    onChange={(checked) => setDisplay(checked ? 'live' : 'xml')}
                />
            </div>
            <h1>{title}</h1>
            <div className='content'>
                <Loader loading={documents.length === 0}>
                    {display === 'live' && documents.map((document, index) => 
                        <BillDocumentPreview
                            key={document.id}
                            bill={bill}
                            document={document}
                            index={index}
                        />
                    )}
                    {display === 'xml' && (
                        <CodeBlock
                            text={exportBillXml(bill.title, documents)}
                            language={'xml'}
                            customStyle={{ overflowX: 'visible' }}
                        />
                    )}
                </Loader>
            </div>
        </div>
    );
};

export default BillPreview;