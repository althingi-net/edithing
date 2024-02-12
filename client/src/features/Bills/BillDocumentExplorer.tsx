import { Collapse } from 'antd';
import { BillDocument, GithubFile } from 'client-sdk';
import { FC, useMemo, useState } from 'react';
import useLanguageContext from '../App/useLanguageContext';
import filterLawEntry from '../Documents/filterLawEntry';
import './BillDocumentExplorer.css';
import BillDocumentList from './BillDocumentList';
import DocumentsList from './DocumentsList';
import PanelHeader from './PanelHeader';

interface Props {
    selected?: string;
    setSelected: (identifier: string) => void;
    lawList: GithubFile[];
    billDocuments: BillDocument[] | undefined;
    onAddDocument: (identifier: string) => void;
    onDeleteDocument: (identifier: string) => void;
}

const isInBillDocuments = (law: GithubFile, billDocuments: BillDocument[] | undefined) => {
    return billDocuments?.find(doc => doc.identifier === law.identifier);
};

const BillDocumentExplorer: FC<Props> = ({ setSelected, selected, lawList, billDocuments, onAddDocument, onDeleteDocument }) => {
    const { t } = useLanguageContext();
    const [filter, setFilter] = useState('');
    const availableDocuments = useMemo(() => {
        return lawList.filter(law => 
            !isInBillDocuments(law, billDocuments)
            && filterLawEntry(filter)(law));
    }, [lawList, billDocuments, filter]);

    return (
        <div className='bill-document-explorer'>
            <div className='bill-header'>
                <div className='bill-title'>{t('Bill Document Explorer')}</div>
            </div>

            <Collapse
                defaultActiveKey={['1', '2']}
                size='small'
                ghost={true}
            >
                <Collapse.Panel
                    header={t('Documents in the Bill')}
                    key="1"
                >
                    <div className='explorer-list bill-documents'>
                        <BillDocumentList
                            billDocuments={billDocuments}
                            onDeleteDocument={onDeleteDocument}
                            setSelected={setSelected}
                            selected={selected}
                        />
                    </div>
                </Collapse.Panel>
                <Collapse.Panel
                    header={<PanelHeader title={t('Legal Codex')} onFilter={setFilter} />} 
                    key="2"
                >
                    <div className='explorer-list'>
                        <DocumentsList
                            documents={availableDocuments}
                            onAddDocument={onAddDocument}
                            setSelected={setSelected}
                            selected={selected}
                        />
                    </div>
                </Collapse.Panel>
            </Collapse>
        </div>
    );
};

export default BillDocumentExplorer;