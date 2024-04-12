import { GitJsonMerger } from 'git-json-merger';
import BillDocument from '../entities/BillDocument';
import BillDocumentUpdate, { UpdateStatus } from '../entities/BillDocumentUpdate';
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
        select: ['billDocumentId', 'title', 'content', 'events', 'gitHash'],
    });

    if (!update) {
        return;
    }

    const { billDocumentId, title, gitHash } = update;
    const originalDocument = await BillDocument.findOne({
        where: { id: billDocumentId },
        select: ['content', 'events', 'billId'],
    });

    if (!originalDocument) {
        return;
    }

    // Merge the changes
    const merger = new GitJsonMerger(`${originalDocument.billId}-${billDocumentId}`);
    const isGitInitialized = await merger.git.exists();
    
    if (!gitHash && !isGitInitialized) {
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
};

const stringifyPayload = ({ content, events }: { content: object, events: object }) => {
    return {
        content: JSON.stringify(content),
        events: JSON.stringify(events),
    };
};

const parsePayload = ({ content, events }: { content: string, events: string }) => {
    return {
        content: JSON.parse(content),
        events: JSON.parse(events),
    };
};

const isBillDocumentPayload = (payload: any): payload is { content: object, events: object } => {
    return payload.content && payload.events;
};