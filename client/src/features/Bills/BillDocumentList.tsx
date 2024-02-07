/* eslint-disable jsx-a11y/click-events-have-key-events */
import { DeleteOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { BillDocument } from 'client-sdk';
import { FC } from 'react';
import useLanguageContext from '../App/useLanguageContext';
import formatIdentifier from '../Documents/formatIdentifier';

interface Props {
    billDocuments: BillDocument[] | undefined,
    onDeleteDocument: (identifier: string) => void,
    setSelected: (identifier: string) => void,
    selected?: string;
}

const BillDocumentList: FC<Props> = ({ billDocuments, onDeleteDocument, setSelected, selected }) => {
    const { t } = useLanguageContext();

    return (
        <>
            {billDocuments?.map(doc => 
                <div
                    className={['list-item', selected === doc.identifier ? 'selected' : ''].join(' ')}
                    key={doc.title}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelected(doc.identifier)}
                >
                    <div className='infos'>
                        <div className='item-identifier'>{formatIdentifier(doc.identifier)}</div>
                        <div className='item-title'>{doc.title}</div>
                    </div>
                    <div className='item-actions'>
                        <Tooltip title={t('Remove document from bill and delete changes')}>
                            <div
                                className='item-action delete'
                                role='button'
                                tabIndex={0}
                                onClick={(event) => {
                                    event.stopPropagation();
                                    onDeleteDocument(doc.identifier);
                                }}
                            >
                                <DeleteOutlined />
                            </div>
                        </Tooltip>
                    </div>
                </div>
            )}
        </>
    );
};

export default BillDocumentList;