import { writeFile } from 'fs/promises';
import { GitJsonMerger } from 'git-json-merger';
import { exportBillXml } from 'law-document';
import Bill from '../entities/Bill';
import BillDocument from '../entities/BillDocument';
import BillDocumentUpdate, { UpdateStatus } from '../entities/BillDocumentUpdate';
import { postBillForValidation } from '../integration/lagasafnApi';
import connection from '../integration/messageQueue/connection';

export const subscribeBillDocumentUpdateQueue = async (overwriteChannel = 'BillDocumentUpdate') => {
    // @ts-expect-error - dynamic name for testing purposes
    await connection.consume(overwriteChannel, async (msg) => {
        try {
            console.log('queue consume', overwriteChannel, msg);
            await runBillDocumentUpdate(msg);
        } catch(error) {
            console.error(error);
            process.exit(1);
        }
    });
};

export const runBillDocumentUpdate = async (updateId: number) => {
    const update = await BillDocumentUpdate.findOne({
        where: { id: updateId },
        select: ['billDocumentId', 'title', 'content', 'gitHash'],
    });

    if (!update) {
        return;
    }

    const { billDocumentId, title, gitHash } = update;
    const originalDocument = await BillDocument.findOne({
        where: { id: billDocumentId },
        select: ['content', 'billId'],
    });

    if (!originalDocument) {
        return;
    }

    // Merge the changes
    const merger = new GitJsonMerger(`${originalDocument.billId}-${billDocumentId}`);
    const isGitInitialized = await merger.git.exists();
    
    if (!isGitInitialized) {
        await merger.init(
            parsePayload(originalDocument)
        );
    }

    const result = await merger.merge(
        parsePayload(update),
        gitHash,
    );


    // Save new document state
    if (result.error) {
        await BillDocumentUpdate.update({ id: updateId }, { status: UpdateStatus.ERROR });
    } else {
        if (!isBillDocumentPayload(result.document)) {
            throw new Error('Invalid payload');
        }

        await BillDocument.update({ id: billDocumentId }, {
            title,
            gitHash: result.hash,
            ...stringifyPayload(result.document),
        });

        await BillDocumentUpdate.update({ id: updateId }, { status: UpdateStatus.SUCCESS });
    }

    // Export bill xml to disk
    const bill = await Bill.findOne({
        where: { id: originalDocument.billId },
        select: ['title'],
        loadEagerRelations: false,
    });
    const documents = await BillDocument.find({
        where: { billId: originalDocument.billId },
        select: ['content'],
        loadEagerRelations: false,
    });

    if (!bill) {
        throw new Error('Bill not found');
    }

    const billXml = exportBillXml(bill.title, documents);
    await writeFile(`./tmp/bill-${originalDocument.billId}.xml`, billXml);
    console.log('Bill XML exported to', `./tmp/bill-${originalDocument.billId}.xml`);

    await postBillForValidation(billXml);
};

const stringifyPayload = ({ content }: { content: object }) => {
    return {
        content: JSON.stringify(content),
    };
};

const parsePayload = ({ content }: { content: string }) => {
    return {
        content: JSON.parse(content),
    };
};

const isBillDocumentPayload = (payload: any): payload is { content: object } => {
    return payload.content;
};