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
     * Create
     * @param requestBody User
     * @returns User
     * @throws ApiError
     */
    public static userControllerCreate(
        requestBody?: User,
    ): CancelablePromise<User> {
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
     * @returns User
     * @throws ApiError
     */
    public static userControllerGet(
        id: number,
    ): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/users/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * Update
     * @param id
     * @param requestBody
     * @returns User
     * @throws ApiError
     */
    public static userControllerUpdate(
        id: number,
        requestBody?: any,
    ): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/users/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

}
