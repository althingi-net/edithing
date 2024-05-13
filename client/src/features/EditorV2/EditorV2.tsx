import { FC } from 'react';
import EditorNode from './EditorNode';

const EditorV2: FC = () => {
    const schema = {
        title: {
            inline: true,
        },
        name: {
            inline: true,
        },
        sen: {
            inline: true,
        },
    };
    const content = [{
        id: '1',
        type: 'chapter',
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
    }];
    
    const nodes = content.map((node) => <EditorNode
        key={node.id}
        node={node}
        schema={schema}
        config={{
            editable: true,
        }}
    />);

    return (
        <>
            {nodes}
        </>
    );
};

export default EditorV2;