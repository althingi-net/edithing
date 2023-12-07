/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { User } from '../models/User';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AuthService {

    /**
     * Post login
     * @returns any Successful response
     * @throws ApiError
     */
    public static authControllerPostLogin(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/login',
        });
    }

    /**
     * Post register
     * @param requestBody User
     * @returns any Successful response
     * @throws ApiError
     */
    public static authControllerPostRegister(
        requestBody?: User,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/register',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Post activation
     * @param requestBody
     * @returns any Successful response
     * @throws ApiError
     */
    public static authControllerPostActivation(
        requestBody?: {
            authenticationToken?: string;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/activate',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Get me
     * @returns any Successful response
     * @throws ApiError
     */
    public static authControllerGetMe(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/auth/me',
        });
    }

}
