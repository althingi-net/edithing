/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BillDocument } from '../models/BillDocument';
import type { CreateBillDocument } from '../models/CreateBillDocument';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class BillDocumentService {

    /**
     * Get all
     * @returns BillDocument
     * @throws ApiError
     */
    public static billDocumentControllerGetAll(): CancelablePromise<Array<BillDocument>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/billDocuments',
        });
    }

    /**
     * Create
     * @param requestBody CreateBillDocument
     * @returns BillDocument
     * @throws ApiError
     */
    public static billDocumentControllerCreate(
        requestBody?: CreateBillDocument,
    ): CancelablePromise<BillDocument> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/billDocuments',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Get
     * @param id
     * @returns BillDocument
     * @throws ApiError
     */
    public static billDocumentControllerGet(
        id: number,
    ): CancelablePromise<BillDocument> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/billDocuments/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * Update
     * @param id
     * @param requestBody
     * @returns BillDocument
     * @throws ApiError
     */
    public static billDocumentControllerUpdate(
        id: number,
        requestBody?: any,
    ): CancelablePromise<BillDocument> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/billDocuments/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

}
