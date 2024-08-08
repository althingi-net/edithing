/* eslint-disable @typescript-eslint/ban-ts-comment */
import 'dotenv/config';
import 'reflect-metadata';
import * as repl from 'repl';
import database from '../config/database';
import Bill from '../entities/Bill';
import BillDocument, { UpdateBillDocument } from '../entities/BillDocument';
import Document from '../entities/Document';
import User, { UserRole } from '../entities/User';
import { initConnection } from '../integration/database/connection';
import { findOrImportDocument, loadIndexXml } from '../services/DocumentService';

void (async () => {
    // @ts-ignore
    database.logging = false;
    await initConnection();

    Object.assign(global as any, {
        Bill,
        BillDocument,
        UpdateBillDocument,
        Document,
        User,
        UserRole,
        findOrImportDocument,
        loadIndexXml,
    });

    repl.start('> ');

})();