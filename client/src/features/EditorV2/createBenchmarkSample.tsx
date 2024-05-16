import { Node } from './Node';

export const createBenchmarkSample = () => {
    const nodes: Node[] = [];
    const count = 10;
    let id = 0;

    for (let c = 0; c < count; c++) {
        const cChildren: Node[] = [];

        nodes.push({
            id: `${id++}`,
            type: 'chapter',
            attributes: {
                nr: c.toString(),
                nrType: 'roman',
            },
            children: cChildren,
        });

        for (let a = 0; a < count; a++) {
            const aChildren: Node[] = [];

            cChildren.push({
                id: `${id++}`,
                type: 'art',
                attributes: {
                    nr: a.toString(),
                },
                children: aChildren,
            });

            for (let s = 0; s < count; s++) {
                const sChildren: Node[] = [];

                aChildren.push({
                    id: `${id++}`,
                    type: 'subart',
                    attributes: {
                        nr: s.toString(),
                    },
                    children: sChildren,
                });

                for (let t = 0; t < count; t++) {
                    sChildren.push({
                        id: `${id++}`,
                        type: 'sen',
                        attributes: {
                            nr: t.toString(),
                        },
                        text: 'Lög þessi gilda um uppbyggingu og rekstur flugvalla í eigu íslenska ríkisins og þá rekstrarstjórnun flugumferðar/flugleiðsöguþjónustu sem veitt er af hálfu íslenska ríkisins á íslensku yfirráðasvæði eða á grundvelli alþjóðlegra skuldbindinga',
                    });
                }
            }
        }
    }

    return {
        config: {
            editable: true,
            editMenu: true,
        },
        schema: {
            sen: {
                inline: true,
            },
        },
        nodes,
    };
};
