/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type BillDocumentUpdate = {
    id?: number;
    billDocumentId: number;
    title: string;
    content: string;
    events: string;
    status?: BillDocumentUpdate.status;
    createdAt?: string;
    updatedAt?: string;
};

export namespace BillDocumentUpdate {

    export enum status {
        PENDING = 'pending',
        SUCCESS = 'success',
        ERROR = 'error',
    }


}

