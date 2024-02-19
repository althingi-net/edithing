import { Bill, BillDocument } from 'client-sdk';
import { LawEditor, compareDocuments, convertRomanNumber, formatIdentifier, importXml } from 'law-document';
import { FC, useMemo } from 'react';
import { Link } from 'react-router-dom';
import useLanguageContext from '../App/useLanguageContext';
import LawChanges from '../Editor/LawChanges';

interface Props {
    bill: Bill;
    document: BillDocument;
    index: number;
}

const BillDocumentPreview: FC<Props> = ({ bill, document, index }) => {
    const { t } = useLanguageContext();

    const changelog = useMemo(() => {
        const editor = {
            children: JSON.parse(document.content),
            events: JSON.parse(document.events),
        } as unknown as LawEditor;
        
        return compareDocuments(editor, importXml(document.originalXml));
    }, [document.content, document.events, document.originalXml]);

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
            <LawChanges changelog={changelog} displayFullTextOnly />
        </div>
    );
};

export default BillDocumentPreview;