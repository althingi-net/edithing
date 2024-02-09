/* eslint-disable jsx-a11y/click-events-have-key-events */
import { VariableSizeList } from 'react-window';
import { FileAddOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { GithubFile } from 'client-sdk';
import { FC } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import useLanguageContext from '../App/useLanguageContext';
import formatIdentifier from '../Documents/formatIdentifier';
import Loader from '../App/Loader';
import getTextSize from '../App/getTextSize';

interface Props {
    documents: GithubFile[] | undefined,
    onAddDocument: (identifier: string) => void,
    setSelected: (identifier: string) => void,
    selected?: string;
}

const DocumentsList: FC<Props> = ({ documents, onAddDocument, setSelected, selected }) => {
    const { t } = useLanguageContext();

    if (!documents) return (
        <Loader />
    );

    const getItemSize = (index: number) => {
        const textBoxWidth = 183;
        const document = documents[index];
        const size = getTextSize(document.name);
        const lines = Math.ceil(size.width / textBoxWidth);
        return 15 + 20 + lines * 15;
    };

    return (
        <>
            <AutoSizer>
                {({ height, width }) => (
                    <VariableSizeList
                        itemCount={documents.length}
                        itemSize={getItemSize}
                        height={height}
                        width={width}
                    >
                        {({ index, style }) => (
                            <div
                                style={style}
                                className={['list-item', selected === documents[index].identifier ? 'selected' : ''].join(' ')}
                                key={documents[index].identifier}
                                role="button"
                                tabIndex={0}
                                onClick={() => setSelected(documents[index].identifier)}
                            >
                                <div className='infos'>
                                    <div className='item-identifier'>{formatIdentifier(documents[index].identifier)}</div>
                                    <div className='item-title'>{documents[index].name}</div>
                                </div>
                                <div className='item-actions'>
                                    <Tooltip title={t('Add document to bill and start editing')}>
                                        <div
                                            className='item-action add'
                                            role='button'
                                            tabIndex={0}
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                onAddDocument(documents[index].identifier);
                                            }}
                                        >
                                            <FileAddOutlined />
                                        </div>
                                    </Tooltip>
                                </div>
                            </div>
                        )}
                    </VariableSizeList>
                )}
            </AutoSizer>
        </>
    );
};

export default DocumentsList;