/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Bill = {
    id?: number;
    author: any;
    lagasafnID: number;
    title: string;
    description: string;
    documents?: any;
    status?: Bill.status;
    createdAt?: string;
    updatedAt?: string;
};
export namespace Bill {
    export enum status {
        DRAFT = 'draft',
        PUBLISHED = 'published',
        ARCHIVED = 'archived',
    }
}

