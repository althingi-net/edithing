import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from 'antd';
import { LanguageContextProvider } from '../App/useLanguageContext';
import XmlModal from './XmlModal';

const meta: Meta<typeof XmlModal> = {
    title: 'EditorV2/XmlModal',
    component: XmlModal,
    decorators: [
        (Story) => (
            <LanguageContextProvider>
                <Skeleton title avatar />
                <Skeleton />
                <Skeleton />
                <Story />
            </LanguageContextProvider>
        ),
    ],
};
    
export default meta;
type Story = StoryObj<typeof XmlModal>;
  
export const ImportXmlModal: Story = {
    args: {
        title: 'Import XML',
        actionTitle: 'Import',
        isOpen: true,
        editable: true,
    },
};
  
export const ExportXmlModal: Story = {
    args: {
        title: 'Export XML',
        actionTitle: 'Export',
        content: '<xml></xml>',
        isOpen: true,
    },
};