/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Bill } from '../models/Bill';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class BillService {

    /**
     * Get all
     * @returns Bill
     * @throws ApiError
     */
    public static billControllerGetAll(): CancelablePromise<Array<Bill>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/bills',
        });
    }

    /**
     * Create
     * @param requestBody Bill
     * @returns Bill
     * @throws ApiError
     */
    public static billControllerCreate(
        requestBody?: Bill,
    ): CancelablePromise<Bill> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/bills',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Get
     * @param id
     * @returns Bill
     * @throws ApiError
     */
    public static billControllerGet(
        id: number,
    ): CancelablePromise<Bill> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/bills/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * Update
     * @param id
     * @param requestBody
     * @returns Bill
     * @throws ApiError
     */
    public static billControllerUpdate(
        id: number,
        requestBody?: any,
    ): CancelablePromise<Bill> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/bills/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

}
