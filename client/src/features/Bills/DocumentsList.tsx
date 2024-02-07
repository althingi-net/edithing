/* eslint-disable jsx-a11y/click-events-have-key-events */
import { FileAddOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { GithubFile } from 'client-sdk';
import { FC } from 'react';
import useLanguageContext from '../App/useLanguageContext';
import formatIdentifier from '../Documents/formatIdentifier';

interface Props {
    documents: GithubFile[] | undefined,
    onAddDocument: (identifier: string) => void,
    setSelected: (identifier: string) => void,
    selected?: string;
}

const DocumentsList: FC<Props> = ({ documents, onAddDocument, setSelected, selected }) => {
    const { t } = useLanguageContext();

    return (
        <>
            {documents?.map(doc => 
                <div
                    className={['list-item', selected === doc.identifier ? 'selected' : ''].join(' ')}
                    key={doc.identifier}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelected(doc.identifier)}
                >
                    <div className='infos'>
                        <div className='item-identifier'>{formatIdentifier(doc.identifier)}</div>
                        <div className='item-title'>{doc.name}</div>
                    </div>
                    <div className='item-actions'>
                        <Tooltip title={t('Add document to bill and start editing')}>
                            <div
                                className='item-action add'
                                role='button'
                                tabIndex={0}
                                onClick={(event) => {
                                    event.stopPropagation();
                                    onAddDocument(doc.identifier);
                                }}
                            >
                                <FileAddOutlined />
                            </div>
                        </Tooltip>
                    </div>
                </div>
            )}
        </>
    );
};

export default DocumentsList;