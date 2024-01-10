/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LoginRequestBody } from '../models/LoginRequestBody';
import type { LoginResponse } from '../models/LoginResponse';
import type { User } from '../models/User';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AuthService {

    /**
     * Authenticate with email and password
     * @param requestBody LoginRequestBody
     * @returns LoginResponse
     * @throws ApiError
     */
    public static authControllerLogin(
        requestBody?: LoginRequestBody,
    ): CancelablePromise<LoginResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/login',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Register
     * @param requestBody User
     * @returns any Successful response
     * @throws ApiError
     */
    public static authControllerRegister(
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
     * Activate
     * @param requestBody
     * @returns any Successful response
     * @throws ApiError
     */
    public static authControllerActivate(
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
