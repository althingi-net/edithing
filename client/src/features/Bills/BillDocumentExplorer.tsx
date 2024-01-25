/* eslint-disable jsx-a11y/click-events-have-key-events */
import { DeleteOutlined, FileAddOutlined } from '@ant-design/icons';
import { Divider } from 'antd';
import { Document, GithubFile } from 'client-sdk';
import { FC } from 'react';
import './BillDocumentExplorer.css';

interface Props {
    selected: string | null;
    setSelected: (identifier: string) => void;
    lawList: GithubFile[];
    billDocuments: Document[] | undefined;
}

const BillDocumentExplorer: FC<Props> = ({ setSelected, selected, lawList, billDocuments }) => {
    return (
        <div className='bill-document-explorer'>
            <div className='bill-header'>
                <div className='bill-title'>Bill Document Explorer</div>
            </div>
            <Divider orientation="left">Documents in the Bill</Divider>
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
                            <div className='item-action delete'><DeleteOutlined /></div>
                        </div>
                    </div>
                )}
            </div>
            <Divider orientation="left">Available to add</Divider>
            <div className='explorer-list'>
                {lawList.map(doc => 
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
                            <div className='item-action add'><FileAddOutlined /></div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BillDocumentExplorer;