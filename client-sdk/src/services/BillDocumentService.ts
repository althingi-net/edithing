/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BillDocument } from '../models/BillDocument';
import type { CreateBillDocument } from '../models/CreateBillDocument';
import type { UpdateBillDocument } from '../models/UpdateBillDocument';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class BillDocumentService {

    /**
     * Get all
     * @param id
     * @returns BillDocument
     * @throws ApiError
     */
    public static billDocumentControllerGetAll(
        id: number,
    ): CancelablePromise<Array<BillDocument>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/bill/{id}/document',
            path: {
                'id': id,
            },
        });
    }

    /**
     * Get
     * @param id
     * @param identifier
     * @returns BillDocument
     * @throws ApiError
     */
    public static billDocumentControllerGet(
        id: number,
        identifier: string,
    ): CancelablePromise<BillDocument> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/bill/{id}/document/{identifier}',
            path: {
                'id': id,
                'identifier': identifier,
            },
        });
    }

    /**
     * Delete
     * @param id
     * @param identifier
     * @returns any Successful response
     * @throws ApiError
     */
    public static billDocumentControllerDelete(
        id: number,
        identifier: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/bill/{id}/document/{identifier}',
            path: {
                'id': id,
                'identifier': identifier,
            },
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
            url: '/api/bill/document',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Update
     * @param id
     * @param requestBody UpdateBillDocument
     * @returns BillDocument
     * @throws ApiError
     */
    public static billDocumentControllerUpdate(
        id: number,
        requestBody?: UpdateBillDocument,
    ): CancelablePromise<BillDocument> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/bill/document/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

}
