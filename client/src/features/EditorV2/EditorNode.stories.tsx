import type { Meta, StoryObj } from '@storybook/react';
import EditorNode from './EditorNode';

const meta: Meta<typeof EditorNode> = {
    title: 'EditorV2/EditorNode',
    component: EditorNode,
    parameters: {
        deepControls: { enabled: true },
    },
};
    
export default meta;
type Story = StoryObj<typeof EditorNode>;
  
export const SimpleNode: Story = {
    args: {
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
        node: {
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
        },
    },
};


export const NestedNodes: Story = {
    args: {
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
        node: {
            id: '1',
            type: 'chapter',
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
                    type: 'art',
                    children: [
                        {
                            id: '5',
                            type: 'title',
                            text: '1. gr.',
                        },
                        {
                            id: '6',
                            type: 'subart',
                            children: [
                                {
                                    id: '7',
                                    type: 'sen',
                                    text: 'Lög þessi gilda um uppbyggingu og rekstur flugvalla í eigu íslenska ríkisins og þá rekstrarstjórnun flugumferðar/flugleiðsöguþjónustu sem veitt er af hálfu íslenska ríkisins á íslensku yfirráðasvæði eða á grundvelli alþjóðlegra skuldbindinga',
                                },
                                {
                                    id: '8',
                                    type: 'sen',
                                    text: 'Opinbert hlutafélag, Isavia ohf. eða dótturfélög, annast fyrir hönd íslenska ríkisins rekstur flugvalla í eigu ríkisins og rekstrarstjórnun flugumferðar og flugleiðsöguþjónustu sem veitt er af hálfu ríkisins á íslensku yfirráðasvæði eða á grundvelli alþjóðlegra skuldbindinga eftir því sem kveðið er á um í lögum þessum.',
                                },
                            ],
                        }
                    ],
                },
            ],
        },
    },
};


export const Editable: Story = {
    args: {
        config: {
            editable: true,
            editMenu: true,
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
                paragraph: true,
            },
        },
        node: {
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
                    type: 'name',
                },
                {
                    id: '5',
                    type: 'sen',
                    text: 'Lög þessi gilda um uppbyggingu og rekstur flugvalla í eigu íslenska ríkisins og þá rekstrarstjórnun flugumferðar/flugleiðsöguþjónustu sem veitt er af hálfu íslenska ríkisins á íslensku yfirráðasvæði eða á grundvelli alþjóðlegra skuldbindinga',
                },
                {
                    id: '6',
                    type: 'sen',
                    text: 'Opinbert hlutafélag, Isavia ohf. eða dótturfélög, annast fyrir hönd íslenska ríkisins rekstur flugvalla í eigu ríkisins og rekstrarstjórnun flugumferðar og flugleiðsöguþjónustu sem veitt er af hálfu ríkisins á íslensku yfirráðasvæði eða á grundvelli alþjóðlegra skuldbindinga eftir því sem kveðið er á um í lögum þessum.',
                },
            ],
        },
    },
};