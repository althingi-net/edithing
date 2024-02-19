/* eslint-disable @typescript-eslint/ban-ts-comment */
import 'dotenv/config';
import 'reflect-metadata';
import database from '../config/database';
import { initConnection } from '../integration/database/connection';
import { findOrImportDocument, loadIndexXml } from '../services/DocumentService';
import Bill from '../entities/Bill';
import BillDocument, { UpdateBillDocument } from '../entities/BillDocument';
import Document from '../entities/Document';
import History from '../entities/History';
import User, { UserRole } from '../entities/User';
import * as repl from 'repl';

void (async () => {
    // @ts-ignore
    database.logging = false;
    await initConnection();

    Object.assign(global as any, {
        Bill,
        BillDocument,
        UpdateBillDocument,
        Document,
        History,
        User,
        UserRole,
        findOrImportDocument,
        loadIndexXml,
    });

    repl.start("> ");

})();