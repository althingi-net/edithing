/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class UserService {

    /**
     * Get all
     * @returns any Successful response
     * @throws ApiError
     */
    public static userControllerGetAll(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/users',
        });
    }

    /**
     * Post
     * @param requestBody
     * @returns any Successful response
     * @throws ApiError
     */
    public static userControllerPost(
        requestBody?: any,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/users',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Get one
     * @param id
     * @returns any Successful response
     * @throws ApiError
     */
    public static userControllerGetOne(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/users/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * Put
     * @param id
     * @param requestBody
     * @returns any Successful response
     * @throws ApiError
     */
    public static userControllerPut(
        id: number,
        requestBody?: any,
    ): CancelablePromise<any> {
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

    /**
     * Remove
     * @param id
     * @returns any Successful response
     * @throws ApiError
     */
    public static userControllerRemove(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/users/{id}',
            path: {
                'id': id,
            },
        });
    }

}
