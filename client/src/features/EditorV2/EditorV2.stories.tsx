import type { Meta, StoryObj } from '@storybook/react';
import { EditorStateContextProvider, InitialPayload } from './EditorStateContext';
import EditorV2 from './EditorV2';
import { createV2BenchmarkSample } from './createBenchmarkSample';

const initialState: InitialPayload = {
    config: {
        editable: false,
        editMenu: false,
    },
    schema: {
        title: {
            inline: true,
        },
        name: {
            inline: true,
        },
        sen: {
            inline: true,
        },
    },
    nodes: [{
        id: '1',
        type: 'node',
        attributes: {
            nr: 'I',
            nrType: 'roman',
        },
        children: [
            {
                id: '2',
                type: 'title',
                text: 'I. kafli.',
            },
            {
                id: '3',
                type: 'name',
                text: 'Markmið, gildissvið og orðskýringar.',
            },
            {
                id: '4',
                type: 'sen',
                attributes: {
                    nr: '1',
                },
                text: 'Lög þessi gilda um uppbyggingu og rekstur flugvalla í eigu íslenska ríkisins og þá rekstrarstjórnun flugumferðar/flugleiðsöguþjónustu sem veitt er af hálfu íslenska ríkisins á íslensku yfirráðasvæði eða á grundvelli alþjóðlegra skuldbindinga',
            },
            {
                id: '5',
                type: 'sen',
                attributes: {
                    nr: '2',
                },
                text: 'Opinbert hlutafélag, Isavia ohf. eða dótturfélög, annast fyrir hönd íslenska ríkisins rekstur flugvalla í eigu ríkisins og rekstrarstjórnun flugumferðar og flugleiðsöguþjónustu sem veitt er af hálfu ríkisins á íslensku yfirráðasvæði eða á grundvelli alþjóðlegra skuldbindinga eftir því sem kveðið er á um í lögum þessum.',
            },
        ],
    }],
};

const meta: Meta<typeof EditorV2> = {
    title: 'EditorV2/Editor',
    component: EditorV2,
    parameters: {
        deepControls: { enabled: true },
    },
    decorators: [
        (Story) => (
            <EditorStateContextProvider initialState={initialState}>
                <Story />
            </EditorStateContextProvider>
        ),
    ]
};
    
export default meta;
type Story = StoryObj<typeof EditorV2>;
  
export const ReadOnly: Story = {
    decorators: [
        (Story) => (
            <EditorStateContextProvider initialState={initialState}>
                <Story />
            </EditorStateContextProvider>
        ),
    ]
};
  
export const Editable: Story = {
    decorators: [
        (Story) => (
            <EditorStateContextProvider initialState={{ ...initialState, config: { editable: true, editMenu: false, reduxDevTools: true, undoable: true } }}>
                <Story />
            </EditorStateContextProvider>
        ),
    ]
};
export const EditableAdvanced: Story = {
    decorators: [
        (Story) => (
            <EditorStateContextProvider initialState={{ ...initialState, config: { editable: true, editMenu: true, reduxDevTools: true, undoable: true } }}>
                <Story />
            </EditorStateContextProvider>
        ),
    ]
};

const benchmarkSample = createV2BenchmarkSample();

export const Benchmark: Story = {
    tags: ['!autodocs'],
    decorators: [
        (Story) => (
            <EditorStateContextProvider initialState={{ ...benchmarkSample, config: { editable: true, editMenu: true, reduxDevTools: true, undoable: true } }}>
                <Story />
            </EditorStateContextProvider>
        ),
    ],
    
};