/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Document } from '../models/Document';
import type { GithubFile } from '../models/GithubFile';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class DocumentService {

    /**
     * Get a list of all documents stored in a xml file on github.
     * @returns GithubFile
     * @throws ApiError
     */
    public static documentControllerGetAll(): CancelablePromise<Array<GithubFile>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/document',
        });
    }

    /**
     * Get a document from the database if it exists, otherwise it downloads it from github and saves it to the database.
     * @param identifier
     * @returns Document
     * @throws ApiError
     */
    public static documentControllerGet(
        identifier: string,
    ): CancelablePromise<Document> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/document/{identifier}',
            path: {
                'identifier': identifier,
            },
        });
    }

    /**
     * Update
     * @param identifier
     * @param requestBody
     * @returns Document
     * @throws ApiError
     */
    public static documentControllerUpdate(
        identifier: string,
        requestBody?: any,
    ): CancelablePromise<Document> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/documents/{identifier}',
            path: {
                'identifier': identifier,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

}
