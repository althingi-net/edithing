/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { User } from '../models/User';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class DocumentService {

    /**
     * Get a list of all documents stored in a xml file on github.
     * @returns User
     * @throws ApiError
     */
    public static documentControllerGetAll(): CancelablePromise<Array<User>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/document',
        });
    }

    /**
     * Get a document from the database if it exists, otherwise it downloads it from github and saves it to the database.
     * @param path
     * @returns any Successful response
     * @throws ApiError
     */
    public static documentControllerGet(
        path: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/document/{path}',
            path: {
                'path': path,
            },
        });
    }

}
