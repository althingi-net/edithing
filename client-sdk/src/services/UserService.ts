/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { User } from '../models/User';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class UserService {

    /**
     * Get all
     * @returns User
     * @throws ApiError
     */
    public static userControllerGetAll(): CancelablePromise<Array<User>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/users',
        });
    }

    /**
     * Save
     * @param requestBody User
     * @returns any Successful response
     * @throws ApiError
     */
    public static userControllerSave(
        requestBody?: User,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/users',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Get
     * @param id
     * @returns any Successful response
     * @throws ApiError
     */
    public static userControllerGet(
        id: User,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/users/{id}',
            path: {
                'id': id,
            },
        });
    }

}
