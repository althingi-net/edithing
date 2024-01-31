/* eslint-disable jsx-a11y/click-events-have-key-events */
import { DeleteOutlined, FileAddOutlined } from '@ant-design/icons';
import { Collapse } from 'antd';
import { Document, GithubFile } from 'client-sdk';
import { FC } from 'react';
import useLanguageContext from '../App/useLanguageContext';
import './BillDocumentExplorer.css';

interface Props {
    selected?: string;
    setSelected: (identifier: string) => void;
    lawList: GithubFile[];
    billDocuments: Document[] | undefined;
    onAddDocument: (identifier: string) => void;
    onDeleteDocument: (identifier: string) => void;
}

const BillDocumentExplorer: FC<Props> = ({ setSelected, selected, lawList, billDocuments, onAddDocument, onDeleteDocument }) => {
    const { t } = useLanguageContext();
    const availableDocuments = lawList.filter(law => !billDocuments?.find(doc => doc.identifier === law.identifier));   

    return (
        <div className='bill-document-explorer'>
            <div className='bill-header'>
                <div className='bill-title'>Bill Document Explorer</div>
            </div>

            <Collapse
                defaultActiveKey={['1']}
                size='small'
                ghost={true}
            >
                <Collapse.Panel header={t('Documents in the Bill')} key="1">
                    <div className='explorer-list bill-documents'>
                        {billDocuments?.map(doc => 
                            <div
                                className={['list-item', selected === doc.identifier ? 'selected' : ''].join(' ')}
                                key={doc.title}
                                role="button"
                                tabIndex={0}
                                onClick={() => setSelected(doc.identifier)}
                            >
                                <div className='infos'>
                                    <div className='item-identifier'>{doc.identifier}</div>
                                    <div className='item-title'>{doc.title}</div>
                                </div>
                                <div className='item-actions'>
                                    <div className='item-action delete' role='button' tabIndex={0} onClick={() => onDeleteDocument(doc.identifier)}><DeleteOutlined /></div>
                                </div>
                            </div>
                        )}
                    </div>
                </Collapse.Panel>
                <Collapse.Panel header={t('Legal Codex')} key="2">
                    <div className='explorer-list'>
                        {availableDocuments.map(doc => 
                            <div
                                className={['list-item', selected === doc.identifier ? 'selected' : ''].join(' ')}
                                key={doc.identifier}
                                role="button"
                                tabIndex={0}
                                onClick={() => setSelected(doc.identifier)}
                            >
                                <div className='infos'>
                                    <div className='item-identifier'>{doc.identifier}</div>
                                    <div className='item-title'>{doc.name}</div>
                                </div>
                                <div className='item-actions'>
                                    <div className='item-action add' role='button' tabIndex={0} onClick={() => onAddDocument(doc.identifier)}><FileAddOutlined /></div>
                                </div>
                            </div>
                        )}
                    </div>
                </Collapse.Panel>
            </Collapse>
        </div>
    );
};

export default BillDocumentExplorer;