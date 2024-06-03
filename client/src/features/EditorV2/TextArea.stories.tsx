import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { createRef, useState } from 'react';
import TextArea from './TextArea';

const meta: Meta<typeof TextArea> = {
    title: 'EditorV2/TextArea',
    component: TextArea,
};
    
export default meta;
type Story = StoryObj<typeof TextArea>;
  
export const Default: Story = {
    args: {
        onChange: fn(),
    },
};
  
export const Placeholder: Story = {
    args: {
        onChange: fn(),
        placeholder: 'Enter text here...',
    },
};
  
export const InitialValue: Story = {
    args: {
        onChange: fn(),
        value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
};

export const ExternalModifications: Story = {
    decorators: [
        () => {
            const [value, setValue] = useState('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.');
            const ref = createRef<HTMLDivElement>();

            return (
                <>
                    <button onClick={() => ref.current?.focus()}>Focus</button>
                    <button onClick={() => setValue(value + ' ' + Math.random())}>Set Value</button>
                    <TextArea ref={ref} value={value} onChange={setValue} />
                </>
            );
        },
    ],
};