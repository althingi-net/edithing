
import { Bill, BillDocument, BillDocumentService } from 'client-sdk';
import { FC, useEffect, useState } from 'react';
import { useNavigation } from 'react-router-dom';
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
    const documents = useBillDocuments(bill);

    return (
        <div className='bill-preview'>
            <h1>{title}</h1>
            <Loader loading={documents.length === 0}>
                {documents.map((document, index) => 
                    <BillDocumentPreview
                        key={document.id}
                        bill={bill}
                        document={document}
                        index={index}
                    />
                )}
            </Loader>
        </div>
    );
};

export default BillPreview;