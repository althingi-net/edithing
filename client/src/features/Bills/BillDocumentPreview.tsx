import { Bill, BillDocument } from 'client-sdk';
import { convertRomanNumber, formatIdentifier } from 'law-document';
import { FC } from 'react';
import { Link } from 'react-router';
import { useStore } from '../App/store/useStore';

interface Props {
    bill: Bill;
    document: BillDocument;
    index: number;
}

const BillDocumentPreview: FC<Props> = ({ bill, document, index }) => {
    const t = useStore((state) => state.t);

    return (
        <div className='bill-document-preview'>
            <h2>{`${convertRomanNumber(index + 1)}. ${t('Chapter')}`}</h2>
            <h3>
                <span>{t('Amendment to')} </span>
                <Link to={`/bill/${bill.id}/document/${document.identifier}`}>
                    {document.title}, {t('no.')} {formatIdentifier(document.identifier)}
                </Link>
                <span>.</span>
            </h3>
        </div>
    );
};

export default BillDocumentPreview;